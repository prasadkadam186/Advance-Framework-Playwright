# Agent Instructions

## Test Case Validation

When adding or modifying Playwright test cases under `src/tests`, run validation before considering the change complete:

```powershell
npm run validate
```

`npm run validate` runs:

```powershell
npm run typecheck
npm run lint
```

Fix any TypeScript or ESLint errors before handing off the change.
