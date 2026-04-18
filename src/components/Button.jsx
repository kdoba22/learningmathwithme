import React from "react";
import "./Button.css";

function Button({ variant = "primary", onClick, disabled, type = "button", children, className = "" }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
