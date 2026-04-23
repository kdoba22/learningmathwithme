# Learning Math With Me 🧮

An interactive math flashcard application built for elementary school children. Students can practice addition, subtraction, multiplication, and division with problems tailored to their experience level. The application features interactive scratchpads for each operation, helping students work through problems step by step just as they would on paper.

> **Live Application:** [https://learningmathwithme.com](https://learningmathwithme.com)
> **Repository:** [https://github.com/kdoba22/learningmathwithme](https://github.com/kdoba22/learningmathwithme)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Running Tests](#running-tests)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [User Setup](#user-setup)
  - [Difficulty Scaling](#difficulty-scaling)
  - [Addition](#addition)
  - [Subtraction](#subtraction)
  - [Multiplication](#multiplication)
  - [Division](#division)
  - [Scratchpads](#scratchpads)
  - [Scoring](#scoring)
- [CI/CD Pipeline](#cicd-pipeline)
- [AWS Infrastructure](#aws-infrastructure)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🎯 **Four operations** — Addition, Subtraction, Multiplication, and Division
- 📊 **Experience-based difficulty** — Number ranges scale across five levels (Beginner → Expert)
- ✖️ **Multiplication modes** — Practice individual times tables (0–14) or random problems with a toggle switch
- ➗ **Smart division** — Remainders introduced only at Advanced experience level and above
- 📝 **Interactive scratchpads** — Each operation includes a scratchpad so students can work problems step by step, just like on paper
- 🔢 **Scratchpad answer detection** — If the answer box is left empty, the app reads the answer from the scratchpad automatically
- ✅ **Instant feedback** — Students are told immediately if their answer is correct or incorrect
- 🔁 **Try Again or Peek** — Wrong answers offer the option to try again or peek at the answer (peeking marks it incorrect)
- 🏆 **Session summary** — Score, percentage, and an encouraging message at the end of each session
- 💾 **Settings preserved** — Returning to the main form keeps all previously selected settings intact
- 📱 **Responsive design** — Works on desktop, tablet, and mobile

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19.x | UI framework |
| [Vite](https://vitejs.dev/) | 7.x | Build tool and dev server |
| [Vitest](https://vitest.dev/) | 4.x | Unit testing |
| [React Testing Library](https://testing-library.com/) | 16.x | Component testing |
| JavaScript (ESM) | ES2020+ | Language |
| Plain CSS | — | Styling with responsive media queries |
| [AWS S3](https://aws.amazon.com/s3/) | — | Static file hosting |
| [AWS CloudFront](https://aws.amazon.com/cloudfront/) | — | CDN and HTTPS |
| [AWS Route 53](https://aws.amazon.com/route53/) | — | DNS and custom domain |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |

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

### Running Tests

```bash
# Run all tests once
npm test -- --run

# Run tests with coverage report
npm run test:coverage
```

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
│   ├── AdditionFlashcard.jsx       # Addition flashcard session
│   ├── AdditionScratchpad.jsx      # Carry/total scratchpad for addition
│   ├── Button.jsx                  # Shared button component with variants
│   ├── Button.css
│   ├── DivisionFlashcard.jsx       # Division flashcard session with optional remainders
│   ├── DivisionFlashcard.css
│   ├── FeedbackSection.jsx         # Shared correct/wrong/peeked feedback UI
│   ├── Flashcard.jsx               # Shared green problem card component
│   ├── FlashcardHeader.jsx         # Shared problem counter and score display
│   ├── Header.jsx                  # Fixed top navigation header
│   ├── Header.css
│   ├── LongDivisionScratchpad.jsx  # Long division scratchpad with step-by-step layout
│   ├── LongDivisionScratchpad.css
│   ├── MultiplicationFlashcard.jsx # Multiplication with times tables & random modes
│   ├── MultiplicationFlashcard.css
│   ├── MultiplicationScratchpad.jsx # Scratchpad for multiplication with partial products
│   ├── ProblemCountSelector.jsx    # Shared 10/25/50/100 problem count picker
│   ├── Scratchpad.css              # Shared scratchpad styles
│   ├── ScratchpadToggle.jsx        # Shared hide/show scratchpad checkbox
│   ├── ScratchpadToggle.css
│   ├── SubtractionFlashcard.jsx    # Subtraction flashcard session
│   ├── SubtractionScratchpad.jsx   # Borrow/result scratchpad for subtraction
│   ├── SummaryScreen.jsx           # Shared session summary with score and messages
│   ├── UserForm.jsx                # Student setup form
│   ├── UserForm.css
│   ├── WelcomeBanner.jsx           # Shared welcome/great job heading
│   └── AdditionFlashcard.css      # Shared flashcard styles
├── test/
│   ├── setup.js                    # Vitest setup file
│   ├── mathUtils.test.js           # Tests for difficulty scaling utility
│   ├── Button.test.jsx             # Tests for Button component
│   ├── FeedbackSection.test.jsx    # Tests for FeedbackSection component
│   ├── ScratchpadToggle.test.jsx   # Tests for ScratchpadToggle component
│   ├── SummaryScreen.test.jsx      # Tests for SummaryScreen component
│   └── WelcomeBanner.test.jsx      # Tests for WelcomeBanner component
├── utils/
│   └── mathUtils.js                # Shared difficulty range lookup
├── App.jsx                         # Root component and navigation state
├── App.css
├── index.css
└── main.jsx
```

---

## How It Works

### User Setup

On the home screen the student optionally enters their name, then selects:

- **Experience Level** — Beginner, Intermediate, Advanced, Proficient, or Expert
- **Operation** — Addition, Subtraction, Multiplication, or Division

Pressing **GO** launches the appropriate flashcard session.

### Difficulty Scaling

Number ranges are determined solely by experience level, defined in `src/utils/mathUtils.js`:

| Experience | Max Number |
|---|---|
| Beginner | 20 (Addition: 0–9 single digit) |
| Intermediate | 50 |
| Advanced | 100 |
| Proficient | 250 |
| Expert | 999 |

### Addition

- Beginner level uses single-digit numbers (0–9) including zero, to support finger counting
- All other levels use the standard experience range
- Students choose how many problems to answer: 10, 25, 50, or 100

### Subtraction

- Problems always produce a positive result (larger number minus smaller)
- A result of zero is allowed
- Students choose how many problems to answer: 10, 25, 50, or 100

### Multiplication

Two modes available via a toggle at the top of the flashcard page:

- **Times Tables** — Pick a number 0–14 and work through all 15 problems (n × 0 through n × 14) in order
- **Random** — Random problems using the experience-based number ranges

Switching modes resets all stats and returns to the selector screen.

### Division

- **Beginner / Intermediate** — Problems always divide evenly (no remainders)
- **Advanced / Proficient / Expert** — Remainders are possible; answer is entered as quotient + remainder (e.g. `7 ÷ 2 = 3 R1`)

### Scratchpads

Every operation includes a scratchpad panel to the right of the flashcard so students can work through problems step by step:

- **Addition** — Column layout (Th, H, T, O) with carry row, pre-filled numbers, and answer row. Includes a place value legend.
- **Subtraction** — Same layout as addition with a borrow row instead of carry.
- **Multiplication** — Stacked number layout with a carry row, partial product rows (add/remove as needed), and a final total row.
- **Division** — Long division house layout with step-by-step multiply, subtract, and bring-down fields.

All scratchpads:
- Pre-fill the problem numbers automatically
- Auto-clear when the next problem loads
- Have a **Clear** button to reset manually
- Have a **Hide/Show Scratchpad** toggle
- Feed their answer row back to the Check button as a fallback if the answer box is left empty

### Scoring

- A problem is only counted as correct if answered on the **first attempt**
- Peeking at the answer counts as incorrect
- The session summary shows total correct, percentage, and an encouraging message based on performance

---

## CI/CD Pipeline

Every push to the `main` branch triggers an automated GitHub Actions workflow that:

1. **Installs** dependencies via `npm ci`
2. **Runs** all unit tests via `vitest` — deployment is blocked if any test fails
3. **Builds** the production bundle via `vite build`
4. **Deploys** the `dist/` folder to AWS S3 with optimized cache headers:
   - Hashed assets (JS/CSS) — cached for 1 year (`max-age=31536000, immutable`)
   - `index.html` — never cached (`no-cache, no-store, must-revalidate`)
5. **Invalidates** the CloudFront cache so users always receive the latest version

The workflow file is located at `.github/workflows/deploy.yml`.

---

## AWS Infrastructure

The application is hosted entirely on AWS using a serverless static hosting architecture:

```
User → Route 53 (DNS) → CloudFront (CDN/HTTPS) → S3 (Static Files)
```

| Service | Purpose |
|---|---|
| **S3** | Stores the production build files |
| **CloudFront** | Serves files globally via CDN, enforces HTTPS, handles custom error responses for React routing |
| **Route 53** | Manages the `learningmathwithme.com` domain and DNS records |
| **ACM** | Provides the SSL/TLS certificate for HTTPS |
| **IAM** | Scoped deployment user (`github-actions-deploy`) with least-privilege permissions |

**Estimated monthly cost:** < $1 USD for typical portfolio/demo traffic levels.

---

## Development Notes

This project was developed iteratively using **Amazon Q Developer** as an AI pair programmer within VS Code. Amazon Q assisted with component architecture, refactoring shared components, CSS layout, AWS infrastructure setup, CI/CD configuration, and unit test generation throughout the development process.

---

## Roadmap

- [ ] Fraction operations (addition, subtraction, multiplication, division)
- [ ] Help modules explaining how to solve fraction problems step by step
- [ ] Decimal operations
- [ ] Money math
- [ ] Backend for progress tracking across sessions
- [ ] User accounts and session history
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

Please make sure your code passes linting and all tests before submitting:

```bash
npm run lint
npm test -- --run
```

---

## License

This project is licensed under the [MIT License](LICENSE).
