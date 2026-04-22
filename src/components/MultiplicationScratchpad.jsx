import React, { useState, useEffect } from "react";
import "./Scratchpad.css";
import Button from "./Button";

function toDigits(num, len = 4) {
  return String(num).padStart(len, " ").split("");
}

const emptyPartial = (len = 4) => ({ product: Array(len + 2).fill("") });

function MultiplicationScratchpad({ a, b, clearSignal, onTotalChange }) {
  const aLen = Math.max(String(a).length, String(b).length);
  const [topCarry, setTopCarry] = useState(Array(aLen + 1).fill(""));
  const [topNum, setTopNum] = useState(toDigits(a, aLen));
  const [bottomNum, setBottomNum] = useState(toDigits(b, aLen));
  const [partials, setPartials] = useState([emptyPartial(aLen)]);
  const [total, setTotal] = useState(Array(aLen * 2 + 1).fill(""));

  useEffect(() => {
    setTopCarry(Array(aLen + 1).fill(""));
    setTopNum(toDigits(a, aLen));
    setBottomNum(toDigits(b, aLen));
    setPartials([emptyPartial(aLen)]);
    setTotal(Array(aLen * 2 + 1).fill(""));
    if (onTotalChange) onTotalChange("");
  }, [clearSignal, a, b]);

  const handleClear = () => {
    setTopCarry(Array(aLen + 1).fill(""));
    setTopNum(toDigits(a, aLen));
    setBottomNum(toDigits(b, aLen));
    setPartials([emptyPartial(aLen)]);
    setTotal(Array(aLen * 2 + 1).fill(""));
    if (onTotalChange) onTotalChange("");
  };

  const addRow = () => setPartials((prev) => [...prev, emptyPartial(aLen)]);
  const removeRow = () => setPartials((prev) => prev.length > 1 ? prev.slice(0, -1) : prev);

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

  const updatePartial = (rowIndex, colIndex, value) => {
    setPartials((prev) =>
      prev.map((row, i) => {
        if (i !== rowIndex) return row;
        const updated = [...row.product];
        updated[colIndex] = value;
        return { ...row, product: updated };
      })
    );
  };

  return (
    <div className="scratchpad">
      <div className="scratchpad-title">
        Scratchpad
        <Button variant="destructive" className="btn-sm" onClick={handleClear}>Clear</Button>
      </div>

      <div className="mult-scratchpad">

        {/* Carry row with Clear Row button on the left */}
        <div className="mult-row carry-row">
          <Button variant="secondary" className="btn-sm carry-clear-btn" onClick={() => setTopCarry(Array(aLen + 1).fill(""))}>Clear Row</Button>
          {topCarry.map((v, i) => (
            <input key={i} type="text" maxLength={1} className="scratchpad-cell carry-cell"
              value={v} onChange={(e) => updateCell(setTopCarry, topCarry, i, e.target.value)} />
          ))}
        </div>

        {/* Top number */}
        <div className="mult-row">
          {topNum.map((v, i) => (
            <input key={i} type="text" maxLength={1} className="scratchpad-cell prefilled"
              value={v} onChange={(e) => updateCell(setTopNum, topNum, i, e.target.value)} />
          ))}
        </div>

        {/* Bottom number with × sign */}
        <div className="mult-row operator-row">
          <span className="operator-sign">×</span>
          {bottomNum.map((v, i) => (
            <input key={i} type="text" maxLength={1} className="scratchpad-cell prefilled"
              value={v} onChange={(e) => updateCell(setBottomNum, bottomNum, i, e.target.value)} />
          ))}
        </div>

        <div className="mult-divider" />

        {/* Partial product rows */}
        {partials.map((row, ri) => (
          <div key={ri} className="mult-partial-group">
            <div className="mult-row">
              {row.product.map((v, i) => (
                <input key={i} type="text" maxLength={1} className="scratchpad-cell"
                  value={v} onChange={(e) => updatePartial(ri, i, e.target.value)} />
              ))}
            </div>
          </div>
        ))}

        {/* Add / remove row buttons */}
        <div className="ld-step-controls">
          <Button variant="secondary" className="btn-sm" onClick={addRow}>+ Row</Button>
          {partials.length > 1 && (
            <Button variant="danger" className="btn-sm" onClick={removeRow}>− Row</Button>
          )}
        </div>

        <div className="mult-divider" />

        {/* Final total */}
        <div className="mult-row total-row">
          {total.map((v, i) => (
            <input key={i} type="text" maxLength={1} className="scratchpad-cell total-cell"
              value={v} onChange={(e) => updateTotal(i, e.target.value)} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default MultiplicationScratchpad;
