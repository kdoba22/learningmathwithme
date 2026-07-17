import React, { useState, useEffect } from "react";
import "./Scratchpad.css";
import Button from "./Button";

// Pad a number string to 4 characters, left-padded with spaces
function toDigits(num) {
  return String(Math.round(num)).padStart(4, " ").split("");
}

const COLS = ["Th", "H", "T", "O"];

function SubtractionScratchpad({ a, b, clearSignal, onTotalChange }) {
  const emptyRow = () => Array(4).fill("");

  const [borrow, setBorrow] = useState(emptyRow);
  const [topNum, setTopNum] = useState(() => toDigits(a));
  const [bottomNum, setBottomNum] = useState(() => toDigits(b));
  const [result, setResult] = useState(emptyRow);

  useEffect(() => {
    setBorrow(emptyRow());
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setResult(emptyRow());
    if (onTotalChange) onTotalChange("");
  }, [clearSignal, a, b]);

  const handleClear = () => {
    setBorrow(emptyRow());
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setResult(emptyRow());
    if (onTotalChange) onTotalChange("");
  };

  const updateCell = (setter, arr, index, value) => {
    const updated = [...arr];
    updated[index] = value;
    setter(updated);
  };

  const updateResult = (index, value) => {
    const updated = [...result];
    updated[index] = value;
    setResult(updated);
    if (onTotalChange) onTotalChange(updated.join("").trim());
  };

  return (
    <div className="scratchpad">
      <div className="scratchpad-title">
        Scratchpad
        <Button variant="destructive" className="btn-sm" onClick={handleClear}>Clear</Button>
      </div>

      <table className="scratchpad-table">
        <thead>
          <tr>
            {COLS.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Borrow row */}
          <tr className="carry-row">
            {borrow.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell carry-cell"
                  value={v} onChange={(e) => updateCell(setBorrow, borrow, i, e.target.value)} />
              </td>
            ))}
            <td>
              <Button variant="secondary" className="btn-sm"
                onClick={() => setBorrow(emptyRow())}>Clear Row</Button>
            </td>
          </tr>

          {/* Top number (a) */}
          <tr>
            {topNum.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell prefilled"
                  value={v} onChange={(e) => updateCell(setTopNum, topNum, i, e.target.value)} />
              </td>
            ))}
          </tr>

          {/* Bottom number (b) with − sign */}
          <tr className="operator-row">
            {bottomNum.map((v, i) => (
              <td key={i} className={i === 0 ? "operator-cell" : ""}>
                {i === 0 && <span className="operator-sign">−</span>}
                <input type="text" maxLength={1} className="scratchpad-cell prefilled"
                  value={v} onChange={(e) => updateCell(setBottomNum, bottomNum, i, e.target.value)} />
              </td>
            ))}
          </tr>

          {/* Result (answer) row */}
          <tr className="total-row">
            {result.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell total-cell"
                  value={v} onChange={(e) => updateResult(i, e.target.value)} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="scratchpad-legend">
        <span><strong>Th</strong> = Thousands</span>
        <span><strong>H</strong> = Hundreds</span>
        <span><strong>T</strong> = Tens</span>
        <span><strong>O</strong> = Ones</span>
      </div>
    </div>
  );
}

export default SubtractionScratchpad;
