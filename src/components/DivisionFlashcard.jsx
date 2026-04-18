import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import "./DivisionFlashcard.css";
import LongDivisionScratchpad from "./LongDivisionScratchpad";
import { getMaxNumber } from "../utils/mathUtils";

const noRemainderLevels = ["Beginner", "Intermediate"];

function generateProblem(max, experience, grade) {
  const gradeNum = grade === "KG" ? 0 : parseInt(grade);
  const allowRemainder = gradeNum >= 4 && !noRemainderLevels.includes(experience);
  const b = Math.floor(Math.random() * Math.min(max, 20)) + 2; // divisor between 2 and min(max, 20)

  if (allowRemainder) {
    const a = Math.floor(Math.random() * (max - b)) + b; // dividend always >= divisor
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    return { a, b, quotient, remainder, hasRemainder: remainder > 0 };
  } else {
    const maxQuotient = Math.max(1, Math.floor(max / b));
    const quotient = Math.floor(Math.random() * maxQuotient) + 1;
    const a = b * quotient;
    return { a, b, quotient, remainder: 0, hasRemainder: false };
  }
}

function DivisionFlashcard({ settings, onBack }) {
  const { name, grade, experience } = settings;
  const max = getMaxNumber(grade, experience);
  const gradeNum = grade === "KG" ? 0 : parseInt(grade);
  const allowRemainder = gradeNum >= 4 && !noRemainderLevels.includes(experience);

  const [totalProblems, setTotalProblems] = useState(null);
  const [problem, setProblem] = useState(null);
  const [quotientAnswer, setQuotientAnswer] = useState("");
  const [remainderAnswer, setRemainderAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [peeked, setPeeked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentNum, setCurrentNum] = useState(1);
  const [done, setDone] = useState(false);
  const [triedOnce, setTriedOnce] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const quotientRef = useRef(null);

  const startSession = (count) => {
    setTotalProblems(count);
    setProblem(generateProblem(max, experience, grade));
    setCurrentNum(1);
    setScore(0);
    setWrongCount(0);
    setDone(false);
    setFeedback(null);
    setQuotientAnswer("");
    setRemainderAnswer("");
    setTriedOnce(false);
    setPeeked(false);
    setClearSignal((s) => s + 1);
  };

  useEffect(() => {
    if (problem && quotientRef.current) quotientRef.current.focus();
  }, [problem]);

  useEffect(() => {
    if (feedback === null && quotientRef.current) quotientRef.current.focus();
  }, [feedback]);

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    const parsedQ = parseInt(quotientAnswer);
    const parsedR = allowRemainder && problem.hasRemainder ? parseInt(remainderAnswer) : 0;

    if (isNaN(parsedQ)) return;
    if (allowRemainder && problem.hasRemainder && isNaN(parsedR)) return;

    const correct =
      parsedQ === problem.quotient &&
      (problem.hasRemainder ? parsedR === problem.remainder : true);

    if (correct) {
      if (!triedOnce) setScore((s) => s + 1);
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
      setProblem(generateProblem(max, experience, grade));
      setQuotientAnswer("");
      setRemainderAnswer("");
      setFeedback(null);
      setTriedOnce(false);
      setPeeked(false);
      setClearSignal((s) => s + 1);
    }
  };

  const handlePeek = () => {
    setPeeked(true);
    setWrongCount((w) => w + 1);
    setFeedback("peeked");
  };

  const handleTryAgain = () => {
    setQuotientAnswer("");
    setRemainderAnswer("");
    setFeedback(null);
  };

  const formatAnswer = (p) =>
    p.hasRemainder ? `${p.quotient} R${p.remainder}` : `${p.quotient}`;

  if (!totalProblems) {
    return (
      <div className="flashcard-container">
        <h2>Welcome{name ? `, ${name}` : ""}! 👋</h2>
        <p>How many division problems would you like to solve?</p>
        {allowRemainder && (
          <p className="remainder-notice">⚠️ Some problems may have remainders!</p>
        )}
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
    <div className="division-page">
      <div className="flashcard-container division-left">
        <div className="flashcard-header">
          <span>Problem {currentNum} of {totalProblems}</span>
          <span>✅ {score} correct</span>
        </div>

        <div className="flashcard">
          <p className="problem">{problem.a} ÷ {problem.b} = ?</p>
        </div>

        {feedback === null && (
          <form onSubmit={handleSubmitAnswer} className="answer-form">
            <input
              ref={quotientRef}
              type="number"
              value={quotientAnswer}
              onChange={(e) => setQuotientAnswer(e.target.value)}
              className="answer-input"
              placeholder={allowRemainder && problem.hasRemainder ? "Quotient" : "Answer"}
            />
            {allowRemainder && problem.hasRemainder && (
              <>
                <span style={{ fontWeight: "bold", fontSize: "1.3rem", display: "flex", alignItems: "center" }}>R</span>
                <input
                  type="number"
                  value={remainderAnswer}
                  onChange={(e) => setRemainderAnswer(e.target.value)}
                  className="answer-input"
                  placeholder="Remainder"
                />
              </>
            )}
            <button type="submit" className="submit-answer-btn">Check</button>
          </form>
        )}

        {feedback === "correct" && (
          <div className="feedback correct-feedback">
            <p>✅ Correct! {problem.a} ÷ {problem.b} = {formatAnswer(problem)}</p>
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
            <p>👀 The answer is <strong>{formatAnswer(problem)}</strong>. (Marked as incorrect)</p>
            <button className="next-btn" onClick={handleNext}>
              {currentNum >= totalProblems ? "See Results" : "Next →"}
            </button>
          </div>
        )}

        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      <div className="division-right">
        <LongDivisionScratchpad
          divisor={problem.b}
          dividend={problem.a}
          clearSignal={clearSignal}
        />
      </div>
    </div>
  );
}

export default DivisionFlashcard;
