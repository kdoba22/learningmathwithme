import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import "./MultiplicationFlashcard.css";
import { getMaxNumber } from "../utils/mathUtils";
import SummaryScreen from "./SummaryScreen";
import FeedbackSection from "./FeedbackSection";
import FlashcardHeader from "./FlashcardHeader";
import Flashcard from "./Flashcard";
import WelcomeBanner from "./WelcomeBanner";
import Button from "./Button";
import MultiplicationScratchpad from "./MultiplicationScratchpad";

function generateRandomProblem(max) {
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  return { a, b, answer: a * b };
}

function MultiplicationFlashcard({ settings, onBack }) {
  const { name, experience } = settings;
  const max = getMaxNumber(experience);

  const [activeType, setActiveType] = useState("times-table");
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
  const [clearSignal, setClearSignal] = useState(0);
  const [scratchpadTotal, setScratchpadTotal] = useState("");
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
    const answerSource = userAnswer.trim() !== "" ? userAnswer : scratchpadTotal;
    const parsed = parseInt(answerSource);
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
        setClearSignal((s) => s + 1);
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
        setClearSignal((s) => s + 1);
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
  const title = screen === "times-table" ? `${selectedTable}'s Times Table` : "Random Multiplication";

  const ModeToggle = () => (
    <div className="mode-toggle">
      <button
        className={`btn btn-toggle ${activeType === "times-table" ? "active" : ""}`}
        onClick={() => activeType !== "times-table" && switchType("times-table")}
      >
        Times Tables
      </button>
      <button
        className={`btn btn-toggle ${activeType === "random" ? "active" : ""}`}
        onClick={() => activeType !== "random" && switchType("random")}
      >
        Random
      </button>
    </div>
  );

  if (done) {
    return (
      <div className="multiplication-container">
        <ModeToggle />
        <SummaryScreen
          name={name}
          score={score}
          total={total}
          title={title}
          onPlayAgain={() => screen === "times-table" ? startTimesTable(selectedTable) : startRandom(totalProblems)}
          onBack={onBack}
          extraActions={
            <Button variant="primary" className="btn-lg" onClick={() => {
              applyReset();
              setScreen(activeType === "times-table" ? "select" : "random-setup");
            }}>
              Try Another
            </Button>
          }
        />
      </div>
    );
  }

  if (screen === "select") {
    return (
      <div className="flashcard-container multiplication-container">
        <ModeToggle />
        <p className="multiplication-welcome"><WelcomeBanner name={name} /></p>
        <p>Which times table would you like to practice?</p>
        <div className="times-table-grid">
          {Array.from({ length: 15 }, (_, i) => (
            <Button key={i} variant="primary" className="btn-lg" onClick={() => startTimesTable(i)}>
              {i}s
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>
    );
  }

  if (screen === "random-setup") {
    return (
      <div className="flashcard-container multiplication-container">
        <ModeToggle />
        <p className="multiplication-welcome"><WelcomeBanner name={name} /></p>
        <p>How many multiplication problems would you like to solve?</p>
        <div className="problem-count-buttons">
          {[10, 25, 50, 100].map((n) => (
            <Button key={n} variant="primary" className="btn-lg" onClick={() => startRandom(n)}>
              {n}
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>
    );
  }

  return (
    <div className="division-page multiplication-container">
      <div className="flashcard-container division-left">
        <ModeToggle />
        <FlashcardHeader
          current={displayNum}
          total={total}
          score={score}
          label={screen === "times-table" ? `${selectedTable}'s Table — ${displayNum} of ${total}` : null}
        />
        <Flashcard>{problem.a} × {problem.b} = ?</Flashcard>
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
            <Button variant="primary" type="submit">Check</Button>
          </form>
        )}
        <FeedbackSection
          feedback={feedback}
          problem={problem}
          formatProblem={(p) => `${p.a} × ${p.b}`}
          formatAnswer={(p) => `${p.answer}`}
          onNext={handleNext}
          onTryAgain={handleTryAgain}
          onPeek={handlePeek}
          isLast={displayNum >= total}
        />
        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>
      <div className="division-right">
        <MultiplicationScratchpad a={problem.a} b={problem.b} clearSignal={clearSignal} onTotalChange={setScratchpadTotal} />
      </div>
    </div>
  );
}

export default MultiplicationFlashcard;
