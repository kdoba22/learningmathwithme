import React, { useState, useEffect, useRef } from "react";
import "./AdditionFlashcard.css";
import "./DivisionFlashcard.css";
import LongDivisionScratchpad from "./LongDivisionScratchpad";
import { getMaxNumber } from "../utils/mathUtils";
import SummaryScreen from "./SummaryScreen";
import FeedbackSection from "./FeedbackSection";
import ProblemCountSelector from "./ProblemCountSelector";
import FlashcardHeader from "./FlashcardHeader";
import Flashcard from "./Flashcard";
import Button from "./Button";

const noRemainderLevels = ["Beginner", "Intermediate"];

function generateProblem(max, experience) {
  const allowRemainder = !noRemainderLevels.includes(experience);
  const b = Math.floor(Math.random() * Math.min(max, 20)) + 2;

  if (allowRemainder) {
    const a = Math.floor(Math.random() * (max - b)) + b;
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
  const { name, experience } = settings;
  const max = getMaxNumber(experience);
  const allowRemainder = !noRemainderLevels.includes(experience);

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
  const [scratchpadQuotient, setScratchpadQuotient] = useState("");
  const [scratchpadRemainder, setScratchpadRemainder] = useState("");
  const quotientRef = useRef(null);

  const startSession = (count) => {
    setTotalProblems(count);
    setProblem(generateProblem(max, experience));
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
    const qSource = quotientAnswer.trim() !== "" ? quotientAnswer : scratchpadQuotient;
    const rSource = remainderAnswer.trim() !== "" ? remainderAnswer : scratchpadRemainder;
    const parsedQ = parseInt(qSource);
    const parsedR = allowRemainder && problem.hasRemainder ? parseInt(rSource) : 0;
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
      setProblem(generateProblem(max, experience));
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
        <ProblemCountSelector name={name} operation="division" onSelect={startSession} onBack={onBack} />
        {allowRemainder && (
          <p className="remainder-notice">⚠️ Some problems may have remainders!</p>
        )}
      </div>
    );
  }

  if (done) {
    return <SummaryScreen name={name} score={score} total={totalProblems} onPlayAgain={() => startSession(totalProblems)} onBack={onBack} />;
  }

  return (
    <div className="division-page">
      <div className="flashcard-container division-left">
        <FlashcardHeader current={currentNum} total={totalProblems} score={score} />

        <Flashcard>{problem.a} ÷ {problem.b} = ?</Flashcard>

        {feedback === null && (
          <form onSubmit={handleSubmitAnswer} className="answer-form">
            <input
              ref={quotientRef}
              type="number"
              value={quotientAnswer}
              onChange={(e) => setQuotientAnswer(e.target.value)}
              className="answer-input"
              placeholder={allowRemainder && problem.hasRemainder ? "Quotient" : "Your answer"}
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
            <Button variant="primary" type="submit">Check</Button>
          </form>
        )}

        <FeedbackSection
          feedback={feedback}
          problem={problem}
          formatProblem={(p) => `${p.a} ÷ ${p.b}`}
          formatAnswer={formatAnswer}
          onNext={handleNext}
          onTryAgain={handleTryAgain}
          onPeek={handlePeek}
          isLast={currentNum >= totalProblems}
        />

        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>

      <div className="division-right">
        <LongDivisionScratchpad
          divisor={problem.b}
          dividend={problem.a}
          clearSignal={clearSignal}
          onQuotientChange={setScratchpadQuotient}
          onRemainderChange={setScratchpadRemainder}
        />
      </div>
    </div>
  );
}

export default DivisionFlashcard;
