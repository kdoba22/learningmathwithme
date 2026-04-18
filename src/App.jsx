import React, { useState } from "react";
import Header from "./components/Header";
import UserForm from "./components/UserForm";
import AdditionFlashcard from "./components/AdditionFlashcard";
import SubtractionFlashcard from "./components/SubtractionFlashcard";
import MultiplicationFlashcard from "./components/MultiplicationFlashcard";
import DivisionFlashcard from "./components/DivisionFlashcard";
import "./App.css";

function App() {
  const [userSettings, setUserSettings] = useState(null);
  const [started, setStarted] = useState(false);

  const handleStart = (settings) => {
    setUserSettings(settings);
    setStarted(true);
  };

  const handleBack = () => {
    setStarted(false);
  };

  return (
    <div className="App">
      <Header />
      {!started ? (
        <UserForm onStart={handleStart} initialSettings={userSettings} />
      ) : userSettings.operation === "Addition" ? (
        <AdditionFlashcard settings={userSettings} onBack={handleBack} />
      ) : userSettings.operation === "Subtraction" ? (
        <SubtractionFlashcard settings={userSettings} onBack={handleBack} />
      ) : userSettings.operation === "Multiplication" ? (
        <MultiplicationFlashcard settings={userSettings} onBack={handleBack} />
      ) : userSettings.operation === "Division" ? (
        <DivisionFlashcard settings={userSettings} onBack={handleBack} />
      ) : (
        <div style={{ marginTop: "10rem", textAlign: "center" }}>
          <p>{userSettings.operation} coming soon!</p>
          <button onClick={handleBack}>Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
