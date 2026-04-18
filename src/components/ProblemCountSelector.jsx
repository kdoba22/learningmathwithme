import React from "react";
import Button from "./Button";
import WelcomeBanner from "./WelcomeBanner";

function ProblemCountSelector({ name, operation, onSelect, onBack }) {
  return (
    <div className="flashcard-container">
      <WelcomeBanner name={name} />
      <p>How many {operation} problems would you like to solve?</p>
      <div className="problem-count-buttons">
        {[10, 25, 50, 100].map((n) => (
          <Button key={n} variant="primary" className="btn-lg" onClick={() => onSelect(n)}>
            {n}
          </Button>
        ))}
      </div>
      <Button variant="outline" onClick={onBack}>← Back</Button>
    </div>
  );
}

export default ProblemCountSelector;
