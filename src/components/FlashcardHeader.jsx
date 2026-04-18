import React from "react";

function FlashcardHeader({ current, total, score, label }) {
  return (
    <div className="flashcard-header">
      <span>{label || `Problem ${current} of ${total}`}</span>
      <span>✅ {score} correct</span>
    </div>
  );
}

export default FlashcardHeader;
