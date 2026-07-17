import React, { useState, useEffect } from "react";
import "./Scratchpad.css";
import Button from "./Button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDigits(num, len) {
  return String(Math.round(num)).padStart(len, " ").split("");
}

function emptyRow(len) {
  return Array(len).fill("");
}

// ─── Component ────────────────────────────────────────────────────────────────

function MultiplicationScratchpad({ a, b, clearSignal, onTotalChange }) {
  const intLen = Math.max(
    String(Math.abs(a)).length,
    String(Math.abs(b)).length
  );

  const initTop = () => toDigits(a, intLen);
  const initBottom = () => toDigits(b, intLen);

  const [topCarry, setTopCarry] = useState(() => emptyRow(intLen + 1));
  const [topNum, setTopNum] = useState(initTop);
  const [bottomNum, setBottomNum] = useState(initBottom);
  const [partials, setPartials] = useState(() => [emptyRow(intLen + 2)]);
  const [total, setTotal] = useState(() => emptyRow(intLen * 2 + 1));

  useEffect(() => {
    setTopCarry(emptyRow(intLen + 1));
    setTopNum(toDigits(a, intLen));
    setBottomNum(toDigits(b, intLen));
    setPartials([emptyRow(intLen + 2)]);
    setTotal(emptyRow(intLen * 2 + 1));
    if (onTotalChange) onTotalChange("");
  }, [clearSignal, a, b]);

  const handleClear = () => {
    setTopCarry(emptyRow(intLen + 1));
    setTopNum(toDigits(a, intLen));
    setBottomNum(toDigits(b, intLen));
    setPartials([emptyRow(intLen + 2)]);
    setTotal(emptyRow(intLen * 2 + 1));
    if (onTotalChange) onTotalChange("");
  };

  const addRow = () => setPartials((prev) => [...prev, emptyRow(intLen * 2 + 1)]);
  const removeRow = () =>
    setPartials((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

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
        const updated = [...row];
        updated[colIndex] = value;
        return updated;
      })
    );
  };

  return (
    <div className="scratchpad">
      <div className="scratchpad-title">
        Scratchpad
        <Button variant="destructive" className="btn-sm" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <div className="mult-scratchpad">

        {/* Carry row */}
        <div className="mult-row carry-row">
          <Button
            variant="secondary"
            className="btn-sm carry-clear-btn"
            onClick={() => setTopCarry(emptyRow(intLen + 1))}
          >
            Clear Row
          </Button>
          {topCarry.map((v, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="scratchpad-cell carry-cell"
              value={v}
              onChange={(e) => updateCell(setTopCarry, topCarry, i, e.target.value)}
            />
          ))}
        </div>

        {/* Top number */}
        <div className="mult-row">
          {topNum.map((v, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="scratchpad-cell prefilled"
              value={v}
              onChange={(e) => updateCell(setTopNum, topNum, i, e.target.value)}
            />
          ))}
        </div>

        {/* Bottom number with × sign */}
        <div className="mult-row operator-row">
          <span className="operator-sign">×</span>
          {bottomNum.map((v, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="scratchpad-cell prefilled"
              value={v}
              onChange={(e) => updateCell(setBottomNum, bottomNum, i, e.target.value)}
            />
          ))}
        </div>

        <div className="mult-divider" />

        {/* Partial product rows */}
        {partials.map((row, ri) => (
          <div key={ri} className="mult-partial-group">
            <div className="mult-row">
              {row.map((v, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="scratchpad-cell"
                  value={v}
                  onChange={(e) => updatePartial(ri, i, e.target.value)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Add / remove row buttons */}
        <div className="ld-step-controls">
          <Button variant="secondary" className="btn-sm" onClick={addRow}>
            + Row
          </Button>
          {partials.length > 1 && (
            <Button variant="danger" className="btn-sm" onClick={removeRow}>
              − Row
            </Button>
          )}
        </div>

        <div className="mult-divider" />

        {/* Final total */}
        <div className="mult-row total-row">
          {total.map((v, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="scratchpad-cell total-cell"
              value={v}
              onChange={(e) => updateTotal(i, e.target.value)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default MultiplicationScratchpad;
