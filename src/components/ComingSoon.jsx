import React from "react";
import "./ComingSoon.css";
import Button from "./Button";

function ComingSoon({ operation, onBack }) {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <p className="coming-soon-emoji">🚧</p>
        <h2 className="coming-soon-title">{operation}</h2>
        <p className="coming-soon-message">
          This feature is coming soon! We're working hard to bring you{" "}
          <strong>{operation}</strong> practice.
        </p>
        <p className="coming-soon-sub">Check back after the next update.</p>
        <Button variant="outline" onClick={onBack}>
          ← Back to Menu
        </Button>
      </div>
    </div>
  );
}

export default ComingSoon;
