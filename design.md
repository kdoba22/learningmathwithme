# Design Document — Learning Math With Me

> This document describes the technical design of the application — how it is structured, how data flows, how screens connect, and the key design decisions behind the implementation.
>
> **v1.1** — Whole number flashcards only. Decimal logic has been removed in preparation for a clean reimplementation as separate components.

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Screen Flow](#2-screen-flow)
3. [Component Hierarchy](#3-component-hierarchy)
4. [State Design](#4-state-design)
5. [Data Flow](#5-data-flow)
6. [Component Interface Contracts](#6-component-interface-contracts)
7. [Problem Generation Design](#7-problem-generation-design)
8. [Scratchpad Design Pattern](#8-scratchpad-design-pattern)
9. [Styling & Visual Design](#9-styling--visual-design)
10. [Key Design Decisions](#10-key-design-decisions)
11. [Technology Stack](#11-technology-stack)
12. [Deployment](#12-deployment)
13. [Testing Strategy](#13-testing-strategy)

---

## 1. High-Level Architecture

```
Browser
  └── React SPA (Vite build, served from S3/CloudFront)
        └── App.jsx  (root — owns top-level navigation state)
              ├── Header.jsx  (always rendered, fixed top)
              └── [active screen]
                    ├── UserForm.jsx          (home screen)
                    ├── AdditionFlashcard     (session)
                    ├── SubtractionFlashcard  (session)
                    ├── MultiplicationFlashcard (session)
                    └── DivisionFlashcard     (session)
```

**Key architectural properties:**
- Fully static — no API calls, no backend, no database
- Client-side state routing — no React Router, no URL changes
- All session state is local to each flashcard component and discarded when the session ends
- Settings are the only state that persists across screens (held in `App.jsx`)
- All math is whole-number only (integers)

---

## 2. Screen Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        UserForm                             │
│  (name, experience, operation → GO)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ onStart(settings)
           ┌───────────────┼───────────────────┐
           ▼               ▼                   ▼
    AdditionFlashcard  SubtractionFlashcard  MultiplicationFlashcard  DivisionFlashcard
           │
    ┌──────┴──────────────────────────────────────────┐
    │                                                  │
    ▼                                                  ▼
ProblemCountSelector                         (Multiplication only)
(10 / 25 / 50 / 100)                         TypeToggle: Times Tables / Random
    │                                              │
    │                                    ┌─────────┴─────────┐
    │                                    ▼                   ▼
    │                            TimesTableSelector     RandomCountSelector
    │                            (0–14 grid)           (10/25/50/100)
    │                                    │                   │
    └──────────────────┬─────────────────┴───────────────────┘
                       ▼
              Active Problem Loop
              ┌─────────────────┐
              │  Problem card   │
              │  Answer input   │
              │  Scratchpad     │
              └────────┬────────┘
                       │ submit
              ┌────────┴────────┐
              │                 │
           Correct            Wrong
              │                 │
           Next →         Try Again / Peek
              │                 │
              └────────┬────────┘
                       │ (last problem)
                       ▼
                 SummaryScreen
                 (Play Again / Change Settings)
                       │
                       ▼ Change Settings
                   UserForm
               (settings preserved)
```

---

## 3. Component Hierarchy

```
App
├── Header
└── [active screen — one of:]
    │
    ├── UserForm
    │
    ├── AdditionFlashcard
    │   ├── ProblemCountSelector        (screen: no totalProblems)
    │   ├── [active session]
    │   │   ├── FlashcardHeader
    │   │   ├── StackedProblem
    │   │   │   ├── [answer form with input + Button]
    │   │   │   └── FeedbackSection
    │   │   ├── Button (Back)
    │   │   └── [scratchpad panel]
    │   │       ├── ScratchpadToggle
    │   │       └── AdditionScratchpad
    │   └── SummaryScreen               (screen: done)
    │
    ├── SubtractionFlashcard            (same structure as Addition)
    │   └── SubtractionScratchpad
    │
    ├── MultiplicationFlashcard
    │   ├── TypeToggle (Times Tables / Random)
    │   ├── [screen: select]
    │   │   └── times table grid (0–14 buttons)
    │   ├── [screen: random-setup]
    │   │   └── problem count buttons (10/25/50/100)
    │   ├── [screen: times-table / random — active session]
    │   │   ├── TypeToggle
    │   │   ├── FlashcardHeader
    │   │   ├── Flashcard (horizontal display: a × b = ?)
    │   │   ├── [answer form]
    │   │   ├── FeedbackSection
    │   │   ├── Button (Back)
    │   │   └── [scratchpad panel]
    │   │       ├── ScratchpadToggle
    │   │       └── MultiplicationScratchpad
    │   └── SummaryScreen (with extraActions: Try Another button)
    │
    └── DivisionFlashcard
        ├── ProblemCountSelector        (screen: no totalProblems)
        ├── [active session]
        │   ├── FlashcardHeader
        │   ├── Flashcard (horizontal display: a ÷ b = ?)
        │   ├── [answer form — quotient + optional remainder]
        │   ├── FeedbackSection
        │   ├── Button (Back)
        │   └── [scratchpad panel]
        │       ├── ScratchpadToggle
        │       └── LongDivisionScratchpad
        └── SummaryScreen
```

---

## 4. State Design

### App.jsx — Top-level state

| State | Type | Purpose |
|---|---|---|
| `userSettings` | `{ name, experience, operation } \| null` | Settings from the last form submission; passed to the active flashcard and back to UserForm as `initialSettings` |
| `started` | `boolean` | Controls whether UserForm or a flashcard is rendered |

### UserForm.jsx — Form state

| State | Type | Purpose |
|---|---|---|
| `name` | `string` | Current value of the name input |
| `experience` | `string` | Selected experience level (Beginner/Intermediate/Advanced/Proficient/Expert) |
| `operation` | `string` | Selected operation (Addition/Subtraction/Multiplication/Division) |
| `error` | `string` | Validation error message (empty string = no error) |

### Flashcard components — Session state (Addition / Subtraction / Division)

| State | Type | Purpose |
|---|---|---|
| `totalProblems` | `number \| null` | `null` = show count selector; number = session in progress |
| `problem` | `object \| null` | Current problem (`{ a, b, answer }` or division variant) |
| `userAnswer` | `string` | Current value of the answer input |
| `feedback` | `"correct" \| "wrong" \| "peeked" \| null` | Controls which feedback UI is shown |
| `score` | `number` | Running count of first-attempt correct answers |
| `wrongCount` | `number` | Running count of incorrect/peeked answers |
| `currentNum` | `number` | 1-based index of the current problem |
| `done` | `boolean` | `true` = show SummaryScreen |
| `triedOnce` | `boolean` | `true` = student has already attempted this problem; correct answer will not increment score |
| `peeked` | `boolean` | `true` = student has peeked; used to prevent double-counting |
| `clearSignal` | `number` | Integer counter incremented on each new problem; scratchpads watch this to auto-clear |
| `scratchpadTotal` | `string` | Answer value reported back from the scratchpad's answer row |
| `hideScratchpad` | `boolean` | Controls scratchpad panel visibility |

### MultiplicationFlashcard — Additional state

| State | Type | Purpose |
|---|---|---|
| `activeType` | `"times-table" \| "random"` | Which mode is active |
| `screen` | `"select" \| "random-setup" \| "times-table" \| "random"` | Which sub-screen to render |
| `selectedTable` | `number \| null` | The times table number chosen (0–14) |
| `problems` | `array` | Pre-generated array of 15 problems for times table mode |
| `celebrateTick` | `number` | Incremented on correct answer to trigger CSS pop animation via React key |

### DivisionFlashcard — Additional state

| State | Type | Purpose |
|---|---|---|
| `quotientAnswer` | `string` | Student's quotient input |
| `remainderAnswer` | `string` | Student's remainder input (only used when problem has remainder) |
| `scratchpadQuotient` | `string` | Quotient reported back from LongDivisionScratchpad |
| `scratchpadRemainder` | `string` | Remainder reported back from LongDivisionScratchpad |

---

## 5. Data Flow

### Settings flow (top-down via props)

```
App.jsx
  userSettings ──────────────────────────────► [Flashcard].settings
  userSettings ──────────────────────────────► UserForm.initialSettings
```

### Session start flow

```
UserForm
  onStart(settings) ─► App.handleStart ─► setUserSettings + setStarted(true)
```

### Answer submission flow

```
[answer input]  ──► userAnswer (state)
                         │
                         ▼
                  handleSubmitAnswer
                         │
                  answerSource = userAnswer.trim() !== ""
                    ? userAnswer
                    : scratchpadTotal        ◄── scratchpad callback
                         │
                  parseInt(answerSource)
                         │
                  compare to problem.answer (exact integer match)
                         │
              ┌──────────┴──────────┐
           correct               wrong
              │                     │
        setFeedback("correct")  setTriedOnce(true)
        if !triedOnce:          setFeedback("wrong")
          setScore(s+1)
```

### Scratchpad answer reporting flow

```
[scratchpad answer row cell onChange]
  ─► updateTotal(index, value)
  ─► setTotal(updated)
  ─► onTotalChange(updated.join("").trim())
  ─► [parent].setScratchpadTotal(value)
```

### clearSignal pattern

```
handleNext() or startSession()
  ─► setClearSignal(s => s + 1)

Scratchpad useEffect([clearSignal, a, b])
  ─► reset all student-entered cells
  ─► re-fill operands from new a, b props
  ─► onTotalChange("")
```

---

## 6. Component Interface Contracts

### `<UserForm>`
```
Props:
  onStart(settings: { name: string, experience: string, operation: string }) → void
  initialSettings?: { name: string, experience: string, operation: string }
```

### `<[Operation]Flashcard>`
```
Props:
  settings: { name: string, experience: string, operation: string }
  onBack() → void
```

### `<FeedbackSection>`
```
Props:
  feedback: "correct" | "wrong" | "peeked" | null
  problem: object
  formatProblem(p: object) → string
  formatAnswer(p: object) → string
  onNext() → void
  onTryAgain() → void
  onPeek() → void
  isLast: boolean
```

### `<FlashcardHeader>`
```
Props:
  current: number
  total: number
  score: number
  label?: string   // overrides default "Problem X of Y" text
```

### `<SummaryScreen>`
```
Props:
  name: string
  score: number
  total: number
  onPlayAgain() → void
  onBack() → void
  title?: string         // subtitle below banner
  extraActions?: ReactNode  // additional buttons (e.g. "Try Another")
```

### `<ProblemCountSelector>`
```
Props:
  name: string
  operation: string
  onSelect(count: number) → void
  onBack() → void
```

### `<StackedProblem>`
```
Props:
  topNumber: string       // displayed as-is (right-aligned)
  bottomNumber: string    // displayed as-is (right-aligned)
  operator: string        // "+", "−", "×"
  answerInput?: ReactNode // rendered below the line
  feedback?: ReactNode    // rendered below the answer
```

### `<Flashcard>`
```
Props:
  children: ReactNode     // problem text (e.g., "5 × 3 = ?")
```

### `<ScratchpadToggle>`
```
Props:
  hidden: boolean
  onChange(hidden: boolean) → void
```

### `<Button>`
```
Props:
  variant: "primary" | "secondary" | "outline" | "danger" | "destructive" | "toggle"
  onClick?: () → void
  disabled?: boolean
  type?: "button" | "submit"
  className?: string   // e.g. "btn-lg", "btn-sm"
  children: ReactNode
```

### `<AdditionScratchpad>` / `<SubtractionScratchpad>`
```
Props:
  a: number              // top operand (integer)
  b: number              // bottom operand (integer)
  clearSignal: number    // increment to reset
  onTotalChange(value: string) → void
```

### `<MultiplicationScratchpad>`
```
Props:
  a: number
  b: number
  clearSignal: number
  onTotalChange(value: string) → void
```

### `<LongDivisionScratchpad>`
```
Props:
  divisor: number
  dividend: number
  clearSignal: number
  onQuotientChange(value: string) → void
  onRemainderChange(value: string) → void
```

---

## 7. Problem Generation Design

### Experience Level → Max Number

| Level | Max (general) | Max (addition beginner) |
|-------|---------------|------------------------|
| Beginner | 20 | 9 |
| Intermediate | 50 | 50 |
| Advanced | 100 | 100 |
| Proficient | 250 | 250 |
| Expert | 999 | 999 |

### Addition
```js
function generateProblem(max, allowZero = false) {
  const min = allowZero ? 0 : 1;
  a = random(min, max)
  b = random(min, max)
  return { a, b, answer: a + b }
}
// Beginner: allowZero = true, max = 9
// Others:   allowZero = false, max from experience
```

### Subtraction
```js
function generateProblem(max) {
  a = random(1, max)
  b = random(1, a)   // b <= a guarantees non-negative result
  return { a, b, answer: a - b }
}
```

### Multiplication (random)
```js
function generateRandomProblem(max) {
  a = random(1, max)
  b = random(1, max)
  return { a, b, answer: a * b }
}
```

### Multiplication (times table)
```js
// Pre-generates all 15 problems upfront for the chosen table n
problems = [0..14].map(i => ({ a: n, b: i, answer: n * i }))
```

### Division
```js
// No remainder (Beginner / Intermediate):
b = random(2, min(max, 20))
quotient = random(1, floor(max / b))
a = b * quotient
return { a, b, quotient, remainder: 0, hasRemainder: false }

// With remainder (Advanced / Proficient / Expert):
b = random(2, min(max, 20))
a = random(b, max)
quotient = floor(a / b)
remainder = a % b
return { a, b, quotient, remainder, hasRemainder: remainder > 0 }
```

---

## 8. Scratchpad Design Pattern

All scratchpads follow a consistent pattern:

### Layout Variants

| Operation | Layout | Columns |
|-----------|--------|---------|
| Addition | Table — 4 columns | Th, H, T, O |
| Subtraction | Table — 4 columns | Th, H, T, O |
| Multiplication | Flex rows — variable width | Based on digit count |
| Division | Step-based free-form | Quotient, multiply/subtract/bring-down steps |

### Communication Pattern

```
Parent (Flashcard)                    Scratchpad
─────────────────                     ──────────
clearSignal ──────────────────────►  useEffect([clearSignal])
a, b ─────────────────────────────►    reset cells
                                        re-fill operands
                                        onTotalChange("")

                                      [student types in answer row]
                                        updateTotal(index, value)
onTotalChange ◄───────────────────────  onTotalChange(joined value)
setScratchpadTotal(value)

[student submits blank input]
  answerSource = scratchpadTotal
```

### Addition/Subtraction Scratchpad Rows
1. **Carry/Borrow row** — editable cells for working, with "Clear Row" button
2. **Top number row** — pre-filled with operand `a` digits
3. **Bottom number row** — pre-filled with operand `b` digits, operator sign on left
4. **Answer row** — blank cells where student writes answer

### Multiplication Scratchpad Rows
1. **Carry row** — editable cells with "Clear Row" button
2. **Top number row** — pre-filled with `a`
3. **Bottom number row** — pre-filled with `b`, × sign on left
4. **Divider line**
5. **Partial product rows** — blank, student can add/remove rows
6. **Divider line**
7. **Total row** — blank cells for final answer

### Long Division Scratchpad
1. **Quotient row** — single text input above the division house
2. **Division house** — divisor on left, dividend under the bracket
3. **Work steps** — repeating (multiply / subtract / bring down) groups; student can add/remove
4. **Remainder row** — single text input

### Why `clearSignal` is an integer counter, not a boolean
A boolean toggle would not re-trigger a `useEffect` if the value doesn't change between two consecutive new problems. An integer that always increments guarantees the effect fires on every new problem.

---

## 9. Styling & Visual Design

### Color Palette

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary / Brand | `#50c878` (emerald green) | Header, buttons, borders, accents |
| Primary hover | `#3daf63` | Button hover states |
| Text | `#213547` | Body text, problem numbers |
| Correct feedback | `#2a7a2a` | Success messages |
| Wrong feedback | `#c0392b` | Error messages |
| Peek feedback | `#e67e22` (orange) | Peeked answer messages |
| Carry cells | `#fff9e6` bg, `#e67e22` text | Scratchpad carry/borrow rows |
| Prefilled cells | `#f0faf4` bg | Scratchpad operand rows |

### Typography
- Body: `system-ui, Avenir, Helvetica, Arial, sans-serif`
- Header: `"Cursive", sans-serif`
- Scratchpad / problems: `"Courier New", monospace`

### Layout
- Fixed header at top (`position: fixed`, `z-index: 1000`)
- Content starts at `margin-top: 8rem` to clear the header
- Two-column layout for flashcard sessions: problem on left, scratchpad on right
- Single column on mobile (breakpoint: 768px)

### Responsive Breakpoints
- `768px` — switch to single column, reduce header font
- `480px` — times table grid reduces from 5 to 3 columns

---

## 10. Key Design Decisions

### No React Router
Navigation is controlled by `useState` in `App.jsx`. The app has a shallow two-level navigation tree (home → session). Adding React Router would introduce complexity without benefit at this scale.

### No Global State Library
All state is local to each component. Settings flow top-down via props. There is no shared state that needs to be accessed across unrelated components.

### Scratchpad as Controlled Fallback
The scratchpad does not submit the answer — it only reports its current answer row value to the parent. The parent decides whether to use it (only when the answer input is blank). This keeps the scratchpad as a working tool rather than a submission mechanism, matching how students use paper.

### TypeToggle as Inline Component (Multiplication)
`TypeToggle` is defined inside `MultiplicationFlashcard.jsx`. It is tightly coupled to multiplication's Times Tables / Random mode and has no reuse case elsewhere.

### `celebrateTick` for Animation
The multiplication correct-answer pop animation is driven by a React `key` prop that changes on each correct answer. Changing the key forces React to unmount and remount the element, re-triggering the CSS animation.

### Profanity Filter Singleton
The `BadWordsNext` instance is created once outside the `UserForm` component function. Creating it inside would re-instantiate the filter on every render.

### Integer-Only Answer Validation
All answer comparisons use `parseInt()` and exact equality (`===`). There is no floating-point tolerance logic. This will change when decimal components are added as separate number-type modules.

### Problem Display: Stacked vs. Horizontal
- **Addition / Subtraction** use `StackedProblem` — vertical layout matching how these are done on paper
- **Multiplication / Division** use `Flashcard` — horizontal display (`a × b = ?`, `a ÷ b = ?`)

---

## 11. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Build tool | Vite | 7.x |
| Test runner | Vitest | 4.x |
| Test utilities | Testing Library (React) | 16.x |
| Linter | ESLint | 9.x |
| Content filter | bad-words-next | 3.x |
| Deployment | GitHub Actions → S3/CloudFront | — |

### No Additional Dependencies
The app deliberately avoids third-party UI libraries (no Material UI, no Tailwind). All styling is hand-written CSS. This keeps the bundle small and the design fully custom for a children's education app.

---

## 12. Deployment

- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Builds with `vite build` → outputs to `dist/`
- Deployed as static files (S3 + CloudFront or similar)
- No server-side rendering, no serverless functions

---

## 13. Testing Strategy

### Current Coverage
- **Unit tests** for utility functions (`mathUtils.js`)
- **Component tests** for presentational components (Button, FeedbackSection, StackedProblem, ScratchpadToggle, SummaryScreen, UserForm, WelcomeBanner, ComingSoon)
- Test framework: Vitest + Testing Library + jsdom

### Testing Principles
- Every shared component has a test file in `src/test/`
- Tests verify rendering, user interaction, and prop-based behavior
- No snapshot tests — explicit assertions only
- Test command: `npx vitest run` (single run) or `npm test` (watch mode)

---

## Change Log

| Version | Date | Change |
|---|---|---|
| 1.0 | May 2025 | Initial design document |
| 1.1 | July 2025 | Removed decimal logic; simplified to whole-number-only; updated all sections to reflect current state |
