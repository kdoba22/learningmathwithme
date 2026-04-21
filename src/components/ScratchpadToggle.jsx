import React from "react";
import "./ScratchpadToggle.css";

function ScratchpadToggle({ hidden, onChange }) {
  return (
    <label className="scratchpad-toggle">
      <input
        type="checkbox"
        checked={hidden}
        onChange={(e) => onChange(e.target.checked)}
      />
      {hidden ? "Show Scratchpad" : "Hide Scratchpad"}
    </label>
  );
}

export default ScratchpadToggle;
