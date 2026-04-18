import React, { useState, useEffect } from "react";
import "./LongDivisionScratchpad.css";

function LongDivisionScratchpad({ divisor, dividend, clearSignal }) {
  const [quotientWork, setQuotientWork] = useState("");
  const [steps, setSteps] = useState([{ multiply: "", subtract: "", bringDown: "" }]);
  const [remainderWork, setRemainderWork] = useState("");

  useEffect(() => {
    setQuotientWork("");
    setSteps([{ multiply: "", subtract: "", bringDown: "" }]);
    setRemainderWork("");
  }, [clearSignal]);

  const addStep = () => {
    setSteps((prev) => [...prev, { multiply: "", subtract: "", bringDown: "" }]);
  };

  const removeStep = () => {
    if (steps.length > 1) setSteps((prev) => prev.slice(0, -1));
  };

  const updateStep = (index, field, value) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleClear = () => {
    setQuotientWork("");
    setSteps([{ multiply: "", subtract: "", bringDown: "" }]);
    setRemainderWork("");
  };

  return (
    <div className="scratchpad">
      <div className="scratchpad-title">
        Scratchpad
        <button className="scratchpad-clear-btn" onClick={handleClear}>Clear</button>
      </div>

      <div className="long-division-layout">

        {/* Quotient row */}
        <div className="ld-quotient-row">
          <div className="ld-divisor-spacer" />
          <div className="ld-quotient-box">
            <input
              type="text"
              className="ld-input ld-quotient-input"
              value={quotientWork}
              onChange={(e) => setQuotientWork(e.target.value)}
              placeholder="quotient"
            />
          </div>
        </div>

        {/* Division house: divisor | dividend */}
        <div className="ld-house-row">
          <div className="ld-divisor">
            <span className="ld-divisor-value">{divisor}</span>
          </div>
          <div className="ld-house-symbol">
            <div className="ld-dividend-box">
              <input
                type="text"
                className="ld-input ld-dividend-input"
                value={dividend}
                readOnly
                tabIndex={-1}
              />
            </div>
          </div>
        </div>

        {/* Work steps */}
        {steps.map((step, i) => (
          <div key={i} className="ld-step">
            <div className="ld-step-label">Step {i + 1}</div>
            <div className="ld-step-row">
              <label className="ld-step-field-label">× </label>
              <input
                type="text"
                className="ld-input ld-step-input"
                value={step.multiply}
                onChange={(e) => updateStep(i, "multiply", e.target.value)}
                placeholder="multiply"
              />
            </div>
            <div className="ld-step-row ld-underline">
              <label className="ld-step-field-label">− </label>
              <input
                type="text"
                className="ld-input ld-step-input"
                value={step.subtract}
                onChange={(e) => updateStep(i, "subtract", e.target.value)}
                placeholder="subtract"
              />
            </div>
            <div className="ld-step-row">
              <label className="ld-step-field-label">↓ </label>
              <input
                type="text"
                className="ld-input ld-step-input"
                value={step.bringDown}
                onChange={(e) => updateStep(i, "bringDown", e.target.value)}
                placeholder="bring down"
              />
            </div>
          </div>
        ))}

        {/* Remainder */}
        <div className="ld-remainder-row">
          <label className="ld-step-field-label">R </label>
          <input
            type="text"
            className="ld-input ld-step-input"
            value={remainderWork}
            onChange={(e) => setRemainderWork(e.target.value)}
            placeholder="remainder"
          />
        </div>

        {/* Add / remove step buttons */}
        <div className="ld-step-controls">
          <button className="ld-step-btn" onClick={addStep}>+ Step</button>
          {steps.length > 1 && (
            <button className="ld-step-btn ld-step-btn-remove" onClick={removeStep}>− Step</button>
          )}
        </div>

      </div>
    </div>
  );
}

export default LongDivisionScratchpad;
