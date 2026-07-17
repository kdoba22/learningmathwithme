# Architecture: Separated Number Types

## Overview

This document describes the planned architecture for supporting multiple number types
(whole numbers, decimals, money, fractions) as **separate component trees** rather than
toggled modes within a single component.

---

## Current State (After Decimal Removal)

The app currently supports whole-number flashcards for four operations:

```
src/components/
  AdditionFlashcard.jsx       ← whole numbers only
  SubtractionFlashcard.jsx    ← whole numbers only
  MultiplicationFlashcard.jsx ← whole numbers only
  DivisionFlashcard.jsx       ← whole numbers only
  AdditionScratchpad.jsx      ← 4-column (Th, H, T, O)
  SubtractionScratchpad.jsx   ← 4-column (Th, H, T, O)
  MultiplicationScratchpad.jsx← flex-row layout
  LongDivisionScratchpad.jsx  ← step-based layout
```

Shared components (reusable across all number types):
- `FeedbackSection.jsx` — correct/wrong/peeked feedback
- `SummaryScreen.jsx` — end-of-session score summary
- `FlashcardHeader.jsx` — progress bar (X of Y, score)
- `ProblemCountSelector.jsx` — session count picker
- `Button.jsx` — styled button
- `ScratchpadToggle.jsx` — show/hide scratchpad
- `StackedProblem.jsx` — vertical problem layout (works with any string values)
- `Flashcard.jsx` — horizontal problem display
- `WelcomeBanner.jsx` — greeting

---

## Planned Architecture

### Folder Structure

```
src/components/
  shared/                        ← shared presentational components (move existing)
    FeedbackSection.jsx
    SummaryScreen.jsx
    FlashcardHeader.jsx
    ProblemCountSelector.jsx
    Button.jsx
    ScratchpadToggle.jsx
    StackedProblem.jsx
    Flashcard.jsx
    WelcomeBanner.jsx

  whole/                         ← whole number flashcards (current)
    AdditionFlashcard.jsx
    SubtractionFlashcard.jsx
    MultiplicationFlashcard.jsx
    DivisionFlashcard.jsx
    AdditionScratchpad.jsx
    SubtractionScratchpad.jsx
    MultiplicationScratchpad.jsx
    LongDivisionScratchpad.jsx

  decimal/                       ← decimal number flashcards (future)
    AdditionFlashcard.jsx
    SubtractionFlashcard.jsx
    MultiplicationFlashcard.jsx
    DivisionFlashcard.jsx
    DecimalScratchpad.jsx        ← purpose-built with decimal point column

  money/                         ← money math (future)
    AdditionFlashcard.jsx
    SubtractionFlashcard.jsx
    MakingChange.jsx
    MoneyScratchpad.jsx          ← shows $ sign, cents column

  fractions/                     ← fraction math (future)
    AdditionFlashcard.jsx
    SubtractionFlashcard.jsx
    MultiplicationFlashcard.jsx
    DivisionFlashcard.jsx
    FractionScratchpad.jsx       ← numerator/denominator layout
```

### Routing / Selection

The `UserForm` collects three settings:
1. **Name** — student's name
2. **Experience level** — Beginner, Intermediate, etc.
3. **Operation** — Addition, Subtraction, Multiplication, Division
4. **Number Type** (new) — Whole Numbers, Decimals, Money, Fractions

`App.jsx` routes to the correct component based on `numberType + operation`:

```jsx
// Conceptual routing
const componentMap = {
  "whole-Addition": WholeAdditionFlashcard,
  "whole-Subtraction": WholeSubtractionFlashcard,
  "decimal-Addition": DecimalAdditionFlashcard,
  "decimal-Subtraction": DecimalSubtractionFlashcard,
  "money-Addition": MoneyAdditionFlashcard,
  "fractions-Addition": FractionsAdditionFlashcard,
  // ...
};
```

### What's Shared vs. Unique

| Layer | Shared? | Notes |
|-------|---------|-------|
| Feedback (correct/wrong/peek) | ✅ Shared | Same UX for all number types |
| Summary screen | ✅ Shared | Score display is universal |
| Progress header | ✅ Shared | X of Y problems |
| Problem count selector | ✅ Shared | 10/25/50/100 buttons |
| Problem generation | ❌ Per type | Decimal gen ≠ fraction gen ≠ whole gen |
| Answer validation | ❌ Per type | Tolerance for decimals, exact for whole |
| Scratchpad | ❌ Per type | Completely different layouts |
| Problem display | Mostly shared | StackedProblem handles string rendering |

### Shared Hooks (Optional Refactor)

To reduce repetition of session state logic across number types:

```jsx
// src/hooks/useFlashcardSession.js
function useFlashcardSession({ generateProblem, validateAnswer }) {
  // Manages: problem, score, currentNum, feedback, done, triedOnce, etc.
  // Returns: startSession, handleSubmit, handleNext, handlePeek, handleTryAgain
}
```

Each flashcard component would use this hook and only provide:
- `generateProblem()` — how to make a new problem
- `validateAnswer(userInput, problem)` — how to check correctness

---

## Benefits

1. **Isolation** — Adding fractions can't break whole number addition
2. **Clarity** — Each component has one job, easy to read and debug
3. **Purpose-built scratchpads** — No awkward `if (dp > 0)` branching
4. **Independent testing** — Test decimal logic without touching whole numbers
5. **Gradual rollout** — Ship new number types independently

## Migration Steps

When ready to add decimals back:
1. Create `src/components/decimal/` folder
2. Build `DecimalAdditionFlashcard` as a new component (not copied from whole)
3. Build `DecimalScratchpad` with proper column layout for decimal points
4. Add "Decimals" as a number type option in UserForm
5. Wire routing in App.jsx
6. Repeat for subtraction, multiplication, division

---

## Experience Level Mapping (Future)

Each number type can define its own difficulty scaling:

| Number Type | Beginner | Intermediate | Advanced | Proficient | Expert |
|-------------|----------|--------------|----------|------------|--------|
| Whole | 0–9 | 0–50 | 0–100 | 0–250 | 0–999 |
| Decimal | 1 dp, small | 1 dp, medium | 2 dp | 2 dp, large | 3 dp |
| Money | Coins only | Bills + coins | < $100 | < $1000 | Any |
| Fractions | Halves/quarters | Simple fractions | Unlike denom | Mixed numbers | Complex |
