import React from "react";
import Button from "./Button";

function FeedbackSection({ feedback, problem, formatProblem, formatAnswer, onNext, onTryAgain, onPeek, isLast }) {
  if (feedback === "correct") {
    return (
      <div className="feedback correct-feedback">
        <p>✅ Correct! {formatProblem(problem)} = {formatAnswer(problem)}</p>
        <Button variant="primary" onClick={onNext}>
          {isLast ? "See Results" : "Next →"}
        </Button>
      </div>
    );
  }

  if (feedback === "wrong") {
    return (
      <div className="feedback wrong-feedback">
        <p>❌ Not quite! Try again or peek at the answer.</p>
        <div className="wrong-actions">
          <Button variant="secondary" onClick={onTryAgain}>Try Again</Button>
          <Button variant="danger" onClick={onPeek}>Peek at Answer</Button>
        </div>
      </div>
    );
  }

  if (feedback === "peeked") {
    return (
      <div className="feedback peeked-feedback">
        <p>👀 The answer is <strong>{formatAnswer(problem)}</strong>. (Marked as incorrect)</p>
        <Button variant="primary" onClick={onNext}>
          {isLast ? "See Results" : "Next →"}
        </Button>
      </div>
    );
  }

  return null;
}

export default FeedbackSection;
