import React from "react";

function WelcomeBanner({ name, done }) {
  return (
    <h2>{done ? "Great job" : "Welcome"}{name ? `, ${name}` : ""}! {done ? "🎉" : "👋"}</h2>
  );
}

export default WelcomeBanner;
