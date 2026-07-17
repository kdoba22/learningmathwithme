# Learning Math With Me — Project Documentation

> **Live site:** [https://learningmathwithme.com](https://learningmathwithme.com)  
> **Repository:** [https://github.com/kdoba22/learningmathwithme](https://github.com/kdoba22/learningmathwithme)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Application Architecture](#4-application-architecture)
5. [Component Reference](#5-component-reference)
   - [Shared / Utility Components](#shared--utility-components)
   - [Flashcard Session Components](#flashcard-session-components)
   - [Scratchpad Components](#scratchpad-components)
6. [Utility Functions](#6-utility-functions)
7. [Game Logic & Rules](#7-game-logic--rules)
8. [State Management](#8-state-management)
9. [Styling Approach](#9-styling-approach)
10. [Testing](#10-testing)
11. [CI/CD Pipeline](#11-cicd-pipeline)
12. [AWS Infrastructure](#12-aws-infrastructure)
13. [Environment & Secrets](#13-environment--secrets)
14. [Local Development](#14-local-development)
15. [Roadmap](#15-roadmap)

---

## 1. Project Overview

**Learning Math With Me** is an interactive math flashcard web application built for elementary school children. Students practice the four core arithmetic operations — addition, subtraction, multiplication, and division — with problem difficulty that scales to their experience level.

Key design goals:
- Make practice feel like working on paper (scratchpads mirror pencil-and-paper layouts)
- Encourage persistence without penalizing exploration (Try Again / Peek options)
- Keep the UI simple and distraction-free for young learners
- Zero backend — fully static, deployable anywhere

---

## 2. Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool and dev server |
| Vitest | 4.x | Unit test runner |
| React Testing Library | 16.x | Component testing utilities |
| JavaScript (ESM) | ES2020+ | Language |
| Plain CSS | — | Styling (no CSS framework) |
| AWS S3 | — | Static file hosting |
| AWS CloudFront | — | CDN, HTTPS, custom domain |
| AWS Route 53 | — | DNS management |
| AWS ACM | — | SSL/TLS certificate |
| GitHub Actions | — | CI/CD automation |

---

## 3. Repository Structure

```
learningmathwithme/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline (test → build → deploy)
├── public/                     # Static assets (currently empty)
├── src/
│   ├── components/             # All React components
│   │   ├── AdditionFlashcard.jsx
│   │   ├── AdditionFlashcard.css
│   │   ├── AdditionScratchpad.jsx
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── DivisionFlashcard.jsx
│   │   ├── DivisionFlashcard.css
│   │   ├── FeedbackSection.jsx
│   │   ├── Flashcard.jsx
│   │   ├── FlashcardHeader.jsx
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── LongDivisionScratchpad.jsx
│   │   ├── LongDivisionScratchpad.css
│   │   ├── MultiplicationFlashcard.jsx
│   │   ├── MultiplicationFlashcard.css
│   │   ├── MultiplicationScratchpad.jsx
│   │   ├── ProblemCountSelector.jsx
│   │   ├── Scratchpad.css
│   │   ├── ScratchpadToggle.jsx
│   │   ├── ScratchpadToggle.css
│   │   ├── SubtractionFlashcard.jsx
│   │   ├── SubtractionScratchpad.jsx
│   │   ├── SummaryScreen.jsx
│   │   ├── UserForm.jsx
│   │   ├── UserForm.css
│   │   └── WelcomeBanner.jsx
│   ├── test/
│   │   ├── setup.js                    # Vitest global setup (jest-dom matchers)
│   │   ├── mathUtils.test.js           # Unit tests for getMaxNumber
│   │   ├── Button.test.jsx
│   │   ├── FeedbackSection.test.jsx
│   │   ├── ScratchpadToggle.test.jsx
│   │   ├── SummaryScreen.test.jsx
│   │   └── WelcomeBanner.test.jsx
│   ├── utils/
│   │   └── mathUtils.js                # Difficulty range helper
│   ├── App.jsx                         # Root component, top-level routing state
│   ├── App.css
│   ├── index.css
│   └── main.jsx                        # React DOM entry point
├── index.html                          # Vite HTML entry
├── vite.config.js                      # Vite + Vitest configuration
├── eslint.config.js                    # ESLint flat config
├── package.json
└── package-lock.json
```

---

## 4. Application Architecture

The app uses **client-side state routing** — there is no React Router. Navigation between screens is controlled by two pieces of state in `App.jsx`:

```
App
├── started = false  →  UserForm (home screen)
└── started = true   →  [operation-specific flashcard]
    ├── operation === "Addition"       →  AdditionFlashcard
    ├── operation === "Subtraction"    →  SubtractionFlashcard
    ├── operation === "Multiplication" →  MultiplicationFlashcard
    └── operation === "Division"       →  DivisionFlashcard
```

Each flashcard component manages its own internal screen flow:

```
Flashcard Component
├── Screen: problem count selector (or times table picker for multiplication)
├── Screen: active problem loop
└── Screen: session summary (SummaryScreen)
```

**Data flow is top-down via props.** There is no global state store (no Redux, no Context API). Settings selected on `UserForm` are passed down as a `settings` prop to the active flashcard component.

---

## 5. Component Reference

### Shared / Utility Components

#### `App.jsx`
Root component. Holds `userSettings` (name, experience, operation) and `started` boolean. Renders `Header` always, then conditionally renders `UserForm` or the appropriate flashcard based on state.

**Props:** none (root)  
**State:** `userSettings`, `started`

---

#### `Header.jsx`
Fixed top navigation bar displaying the app name/logo. Purely presentational.

**Props:** none

---

#### `UserForm.jsx`
The home screen form where students configure their session.

**Props:**
- `onStart(settings)` — called when the form is submitted; receives `{ name, experience, operation }`
- `initialSettings` — pre-populates the form when returning from a session (preserves prior selections)

**State:** `name`, `experience`, `operation`, `error`

**Behavior:**
- Name field is optional
- Basic profanity filter on the name field (blocks a hardcoded list of words)
- GO button is disabled while there is a validation error
- Experience options: Beginner, Intermediate, Advanced, Proficient, Expert
- Operation options: Addition, Subtraction, Multiplication, Division

---

#### `WelcomeBanner.jsx`
Displays a greeting heading. Shows "Welcome, [name]! 👋" at the start of a session and "Great job, [name]! 🎉" on the summary screen.

**Props:**
- `name` (string) — student's name; omitted if blank
- `done` (boolean) — switches between welcome and congratulations copy

---

#### `Flashcard.jsx`
The green problem card. Purely presentational wrapper that renders its `children` inside a styled card.

**Props:**
- `children` — the problem expression (e.g., `5 + 3 = ?`)

---

#### `FlashcardHeader.jsx`
Displays the current problem number and running correct count at the top of a session.

**Props:**
- `current` (number) — current problem index (1-based)
- `total` (number) — total problems in session
- `score` (number) — number correct so far
- `label` (string, optional) — overrides the default "Problem X of Y" text (used by multiplication times table mode)

---

#### `FeedbackSection.jsx`
Renders the feedback UI after an answer is submitted. Handles three states:

| `feedback` value | Display |
|---|---|
| `"correct"` | ✅ message + Next / See Results button |
| `"wrong"` | ❌ message + Try Again + Peek at Answer buttons |
| `"peeked"` | 👀 reveals the answer, marks incorrect, shows Next button |
| `null` | renders nothing |

**Props:**
- `feedback` — `"correct"` | `"wrong"` | `"peeked"` | `null`
- `problem` — the current problem object
- `formatProblem(p)` — function returning the problem string (e.g., `"5 + 3"`)
- `formatAnswer(p)` — function returning the answer string (e.g., `"8"` or `"3 R1"`)
- `onNext()` — advance to next problem
- `onTryAgain()` — clear answer and retry
- `onPeek()` — reveal answer and mark incorrect
- `isLast` (boolean) — changes "Next →" button to "See Results"

---

#### `Button.jsx`
Shared button component. Applies a CSS class based on `variant`.

**Props:**
- `variant` — `"primary"` | `"secondary"` | `"outline"` | `"danger"` (default: `"primary"`)
- `onClick`, `disabled`, `type`, `className`, `children` — standard button props

**CSS classes applied:** `btn btn-{variant}`

---

#### `ProblemCountSelector.jsx`
Screen that asks the student how many problems they want to solve. Renders 10 / 25 / 50 / 100 buttons. Used by Addition, Subtraction, and Division.

**Props:**
- `name` (string) — student name for the welcome banner
- `operation` (string) — operation name for the prompt text
- `onSelect(count)` — called with the chosen count
- `onBack()` — returns to the home screen

---

#### `SummaryScreen.jsx`
End-of-session results screen. Shows score, percentage, and an encouraging message.

| Score % | Message |
|---|---|
| 100% | "Perfect score! 🌟" |
| 80–99% | "Really great work! Keep it up! 💪" |
| 60–79% | "Good effort! A little more practice and you'll get there! 📚" |
| < 60% | "Keep practicing — you're getting better every time! 🚀" |

**Props:**
- `name` — student name
- `score` — number of correct first-attempt answers
- `total` — total problems attempted
- `onPlayAgain()` — restart the same session configuration
- `onBack()` — return to home screen
- `title` (optional) — subtitle shown below the banner (used by multiplication)
- `extraActions` (optional) — additional buttons rendered between Play Again and Back (used by multiplication's "Try Another" button)

---

#### `ScratchpadToggle.jsx`
A checkbox that shows/hides the scratchpad panel.

**Props:**
- `hidden` (boolean) — current visibility state
- `onChange(hidden)` — called when toggled

---

### Flashcard Session Components

All four flashcard components share the same general internal flow:

1. **Problem count selection** (or times table selection for multiplication)
2. **Active problem loop** — generate problem → accept answer → show feedback → advance
3. **Session summary** via `SummaryScreen`

#### `AdditionFlashcard.jsx`

Generates problems as `a + b` where both operands are drawn from `[0, max]` (Beginner) or `[1, max]` (all other levels).

**Scratchpad integration:** Reads `scratchpadTotal` from `AdditionScratchpad` as a fallback answer if the answer input is left blank.

**Key state:** `problem`, `userAnswer`, `feedback`, `score`, `triedOnce`, `peeked`, `clearSignal`, `scratchpadTotal`, `hideScratchpad`

---

#### `SubtractionFlashcard.jsx`

Generates problems ensuring `a >= b` so the result is always non-negative (zero is allowed).

**Scratchpad integration:** Same fallback pattern as addition, reading from `SubtractionScratchpad`.

---

#### `MultiplicationFlashcard.jsx`

Has two modes toggled by `ModeToggle` (an inline component):

- **Times Tables mode** — student picks a number 0–14; the component generates all 15 problems (`n × 0` through `n × 14`) in order. Switching modes resets all state.
- **Random mode** — random problems using the experience-based max number. Student picks problem count (10/25/50/100).

**Extra UI:** `ModeToggle` renders at the top of every screen in this component. The summary screen includes a "Try Another" button (via `extraActions` prop on `SummaryScreen`) to return to the selector without going back to the home screen.

**Scratchpad integration:** Reads `scratchpadTotal` from `MultiplicationScratchpad`.

**Key state:** `activeType`, `screen`, `selectedTable`, `problems` (array for times table), `celebrateTick` (drives a CSS pop animation on correct answers)

---

#### `DivisionFlashcard.jsx`

Generates division problems with two modes based on experience level:

- **Beginner / Intermediate** — problems always divide evenly (no remainders). Answer input is a single number.
- **Advanced / Proficient / Expert** — remainders are possible. When a problem has a remainder, two inputs appear: Quotient and Remainder (displayed as `Q R R`).

**Problem generation logic:**
- Divisor (`b`) is capped at `min(max, 20)` to keep problems reasonable
- For no-remainder mode: picks a random quotient, then computes `a = b × quotient`
- For remainder mode: picks a random `a` and computes quotient and remainder

**Scratchpad integration:** Reads `scratchpadQuotient` and `scratchpadRemainder` from `LongDivisionScratchpad`.

---

### Scratchpad Components

All scratchpads:
- Pre-fill the problem numbers automatically when a new problem loads
- Auto-clear when `clearSignal` increments (new problem)
- Expose a **Clear** button to reset manually
- Report their answer row back to the parent via callback props

#### `AdditionScratchpad.jsx`
Column layout (Thousands, Hundreds, Tens, Ones) with a carry row, the two addends pre-filled, and an answer row. Includes a place value legend.

**Props:** `a`, `b`, `clearSignal`, `onTotalChange(value)`

---

#### `SubtractionScratchpad.jsx`
Same column layout as addition with a borrow row instead of carry.

**Props:** `a`, `b`, `clearSignal`, `onTotalChange(value)`

---

#### `MultiplicationScratchpad.jsx`
Stacked layout with the two factors, a carry row, partial product rows (student can add/remove rows), and a final total row.

**Props:** `a`, `b`, `clearSignal`, `onTotalChange(value)`

---

#### `LongDivisionScratchpad.jsx`
Long division "house" layout with step-by-step fields: divide, multiply, subtract, bring-down. Reports quotient and remainder separately.

**Props:** `divisor`, `dividend`, `clearSignal`, `onQuotientChange(value)`, `onRemainderChange(value)`

---

## 6. Utility Functions

### `src/utils/mathUtils.js`

#### `getMaxNumber(experience, operation?)`

Returns the upper bound for randomly generated numbers based on the student's experience level.

| Experience | Default max | Addition (Beginner) |
|---|---|---|
| Beginner | 20 | **9** (single digit) |
| Intermediate | 50 | 50 |
| Advanced | 100 | 100 |
| Proficient | 250 | 250 |
| Expert | 999 | 999 |

The Beginner addition override (max 9) supports finger counting and single-digit fluency before moving to larger numbers.

---

## 7. Game Logic & Rules

### Scoring
- A problem is counted as **correct only on the first attempt**
- If the student tries again after a wrong answer and gets it right, it is **not** counted as correct
- Peeking at the answer counts as **incorrect** and increments `wrongCount`
- The final score shown on `SummaryScreen` is the count of first-attempt correct answers

### Answer Submission
- The answer input is the primary source
- If the answer input is **blank**, the app falls back to reading the answer from the scratchpad's answer row
- For division with remainders, both quotient and remainder must be correct for the problem to be marked correct

### Problem Generation
- Addition: both operands from `[0, max]` (Beginner) or `[1, max]`
- Subtraction: `a` and `b` generated, then swapped if needed so `a >= b`
- Multiplication (random): both operands from `[1, max]`
- Multiplication (times table): fixed sequence `n × 0` through `n × 14`
- Division (no remainder): `a = b × quotient` to guarantee clean division
- Division (with remainder): random `a`, compute `quotient = floor(a/b)`, `remainder = a % b`

### Settings Persistence
When the student clicks "← Back" from a session, `App.jsx` keeps `userSettings` in state. `UserForm` receives `initialSettings` and pre-populates all fields, so the student doesn't have to re-select everything.

---

## 8. State Management

The app uses **local React state only** (`useState`, `useRef`). There is no global state library.

| Scope | State held |
|---|---|
| `App.jsx` | `userSettings`, `started` |
| Each flashcard component | All session state (problem, score, feedback, scratchpad values, etc.) |
| `UserForm.jsx` | Form field values, validation error |

State is reset when a new session starts (`startSession()` in each flashcard component).

---

## 9. Styling Approach

- **Plain CSS** — no CSS framework or preprocessor
- Each component has a co-located `.css` file (e.g., `Button.css`, `Header.css`)
- Shared scratchpad styles live in `Scratchpad.css`
- `index.css` holds global resets and base styles
- `App.css` holds top-level layout styles
- Responsive design is handled with CSS media queries

---

## 10. Testing

Tests live in `src/test/` and run with **Vitest** in a **jsdom** environment. React Testing Library is used for component tests.

### Test Files

| File | What it covers |
|---|---|
| `mathUtils.test.js` | `getMaxNumber` — all 5 experience levels + Beginner addition override |
| `Button.test.jsx` | Renders with correct variant class, handles click, respects disabled |
| `FeedbackSection.test.jsx` | Correct / wrong / peeked states render expected text and buttons |
| `ScratchpadToggle.test.jsx` | Toggle renders, fires onChange with correct value |
| `SummaryScreen.test.jsx` | Score display, percentage, all four encouragement messages |
| `WelcomeBanner.test.jsx` | Welcome vs. done state, with and without name |

### Running Tests

```bash
# Single run (used in CI)
npm test -- --run

# Watch mode (local development)
npm test

# With coverage report
npm run test:coverage
```

### Test Configuration

Vitest is configured inside `vite.config.js`:

```js
test: {
  globals: true,          // no need to import describe/it/expect
  environment: 'jsdom',   // browser-like DOM
  setupFiles: './src/test/setup.js',  // loads @testing-library/jest-dom matchers
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
  },
}
```

---

## 11. CI/CD Pipeline

Every push to the `main` branch triggers the GitHub Actions workflow at `.github/workflows/deploy.yml`.

### Pipeline Steps

```
push to main
    │
    ▼
1. Checkout code (actions/checkout@v4)
    │
    ▼
2. Set up Node.js 20 (actions/setup-node@v4)
    │
    ▼
3. npm ci  (clean install from lock file)
    │
    ▼
4. npm test -- --run  ← BLOCKS deployment if any test fails
    │
    ▼
5. npm run build  (Vite production build → dist/)
    │
    ▼
6. Configure AWS credentials (aws-actions/configure-aws-credentials@v4)
    │
    ▼
7. aws s3 sync dist/ → S3 bucket
   ├── All files except index.html: Cache-Control: max-age=31536000, immutable
   └── index.html: Cache-Control: no-cache, no-store, must-revalidate
    │
    ▼
8. CloudFront invalidation (/* paths)
```

### Cache Strategy

| File type | Cache-Control | Reason |
|---|---|---|
| Hashed JS/CSS assets | `max-age=31536000, immutable` | Vite adds content hashes to filenames; safe to cache forever |
| `index.html` | `no-cache, no-store, must-revalidate` | Always fetched fresh so browsers pick up new asset hashes |

---

## 12. AWS Infrastructure

```
User → Route 53 (DNS) → CloudFront (CDN / HTTPS) → S3 (static files)
```

| Service | Purpose |
|---|---|
| **S3** | Stores the production `dist/` build files |
| **CloudFront** | Global CDN, enforces HTTPS, handles SPA routing (custom error responses redirect to `index.html`) |
| **Route 53** | Manages `learningmathwithme.com` DNS records, routes to CloudFront |
| **ACM** | SSL/TLS certificate for HTTPS on the custom domain |
| **IAM** | Scoped `github-actions-deploy` user with least-privilege S3 + CloudFront permissions |

**Estimated monthly cost:** < $1 USD at typical portfolio/demo traffic levels.

---

## 13. Environment & Secrets

The CI/CD pipeline requires four GitHub Actions secrets:

| Secret | Used for |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user credentials for S3 sync and CloudFront invalidation |
| `AWS_SECRET_ACCESS_KEY` | IAM user credentials |
| `S3_BUCKET_NAME` | Target S3 bucket for deployment |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution to invalidate after deploy |

These are set in the GitHub repository under **Settings → Secrets and variables → Actions**.

There are no runtime environment variables — the app is fully static with no API keys or backend calls.

---

## 14. Local Development

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Setup

```bash
git clone https://github.com/kdoba22/learningmathwithme.git
cd learningmathwithme
npm install
```

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at http://localhost:5173 |
| `npm test -- --run` | Run all tests once |
| `npm test` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with V8 coverage report |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make changes and ensure tests pass: `npm test -- --run`
3. Ensure linting passes: `npm run lint`
4. Push and open a Pull Request against `main`
5. Merging to `main` automatically deploys to production

---

## 15. Roadmap

Items tracked in the README for future development:

- [ ] Fraction operations (add, subtract, multiply, divide)
- [ ] Step-by-step help modules for fraction problems
- [ ] Decimal operations
- [ ] Money math
- [ ] Backend for cross-session progress tracking
- [ ] User accounts and session history
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Sound effects and animations for correct/incorrect answers

---

*Documentation generated May 2026. Developed with Amazon Q Developer.*
