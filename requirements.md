# Requirements — Learning Math With Me

> This document captures the formal requirements for the current production version of the application (v1.0). Requirements are written as testable statements using **SHALL** for mandatory behavior and **SHOULD** for preferred behavior.
>
> Each requirement is tagged with a unique ID for traceability. When a new feature is built, new requirements are added here before implementation begins.

---

## Table of Contents

1. [REQ-APP — Application Shell](#1-req-app--application-shell)
2. [REQ-FORM — Student Setup Form](#2-req-form--student-setup-form)
3. [REQ-DIFF — Difficulty Scaling](#3-req-diff--difficulty-scaling)
4. [REQ-SESSION — Session Flow](#4-req-session--session-flow)
5. [REQ-SCORE — Scoring](#5-req-score--scoring)
6. [REQ-FEEDBACK — Feedback](#6-req-feedback--feedback)
7. [REQ-SUMMARY — Session Summary](#7-req-summary--session-summary)
8. [REQ-ADD — Addition](#8-req-add--addition)
9. [REQ-SUB — Subtraction](#9-req-sub--subtraction)
10. [REQ-MUL — Multiplication](#10-req-mul--multiplication)
11. [REQ-DIV — Division](#11-req-div--division)
12. [REQ-SCRATCH — Scratchpads (General)](#12-req-scratch--scratchpads-general)
13. [REQ-SCRATCH-ADD — Addition Scratchpad](#13-req-scratch-add--addition-scratchpad)
14. [REQ-SCRATCH-SUB — Subtraction Scratchpad](#14-req-scratch-sub--subtraction-scratchpad)
15. [REQ-SCRATCH-MUL — Multiplication Scratchpad](#15-req-scratch-mul--multiplication-scratchpad)
16. [REQ-SCRATCH-DIV — Division Scratchpad](#16-req-scratch-div--division-scratchpad)
17. [REQ-NAV — Navigation](#17-req-nav--navigation)
18. [REQ-PLATFORM — Platform & Accessibility](#18-req-platform--accessibility)

---

## 1. REQ-APP — Application Shell

| ID | Requirement |
|---|---|
| REQ-APP-01 | The application SHALL display a persistent header with the application name on all screens. |
| REQ-APP-02 | The application SHALL render correctly on desktop, tablet, and mobile screen sizes. |
| REQ-APP-03 | The application SHALL function entirely in the browser with no server-side rendering or backend calls required for core functionality. |
| REQ-APP-04 | The application SHALL NOT require a user account or login to use. |
| REQ-APP-05 | The application SHALL NOT store any user data beyond the current browser session. |

---

## 2. REQ-FORM — Student Setup Form

| ID | Requirement |
|---|---|
| REQ-FORM-01 | The setup form SHALL present a name input field, an experience level selector, and an operation selector. |
| REQ-FORM-02 | The name field SHALL be optional — the student may leave it blank and proceed. |
| REQ-FORM-03 | The experience level selector SHALL offer exactly five options: Beginner, Intermediate, Advanced, Proficient, Expert. |
| REQ-FORM-04 | The operation selector SHALL offer exactly four options: Addition, Subtraction, Multiplication, Division. |
| REQ-FORM-05 | The form SHALL default to Beginner experience and Addition operation when first loaded. |
| REQ-FORM-06 | The GO button SHALL be disabled while a validation error is present. |
| REQ-FORM-07 | The form SHALL validate the name field for inappropriate language using the `bad-words-next` library with the English dictionary. |
| REQ-FORM-08 | WHERE the name field contains a word identified as inappropriate by the profanity filter, the form SHALL display an error message and prevent submission. |
| REQ-FORM-09 | The profanity filter SHALL detect common letter substitutions (e.g., `sh!t`, `@ss`). |
| REQ-FORM-10 | WHERE the name field is empty, the profanity filter SHALL NOT trigger. |
| REQ-FORM-11 | WHEN the student returns to the setup form from a session, the form SHALL pre-populate all fields with the settings from the previous session. |

---

## 3. REQ-DIFF — Difficulty Scaling

| ID | Requirement |
|---|---|
| REQ-DIFF-01 | Problem number ranges SHALL be determined by the student's selected experience level. |
| REQ-DIFF-02 | The Beginner level SHALL use a maximum number of 20 for all operations except addition. |
| REQ-DIFF-03 | The Beginner level SHALL use a maximum number of 9 for addition (single-digit operands only). |
| REQ-DIFF-04 | The Intermediate level SHALL use a maximum number of 50. |
| REQ-DIFF-05 | The Advanced level SHALL use a maximum number of 100. |
| REQ-DIFF-06 | The Proficient level SHALL use a maximum number of 250. |
| REQ-DIFF-07 | The Expert level SHALL use a maximum number of 999. |

---

## 4. REQ-SESSION — Session Flow

| ID | Requirement |
|---|---|
| REQ-SESSION-01 | Before starting a session, the student SHALL be presented with a problem count selector offering 10, 25, 50, or 100 problems. |
| REQ-SESSION-02 | The session SHALL present problems one at a time. |
| REQ-SESSION-03 | The session SHALL display the current problem number and total problem count throughout the session. |
| REQ-SESSION-04 | The session SHALL display the running correct count throughout the session. |
| REQ-SESSION-05 | WHEN the student answers the last problem, the session SHALL transition to the summary screen. |
| REQ-SESSION-06 | The answer input field SHALL receive focus automatically when a new problem is displayed. |
| REQ-SESSION-07 | The answer input field SHALL receive focus automatically after a Try Again action. |
| REQ-SESSION-08 | WHEN the answer input is blank and the student submits, the system SHALL attempt to use the scratchpad answer row as the answer source. |
| REQ-SESSION-09 | WHEN neither the answer input nor the scratchpad answer row contains a valid number, the submission SHALL be ignored. |

---

## 5. REQ-SCORE — Scoring

| ID | Requirement |
|---|---|
| REQ-SCORE-01 | A problem SHALL be counted as correct only if answered correctly on the first attempt. |
| REQ-SCORE-02 | IF the student answers incorrectly and then answers correctly on a subsequent attempt, the problem SHALL NOT be counted as correct. |
| REQ-SCORE-03 | IF the student peeks at the answer, the problem SHALL be counted as incorrect. |
| REQ-SCORE-04 | Peeking SHALL NOT increment the correct score. |
| REQ-SCORE-05 | The correct count SHALL NOT decrease during a session. |

---

## 6. REQ-FEEDBACK — Feedback

| ID | Requirement |
|---|---|
| REQ-FEEDBACK-01 | WHEN the student submits a correct answer, the system SHALL display a correct feedback message showing the full equation and answer. |
| REQ-FEEDBACK-02 | WHEN the student submits an incorrect answer, the system SHALL display a wrong feedback message with options to Try Again or Peek at the Answer. |
| REQ-FEEDBACK-03 | WHEN the student peeks at the answer, the system SHALL display the correct answer and indicate the problem is marked incorrect. |
| REQ-FEEDBACK-04 | The Try Again action SHALL clear the answer input and return the student to the answer entry state. |
| REQ-FEEDBACK-05 | On the last problem of a session, the Next button SHALL be labeled "See Results" instead of "Next →". |
| REQ-FEEDBACK-06 | The answer input form SHALL be hidden while feedback is displayed. |

---

## 7. REQ-SUMMARY — Session Summary

| ID | Requirement |
|---|---|
| REQ-SUMMARY-01 | The summary screen SHALL display the student's name (if provided) in a congratulatory heading. |
| REQ-SUMMARY-02 | The summary screen SHALL display the number of correct answers and the total number of problems (e.g., "8 / 10 correct"). |
| REQ-SUMMARY-03 | The summary screen SHALL display the score as a percentage, rounded to the nearest whole number. |
| REQ-SUMMARY-04 | WHERE the score is 100%, the summary SHALL display "Perfect score! 🌟". |
| REQ-SUMMARY-05 | WHERE the score is between 80% and 99% inclusive, the summary SHALL display "Really great work! Keep it up! 💪". |
| REQ-SUMMARY-06 | WHERE the score is between 60% and 79% inclusive, the summary SHALL display "Good effort! A little more practice and you'll get there! 📚". |
| REQ-SUMMARY-07 | WHERE the score is below 60%, the summary SHALL display "Keep practicing — you're getting better every time! 🚀". |
| REQ-SUMMARY-08 | The summary screen SHALL provide a Play Again button that restarts the session with the same problem count. |
| REQ-SUMMARY-09 | The summary screen SHALL provide a Change Settings button that returns the student to the setup form with settings preserved. |

---

## 8. REQ-ADD — Addition

| ID | Requirement |
|---|---|
| REQ-ADD-01 | Addition problems SHALL be generated as `a + b` where both operands are randomly selected. |
| REQ-ADD-02 | At Beginner level, both operands SHALL be drawn from the range [0, 9] inclusive (zero allowed to support finger counting). |
| REQ-ADD-03 | At all levels above Beginner, both operands SHALL be drawn from the range [1, max] where max is determined by the experience level. |
| REQ-ADD-04 | The correct answer SHALL equal `a + b`. |

---

## 9. REQ-SUB — Subtraction

| ID | Requirement |
|---|---|
| REQ-SUB-01 | Subtraction problems SHALL be generated as `a − b` where `a >= b`. |
| REQ-SUB-02 | The result of a subtraction problem SHALL always be non-negative (zero is allowed). |
| REQ-SUB-03 | Both operands SHALL be drawn from the range [1, max] where max is determined by the experience level. |
| REQ-SUB-04 | The correct answer SHALL equal `a - b`. |

---

## 10. REQ-MUL — Multiplication

| ID | Requirement |
|---|---|
| REQ-MUL-01 | The multiplication session SHALL offer two modes: Times Tables and Random. |
| REQ-MUL-02 | A mode toggle SHALL be visible on all multiplication screens and SHALL allow switching between modes at any time. |
| REQ-MUL-03 | WHEN the mode is switched, all session state (score, current problem, progress) SHALL be reset. |
| REQ-MUL-04 | **Times Tables mode:** The student SHALL select a number from 0 to 14 to practice. |
| REQ-MUL-05 | **Times Tables mode:** The session SHALL present exactly 15 problems: `n × 0` through `n × 14` in sequential order. |
| REQ-MUL-06 | **Times Tables mode:** The session header SHALL display the selected table name (e.g., "5's Table — 3 of 15"). |
| REQ-MUL-07 | **Random mode:** The student SHALL select a problem count of 10, 25, 50, or 100. |
| REQ-MUL-08 | **Random mode:** Problems SHALL be generated as `a × b` where both operands are drawn from [1, max]. |
| REQ-MUL-09 | The summary screen for multiplication SHALL include a "Try Another" button that returns to the selector screen without going back to the setup form. |
| REQ-MUL-10 | The correct answer SHALL equal `a × b`. |

---

## 11. REQ-DIV — Division

| ID | Requirement |
|---|---|
| REQ-DIV-01 | At Beginner and Intermediate experience levels, division problems SHALL always divide evenly (no remainders). |
| REQ-DIV-02 | At Advanced, Proficient, and Expert experience levels, division problems MAY produce remainders. |
| REQ-DIV-03 | WHEN a problem has no remainder, the student SHALL enter a single answer (the quotient). |
| REQ-DIV-04 | WHEN a problem has a remainder, the student SHALL enter two values: the quotient and the remainder. |
| REQ-DIV-05 | WHEN a problem has a remainder, both the quotient AND the remainder must be correct for the problem to be marked correct. |
| REQ-DIV-06 | The divisor SHALL be capped at 20 regardless of experience level. |
| REQ-DIV-07 | WHEN the experience level allows remainders, the problem count selector SHALL display a notice warning the student that some problems may have remainders. |
| REQ-DIV-08 | The correct quotient SHALL equal `floor(a / b)`. |
| REQ-DIV-09 | The correct remainder SHALL equal `a mod b`. |

---

## 12. REQ-SCRATCH — Scratchpads (General)

| ID | Requirement |
|---|---|
| REQ-SCRATCH-01 | Every operation SHALL include a scratchpad panel displayed alongside the flashcard. |
| REQ-SCRATCH-02 | Each scratchpad SHALL pre-fill the problem's operands automatically when a new problem loads. |
| REQ-SCRATCH-03 | WHEN a new problem loads, the scratchpad SHALL auto-clear all student-entered cells while preserving the pre-filled operands. |
| REQ-SCRATCH-04 | Each scratchpad SHALL provide a Clear button that resets all student-entered cells and re-fills the operands. |
| REQ-SCRATCH-05 | Each scratchpad SHALL provide a Hide/Show toggle that collapses or expands the scratchpad panel. |
| REQ-SCRATCH-06 | WHEN the answer input is blank and the student submits, the scratchpad's answer row SHALL be used as the answer source. |
| REQ-SCRATCH-07 | The scratchpad answer row SHALL report its current value to the parent component via a callback whenever it changes. |

---

## 13. REQ-SCRATCH-ADD — Addition Scratchpad

| ID | Requirement |
|---|---|
| REQ-SCRATCH-ADD-01 | The addition scratchpad SHALL display a column layout with four place value columns: Thousands (Th), Hundreds (H), Tens (T), Ones (O). |
| REQ-SCRATCH-ADD-02 | The scratchpad SHALL include a carry row above the operands. |
| REQ-SCRATCH-ADD-03 | The scratchpad SHALL include a total (answer) row below the operands. |
| REQ-SCRATCH-ADD-04 | The carry row SHALL provide a Clear Row button to reset only the carry row. |
| REQ-SCRATCH-ADD-05 | The scratchpad SHALL display a place value legend (Th = Thousands, H = Hundreds, T = Tens, O = Ones). |
| REQ-SCRATCH-ADD-06 | The total row SHALL report its joined value to the parent via `onTotalChange` whenever any cell changes. |

---

## 14. REQ-SCRATCH-SUB — Subtraction Scratchpad

| ID | Requirement |
|---|---|
| REQ-SCRATCH-SUB-01 | The subtraction scratchpad SHALL display the same four-column layout as the addition scratchpad. |
| REQ-SCRATCH-SUB-02 | The scratchpad SHALL include a borrow row above the operands (in place of the carry row). |
| REQ-SCRATCH-SUB-03 | The scratchpad SHALL include a result (answer) row below the operands. |
| REQ-SCRATCH-SUB-04 | The borrow row SHALL provide a Clear Row button to reset only the borrow row. |
| REQ-SCRATCH-SUB-05 | The scratchpad SHALL display a place value legend. |
| REQ-SCRATCH-SUB-06 | The result row SHALL report its joined value to the parent via `onTotalChange` whenever any cell changes. |

---

## 15. REQ-SCRATCH-MUL — Multiplication Scratchpad

| ID | Requirement |
|---|---|
| REQ-SCRATCH-MUL-01 | The multiplication scratchpad SHALL display a stacked layout with the two factors pre-filled. |
| REQ-SCRATCH-MUL-02 | The scratchpad SHALL include a carry row above the top factor. |
| REQ-SCRATCH-MUL-03 | The scratchpad SHALL include one or more partial product rows. |
| REQ-SCRATCH-MUL-04 | The student SHALL be able to add additional partial product rows using an "+ Row" button. |
| REQ-SCRATCH-MUL-05 | WHEN more than one partial product row exists, the student SHALL be able to remove the last row using a "− Row" button. |
| REQ-SCRATCH-MUL-06 | The scratchpad SHALL include a final total row below the partial products. |
| REQ-SCRATCH-MUL-07 | The total row SHALL report its joined value to the parent via `onTotalChange` whenever any cell changes. |
| REQ-SCRATCH-MUL-08 | The carry row SHALL provide a Clear Row button. |

---

## 16. REQ-SCRATCH-DIV — Division Scratchpad

| ID | Requirement |
|---|---|
| REQ-SCRATCH-DIV-01 | The division scratchpad SHALL display a long division "house" layout with the divisor and dividend pre-filled. |
| REQ-SCRATCH-DIV-02 | The scratchpad SHALL include a quotient input field above the dividend. |
| REQ-SCRATCH-DIV-03 | The scratchpad SHALL include at least one work step with three fields: multiply, subtract, and bring-down. |
| REQ-SCRATCH-DIV-04 | The student SHALL be able to add additional work steps using a "+ Step" button. |
| REQ-SCRATCH-DIV-05 | WHEN more than one work step exists, the student SHALL be able to remove the last step using a "− Step" button. |
| REQ-SCRATCH-DIV-06 | The scratchpad SHALL include a remainder input field. |
| REQ-SCRATCH-DIV-07 | The quotient field SHALL report its value to the parent via `onQuotientChange` whenever it changes. |
| REQ-SCRATCH-DIV-08 | The remainder field SHALL report its value to the parent via `onRemainderChange` whenever it changes. |
| REQ-SCRATCH-DIV-09 | The dividend field SHALL be read-only (pre-filled, not editable by the student). |

---

## 17. REQ-NAV — Navigation

| ID | Requirement |
|---|---|
| REQ-NAV-01 | Every session screen SHALL provide a Back button that returns the student to the setup form. |
| REQ-NAV-02 | WHEN the student navigates back to the setup form, all previously selected settings SHALL be preserved and pre-populated. |
| REQ-NAV-03 | Navigation between screens SHALL be managed by application state — no URL changes or browser history entries are created. |

---

## 18. REQ-PLATFORM — Platform & Accessibility

| ID | Requirement |
|---|---|
| REQ-PLATFORM-01 | The application SHALL be deployable as a fully static site with no server-side runtime. |
| REQ-PLATFORM-02 | The application SHALL support the latest two major versions of Chrome, Firefox, Safari, and Edge. |
| REQ-PLATFORM-03 | All form inputs and buttons SHALL be keyboard accessible. |
| REQ-PLATFORM-04 | All form inputs SHALL have associated `<label>` elements. |
| REQ-PLATFORM-05 | The CI/CD pipeline SHALL block deployment if any automated test fails. |
| REQ-PLATFORM-06 | The production build SHALL set a 1-year cache header on hashed static assets. |
| REQ-PLATFORM-07 | The production build SHALL set a no-cache header on `index.html`. |

---

## Change Log

| Version | Date | Change |
|---|---|---|
| 1.0 | May 2026 | Initial requirements document — baseline for v1.0 production release |
| 1.0.1 | May 2026 | REQ-FORM-07 through REQ-FORM-10 added to reflect replacement of placeholder profanity filter with `bad-words-next` library |
