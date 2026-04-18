import React from "react";

function Flashcard({ children }) {
  return (
    <div className="flashcard">
      <p className="problem">{children}</p>
    </div>
  );
}

export default Flashcard;
