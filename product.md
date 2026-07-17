# Product Document — Learning Math With Me

> **Live site:** [https://learningmathwithme.com](https://learningmathwithme.com)
> **Repository:** [https://github.com/kdoba22/learningmathwithme](https://github.com/kdoba22/learningmathwithme)
> **Current version:** 1.0 (React rebuild)

---

## Origin Story

This project started as a personal tool built for a first-grade daughter who was learning basic math with flashcards. When life got busy and one-on-one practice time became scarce, a desktop application was written in AngularJS to give her math problems to work through on her own. Over time it grew to cover all four core arithmetic operations.

The current version is a full rebuild in React — modernizing the tech stack, moving to the web, and expanding the feature set. A secondary motivation for this rebuild is hands-on learning with AI-assisted development tools (Amazon Q Developer, Kiro).

---

## Vision

A free, friendly, and always-available math practice companion for elementary school students — one that feels like working through problems on paper, not taking a test.

---

## Problem Statement

Young students need repetitive, low-stakes math practice to build fluency. Traditional flashcard sessions require a parent or teacher to be present and engaged. When that time isn't available, kids either skip practice or use apps that feel more like games than learning tools.

**Learning Math With Me** fills that gap: it gives students a structured, paper-like practice environment they can use independently, at their own pace, at any experience level.

---

## Target Users

| User | Description |
|---|---|
| **Primary** | Students in Kindergarten through 6th grade practicing core arithmetic |
| **Secondary** | Parents who want a simple, distraction-free tool to assign practice |
| **Future** | As the curriculum expands (fractions, decimals, money, algebra), the upper age range will grow accordingly |

The app is intentionally simple — no accounts, no logins, no ads. A child can open a browser and start practicing in under 30 seconds.

---

## User Personas

### Maya — Age 6, Kindergarten
Maya is just starting to add single-digit numbers. She uses her fingers to count and needs to see the numbers clearly. She benefits from the Beginner level (0–9) and the addition scratchpad's place value layout.

### Jordan — Age 9, 3rd Grade
Jordan knows addition and subtraction well and is working on multiplication tables. He likes to challenge himself and switches between Times Tables mode (to drill a specific table) and Random mode (to mix it up). He rarely uses the scratchpad but likes knowing it's there.

### Priya — Age 11, 5th Grade
Priya is working on long division with remainders and is starting fractions. She uses the Expert difficulty level and relies on the long division scratchpad to work through multi-step problems. She's the reason fractions and decimals are on the roadmap.

---

## Goals

1. **Make independent practice possible** — a student can use the app without a parent sitting next to them
2. **Mirror pencil-and-paper work** — scratchpads replicate the layouts students use in class
3. **Encourage persistence without shame** — Try Again and Peek options let students work through problems without feeling stuck or embarrassed
4. **Scale with the student** — five difficulty levels mean the app stays useful from Kindergarten through middle school
5. **Stay distraction-free** — no ads, no accounts, no gamification that pulls focus away from math

---

## Non-Goals

- This is **not** a full curriculum platform — it does not track progress over time, assign homework, or generate reports for teachers (yet)
- This is **not** a game — there are no points systems, leaderboards, or reward animations beyond a simple encouraging message
- This is **not** a tutoring tool — it does not explain *how* to solve problems (the scratchpads help students work through problems themselves)
- This is **not** monetized — it is a free personal project with no plans for paid tiers at this time

---

## Core User Journey

```
Open learningmathwithme.com
        │
        ▼
Enter name (optional) → Select experience level → Select operation → GO
        │
        ▼
Select number of problems (10 / 25 / 50 / 100)
[Multiplication: select Times Tables or Random, then pick a table or count]
        │
        ▼
Problem appears on flashcard
        │
        ├── Type answer in input box (or work it out in the scratchpad first)
        │
        ▼
Click Check
        │
        ├── Correct on first try → ✅ feedback → Next problem
        │
        ├── Wrong → ❌ feedback
        │       ├── Try Again → re-enter answer
        │       └── Peek at Answer → answer revealed, marked incorrect → Next
        │
        └── Last problem → See Results
                │
                ▼
        Summary screen: score / percentage / encouraging message
                │
                ├── Play Again (same settings)
                └── Change Settings (back to home form, settings preserved)
```

---

## Feature Inventory (v1.0)

### Operations
| Operation | Notes |
|---|---|
| Addition | Beginner uses single digits (0–9); all other levels use experience range |
| Subtraction | Always produces non-negative result; zero allowed |
| Multiplication | Times Tables mode (0s–14s, all 15 problems in order) + Random mode |
| Division | No remainders at Beginner/Intermediate; remainders introduced at Advanced+ |

### Difficulty Levels
| Level | Max Number |
|---|---|
| Beginner | 20 (Addition: 0–9) |
| Intermediate | 50 |
| Advanced | 100 |
| Proficient | 250 |
| Expert | 999 |

### Scratchpads
| Operation | Layout |
|---|---|
| Addition | Column layout (Th, H, T, O) with carry row and place value legend |
| Subtraction | Same column layout with borrow row |
| Multiplication | Stacked layout with carry row, partial product rows (add/remove), total row |
| Division | Long division house layout with step-by-step divide/multiply/subtract/bring-down fields |

All scratchpads auto-fill the problem numbers, auto-clear on next problem, and feed their answer row back as a fallback if the answer input is left blank.

### Session Features
- Problem count selector: 10, 25, 50, or 100 problems
- Instant correct/wrong/peeked feedback after each answer
- Running score displayed throughout the session
- Session summary with score, percentage, and tiered encouraging message
- Settings preserved when returning to the home screen

### Platform
- Fully responsive — works on desktop, tablet, and mobile
- No login, no account, no data stored
- Loads in a browser, works offline after initial load (static files)

---

## Roadmap

### Phase 2 — Expanded Operations
- [ ] **Decimals** — addition, subtraction, multiplication, division with decimal numbers
- [ ] **Money math** — problems framed in dollars and cents (e.g., $3.75 + $1.50)
- [ ] **Fractions** — addition, subtraction, multiplication, division of fractions
- [ ] **Step-by-step help modules** — explanations of *how* to solve fraction and decimal problems (not just practice)

### Phase 3 — Progress & Personalization
- [ ] **Backend / progress tracking** — save session results across visits
- [ ] **User accounts** — named profiles so multiple children can use the same device
- [ ] **Session history** — view past scores and improvement over time

### Phase 4 — Polish & Accessibility
- [ ] **Accessibility improvements** — ARIA labels, full keyboard navigation, screen reader support
- [ ] **Sound effects and animations** — audio/visual feedback for correct and incorrect answers
- [ ] **Print mode** — generate a printable worksheet from the same problem set

### Future Considerations
- Algebra basics (order of operations, simple equations)
- Teacher/parent dashboard for assigning practice and viewing results
- Expanded age range as curriculum grows beyond 6th grade

---

## Technical Constraints & Decisions

| Constraint | Decision |
|---|---|
| No backend today | Fully static React app; all state is in-memory per session |
| Free hosting | AWS S3 + CloudFront; estimated cost < $1/month |
| No build complexity | Vite for fast builds and dev server; plain CSS (no framework) |
| CI/CD gate | Tests must pass before any deploy; GitHub Actions blocks on test failure |
| No tracking | No analytics, no cookies, no third-party scripts |

---

## Development Philosophy

- **AI-assisted development** — this project is intentionally used as a learning vehicle for AI development tools (Amazon Q Developer, Kiro). Each phase is an opportunity to explore new AI-assisted workflows.
- **Iterative growth** — the app started as a single-operation AngularJS desktop tool and has grown feature by feature. Each phase adds a meaningful chunk of value without breaking what already works.
- **Keep it simple** — the UI is intentionally minimal. The student's focus should be on the math, not the interface.

---

*Product document created May 2026.*
