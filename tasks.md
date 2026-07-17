# Tasks — Learning Math With Me

> This document is the active work list for the project. Tasks are organized by phase and ordered by dependency. Each task has a clear definition of done.
>
> **Status key:** ⬜ Not started | 🔄 In progress | ✅ Done

---

## Table of Contents

1. [Phase 0 — Backlog Cleanup (pre-Phase 2)](#phase-0--backlog-cleanup-pre-phase-2)
2. [Phase 2A — Decimals](#phase-2a--decimals)
3. [Phase 2B — Money Math](#phase-2b--money-math)
4. [Phase 2C — Fractions](#phase-2c--fractions)
5. [Phase 3 — Progress Tracking & User Accounts](#phase-3--progress-tracking--user-accounts)
6. [Phase 4 — Polish & Accessibility](#phase-4--polish--accessibility)

---

## Phase 0 — Backlog Cleanup (pre-Phase 2)

Small improvements to the existing codebase that should be addressed before adding new features. None of these are blockers, but they reduce technical debt and make Phase 2 easier.

---

### TASK-0-01 — Add missing test coverage for existing components ⬜

**What:** Several components have no test files. Add tests for all untested components.

**Untested components:**
- `AdditionFlashcard.jsx`
- `SubtractionFlashcard.jsx`
- `MultiplicationFlashcard.jsx`
- `DivisionFlashcard.jsx`
- `AdditionScratchpad.jsx`
- `SubtractionScratchpad.jsx`
- `MultiplicationScratchpad.jsx`
- `LongDivisionScratchpad.jsx`
- `Flashcard.jsx`
- `FlashcardHeader.jsx`
- `ProblemCountSelector.jsx`
- `Header.jsx`

**Definition of done:**
- Each component has a corresponding test file in `src/test/`
- Tests cover: renders correctly, key interactions, prop variations
- All tests pass (`npm test -- --run`)

---

### TASK-0-02 — Add React error boundary ⬜

**What:** Add a top-level error boundary so an unhandled error in a flashcard component shows a friendly message instead of crashing the entire app.

**Files to create/modify:**
- Create `src/components/ErrorBoundary.jsx`
- Create `src/test/ErrorBoundary.test.jsx`
- Wrap the active screen in `App.jsx` with `<ErrorBoundary>`

**Definition of done:**
- An unhandled error in any flashcard component renders a "Something went wrong" message with a button to return to the home screen
- The header remains visible during an error state
- Test confirms error boundary catches and displays the fallback UI

---

### TASK-0-03 — Rename `AdditionFlashcard.css` to `Flashcard.css` ⬜

**What:** `AdditionFlashcard.css` is used as shared flashcard styles across multiple components but is named after one operation. Rename it to `Flashcard.css` and update all imports.

**Files to modify:**
- Rename `src/components/AdditionFlashcard.css` → `src/components/Flashcard.css`
- Update imports in: `AdditionFlashcard.jsx`, `SubtractionFlashcard.jsx`, `MultiplicationFlashcard.jsx`, `DivisionFlashcard.jsx`

**Definition of done:**
- File renamed, all imports updated, app builds and renders correctly
- All tests pass

---

### TASK-0-04 — Add PropTypes to all components ⬜

**What:** Add PropTypes validation to all components so prop errors surface at development time rather than silently at runtime.

**Files to modify:** All `.jsx` files in `src/components/`

**Definition of done:**
- Every component has PropTypes defined for all props
- No PropTypes warnings in the browser console during normal use
- No new tests required (PropTypes are a dev-time tool)

---

### TASK-0-05 — Fix `ScratchpadToggle` prop naming ⬜

**What:** The `hidden` prop on `ScratchpadToggle` uses negative framing. Rename to `isHidden` for clarity and consistency with React conventions.

**Files to modify:**
- `src/components/ScratchpadToggle.jsx`
- `src/components/AdditionFlashcard.jsx`
- `src/components/SubtractionFlashcard.jsx`
- `src/components/MultiplicationFlashcard.jsx`
- `src/components/DivisionFlashcard.jsx`
- `src/test/ScratchpadToggle.test.jsx` (update test props)

**Definition of done:**
- Prop renamed consistently across all usages
- All tests pass

---

## Phase 2A — Decimals

Add decimal number practice for addition, subtraction, multiplication, and division.

**Prerequisites:** Phase 0 cleanup complete, `design.md` Phase 2A section filled in.

---

### TASK-2A-01 — Design decimal feature ⬜

**What:** Fill in the Phase 2A design stub in `design.md` with concrete decisions:
- Decimal place ranges per experience level
- Answer input approach (single decimal input vs. separate whole/decimal parts)
- Scratchpad layout decision
- Problem generation rules

**Definition of done:**
- `design.md` Phase 2A section is complete with no open questions
- `requirements.md` updated with REQ-DEC-xx requirements
- Design reviewed before any code is written

---

### TASK-2A-02 — Add `getDecimalPlaces` to `mathUtils.js` ⬜

**What:** Add a utility function that returns the number of decimal places to use for a given experience level.

**Suggested ranges:**
| Experience | Decimal places |
|---|---|
| Beginner | 1 (e.g., 0.5 + 0.3) |
| Intermediate | 1 |
| Advanced | 2 (e.g., 3.14 + 2.71) |
| Proficient | 2 |
| Expert | 3 |

**Files to modify:**
- `src/utils/mathUtils.js`
- `src/test/mathUtils.test.js` (add tests for new function)

**Definition of done:**
- Function implemented and exported
- Tests cover all 5 experience levels
- All tests pass

---

### TASK-2A-03 — Create `DecimalFlashcard.jsx` ⬜

**What:** New flashcard component for decimal operations. Supports addition, subtraction, multiplication, and division with decimal numbers.

**Files to create:**
- `src/components/DecimalFlashcard.jsx`
- `src/components/DecimalFlashcard.css`
- `src/test/DecimalFlashcard.test.jsx`

**Files to modify:**
- `src/App.jsx` — add `DecimalFlashcard` to the operation routing
- `src/components/UserForm.jsx` — add "Decimals" to the operation selector

**Definition of done:**
- Component renders correctly for all four decimal operations
- Problem generation produces valid decimal problems
- Answer validation handles floating point correctly (avoid `0.1 + 0.2 = 0.30000000000000004`)
- Scratchpad integration works (fallback answer from scratchpad)
- Tests cover problem generation, answer submission, correct/wrong/peek flows
- All tests pass

---

### TASK-2A-04 — Create `DecimalScratchpad.jsx` ⬜

**What:** Scratchpad for decimal problems. Likely extends the column layout with a decimal point marker between columns.

**Files to create:**
- `src/components/DecimalScratchpad.jsx`
- `src/test/DecimalScratchpad.test.jsx`

**Definition of done:**
- Scratchpad pre-fills operands with decimal points in correct position
- Answer row reports decimal value back to parent via `onTotalChange`
- Auto-clears on `clearSignal`
- Tests cover rendering, clear behavior, and answer reporting
- All tests pass

---

### TASK-2A-05 — Update documentation for decimals ⬜

**What:** Update all relevant docs to reflect the new decimal feature.

**Files to modify:**
- `requirements.md` — add REQ-DEC section
- `design.md` — complete Phase 2A stub
- `DOCUMENTATION.md` — add DecimalFlashcard and DecimalScratchpad to component reference
- `tasks.md` — mark Phase 2A tasks done

**Definition of done:**
- All docs reflect the implemented decimal feature

---

## Phase 2B — Money Math

Add money math practice (dollar and cent amounts).

**Prerequisites:** Phase 2A complete (money math is a variant of decimal math).

---

### TASK-2B-01 — Design money math feature ⬜

**What:** Fill in the Phase 2B design stub in `design.md`:
- Is money a separate operation or a mode within decimals?
- Amount ranges per experience level
- Display format (`$3.75` in the flashcard)
- Answer entry format (single decimal input or separate dollars/cents)

**Definition of done:**
- `design.md` Phase 2B section complete
- `requirements.md` updated with REQ-MONEY-xx requirements

---

### TASK-2B-02 — Create `MoneyFlashcard.jsx` ⬜

**What:** Flashcard component for money addition and subtraction. Displays amounts in `$X.XX` format.

**Files to create:**
- `src/components/MoneyFlashcard.jsx`
- `src/test/MoneyFlashcard.test.jsx`

**Files to modify:**
- `src/App.jsx`
- `src/components/UserForm.jsx`

**Key implementation note:** Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` for display formatting — no third-party library.

**Definition of done:**
- Amounts display in correct currency format
- Answer validation handles cent-level precision correctly
- Tests cover rendering and answer flows
- All tests pass

---

### TASK-2B-03 — Update documentation for money math ⬜

**Files to modify:** `requirements.md`, `design.md`, `DOCUMENTATION.md`, `tasks.md`

---

## Phase 2C — Fractions

Add fraction practice for addition, subtraction, multiplication, and division.

**Prerequisites:** Phase 0 complete. Phase 2A and 2B are not required prerequisites.

---

### TASK-2C-01 — Design fraction feature ⬜

**What:** Fill in the Phase 2C design stub in `design.md`:
- Fraction rendering approach (plain text vs. KaTeX)
- Answer entry (two inputs: numerator / denominator)
- Simplified form requirement (must `2/4` be entered as `1/2`?)
- Problem generation rules per experience level
- Help module design (how to explain common denominators, etc.)

**Definition of done:**
- `design.md` Phase 2C section complete with no open questions
- `requirements.md` updated with REQ-FRAC-xx requirements

---

### TASK-2C-02 — Create `fractionUtils.js` ⬜

**What:** Utility functions for fraction arithmetic.

**Functions needed:**
- `gcd(a, b)` — greatest common divisor
- `simplify({ numerator, denominator })` — reduce to lowest terms
- `addFractions(f1, f2)` — returns simplified result
- `subtractFractions(f1, f2)` — returns simplified result
- `multiplyFractions(f1, f2)` — returns simplified result
- `divideFractions(f1, f2)` — returns simplified result
- `generateFraction(experience)` — returns a random fraction appropriate for the level

**Files to create:**
- `src/utils/fractionUtils.js`
- `src/test/fractionUtils.test.js`

**Definition of done:**
- All functions implemented and exported
- Tests cover normal cases, edge cases (zero numerator, same denominator), and all four operations
- All tests pass

---

### TASK-2C-03 — Create `FractionDisplay.jsx` ⬜

**What:** A component that renders a fraction visually (numerator over denominator with a dividing line).

**Files to create:**
- `src/components/FractionDisplay.jsx`
- `src/test/FractionDisplay.test.jsx`

**Definition of done:**
- Renders numerator and denominator in a stacked layout
- Accessible (screen reader reads "3 over 4" or similar)
- Tests confirm correct rendering for whole numbers, proper fractions, and improper fractions

---

### TASK-2C-04 — Create `FractionInput.jsx` ⬜

**What:** A two-field input component for entering a fraction answer (numerator and denominator).

**Files to create:**
- `src/components/FractionInput.jsx`
- `src/test/FractionInput.test.jsx`

**Props:**
```
numerator: string
denominator: string
onNumeratorChange(value: string) → void
onDenominatorChange(value: string) → void
```

**Definition of done:**
- Renders two number inputs with a visual dividing line between them
- Both fields are individually accessible with labels
- Tests cover rendering and change events

---

### TASK-2C-05 — Create `FractionFlashcard.jsx` ⬜

**What:** Flashcard component for fraction operations.

**Files to create:**
- `src/components/FractionFlashcard.jsx`
- `src/test/FractionFlashcard.test.jsx`

**Files to modify:**
- `src/App.jsx`
- `src/components/UserForm.jsx`

**Definition of done:**
- Supports all four fraction operations
- Uses `FractionDisplay` for problem rendering
- Uses `FractionInput` for answer entry
- Validates answer using `fractionUtils` (handles equivalent fractions if simplified form is not required)
- Scratchpad integration works
- Tests cover all four operations, correct/wrong/peek flows
- All tests pass

---

### TASK-2C-06 — Create `FractionScratchpad.jsx` ⬜

**What:** Scratchpad for fraction problems. Layout TBD in design phase.

**Files to create:**
- `src/components/FractionScratchpad.jsx`
- `src/test/FractionScratchpad.test.jsx`

**Definition of done:**
- Pre-fills problem operands
- Reports answer back to parent
- Auto-clears on `clearSignal`
- Tests pass

---

### TASK-2C-07 — Create fraction help modules ⬜

**What:** Step-by-step explanations for how to solve fraction problems (finding common denominators, cross-multiplication, etc.). Design TBD.

**Definition of done:**
- At least one help module per operation (add, subtract, multiply, divide)
- Help is accessible from the fraction flashcard screen
- Does not interfere with the problem flow

---

### TASK-2C-08 — Update documentation for fractions ⬜

**Files to modify:** `requirements.md`, `design.md`, `DOCUMENTATION.md`, `tasks.md`

---

## Phase 3 — Progress Tracking & User Accounts

**Prerequisites:** Phase 2 complete. Backend infrastructure decisions made (see `tech.md` Phase 3 section).

---

### TASK-3-01 — Select and design backend stack ⬜

**What:** Make the backend technology decisions documented in `tech.md` Phase 3:
- Backend: AWS Lambda + API Gateway + DynamoDB vs. Supabase vs. Firebase
- Auth: AWS Cognito vs. Auth0 vs. Supabase Auth
- State management: Add Zustand

**Definition of done:**
- `tech.md` Phase 3 decisions filled in
- `design.md` updated with backend architecture diagram
- No code written yet

---

### TASK-3-02 — Add Zustand for global state ⬜

**What:** Install and configure Zustand. Migrate session result state to a global store so it can be persisted and displayed on a history screen.

**Definition of done:**
- Zustand installed and configured
- Session results written to store on session completion
- Existing tests still pass

---

### TASK-3-03 — Implement user profiles ⬜

**What:** Allow multiple named profiles (e.g., multiple children on the same device) without requiring email/password accounts.

**Definition of done:**
- Student can create a named profile
- Profile selection appears on the home screen
- Settings are saved per profile

---

### TASK-3-04 — Implement session history ⬜

**What:** Save session results (operation, experience, score, date) and display a history screen per profile.

**Definition of done:**
- Session results persist across browser sessions
- History screen shows past sessions with scores
- History is scoped to the selected profile

---

## Phase 4 — Polish & Accessibility

---

### TASK-4-01 — Full accessibility audit and fixes ⬜

**What:** Review the entire app against WCAG 2.1 AA criteria. Fix all identified issues.

**Key areas:**
- ARIA labels on all interactive elements
- Full keyboard navigation (no mouse required)
- Screen reader testing (VoiceOver on macOS/iOS, NVDA on Windows)
- Color contrast ratios

**Definition of done:**
- Automated scan (axe or Lighthouse) shows zero accessibility violations
- Manual keyboard navigation works end-to-end
- Note: full WCAG compliance requires manual testing with assistive technologies

---

### TASK-4-02 — Add sound effects ⬜

**What:** Audio feedback for correct and incorrect answers.

**Definition of done:**
- Correct answer plays a positive sound
- Incorrect answer plays a gentle negative sound
- Sounds can be muted (toggle in header or settings)
- No autoplay on page load

---

### TASK-4-03 — Add animations for correct/incorrect answers ⬜

**What:** Visual feedback animations beyond the current multiplication pop effect.

**Definition of done:**
- Correct answer triggers a celebratory animation
- Incorrect answer triggers a gentle shake or similar
- Animations respect `prefers-reduced-motion` media query

---

### TASK-4-04 — Add print mode ⬜

**What:** Allow a student or parent to print a worksheet generated from the same problem set logic.

**Definition of done:**
- "Print Worksheet" button on the problem count selector screen
- Generates a printable page with N problems (no answers)
- Print CSS hides all app chrome

---

## Change Log

| Version | Date | Change |
|---|---|---|
| 1.0 | May 2026 | Initial tasks document created |
