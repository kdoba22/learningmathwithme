import React from "react";
import "./StackedProblem.css";

/**
 * StackedProblem renders a math problem in the vertical stacked format
 * that matches how arithmetic is taught in school:
 *
 *     12.5
 *  +   3.7
 *  ───────
 *   [input]
 *
 * Props:
 *   topNumber    {string|number} — the top operand
 *   bottomNumber {string|number} — the bottom operand
 *   operator     {string}        — "+", "−", "×"
 *   answerInput  {ReactNode}     — the answer input element rendered below the line
 *   feedback     {ReactNode}     — feedback content rendered below the input (optional)
 */
function StackedProblem({ topNumber, bottomNumber, operator, answerInput, feedback }) {
  return (
    <div className="stacked-problem">
      <div className="stacked-top">{topNumber}</div>
      <div className="stacked-bottom">
        <span className="stacked-operator">{operator}</span>
        <span className="stacked-number">{bottomNumber}</span>
      </div>
      <div className="stacked-line" />
      <div className="stacked-answer">{answerInput}</div>
      {feedback && <div className="stacked-feedback">{feedback}</div>}
    </div>
  );
}

export default StackedProblem;
