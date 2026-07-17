# Requirements Document — Decimal Math Feature

## Introduction

This feature adds decimal number practice to all four existing math operations: addition, subtraction, multiplication, and division. Rather than creating a separate "Decimals" operation, each existing operation gains a mode toggle — similar to how multiplication currently offers "Times Tables" vs. "Random" — allowing students to choose between "Whole Numbers" and "Decimal Numbers" within the same operation.

Decimal problems are appropriate for students in approximately 4th grade and above. The number of decimal places scales with the student's experience level, keeping problems age-appropriate across the full Beginner–Expert range.

## Glossary

- **Decimal_Mode**: The sub-mode of an operation in which one or both operands contain a decimal point.
- **Whole_Number_Mode**: The sub-mode of an operation in which all operands are whole integers (the existing behavior).
- **Mode_Toggle**: The UI control that switches an operation between Whole Number Mode and Decimal Mode, modeled after the existing Times Tables / Random toggle in multiplication.
- **Decimal_Places**: The number of digits to the right of the decimal point in a generated operand.
- **Number_Generator**: The utility responsible for producing random operands for a given operation, experience level, and mode.
- **Flashcard**: The card component that displays a math problem and accepts the student's answer.
- **Scratchpad**: The panel displayed alongside the Flashcard that provides a paper-like workspace for working through problems.
- **Answer_Input**: The text field in which the student types their answer.
- **FeedbackSection**: The component that displays correct/wrong/peeked feedback after an answer is submitted.
- **SummaryScreen**: The screen shown at the end of a session displaying the student's score.
- **ProblemCountSelector**: The screen that lets the student choose how many problems to solve (10, 25, 50, or 100).
- **Session**: A single practice run from the first problem through the SummaryScreen.

---

## Requirements

### Requirement 1: Mode Toggle on Each Operation

**User Story:** As a student, I want to choose between Whole Numbers and Decimal Numbers for any math operation, so that I can practice the type of problem I am working on in class.

#### Acceptance Criteria

1. THE Addition_Flashcard SHALL display a Mode_Toggle with two options: "Whole Numbers" and "Decimal Numbers".
2. THE Subtraction_Flashcard SHALL display a Mode_Toggle with two options: "Whole Numbers" and "Decimal Numbers".
3. THE Multiplication_Flashcard SHALL display a Mode_Toggle with three options: "Times Tables", "Whole Numbers", and "Decimal Numbers".
4. THE Division_Flashcard SHALL display a Mode_Toggle with two options: "Whole Numbers" and "Decimal Numbers".
5. THE Mode_Toggle SHALL be visible on all sub-screens within an operation (problem count selector, active session, and summary screen).
6. WHEN the student selects a different mode via the Mode_Toggle, THE Flashcard SHALL reset all session state (score, current problem, progress) and navigate to the appropriate starting screen for the new mode.
7. WHEN the student first opens an operation, THE Mode_Toggle SHALL default to "Whole Numbers".

---

### Requirement 2: Decimal Place Scaling by Experience Level

**User Story:** As a student, I want decimal problems to match my experience level, so that the problems are neither too easy nor too hard for me.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active and the experience level is Beginner, THE Number_Generator SHALL produce operands with exactly 1 decimal place.
2. WHEN Decimal_Mode is active and the experience level is Intermediate, THE Number_Generator SHALL produce operands with exactly 1 decimal place.
3. WHEN Decimal_Mode is active and the experience level is Advanced, THE Number_Generator SHALL produce operands with exactly 2 decimal places.
4. WHEN Decimal_Mode is active and the experience level is Proficient, THE Number_Generator SHALL produce operands with exactly 2 decimal places.
5. WHEN Decimal_Mode is active and the experience level is Expert, THE Number_Generator SHALL produce operands with exactly 3 decimal places.
6. THE Number_Generator SHALL use the existing experience-level max number as the integer part range for decimal operands (e.g., Beginner max = 20, so the integer part is drawn from [1, 20]).

---

### Requirement 3: Decimal Addition

**User Story:** As a student, I want to practice adding decimal numbers, so that I can build fluency with decimal arithmetic.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active for addition, THE Number_Generator SHALL produce two operands each with the number of decimal places determined by the student's experience level.
2. WHEN Decimal_Mode is active for addition, THE Addition_Flashcard SHALL display the problem as `a + b = ?` where `a` and `b` are decimal numbers.
3. WHEN Decimal_Mode is active for addition, THE Answer_Input SHALL accept decimal values (e.g., `type="number"` with `step` set to match the expected decimal places).
4. WHEN Decimal_Mode is active for addition, THE Addition_Flashcard SHALL evaluate the student's answer by comparing it to the mathematically correct sum, rounded to the same number of decimal places as the operands.
5. WHEN Decimal_Mode is active for addition at Beginner level, THE Number_Generator SHALL allow zero as an operand (consistent with whole-number Beginner addition behavior).

---

### Requirement 4: Decimal Subtraction

**User Story:** As a student, I want to practice subtracting decimal numbers, so that I can build fluency with decimal arithmetic.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active for subtraction, THE Number_Generator SHALL produce two operands each with the number of decimal places determined by the student's experience level, where `a >= b` to guarantee a non-negative result.
2. WHEN Decimal_Mode is active for subtraction, THE Subtraction_Flashcard SHALL display the problem as `a − b = ?` where `a` and `b` are decimal numbers.
3. WHEN Decimal_Mode is active for subtraction, THE Answer_Input SHALL accept decimal values.
4. WHEN Decimal_Mode is active for subtraction, THE Subtraction_Flashcard SHALL evaluate the student's answer by comparing it to the mathematically correct difference, rounded to the same number of decimal places as the operands.
5. WHEN Decimal_Mode is active for subtraction, THE Number_Generator SHALL guarantee the result is greater than or equal to zero.

---

### Requirement 5: Decimal Multiplication

**User Story:** As a student, I want to practice multiplying decimal numbers, so that I can build fluency with decimal arithmetic.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active for multiplication, THE Number_Generator SHALL produce two operands each with the number of decimal places determined by the student's experience level.
2. WHEN Decimal_Mode is active for multiplication, THE Multiplication_Flashcard SHALL display the problem as `a × b = ?` where `a` and `b` are decimal numbers.
3. WHEN Decimal_Mode is active for multiplication, THE Answer_Input SHALL accept decimal values.
4. WHEN Decimal_Mode is active for multiplication, THE Multiplication_Flashcard SHALL evaluate the student's answer by comparing it to the mathematically correct product, rounded to twice the number of decimal places of the operands (e.g., 1-decimal-place operands produce a 2-decimal-place answer).
5. WHEN Decimal_Mode is active for multiplication, THE Multiplication_Flashcard SHALL display the problem count selector (10, 25, 50, or 100 problems) before starting the session, consistent with Random mode behavior.
6. WHEN Decimal_Mode is active for multiplication, THE Multiplication_Flashcard SHALL NOT offer the Times Tables sub-mode (Times Tables is whole-number only).

---

### Requirement 6: Decimal Division

**User Story:** As a student, I want to practice dividing decimal numbers, so that I can build fluency with decimal arithmetic.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active for division, THE Number_Generator SHALL produce a decimal dividend and a whole-number divisor, where the divisor is drawn from [2, min(max, 20)] consistent with whole-number division.
2. WHEN Decimal_Mode is active for division, THE Division_Flashcard SHALL display the problem as `a ÷ b = ?` where `a` is a decimal number and `b` is a whole number.
3. WHEN Decimal_Mode is active for division, THE Answer_Input SHALL accept decimal values.
4. WHEN Decimal_Mode is active for division, THE Division_Flashcard SHALL evaluate the student's answer by comparing it to the mathematically correct quotient, rounded to the same number of decimal places as the dividend.
5. WHEN Decimal_Mode is active for division, THE Division_Flashcard SHALL NOT present remainder inputs (decimal division produces a decimal quotient, not a quotient-with-remainder).
6. WHEN Decimal_Mode is active for division, THE Number_Generator SHALL generate the dividend by multiplying a random whole-number quotient by the divisor and then adding a random decimal fractional part, ensuring the problem has a clean answer at the target decimal precision.

---

### Requirement 7: Answer Evaluation and Floating-Point Safety

**User Story:** As a student, I want my decimal answers to be marked correct when I enter the right value, so that floating-point rounding in the computer does not unfairly mark correct answers as wrong.

#### Acceptance Criteria

1. THE Addition_Flashcard SHALL compare the student's decimal answer to the correct answer using a tolerance of half a unit in the last decimal place (e.g., for 2-decimal-place answers, tolerance = 0.005).
2. THE Subtraction_Flashcard SHALL compare the student's decimal answer to the correct answer using the same tolerance rule.
3. THE Multiplication_Flashcard SHALL compare the student's decimal answer to the correct answer using the same tolerance rule.
4. THE Division_Flashcard SHALL compare the student's decimal answer to the correct answer using the same tolerance rule.
5. THE Number_Generator SHALL produce decimal operands by generating integer values and dividing by the appropriate power of 10 (e.g., for 2 decimal places: `Math.round(Math.random() * max * 100) / 100`), avoiding floating-point accumulation errors at the generation step.
6. THE Addition_Flashcard SHALL display the correct answer in feedback using the same number of decimal places as the operands (e.g., `1.50` not `1.5` when 2 decimal places are expected).
7. THE Subtraction_Flashcard SHALL display the correct answer in feedback using the same number of decimal places as the operands.
8. THE Multiplication_Flashcard SHALL display the correct answer in feedback using the appropriate number of decimal places for the product.
9. THE Division_Flashcard SHALL display the correct answer in feedback using the same number of decimal places as the dividend.

---

### Requirement 8: Decimal Scratchpad

**User Story:** As a student, I want a scratchpad I can use to work through decimal problems on paper, so that I can practice the column-alignment technique taught in class.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active for addition, THE Scratchpad SHALL display the same column layout as the whole-number addition scratchpad, with the decimal point position visually indicated between the Ones column and the Tenths column.
2. WHEN Decimal_Mode is active for subtraction, THE Scratchpad SHALL display the same column layout as the whole-number subtraction scratchpad, with the decimal point position visually indicated.
3. WHEN Decimal_Mode is active for multiplication, THE Scratchpad SHALL display the same stacked layout as the whole-number multiplication scratchpad.
4. WHEN Decimal_Mode is active for division, THE Scratchpad SHALL display the same long division layout as the whole-number division scratchpad.
5. WHEN Decimal_Mode is active, THE Scratchpad SHALL pre-fill the operands with their decimal values (e.g., `3.75` in the appropriate columns).
6. WHEN Decimal_Mode is active, THE Scratchpad answer row SHALL report its joined value to the parent component via the existing `onTotalChange` callback, consistent with whole-number scratchpad behavior.
7. WHEN a new decimal problem loads, THE Scratchpad SHALL auto-clear all student-entered cells and re-fill the new operands, consistent with the existing `clearSignal` pattern.

---

### Requirement 9: Session Flow Consistency

**User Story:** As a student, I want decimal practice sessions to work the same way as whole-number sessions, so that I do not have to learn a new interface.

#### Acceptance Criteria

1. WHEN Decimal_Mode is active, THE ProblemCountSelector SHALL be presented before the session begins, offering 10, 25, 50, or 100 problems, consistent with whole-number session behavior.
2. WHEN Decimal_Mode is active, THE FlashcardHeader SHALL display the current problem number, total problem count, and running score, consistent with whole-number session behavior.
3. WHEN Decimal_Mode is active, THE FeedbackSection SHALL display correct, wrong, and peeked feedback states, consistent with whole-number session behavior.
4. WHEN Decimal_Mode is active, THE SummaryScreen SHALL display the student's score and percentage at the end of the session, consistent with whole-number session behavior.
5. WHEN Decimal_Mode is active and the answer input is blank, THE Flashcard SHALL use the scratchpad answer row as the answer source, consistent with whole-number session behavior (REQ-SESSION-08).
6. WHEN Decimal_Mode is active, THE scoring rules SHALL be identical to whole-number mode: first-attempt correct answers increment the score; peeking counts as incorrect.

---

### Requirement 10: Number Generator Correctness Properties

**User Story:** As a developer, I want the decimal number generator to be verifiably correct, so that students are never given problems with wrong answers or malformed numbers.

#### Acceptance Criteria

1. FOR ALL experience levels and operations in Decimal_Mode, THE Number_Generator SHALL produce operands where `toFixed(decimalPlaces)` equals the string representation of the operand (round-trip property: generate → format → parse → format produces the same string).
2. FOR ALL decimal subtraction problems, THE Number_Generator SHALL produce operands where `a >= b` (invariant: result is always non-negative).
3. FOR ALL decimal division problems generated in Decimal_Mode, THE Number_Generator SHALL produce a dividend and divisor such that `Math.round(dividend / divisor * 10^decimalPlaces) / 10^decimalPlaces` equals the intended clean quotient (invariant: answer is exact at target precision).
4. FOR ALL decimal multiplication problems, THE Number_Generator SHALL produce a product where the number of significant decimal digits does not exceed twice the operand decimal places (invariant: answer precision is bounded).
5. WHEN the Number_Generator is called with the same experience level and operation 1000 times in Decimal_Mode, THE Number_Generator SHALL produce operands within the valid integer-part range for that experience level on every call (invariant: operands are always in bounds).
