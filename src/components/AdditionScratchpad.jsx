import React, { useState, useEffect } from "react";
import "./Scratchpad.css";
import Button from "./Button";

function toDigits(num, len = 4) {
  return String(num).padStart(len, " ").split("");
}

function AdditionScratchpad({ a, b, clearSignal, onTotalChange }) {
  const [carry, setCarry] = useState(["", "", "", ""]);
  const [topNum, setTopNum] = useState(toDigits(a));
  const [bottomNum, setBottomNum] = useState(toDigits(b));
  const [total, setTotal] = useState(["", "", "", ""]);

  useEffect(() => {
    setCarry(["", "", "", ""]);
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setTotal(["", "", "", ""]);
    if (onTotalChange) onTotalChange("");
  }, [clearSignal, a, b]);

  const handleClear = () => {
    setCarry(["", "", "", ""]);
    setTopNum(toDigits(a));
    setBottomNum(toDigits(b));
    setTotal(["", "", "", ""]);
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
            {carry.map((v, i) => (
              <td key={i}>
                <input type="text" maxLength={1} className="scratchpad-cell carry-cell"
                  value={v} onChange={(e) => updateCell(setCarry, carry, i, e.target.value)} />
              </td>
            ))}
            <td>
              <Button variant="secondary" className="btn-sm" onClick={() => setCarry(["", "", "", ""])}>Clear Row</Button>
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
                {i === 0 && <span className="operator-sign">+</span>}
                <input type="text" maxLength={1} className="scratchpad-cell prefilled"
                  value={v} onChange={(e) => updateCell(setBottomNum, bottomNum, i, e.target.value)} />
              </td>
            ))}
          </tr>
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
