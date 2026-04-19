import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import "./DivisionFlashcard.css";
import { getMaxNumber } from "../utils/mathUtils";
import SummaryScreen from "./SummaryScreen";
import FeedbackSection from "./FeedbackSection";
import ProblemCountSelector from "./ProblemCountSelector";
import FlashcardHeader from "./FlashcardHeader";
import Flashcard from "./Flashcard";
import Button from "./Button";
import AdditionScratchpad from "./AdditionScratchpad";

function generateProblem(max, allowZero = false) {
  const min = allowZero ? 0 : 1;
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return { a, b, answer: a + b };
}

function AdditionFlashcard({ settings, onBack }) {
  const { name, experience } = settings;
  const max = getMaxNumber(experience, "addition");

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

  const allowZero = experience === "Beginner";
  const [clearSignal, setClearSignal] = useState(0);
  const [scratchpadTotal, setScratchpadTotal] = useState("");

  const startSession = (count) => {
    setTotalProblems(count);
    setProblem(generateProblem(max, allowZero));
    setCurrentNum(1);
    setScore(0);
    setWrongCount(0);
    setDone(false);
    setFeedback(null);
    setUserAnswer("");
    setTriedOnce(false);
    setPeeked(false);
    setClearSignal((s) => s + 1);
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
    if (currentNum >= totalProblems) {
      setDone(true);
    } else {
      setCurrentNum((n) => n + 1);
      setProblem(generateProblem(max, allowZero));
      setUserAnswer("");
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
    setUserAnswer("");
    setFeedback(null);
  };

  if (!totalProblems) {
    return <ProblemCountSelector name={name} operation="addition" onSelect={startSession} onBack={onBack} />;
  }

  if (done) {
    return <SummaryScreen name={name} score={score} total={totalProblems} onPlayAgain={() => startSession(totalProblems)} onBack={onBack} />;
  }

  return (
    <div className="division-page">
      <div className="flashcard-container division-left">
        <FlashcardHeader current={currentNum} total={totalProblems} score={score} />
        <Flashcard>{problem.a} + {problem.b} = ?</Flashcard>
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
          formatProblem={(p) => `${p.a} + ${p.b}`}
          formatAnswer={(p) => `${p.answer}`}
          onNext={handleNext}
          onTryAgain={handleTryAgain}
          onPeek={handlePeek}
          isLast={currentNum >= totalProblems}
        />
        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>
      <div className="division-right">
        <AdditionScratchpad a={problem.a} b={problem.b} clearSignal={clearSignal} onTotalChange={setScratchpadTotal} />
      </div>
    </div>
  );
}

export default AdditionFlashcard;
