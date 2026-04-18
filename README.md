# Learning Math With Me 🧮

An interactive math flashcard application built for elementary school children (Kindergarten through Grade 6). Students can practice addition, subtraction, multiplication, and division with problems tailored to their grade level and experience.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [User Setup](#user-setup)
  - [Addition & Subtraction](#addition--subtraction)
  - [Multiplication](#multiplication)
  - [Division](#division)
  - [Scoring](#scoring)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🎯 **Four operations** — Addition, Subtraction, Multiplication, and Division
- 📊 **Grade & experience-based difficulty** — Number ranges scale from KG through Grade 6 across five experience levels (Beginner → Expert)
- ✖️ **Multiplication modes** — Practice individual times tables (0–14) or random problems
- ➗ **Smart division** — No remainders for Grade 3 and below or Beginner/Intermediate levels; remainders introduced at Grade 4+ with Advanced experience and above
- ✅ **Instant feedback** — Students are told immediately if they are right or wrong
- 🔁 **Try Again or Peek** — Wrong answers give the option to try again or peek at the answer (peeking marks it incorrect)
- 🏆 **Session summary** — Score, percentage, and an encouraging message at the end of each session
- 💾 **Settings preserved** — Returning to the main form keeps all previously selected settings intact
- 📱 **Responsive design** — Works on desktop and mobile

---

## Demo

> Coming soon

---

## Tech Stack

| Technology                  | Version                                 |
| --------------------------- | --------------------------------------- |
| [React](https://react.dev/) | 19.x                                    |
| [Vite](https://vitejs.dev/) | 7.x                                     |
| JavaScript (ESM)            | ES2020+                                 |
| CSS                         | Plain CSS with responsive media queries |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/kdoba22/learningmathwithme.git

# Navigate into the project directory
cd learningmathwithme

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
```

The production-ready files will be output to the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Fixed top navigation header
│   ├── Header.css
│   ├── UserForm.jsx            # Student setup form (name, grade, experience, operation)
│   ├── UserForm.css
│   ├── AdditionFlashcard.jsx   # Addition flashcard session
│   ├── SubtractionFlashcard.jsx # Subtraction flashcard session
│   ├── MultiplicationFlashcard.jsx # Multiplication with times tables & random modes
│   ├── MultiplicationFlashcard.css
│   ├── DivisionFlashcard.jsx   # Division flashcard session with optional remainders
│   └── AdditionFlashcard.css  # Shared styles for all flashcard components
├── App.jsx                     # Root component and navigation state
├── App.css
├── index.css
└── main.jsx
```

---

## How It Works

### User Setup

On the home screen the student selects:

- **Name** _(optional)_
- **Grade** — KG, 1, 2, 3, 4, 5, or 6
- **Experience Level** — Beginner, Intermediate, Advanced, Proficient, or Expert
- **Operation** — Addition, Subtraction, Multiplication, or Division

Pressing **GO** launches the appropriate flashcard session.

### Addition & Subtraction

- Number ranges are determined by a grade × experience lookup table
- Subtraction problems always produce a positive result (larger minus smaller)
- Students choose how many problems to answer: 10, 25, 50, or 100

| Grade | Beginner | Intermediate | Advanced | Proficient | Expert |
| ----- | -------- | ------------ | -------- | ---------- | ------ |
| KG    | 0–5      | 0–10         | 0–15     | 0–20       | 0–25   |
| 1     | 0–10     | 0–20         | 0–30     | 0–40       | 0–50   |
| 2     | 0–20     | 0–40         | 0–60     | 0–80       | 0–100  |
| 3     | 0–25     | 0–50         | 0–75     | 0–100      | 0–150  |
| 4     | 0–50     | 0–100        | 0–150    | 0–200      | 0–250  |
| 5     | 0–75     | 0–150        | 0–200    | 0–250      | 0–500  |
| 6     | 0–100    | 0–200        | 0–300    | 0–500      | 0–999  |

### Multiplication

Two modes available via a toggle at the top of the flashcard page:

- **Times Tables** — Pick a number 0–14 and work through all 15 problems (n × 0 through n × 14) in order
- **Random** — Random problems using the same grade/experience number ranges as addition and subtraction

Switching modes resets all stats.

### Division

- **KG – Grade 3** — No remainders, regardless of experience level
- **Grade 4–6, Beginner/Intermediate** — No remainders
- **Grade 4–6, Advanced/Proficient/Expert** — Remainders possible; answer is entered as quotient + remainder (e.g. `7 ÷ 2 = 3 R1`)

### Scoring

- A problem is only counted as correct if answered correctly on the **first attempt**
- Peeking at the answer counts as an incorrect answer
- The session summary shows total correct, percentage, and an encouraging message based on performance

---

## Roadmap

- [ ] Fraction operations (addition, subtraction, multiplication, division)
- [ ] Help modules explaining how to solve fraction problems
- [ ] Required name field with content filtering
- [ ] Progress tracking across sessions
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Sound effects and animations for correct/incorrect answers

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing style and passes linting:

```bash
npm run lint
```

---

## License

This project is licensed under the [MIT License](LICENSE).
