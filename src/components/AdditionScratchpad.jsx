import React, { useState, useEffect } from "react";
import "./Scratchpad.css";
import Button from "./Button";

// Pad a number string to 4 characters, left-padded with spaces
function toDigits(num) {
  return String(Math.round(num)).padStart(4, " ").split("");
}

const COLS = ["Th", "H", "T", "O"];

function AdditionScratchpad({ a, b, clearSignal, onTotalChange }) {
  const emptyRow = () => Array(4).fill("");

  const [carry, setCarry] = useState(emptyRow);
  const [topNum, setTopNum] = useState(() => toDigits(a));
  const [bottomNum, setBottomNum] = useState(() => toDigits(b));
  const [total, setTotal] = useState(emptyRow);

  useEffect(() => {
    setCarry(emptyRow());
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setTotal(emptyRow());
    if (onTotalChange) onTotalChange("");
  }, [clearSignal, a, b]);

  const handleClear = () => {
    setCarry(emptyRow());
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setTotal(emptyRow());
    if (onTotalChange) onTotalChange("");
  };

  const updateCell = (setter, arr, index, value) => {
    const updated = [...arr];
    updated[index] = value;
    setter(updated);
  };

  const updateTotal = (index, value) => {
    const updated = [...total];
    updated[index] = value;
    setTotal(updated);
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
          {/* Carry row */}
          <tr className="carry-row">
            {carry.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell carry-cell"
                  value={v} onChange={(e) => updateCell(setCarry, carry, i, e.target.value)} />
              </td>
            ))}
            <td>
              <Button variant="secondary" className="btn-sm"
                onClick={() => setCarry(emptyRow())}>Clear Row</Button>
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

          {/* Bottom number (b) with + sign */}
          <tr className="operator-row">
            {bottomNum.map((v, i) => (
              <td key={i} className={i === 0 ? "operator-cell" : ""}>
                {i === 0 && <span className="operator-sign">+</span>}
                <input type="text" maxLength={1} className="scratchpad-cell prefilled"
                  value={v} onChange={(e) => updateCell(setBottomNum, bottomNum, i, e.target.value)} />
              </td>
            ))}
          </tr>

          {/* Total (answer) row */}
          <tr className="total-row">
            {total.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell total-cell"
                  value={v} onChange={(e) => updateTotal(i, e.target.value)} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Legend */}
      <div className="scratchpad-legend">
        <span><strong>Th</strong> = Thousands</span>
        <span><strong>H</strong> = Hundreds</span>
        <span><strong>T</strong> = Tens</span>
        <span><strong>O</strong> = Ones</span>
      </div>
    </div>
  );
}

export default AdditionScratchpad;
