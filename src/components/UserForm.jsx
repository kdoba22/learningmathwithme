import React, { useState } from "react";
import "./UserForm.css";
import Button from "./Button";

function UserForm({ onStart, initialSettings }) {
  const [name, setName] = useState(initialSettings?.name || "");
  const [experience, setExperience] = useState(initialSettings?.experience || "Beginner");
  const [operation, setOperation] = useState(initialSettings?.operation || "Addition");
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    const input = e.target.value;
    const forbiddenWords = ["badword1", "badword2", "badword3"];

    if (forbiddenWords.some((word) => input.toLowerCase().includes(word))) {
      setError("Please avoid using inappropriate language.");
    } else {
      setError("");
    }

    setName(input);
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) {
      onStart({ name, experience, operation });
    }
  };

  const isFormValid = () => {
    if (error) return false;
    return true;
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="name-input"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label htmlFor="experience">Experience Level: </label>
        <select
          id="experience"
          value={experience}
          onChange={handleExperienceChange}
          className="experience-select"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Proficient">Proficient</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      <div>
        <label htmlFor="operation">Operation: </label>
        <select
          id="operation"
          value={operation}
          onChange={handleOperationChange}
          className="operation-select"
        >
          <option value="Addition">Addition</option>
          <option value="Subtraction">Subtraction</option>
          <option value="Multiplication">Multiplication</option>
          <option value="Division">Division</option>
        </select>
      </div>
      <Button variant="primary" type="submit" disabled={!isFormValid()}
        style={{ fontSize: "1.2rem", padding: "0.75rem 1.5rem" }}>
        GO
      </Button>
    </form>
  );
}

export default UserForm;
