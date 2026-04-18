import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import "./MultiplicationFlashcard.css";
import { getMaxNumber } from "../utils/mathUtils";

function generateRandomProblem(max) {
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  return { a, b, answer: a * b };
}

function resetStats() {
  return {
    score: 0,
    wrongCount: 0,
    currentNum: 0,
    triedOnce: false,
    peeked: false,
    done: false,
    feedback: null,
    userAnswer: "",
    problem: null,
    problems: [],
    selectedTable: null,
    totalProblems: null,
  };
}

function MultiplicationFlashcard({ settings, onBack }) {
  const { name, grade, experience } = settings;
  const max = getMaxNumber(grade, experience);

  // "times-table" | "random" — which top-level mode the user is in
  const [activeType, setActiveType] = useState("times-table");

  // sub-screens: "select" | "times-table" | "random-setup" | "random"
  const [screen, setScreen] = useState("select");

  const [selectedTable, setSelectedTable] = useState(null);
  const [totalProblems, setTotalProblems] = useState(null);
  const [problems, setProblems] = useState([]);
  const [problem, setProblem] = useState(null);
  const [currentNum, setCurrentNum] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [peeked, setPeeked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triedOnce, setTriedOnce] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const applyReset = () => {
    setScore(0);
    setWrongCount(0);
    setCurrentNum(0);
    setTriedOnce(false);
    setPeeked(false);
    setDone(false);
    setFeedback(null);
    setUserAnswer("");
    setProblem(null);
    setProblems([]);
    setSelectedTable(null);
    setTotalProblems(null);
  };

  const switchType = (type) => {
    applyReset();
    setActiveType(type);
    setScreen(type === "times-table" ? "select" : "random-setup");
  };

  const buildTimesTable = (n) =>
    Array.from({ length: 15 }, (_, i) => ({ a: n, b: i, answer: n * i }));

  const startTimesTable = (n) => {
    const tableProblems = buildTimesTable(n);
    applyReset();
    setSelectedTable(n);
    setProblems(tableProblems);
    setProblem(tableProblems[0]);
    setScreen("times-table");
  };

  const startRandom = (count) => {
    applyReset();
    setTotalProblems(count);
    setProblem(generateRandomProblem(max));
    setCurrentNum(1);
    setScreen("random");
  };

  useEffect(() => {
    if (problem && inputRef.current) inputRef.current.focus();
  }, [problem]);

  useEffect(() => {
    if (feedback === null && inputRef.current) inputRef.current.focus();
  }, [feedback]);

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    const parsed = parseInt(userAnswer);
    if (isNaN(parsed)) return;
    if (parsed === problem.answer) {
      if (!triedOnce) setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setTriedOnce(true);
      setFeedback("wrong");
    }
  };

  const handleNext = () => {
    if (screen === "times-table") {
      if (currentNum >= problems.length - 1) {
        setDone(true);
      } else {
        const next = currentNum + 1;
        setCurrentNum(next);
        setProblem(problems[next]);
        setUserAnswer("");
        setFeedback(null);
        setTriedOnce(false);
        setPeeked(false);
      }
    } else {
      if (currentNum >= totalProblems) {
        setDone(true);
      } else {
        setCurrentNum((n) => n + 1);
        setProblem(generateRandomProblem(max));
        setUserAnswer("");
        setFeedback(null);
        setTriedOnce(false);
        setPeeked(false);
      }
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

  const total = screen === "times-table" ? problems.length : totalProblems;
  const displayNum = screen === "times-table" ? currentNum + 1 : currentNum;

  const ModeToggle = () => (
    <div className="mode-toggle">
      <button
        className={`mode-toggle-btn ${activeType === "times-table" ? "active" : ""}`}
        onClick={() => activeType !== "times-table" && switchType("times-table")}
      >
        Times Tables
      </button>
      <button
        className={`mode-toggle-btn ${activeType === "random" ? "active" : ""}`}
        onClick={() => activeType !== "random" && switchType("random")}
      >
        Random
      </button>
    </div>
  );

  // Summary screen
  if (done) {
    const finalTotal = screen === "times-table" ? problems.length : totalProblems;
    const pct = finalTotal > 0 ? Math.round((score / finalTotal) * 100) : 0;
    const title = screen === "times-table" ? `${selectedTable}'s Times Table` : "Random Multiplication";
    return (
      <div className="flashcard-container summary multiplication-container">
        <ModeToggle />
        <p className="multiplication-welcome">Great job{name ? `, ${name}` : ""}! 🎉</p>
        <p className="summary-title">{title}</p>
        <p className="summary-score">{score} / {finalTotal} correct</p>
        <p className="summary-pct">{pct}%</p>
        {pct === 100 && <p className="perfect">Perfect score! 🌟</p>}
        {pct >= 80 && pct < 100 && <p className="great">Really great work! Keep it up! 💪</p>}
        {pct >= 60 && pct < 80 && <p className="good">Good effort! A little more practice and you'll get there! 📚</p>}
        {pct < 60 && <p className="keep-trying">Keep practicing — you're getting better every time! 🚀</p>}
        <div className="summary-actions">
          {screen === "times-table" ? (
            <button className="count-btn" onClick={() => startTimesTable(selectedTable)}>Play Again</button>
          ) : (
            <button className="count-btn" onClick={() => startRandom(totalProblems)}>Play Again</button>
          )}
          <button className="count-btn" onClick={() => {
            applyReset();
            setScreen(activeType === "times-table" ? "select" : "random-setup");
          }}>
            Try Another
          </button>
          <button className="back-btn" onClick={onBack}>← Change Settings</button>
        </div>
      </div>
    );
  }

  // Times table selector
  if (screen === "select") {
    return (
      <div className="flashcard-container multiplication-container">
        <ModeToggle />
        <p className="multiplication-welcome">Welcome{name ? `, ${name}` : ""}! 👋</p>
        <p>Which times table would you like to practice?</p>
        <div className="times-table-grid">
          {Array.from({ length: 15 }, (_, i) => (
            <button key={i} className="count-btn" onClick={() => startTimesTable(i)}>
              {i}s
            </button>
          ))}
        </div>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
    );
  }

  // Random problem count selector
  if (screen === "random-setup") {
    return (
      <div className="flashcard-container multiplication-container">
        <ModeToggle />
        <p className="multiplication-welcome">Welcome{name ? `, ${name}` : ""}! 👋</p>
        <p>How many multiplication problems would you like to solve?</p>
        <div className="problem-count-buttons">
          {[10, 25, 50, 100].map((n) => (
            <button key={n} className="count-btn" onClick={() => startRandom(n)}>
              {n}
            </button>
          ))}
        </div>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
    );
  }

  // Flashcard screen
  return (
    <div className="flashcard-container multiplication-container">
      <ModeToggle />
      <div className="flashcard-header">
        <span>
          {screen === "times-table"
            ? `${selectedTable}'s Table — ${displayNum} of ${total}`
            : `Problem ${displayNum} of ${total}`}
        </span>
        <span>✅ {score} correct</span>
      </div>

      <div className="flashcard">
        <p className="problem">{problem.a} × {problem.b} = ?</p>
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
          <p>✅ Correct! {problem.a} × {problem.b} = {problem.answer}</p>
          <button className="next-btn" onClick={handleNext}>
            {displayNum >= total ? "See Results" : "Next →"}
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
            {displayNum >= total ? "See Results" : "Next →"}
          </button>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Back</button>
    </div>
  );
}

export default MultiplicationFlashcard;
