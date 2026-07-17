import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import "./DivisionFlashcard.css";
import { getMaxNumber } from "../utils/mathUtils";
import SummaryScreen from "./SummaryScreen";
import FeedbackSection from "./FeedbackSection";
import ProblemCountSelector from "./ProblemCountSelector";
import FlashcardHeader from "./FlashcardHeader";
import StackedProblem from "./StackedProblem";
import Button from "./Button";
import SubtractionScratchpad from "./SubtractionScratchpad";
import ScratchpadToggle from "./ScratchpadToggle";

// ─── Problem generator ────────────────────────────────────────────────────────

function generateProblem(max) {
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * a) + 1; // b <= a → result always >= 0
  return { a, b, answer: a - b };
}

// ─── Main component ───────────────────────────────────────────────────────────

function SubtractionFlashcard({ settings, onBack }) {
  const { name, experience } = settings;
  const max = getMaxNumber(experience);

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
  const [clearSignal, setClearSignal] = useState(0);
  const [scratchpadTotal, setScratchpadTotal] = useState("");
  const [hideScratchpad, setHideScratchpad] = useState(false);
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
      setProblem(generateProblem(max));
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

  // ── Problem count selector screen ──
  if (!totalProblems) {
    return (
      <ProblemCountSelector
        name={name}
        operation="subtraction"
        onSelect={startSession}
        onBack={onBack}
      />
    );
  }

  // ── Summary screen ──
  if (done) {
    return (
      <SummaryScreen
        name={name}
        score={score}
        total={totalProblems}
        onPlayAgain={() => startSession(totalProblems)}
        onBack={onBack}
      />
    );
  }

  // ── Active session ──
  return (
    <div className="division-page">
      <div className="flashcard-container division-left">
        <FlashcardHeader current={currentNum} total={totalProblems} score={score} />
        <StackedProblem
          topNumber={String(problem.a)}
          bottomNumber={String(problem.b)}
          operator="−"
          answerInput={
            feedback === null ? (
              <form onSubmit={handleSubmitAnswer} style={{ width: "100%" }}>
                <input
                  ref={inputRef}
                  type="number"
                  step="1"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="?"
                  aria-label="Your answer"
                />
                <Button variant="primary" type="submit">Check</Button>
              </form>
            ) : null
          }
          feedback={
            <FeedbackSection
              feedback={feedback}
              problem={problem}
              formatProblem={(p) => `${p.a} − ${p.b}`}
              formatAnswer={(p) => String(p.answer)}
              onNext={handleNext}
              onTryAgain={handleTryAgain}
              onPeek={handlePeek}
              isLast={currentNum >= totalProblems}
            />
          }
        />
        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>
      <div className="division-right">
        <ScratchpadToggle hidden={hideScratchpad} onChange={setHideScratchpad} />
        {!hideScratchpad && (
          <SubtractionScratchpad
            a={problem.a}
            b={problem.b}
            clearSignal={clearSignal}
            onTotalChange={setScratchpadTotal}
          />
        )}
      </div>
    </div>
  );
}

export default SubtractionFlashcard;
