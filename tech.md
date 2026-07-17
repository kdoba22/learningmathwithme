# Tech Document — Learning Math With Me

> This document captures the technical decisions behind the project — the *why* behind each choice, known trade-offs, technical debt, and decisions still to be made as the app grows.

---

## Table of Contents

1. [Project History & Migration](#1-project-history--migration)
2. [Tech Stack Decisions](#2-tech-stack-decisions)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Infrastructure Decisions](#4-infrastructure-decisions)
5. [Development Tooling](#5-development-tooling)
6. [Coding Conventions](#6-coding-conventions)
7. [Known Technical Debt](#7-known-technical-debt)
8. [Future Technical Decisions](#8-future-technical-decisions)

---

## 1. Project History & Migration

### Original: AngularJS Desktop App
The first version of this application was a desktop app built with AngularJS. It was a single-purpose tool covering basic arithmetic (addition, subtraction, multiplication, division) for one user. It was never intended to be public-facing or scalable.

### Current: React Web App
The rebuild was motivated by three things:
1. **Modernize the stack** — AngularJS is end-of-life (support ended December 2021). React is the dominant UI library with a large ecosystem and long-term support.
2. **Move to the web** — a browser-based app works on any device without installation, making it accessible to more kids.
3. **Learn AI-assisted development** — the rebuild is intentionally used as a hands-on learning project for AI development tools (Amazon Q Developer, Kiro).

---

## 2. Tech Stack Decisions

### React 19
**Chosen over:** Angular, Vue, Svelte, plain JavaScript

**Why React:**
- Largest ecosystem and community for a JavaScript UI framework
- Component model maps naturally to the flashcard/scratchpad UI pattern (each operation is a self-contained component)
- Familiarity goal — React is the most in-demand frontend skill, making this project a useful learning vehicle
- React 19 is the current stable release with no breaking changes expected in the near term

**Trade-offs:**
- More boilerplate than Vue or Svelte for simple components
- No built-in routing (handled with state — see Architecture Decisions)

---

### Vite 7
**Chosen over:** Create React App (CRA), Next.js, Parcel

**Why Vite:**
- Significantly faster dev server startup and hot module replacement than CRA (which uses Webpack)
- CRA is no longer actively maintained by the React team
- Next.js was overkill — this is a fully static app with no server-side rendering, API routes, or dynamic routing needs
- Vite's native ESM approach aligns with the project's ES module setup
- Vitest (the test runner) is built on Vite, so the test and build configs share the same tool

**Trade-offs:**
- Slightly less mature ecosystem than Webpack for edge cases
- No SSR/SSG if that becomes needed later (would require migrating to Next.js or Remix)

---

### Plain CSS
**Chosen over:** Tailwind CSS, CSS Modules, styled-components, Sass

**Why plain CSS:**
- The UI is simple enough that a CSS framework adds more complexity than it removes
- Co-located `.css` files per component keep styles easy to find and reason about
- No build-time dependencies or configuration needed
- Keeps the focus on learning React and AI tooling, not CSS tooling

**Trade-offs:**
- No design system or utility classes — styles are written from scratch
- Global class name collisions are possible as the project grows (mitigated by component-specific class naming)
- If the project grows significantly, CSS Modules or a utility framework may become worth adopting

---

### Vitest + React Testing Library
**Chosen over:** Jest, Cypress, Playwright

**Why Vitest:**
- Native Vite integration — no separate Babel/Jest config needed
- Identical API to Jest, so existing Jest knowledge transfers directly
- Runs in jsdom environment for component testing without a real browser

**Why React Testing Library over Enzyme:**
- Tests behavior from the user's perspective (what renders, what happens on click) rather than implementation details (component internals)
- Actively maintained; Enzyme is largely abandoned for React 17+
- Encourages accessible markup (queries by role, label, text)

**Why not Cypress/Playwright:**
- End-to-end tests are not yet in scope for this project
- The component and unit test coverage provided by Vitest + RTL is sufficient for the current feature set

---

### JavaScript (not TypeScript)
**Chosen over:** TypeScript

**Why JavaScript:**
- Reduces setup complexity for a solo project
- The component props are simple enough that PropTypes or JSDoc comments provide adequate documentation
- Faster iteration without type compilation step

**Future consideration:** TypeScript becomes more valuable as the codebase grows and more contributors join. Migration is straightforward with Vite — this is a likely Phase 3 or 4 addition.

---

## 3. Architecture Decisions

### Client-Side State Routing (no React Router)
**Decision:** Navigation between screens is controlled by `useState` in `App.jsx`, not a routing library.

**Why:**
- The app has a very shallow navigation tree: home → flashcard session → summary → home
- No URL-based navigation is needed (there are no shareable links to specific sessions)
- No React Router means no dependency to maintain and no URL bar changes that could confuse young users
- Each flashcard component manages its own internal screen flow (problem count selector → active session → summary)

**Trade-offs:**
- Browser back button does not work as expected (pressing back exits the app, not the session)
- Deep linking to a specific operation or difficulty level is not possible
- If the app grows to include a home page, help pages, or user account pages, React Router will need to be added

---

### Local State Only (no global state library)
**Decision:** All state is managed with `useState` and `useRef` inside individual components. No Redux, Zustand, Context API, or other global state solution.

**Why:**
- The app has no shared state that needs to be accessed across unrelated components
- Settings flow top-down from `App.jsx` → flashcard component via props
- Session state (score, current problem, feedback) is entirely local to each flashcard component and reset on each new session
- Adding a state library would be premature optimization for the current scope

**Trade-offs:**
- If progress tracking is added (Phase 3), a global state solution or server-side persistence will be needed
- Prop drilling could become an issue if component nesting deepens significantly

---

### No Backend (fully static)
**Decision:** The app is a static React SPA with no API, database, or server-side logic.

**Why:**
- No user data needs to persist between sessions in v1.0
- Static hosting on S3 + CloudFront is essentially free and infinitely scalable for this traffic level
- Eliminates an entire category of complexity (auth, APIs, databases, server maintenance)

**Trade-offs:**
- Session results are lost when the browser tab is closed
- No cross-device progress — a student's history on a tablet is not visible on a desktop
- Phase 3 (progress tracking, user accounts) will require introducing a backend

---

## 4. Infrastructure Decisions

### AWS S3 + CloudFront + Route 53
**Chosen over:** Netlify, Vercel, GitHub Pages, Firebase Hosting

**Why AWS:**
- Primary motivation: hands-on learning with AWS services
- Full control over CDN behavior, cache headers, and error responses
- Custom domain with HTTPS via ACM is straightforward
- Cost is negligible (< $1/month) for this traffic level
- When a backend is added (Phase 3), AWS has a natural path: Lambda, API Gateway, DynamoDB, Cognito

**Trade-offs:**
- More setup than Netlify or Vercel (which handle CDN, HTTPS, and deploys automatically)
- Requires managing IAM permissions and GitHub secrets manually
- CloudFront cache invalidation adds a step to every deploy (handled automatically in the CI/CD pipeline)

### Cache Strategy
- **Hashed JS/CSS assets:** `max-age=31536000, immutable` — Vite appends content hashes to filenames, so these files can be cached forever by browsers and CDN
- **index.html:** `no-cache, no-store, must-revalidate` — always fetched fresh so browsers pick up new asset hashes on each deploy

### GitHub Actions CI/CD
**Decision:** Tests must pass before any deploy. A failing test blocks the entire pipeline.

**Why:** Prevents broken code from reaching production. Since this is a live app used by real kids, a broken deploy is a bad experience. The test gate is a hard stop, not a warning.

---

## 5. Development Tooling

### ESLint
Configured with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`. Enforces React hooks rules and catches stale closures. Run with `npm run lint`.

### Node.js Version
CI/CD pipeline uses Node.js 20 (LTS). Local development should match. Minimum supported version is Node 18.

### Package Management
`npm` with a committed `package-lock.json`. CI uses `npm ci` (clean install from lock file) to ensure reproducible builds. Do not use `yarn` or `pnpm` without updating the CI workflow.

---

## 6. Coding Conventions

### Component Structure
- One component per file
- Co-located CSS file for each component that has styles (e.g., `Button.jsx` + `Button.css`)
- Shared/cross-component styles in dedicated files (`Scratchpad.css`, `AdditionFlashcard.css` used by multiple flashcard components)

### Naming
- Components: PascalCase (`AdditionFlashcard`, `SummaryScreen`)
- Files: match component name exactly (`AdditionFlashcard.jsx`)
- CSS classes: kebab-case (`flashcard-container`, `answer-input`)
- Utility functions: camelCase (`getMaxNumber`)

### Props
- Callback props prefixed with `on` (`onStart`, `onBack`, `onSelect`)
- Boolean props use positive framing where possible (`hidden` rather than `visible` for the scratchpad toggle is a current exception — worth revisiting)

### State
- State variables named for what they hold, not how they're used (`feedback` not `feedbackState`)
- Reset functions named `startSession` or `applyReset` to make intent clear

---

## 7. Known Technical Debt

| Item | Description | Priority |
|---|---|---|
| Profanity filter | `UserForm.jsx` has a hardcoded placeholder list (`["badword1", "badword2", "badword3"]`). Not a real filter. | Low — name field is optional and low-risk |
| No PropTypes | Component props are not validated with PropTypes or TypeScript. Errors surface at runtime, not build time. | Medium — add PropTypes or migrate to TypeScript in Phase 3 |
| CSS class collisions | Plain CSS with global class names. No scoping mechanism. Risk grows as more components are added. | Medium — consider CSS Modules in Phase 2 |
| `AdditionFlashcard.css` naming | Used as shared flashcard styles across multiple components but named after one operation. Misleading. | Low — rename to `Flashcard.css` or `shared.css` |
| No error boundaries | No React error boundaries. An unhandled error in a flashcard component will crash the entire app. | Medium — add a top-level error boundary in Phase 2 |
| Browser back button | Pressing the browser back button exits the app rather than navigating back within it. | Low — acceptable for now; needs React Router to fix properly |

---

## 8. Future Technical Decisions

These decisions don't need to be made now but will need to be addressed as the roadmap progresses.

### Phase 2 — Decimals, Money, Fractions
- **Fraction rendering:** Plain text (`3/4`) vs. a math rendering library (KaTeX, MathJax). KaTeX is lightweight and purpose-built; worth evaluating when fractions are scoped.
- **Money formatting:** Use `Intl.NumberFormat` (built-in) for currency display rather than a third-party library.
- **Scratchpad complexity:** Fraction and decimal scratchpads will be more complex than current ones. May need to revisit the scratchpad architecture.

### Phase 3 — Progress Tracking & User Accounts
- **Backend options:** AWS Lambda + API Gateway + DynamoDB is the natural path given the existing AWS infrastructure. Alternatively, a managed BaaS like Supabase or Firebase would be faster to set up.
- **Authentication:** AWS Cognito (stays in AWS ecosystem) vs. Auth0 vs. Supabase Auth. For a kids' app, parent-managed accounts are likely the right model.
- **State management:** Once session data needs to persist and be shared across components (e.g., a dashboard showing history), a global state solution will be needed. Zustand is the current preference — lightweight, no boilerplate, works well with React.
- **TypeScript migration:** Phase 3 is the right time to migrate. The codebase will be large enough that type safety pays off, and the addition of API calls and shared data models makes types especially valuable.

### Phase 4 — Accessibility & Polish
- **ARIA audit:** A full accessibility review will be needed before claiming WCAG compliance. Automated tools (axe, Lighthouse) catch ~30% of issues; manual testing with a screen reader is required for the rest.
- **Animation library:** If sound effects and animations are added, evaluate whether plain CSS animations are sufficient or if a library like Framer Motion is warranted.

---

*Tech document created May 2026.*
