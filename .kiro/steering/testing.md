# Testing Standards

## Rules

1. **New code always gets tests.** Any new component, utility function, or non-trivial logic must have a corresponding test file written at the same time. Do not deliver new code without tests.

2. **Run tests after every change.** After any code change, run `npm test -- --run` from the project root to verify nothing is broken before presenting the result.

3. **Fix broken tests automatically.** If a change breaks an existing test, fix the test (or the code, whichever is wrong) before finishing. Never leave the test suite in a failing state.

4. **Test file location.** All test files live in `src/test/`. Name them to match the file under test:
   - Component: `src/components/MyComponent.jsx` → `src/test/MyComponent.test.jsx`
   - Utility: `src/utils/myUtil.js` → `src/test/myUtil.test.js`

5. **What to test.** Focus on behavior, not implementation:
   - Utility functions: test all input/output cases including edge cases
   - Components: test what renders, what happens on user interaction, and prop variations
   - Do not test internal state directly — test what the user sees and does

6. **Test runner.** Use Vitest with React Testing Library. Query by role, label, or visible text — not by class name or test IDs unless unavoidable.
