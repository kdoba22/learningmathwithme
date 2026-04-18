import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import { getMaxNumber } from "../utils/mathUtils";

function generateProblem(max) {
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * a) + 1; // b is always <= a, so answer >= 0
  return { a, b, answer: a - b };
}

function SubtractionFlashcard({ settings, onBack }) {
  const { name, grade, experience } = settings;
  const max = getMaxNumber(grade, experience);

  const [totalProblems, setTotalProblems] = useState(null);
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [peeked, setPeeked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentNum, setCurrentNum] = useState(1);
  const [done, setDone] = useState(false);
  const [triedOnce, setTriedOnce] = useState(false);
  const inputRef = useRef(null);

  const startSession = (count) => {
    setTotalProblems(count);
    setProblem(generateProblem(max));
    setCurrentNum(1);
    setScore(0);
    setWrongCount(0);
    setDone(false);
    setFeedback(null);
    setUserAnswer("");
    setTriedOnce(false);
    setPeeked(false);
  };

  useEffect(() => {
    if (problem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem]);

  useEffect(() => {
    if (feedback === null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback]);

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    const parsed = parseInt(userAnswer);
    if (isNaN(parsed)) return;

    if (parsed === problem.answer) {
      if (!triedOnce) {
        setScore((s) => s + 1);
      }
      setFeedback("correct");
    } else {
      setTriedOnce(true);
      setFeedback("wrong");
    }
  };

  const handleNext = () => {
    if (currentNum >= totalProblems) {
      setDone(true);
    } else {
      setCurrentNum((n) => n + 1);
      setProblem(generateProblem(max));
      setUserAnswer("");
      setFeedback(null);
      setTriedOnce(false);
      setPeeked(false);
    }
  };

  const handlePeek = () => {
    setPeeked(true);
    setWrongCount((w) => w + 1);
    setFeedback("peeked");
  };

  const handleTryAgain = () => {
    setUserAnswer("");
    setFeedback(null);
  };

  if (!totalProblems) {
    return (
      <div className="flashcard-container">
        <h2>Welcome{name ? `, ${name}` : ""}! 👋</h2>
        <p>How many subtraction problems would you like to solve?</p>
        <div className="problem-count-buttons">
          {[10, 25, 50, 100].map((n) => (
            <button key={n} className="count-btn" onClick={() => startSession(n)}>
              {n}
            </button>
          ))}
        </div>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / totalProblems) * 100);
    return (
      <div className="flashcard-container summary">
        <h2>Great job{name ? `, ${name}` : ""}! 🎉</h2>
        <p className="summary-score">{score} / {totalProblems} correct</p>
        <p className="summary-pct">{pct}%</p>
        {pct === 100 && <p className="perfect">Perfect score! 🌟</p>}
        {pct >= 80 && pct < 100 && <p className="great">Really great work! Keep it up! 💪</p>}
        {pct >= 60 && pct < 80 && <p className="good">Good effort! A little more practice and you'll get there! 📚</p>}
        {pct < 60 && <p className="keep-trying">Keep practicing — you're getting better every time! 🚀</p>}
        <div className="summary-actions">
          <button className="count-btn" onClick={() => startSession(totalProblems)}>Play Again</button>
          <button className="back-btn" onClick={onBack}>← Change Settings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <span>Problem {currentNum} of {totalProblems}</span>
        <span>✅ {score} correct</span>
      </div>

      <div className="flashcard">
        <p className="problem">{problem.a} − {problem.b} = ?</p>
      </div>

      {feedback === null && (
        <form onSubmit={handleSubmitAnswer} className="answer-form">
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="answer-input"
            placeholder="Your answer"
          />
          <button type="submit" className="submit-answer-btn">Check</button>
        </form>
      )}

      {feedback === "correct" && (
        <div className="feedback correct-feedback">
          <p>✅ Correct! {problem.a} − {problem.b} = {problem.answer}</p>
          <button className="next-btn" onClick={handleNext}>
            {currentNum >= totalProblems ? "See Results" : "Next →"}
          </button>
        </div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong-feedback">
          <p>❌ Not quite! Try again or peek at the answer.</p>
          <div className="wrong-actions">
            <button className="try-again-btn" onClick={handleTryAgain}>Try Again</button>
            <button className="peek-btn" onClick={handlePeek}>Peek at Answer</button>
          </div>
        </div>
      )}

      {feedback === "peeked" && (
        <div className="feedback peeked-feedback">
          <p>👀 The answer is <strong>{problem.answer}</strong>. (Marked as incorrect)</p>
          <button className="next-btn" onClick={handleNext}>
            {currentNum >= totalProblems ? "See Results" : "Next →"}
          </button>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Back</button>
    </div>
  );
}

export default SubtractionFlashcard;
