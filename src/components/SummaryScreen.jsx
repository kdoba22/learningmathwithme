import React from "react";
import Button from "./Button";
import WelcomeBanner from "./WelcomeBanner";

function SummaryScreen({ name, score, total, onPlayAgain, onBack, title, extraActions }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="flashcard-container summary">
      <WelcomeBanner name={name} done />
      {title && <p className="summary-title">{title}</p>}
      <p className="summary-score">{score} / {total} correct</p>
      <p className="summary-pct">{pct}%</p>
      {pct === 100 && <p className="perfect">Perfect score! 🌟</p>}
      {pct >= 80 && pct < 100 && <p className="great">Really great work! Keep it up! 💪</p>}
      {pct >= 60 && pct < 80 && <p className="good">Good effort! A little more practice and you'll get there! 📚</p>}
      {pct < 60 && <p className="keep-trying">Keep practicing — you're getting better every time! 🚀</p>}
      <div className="summary-actions">
        <Button variant="primary" className="btn-lg" onClick={onPlayAgain}>Play Again</Button>
        {extraActions}
        <Button variant="outline" onClick={onBack}>← Change Settings</Button>
      </div>
    </div>
  );
}

export default SummaryScreen;
