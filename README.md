# Advance Framework Playwright

Advanced Playwright automation framework with TypeScript, browser-specific execution, custom reporting, validation rules, and GitHub Actions CI.

## Project Structure

```text
Advance-Framework-Playwright/
  .cursor/
    rules/
      test-validation.mdc
  .github/
    instructions/
      test-validation.instructions.md
    workflows/
      playwright.yml
    copilot-instructions.md
  docs/
    phase1/
      prompt.md
  phase1/
    README.md
  src/
    api/
    config/
    fixtures/
    pages/
    testdata/
    tests/
      example.spec.ts
    utils/
      CustomReporter.ts
  AGENTS.md
  CLAUDE.md
  Dockerfile
  eslint.config.mjs
  package-lock.json
  package.json
  playwright.config.ts
  README.md
  tsconfig.json
```

Generated output folders may also appear after running tests:

```text
allure-results/
playwright-report/
test-results/
testResults/
tta-report/
playwright-report.json
```

## Key Files

- `playwright.config.ts` - Playwright configuration, browser projects, reporters, base URL handling, trace, screenshot, and video settings.
- `tsconfig.json` - TypeScript configuration and path aliases.
- `eslint.config.mjs` - ESLint configuration for TypeScript and Playwright tests.
- `src/tests/` - Test case folder.
- `src/utils/CustomReporter.ts` - Custom TTA reporter.
- `phase1/README.md` - Phase 1 setup summary and completed work.
- `docs/phase1/prompt.md` - Phase 1 prompt log and completed conversation history.
- `.cursor/rules/test-validation.mdc` - Cursor rule for test validation.
- `.github/workflows/playwright.yml` - GitHub Actions workflow for CI.

## Path Aliases

The TypeScript config includes these aliases:

```text
@pages/*     -> ./src/pages/*
@modules/*   -> ./src/modules/*
@utils/*     -> ./src/utils/*
@fixtures/*  -> ./src/fixtures/*
@api/*       -> ./src/api/*
@config/*    -> ./src/config/*
@testdata/*  -> ./src/testdata/*
```

## Available Scripts

```powershell
npm run init:playwright
npm test
npm run test:ui
npm run test:chromium
npm run test:firefox
npm run test:debug
npm run test:e2e
npm run test:po
npm run test:lor
npm run test:report
npm run test:ci
npm run report
npm run validate
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run clean
npm run logger:winston
```

## Validation Rule

Whenever a test case is added or changed under `src/tests`, run:

```powershell
npm run validate
```

This runs:

```powershell
npm run typecheck
npm run lint
```

The same rule is documented for Cursor, Claude, generic agents, and GitHub Copilot.

## CI Flow

GitHub Actions runs this flow on push and pull request to `main` or `master`:

```text
npm ci
npm run validate
npx playwright install --with-deps
npx playwright test
```

The Playwright HTML report is uploaded as a workflow artifact.

## Reports

Configured report outputs:

- Playwright HTML report: `playwright-report/`
- JSON report: `playwright-report.json`
- Allure results: `allure-results/`
- Custom TTA report: `tta-report/`

## Phase 1

The Phase 1 implementation details are documented in [phase1/README.md](phase1/README.md).

The Phase 1 prompt log is documented in [docs/phase1/prompt.md](docs/phase1/prompt.md).
