import React, { useState, useEffect } from "react";
import "./Scratchpad.css";
import Button from "./Button";

function toDigits(num, len = 4) {
  return String(num).padStart(len, " ").split("");
}

function SubtractionScratchpad({ a, b, clearSignal, onTotalChange }) {
  const [borrow, setBorrow] = useState(["", "", "", ""]);
  const [topNum, setTopNum] = useState(toDigits(a));
  const [bottomNum, setBottomNum] = useState(toDigits(b));
  const [result, setResult] = useState(["", "", "", ""]);

  useEffect(() => {
    setBorrow(["", "", "", ""]);
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setResult(["", "", "", ""]);
    if (onTotalChange) onTotalChange("");
  }, [clearSignal, a, b]);

  const handleClear = () => {
    setBorrow(["", "", "", ""]);
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setResult(["", "", "", ""]);
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

  const cols = ["Th", "H", "T", "O"];

  return (
    <div className="scratchpad">
      <div className="scratchpad-title">
        Scratchpad
        <Button variant="destructive" className="btn-sm" onClick={handleClear}>Clear</Button>
      </div>

      <table className="scratchpad-table">
        <thead>
          <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          <tr className="carry-row">
            {borrow.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell carry-cell"
                  value={v} onChange={(e) => updateCell(setBorrow, borrow, i, e.target.value)} />
              </td>
            ))}
            <td>
              <Button variant="secondary" className="btn-sm" onClick={() => setBorrow(["", "", "", ""])}>Clear Row</Button>
            </td>
          </tr>
          <tr>
            {topNum.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell prefilled"
                  value={v} onChange={(e) => updateCell(setTopNum, topNum, i, e.target.value)} />
              </td>
            ))}
          </tr>
          <tr className="operator-row">
            {bottomNum.map((v, i) => (
              <td key={i} className={i === 0 ? "operator-cell" : ""}>
                {i === 0 && <span className="operator-sign">−</span>}
                <input type="text" maxLength={1} className="scratchpad-cell prefilled"
                  value={v} onChange={(e) => updateCell(setBottomNum, bottomNum, i, e.target.value)} />
              </td>
            ))}
          </tr>
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
