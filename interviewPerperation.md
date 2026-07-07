# Playwright QA Automation Engineer — Interview Preparation
### Target profile: ~3.5 years experience | Role: QA Automation (Playwright)

> Every theory/HR/scenario question below has a **Model Answer** (what to hit conceptually) and a **Real-Life Example** (a first-person line you can adapt from your own project). Interviewers score concrete numbers and named incidents far higher than textbook definitions — steal the structure, swap in your own project's details, don't recite verbatim.

---

## Table of Contents
1. [HR / Behavioral Questions](#part-1-hr--behavioral-questions)
2. [Technical Round — Theory Questions](#part-2-technical-round--theory-questions)
3. [Technical Round — Programming / Coding Questions](#part-3-technical-round--programming--coding-questions)
4. [Scenario-Based / Judgment Questions](#part-4-scenario-based--judgment-questions)
5. [Quick Reference Cheat-Sheet](#part-5-quick-reference-cheat-sheet)

---

## Part 1: HR / Behavioral Questions

**1. Walk me through your current project and your role in the automation framework.**
- **Model Answer:** Give scope (domain, team size), your specific ownership (not "the team did"), the stack, and one measurable outcome.
- **Example:** "I work on an e-commerce checkout platform, team of 5 QAs. I own the Playwright framework end-to-end — POMs, fixtures, CI pipeline. Over 8 months I grew it from 40 to 300+ tests and cut regression cycle time from 2 days of manual testing to a 25-minute automated run."

**2. What's the size of the team, and how do you split automation work?**
- **Model Answer:** Explain the split logic — by module/feature ownership, or by layer (API vs UI), plus how you avoid duplicate/overlapping coverage.
- **Example:** "5 QAs, each owns 1-2 feature modules end-to-end — I own checkout and payments. We split via a shared coverage tracker in Jira so nobody double-covers the same flow, and I review PRs for the payments-adjacent modules since I know that domain best."

**3. Tell me about a time a test you automated caught a real production bug.**
- **Model Answer:** Name the specific bug, how the test caught it (not manual QA), and the business impact of catching it pre-release.
- **Example:** "A nightly regression test on discount-code application caught a bug where a percentage discount was applied twice when a user changed quantity after applying the code — would've caused real revenue loss. It shipped in a hotfix branch and my test failure blocked that branch from merging to main."

**4. Tell me about a time your automation gave a false positive/negative — what did you do?**
- **Model Answer:** Own the mistake, explain root cause, and the fix — this is a flakiness/root-cause-analysis question in disguise.
- **Example:** "A test asserted a success toast appeared, but the locator matched a leftover toast from a previous unrelated test's async operation that hadn't fully unmounted. It was a false pass for weeks. I fixed it by asserting on toast text specific to the action and by ensuring `page.close()` state didn't leak between tests using fresh contexts."

**5. How do you decide what to automate vs leave manual?**
- **Model Answer:** Risk × frequency × stability. High-frequency regression paths and business-critical flows first; one-off exploratory, visually-subjective, or still-churning UI gets manual/deprioritized.
- **Example:** "I automated the checkout flow first because it runs on every release and touches revenue directly. I intentionally left our A/B test preview tool manual because the UI changes weekly and the ROI on maintaining that automation would be negative."

**6. Describe a disagreement with a developer over a bug you reported. How was it resolved?**
- **Model Answer:** Show you argue with evidence (repro steps, trace/video), not opinion, and that you can be wrong gracefully.
- **Example:** "A dev said my failing test was 'testing an edge case that doesn't matter.' I pulled the trace showing it was actually a common cart-abandonment path per our analytics, shared the funnel data, and we agreed it was P1. Another time I was wrong — my test asserted an outdated requirement — I closed my own bug once I saw the updated spec."

**7. How do you handle tight deadlines when the regression suite is large and time is short?**
- **Model Answer:** Prioritize by risk (tag-based smoke subset), communicate trade-offs to stakeholders instead of silently skipping coverage, and consider parallelization/sharding to fit the window.
- **Example:** "Before a hotfix release with a 2-hour window, I ran only the `@smoke` and `@payments` tagged subset (12 minutes on 4 shards) instead of the full 45-minute suite, and explicitly told the release manager which modules weren't covered so it was a visible decision, not a silent gap."

**8. What's your experience mentoring juniors or reviewing their test code?**
- **Model Answer:** Give a specific review habit (e.g., locator strategy, avoiding hard waits) and how you taught it, not just "I review PRs."
- **Example:** "I onboarded a junior who kept using `page.waitForTimeout()` to fix flakiness. Instead of just fixing it myself, I paired with him to find the actual condition to wait on using Trace Viewer, so he could apply that diagnosis pattern independently afterward."

**9. Why are you looking to switch roles now?**
- **Model Answer:** Forward-looking and specific (growth, tech stack, scope) — never frame as "escaping" a bad situation, even if true.
- **Example:** "I've taken our current framework about as far as the project's scope allows — I want a role with a larger, more complex application and API-testing surface where I can grow into ownership of test strategy, not just execution."

**10. Where do you see gaps in your current framework that you'd want to improve?**
- **Model Answer:** Show self-awareness and technical judgment — naming a real limitation signals maturity, not weakness.
- **Example:** "We don't have visual regression testing yet — some CSS-only bugs slip through because nothing asserts on layout, only text/functionality. I've prototyped `toHaveScreenshot()` on a few pages but haven't rolled it out because of cross-OS rendering diffs in CI I still need to tune `maxDiffPixelRatio` for."

---

## Part 2: Technical Round — Theory Questions

### A. Playwright Fundamentals

**1. What is Playwright, and how is it different from Selenium and Cypress?**
- **Model Answer:** Playwright is a Node.js (also Python/Java/.NET) browser automation library built by Microsoft, communicating with browsers over a single WebSocket protocol (CDP for Chromium, custom for Firefox/WebKit) rather than the W3C WebDriver wire protocol Selenium uses. This gives faster, more reliable execution and built-in auto-waiting. Vs Cypress: Playwright supports true multi-tab/multi-origin/multi-browser (including Safari/WebKit) testing and runs outside the browser sandbox, while Cypress runs inside the browser and historically struggled with multi-tab and cross-origin scenarios.
- **Example:** "We migrated from Selenium to Playwright specifically because of auto-waiting — our Selenium suite had ~200 explicit `WebDriverWait` calls scattered everywhere, and flaky failures dropped by roughly 70% after the migration since actionability checks are built in."

**2. What browser engines does Playwright support?**
- **Model Answer:** Chromium, Firefox, and WebKit (Safari's engine) — meaning you get real Safari-engine coverage on Linux CI without needing a Mac, unlike Selenium which needs an actual Safari/macOS machine.
- **Example:** "We caught a WebKit-only CSS flexbox bug in CI using the `webkit` project — something we'd never have found without a Mac in our old Selenium setup."

**3. Explain `Browser`, `BrowserContext`, and `Page`.**
- **Model Answer:** `Browser` is one launched browser process. `BrowserContext` is an isolated, incognito-like session (own cookies/storage/cache) — cheap to create, many contexts per browser. `Page` is a tab within a context. Test isolation in Playwright Test comes from a fresh context per test by default.
- **Example:** "For a multi-user chat test I launched one `Browser`, then two separate `BrowserContext`s — one per user — each with its own `storageState`, so I could simulate a real two-user conversation in a single test without cookie collisions."

**4. Why does each test get its own `BrowserContext`?**
- **Model Answer:** Ensures test isolation — no shared cookies/localStorage/cache bleeding state between tests, which is what causes "works alone, fails in the full suite" bugs.
- **Example:** "Before I understood this, we had reused a single `page` across tests in a describe block to save time — one test's leftover login session caused a completely unrelated test two files later to silently pass against the wrong user. Isolating contexts per test eliminated that class of bug entirely."

**5. Playwright Test vs Playwright Library — what's the difference?**
- **Model Answer:** Playwright Library (`playwright` package) is the raw automation API — you build your own test runner, fixtures, and reporting. Playwright Test (`@playwright/test`) is the full test framework built on top: fixtures, parallelization, retries, config, reporters, trace on failure, all included.
- **Example:** "Early on I evaluated just using the Library with Jest as the runner, but switched to `@playwright/test` because built-in parallel workers, trace-on-retry, and `projects` config for cross-browser saved us from re-inventing all of that ourselves."

**6. Can Playwright test mobile web? How is device emulation done?**
- **Model Answer:** Playwright emulates mobile viewport, user agent, touch events, and device scale factor via the `devices` registry (e.g., `devices['iPhone 13']`) applied per project in config — it's emulation of a mobile *browser*, not a real device/app (for that you'd need Appium).
- **Example:** "We added a `Pixel 5` and `iPhone 13` project to our config to catch a responsive-menu bug that only appeared under 400px viewport width — caught it in CI before it reached a real device lab."

**7. What languages does Playwright support, and which do you use, why?**
- **Model Answer:** TypeScript/JavaScript, Python, Java, .NET — all share the same underlying engine/API design. Choice usually follows the team's existing stack for easier collaboration with devs.
- **Example:** "We use TypeScript because our frontend devs also write TS — it means devs can read and even contribute to test locators/POMs without context-switching languages, and we share `tsconfig` path aliases with the app repo conventions."

### B. Locators

**8. What locator strategies does Playwright support?**
- **Model Answer:** `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByTestId`, `getByTitle`, `getByAltText` (user-facing/semantic), plus CSS and XPath as escape hatches.
- **Example:** "On our forms, `getByLabel` alone covers about 80% of our input locators because our design system already enforces proper `<label>` associations for accessibility — automation benefited for free from the accessibility work."

**9. Why does Playwright recommend user-facing locators over CSS/XPath?**
- **Model Answer:** User-facing locators track what an actual user perceives (role, text, label) rather than implementation details (class names, DOM depth) that change with every refactor/redesign — resilience to non-functional changes.
- **Example:** "During a Tailwind CSS migration, every class-based selector in our old suite broke — over 60 tests. The handful of tests already using `getByRole`/`getByTestId` survived untouched, which is what convinced the team to standardize on them going forward."

**10. Difference between `locator()` and the older `page.$()`/`page.$$()` ElementHandle APIs?**
- **Model Answer:** `locator()` is lazy — it re-queries the DOM every time you act on it, so it naturally survives re-renders and has built-in auto-waiting/retrying. `ElementHandle` (`$`/`$$`) is a snapshot reference to a specific DOM node at query time — if the DOM re-renders, the handle can go stale. Playwright docs now discourage ElementHandle for most use cases.
- **Example:** "We had a flaky test where a React re-render after an API call detached the old element referenced by an `ElementHandle`, causing a 'element is not attached to the DOM' error. Switching to `Locator` fixed it immediately since it re-resolves on each action."

**11. Explain locator chaining — `.filter()`, `.and()`, `.or()`, `.first()`, `.last()`, `.nth()`.**
- **Model Answer:** These narrow a locator that initially matches multiple elements down to exactly one, without writing complex CSS/XPath. `.filter({hasText})` narrows by content, `.and()` combines conditions, `.or()` matches either, `.nth()/.first()/.last()` pick by position.
- **Example:** "On a product listing page, instead of writing a brittle nth-child CSS selector to find 'the Add to Cart button inside the Wireless Mouse card,' I used `page.locator('li.product').filter({hasText: 'Wireless Mouse'}).getByRole('button', {name: 'Add to cart'})` — readable and resilient to list re-ordering."

**12. How do strict-mode violations happen, and how do you fix them?**
- **Model Answer:** Playwright locators throw "strict mode violation: resolved to N elements" when an action expects exactly one match but the locator matches multiple. Fix by narrowing with `.filter()`, a more specific role/testid, or explicit `.first()/.nth()` if multiple matches are genuinely expected.
- **Example:** "`page.getByRole('button', {name: 'Delete'})` matched 5 buttons on a table page — one per row. I fixed it by scoping to the specific row first: `page.getByRole('row', {name: orderId}).getByRole('button', {name: 'Delete'})`."

**13. What is auto-waiting/actionability? Which checks does Playwright run before clicking?**
- **Model Answer:** Before most actions, Playwright waits for the element to be attached, visible, stable (not animating), enabled, and able to receive events (not obscured by another element) — automatically, without explicit waits.
- **Example:** "We removed roughly 50 manual `waitForSelector` calls after realizing `.click()` already performs all these actionability checks internally — the manual waits were pure redundant boilerplate."

### C. Waits & Assertions

**14. Why avoid `page.waitForTimeout()`? When is it acceptable?**
- **Model Answer:** It's a blind, fixed-duration wait — too short causes flakiness, too long wastes CI time, and it doesn't actually assert on the real condition you care about. Acceptable rarely — e.g. debugging locally, or waiting out a fixed client-side animation/debounce with no observable DOM/network signal to hook into.
- **Example:** "We only kept one `waitForTimeout(300)` in the whole suite — for a CSS debounce on a search-as-you-type field with no loading indicator to hook into. Everywhere else we replaced timeouts with `waitForResponse` or web-first assertions, cutting suite flakiness noticeably."

**15. Difference between `waitForSelector`, `waitForLoadState`, `waitForResponse`, `waitForRequest`, `waitForURL`.**
- **Model Answer:** `waitForSelector` waits for a DOM element state (mostly superseded by locator auto-wait); `waitForLoadState` waits for page lifecycle events (`load`, `domcontentloaded`, `networkidle`); `waitForResponse`/`waitForRequest` wait on specific network traffic; `waitForURL` waits for navigation to a matching URL.
- **Example:** "For a 'Submit Order' flow where the button doesn't navigate but triggers a background API call, `waitForURL` wouldn't help — I used `waitForResponse` scoped to `/api/orders` to know the actual backend call had completed before asserting the confirmation UI."

**16. What are web-first (auto-retrying) assertions? How do they differ from generic assertions?**
- **Model Answer:** `expect(locator).toBeVisible()`-style assertions retry internally until the condition is true or timeout — matching Playwright's async, eventually-consistent UI model. Generic `expect(value).toBe()` checks a value once, synchronously, so it needs the value already resolved/stable.
- **Example:** "Switching a flaky `expect(await el.textContent()).toBe('Success')` (single snapshot, often caught mid-render) to `expect(el).toHaveText('Success')` (auto-retries up to the timeout) resolved a test that failed roughly 1 in 20 runs."

**17. What is `expect.soft()`, and when would you use it?**
- **Model Answer:** Soft assertions record failures but let the test continue running, aggregating all failures into one report at the end — useful when you want full visibility into everything wrong on a page instead of stopping at the first failed field.
- **Example:** "On a profile-page field-validation test with 8 fields, using `expect.soft` per field meant a single test run told us all 3 broken fields at once instead of us re-running the test 3 times to discover them one by one."

**18. What is `expect.poll()` used for?**
- **Model Answer:** Retries an arbitrary custom function (not just a locator) until it returns the expected value or times out — for asserting on things outside the DOM, like a database value or a custom API poll.
- **Example:** "We used `expect.poll()` to wait for an async backend job (report generation) to flip a status field in the DB from 'pending' to 'complete', since there was no UI element to assert on directly."

**19. How do you set a custom timeout for a single assertion vs globally?**
- **Model Answer:** Per-assertion via a second argument, e.g. `expect(locator).toBeVisible({ timeout: 10000 })`; globally via `expect: { timeout: ... }` in `playwright.config.ts`.
- **Example:** "Our global assertion timeout is 5s, but for a known-slow report-generation page I bumped just that one assertion to 20s rather than inflating the global timeout and masking real slowness elsewhere."

### D. Fixtures & Test Structure

**20. What are fixtures? Built-in vs custom.**
- **Model Answer:** Fixtures are Playwright Test's dependency-injection mechanism for setup/teardown — built-in ones (`page`, `browser`, `context`, `request`) are provided automatically; custom fixtures let you compose your own reusable setup (e.g., authenticated page, seeded test data, API client).
- **Example:** "We built an `apiClient` fixture that wraps `request` with our base URL and auth headers pre-set, so every API test just destructures `{ apiClient }` instead of re-configuring headers in every file."

**21. Fixture scope: `test` vs `worker`.**
- **Model Answer:** `test`-scoped fixtures run fresh per test (default); `worker`-scoped fixtures run once per worker process and are shared across all tests that worker executes — use for expensive setup safe to share (e.g., a DB connection), never for anything mutated per-test.
- **Example:** "We made our `dbConnection` fixture worker-scoped since opening a connection per test was slow and the connection itself is stateless/read-only — but kept `testUser` creation test-scoped since sharing a user across tests caused data collisions under parallel workers."

**22. How do you extend `test` with custom fixtures using `test.extend()`?**
- **Model Answer:** `base.extend<FixtureTypes>({ fixtureName: async ({ dependencies }, use) => { ...setup...; await use(value); ...teardown... } })`, then export the extended `test` for use across spec files.
- **Example:** "Our `fixtures/auth.fixture.ts` extends `page` into an `authedPage` — every checkout test imports this custom `test` instead of the base one, so authentication is a one-line dependency, not copy-pasted login code."

**23. What's the execution order when a fixture depends on another fixture?**
- **Model Answer:** Playwright resolves fixtures lazily and topologically — a fixture only runs when first requested (directly or as a dependency), and its dependencies are set up before it, torn down after, in reverse order.
- **Example:** "Our `authedPage` fixture depends on `apiClient` to log in via API rather than UI — Playwright automatically sets up `apiClient` first, then `authedPage` uses it, and tears both down in reverse order after the test."

**24. `beforeEach`/`afterEach` hooks vs fixture-based setup — when do you prefer one over the other?**
- **Model Answer:** Hooks are simple and file/describe-block scoped, fine for lightweight, non-reusable setup. Fixtures are preferred when setup is reusable across multiple spec files, needs cleanup guarantees even on failure, or needs to be composed/parameterized (e.g., different fixture per role).
- **Example:** "For a one-off 'navigate to page X' step used only in one file, I use `beforeEach`. For authentication used across 40+ spec files, that's a fixture — a `beforeEach` would mean copy-pasting login logic everywhere."

**25. What are `test.describe.serial()` and `test.describe.parallel()`?**
- **Model Answer:** `.serial()` forces tests within the block to run in file order, on the same worker, and stops the block on first failure (dependent steps in one flow) — `.parallel()` explicitly hints tests inside a describe block can run concurrently even within the same file (opt-in, since files already run in parallel workers by default at the top level).
- **Example:** "A multi-step wizard test suite (page 1 → page 2 → page 3 as separate `test()` blocks sharing state) uses `.serial()` since step 2 assumes step 1 already ran — but our independent CRUD tests within one file use `.parallel()` to speed up that specific file's run."

**26. What do `test.skip`, `test.fixme`, `test.slow`, `test.step()` do?**
- **Model Answer:** `skip` doesn't run the test (with optional condition/reason); `fixme` marks a known-broken test to skip while tracking it as a TODO; `slow` triples the timeout for a known-slow test instead of inflating the global timeout; `test.step()` groups actions into named steps for clearer trace/report output.
- **Example:** "I used `test.fixme('bug JIRA-482 — checkout total miscalculates with 3+ coupons', ...)` instead of just deleting the test, so it's tracked and automatically re-enabled once someone removes the `fixme` after the bug is fixed."

### E. Page Object Model & Framework Design

**27. How do you structure a Playwright framework for a mid/large project?**
- **Model Answer:** Layered separation: `pages/` (POMs — locators + actions, no assertions), `fixtures/` (reusable setup/DI), `tests/` (test logic + assertions), `config/` (env loading), `testdata/` (data files), `utils/` (helpers, logging, custom reporters), plus path aliases for clean imports.
- **Example:** "[Matches my current framework] — `pages/` for POMs, `fixtures/` for things like an authenticated-session fixture, `config/` for env-driven base URLs, `testdata/` for CSV/JSON/XLSX driven cases, and `utils/` for our custom reporter. A new joiner wrote their first passing test within a day because they only touched `tests/` and reused existing objects."

**28. How do you avoid a Page Object becoming a bloated "god class"?**
- **Model Answer:** Compose smaller component objects for shared/reused UI (header, nav, modal, table) rather than one page class owning every locator on the screen; keep POM methods to single, composable actions rather than giant end-to-end workflow methods.
- **Example:** "Our checkout page reused a `CartSummaryComponent` and an `AddressFormComponent` that also appeared independently on other pages — instead of duplicating those locators in every page class, each page composes the shared component objects."

**29. Should assertions live inside Page Objects or in the test file?**
- **Model Answer:** Generally in the test file — POMs should expose locators/actions (and maybe simple getters), keeping "what happened" (actions) separate from "what we expect" (assertions), so the same POM can be reused across tests with different expected outcomes.
- **Example:** "We had a `LoginPage.assertError()` method baked into the POM, but different tests expected different error messages for different invalid inputs — we refactored to expose `loginPage.errorMessage` as a locator and let each test assert on it, making the POM reusable across all the negative-login scenarios."

**30. How do you handle shared UI components across pages without duplicating locators?**
- **Model Answer:** Extract a component class (e.g., `HeaderComponent`, `NavComponent`) taking a `Page`/root `Locator`, instantiated inside each page object that includes it — composition over inheritance.
- **Example:** "Our `HeaderComponent` (search bar, cart icon, user menu) is instantiated inside every page object as `this.header = new HeaderComponent(page)` — one change to the header locators updates every page at once instead of a find-and-replace across 20 files."

**31. How do you manage environment-specific config across dev/QA/staging/prod?**
- **Model Answer:** `.env` files or CI secrets per environment, loaded via a config module keyed by an `ENV` variable, injected into `playwright.config.ts`'s `baseURL`/`use` block — never hardcoded URLs/credentials in test files.
- **Example:** "We run the exact same spec files against `dev`, `staging`, and `prod-smoke` just by changing `ENV=staging` before the CI job — our `config/` loader reads the right `.env.staging` file and the tests never reference an environment-specific string directly."

### F. Test Execution, Parallelism & Config

**32. Difference between `workers` and `shards`.**
- **Model Answer:** `workers` parallelize within a single machine/CI job (multiple worker processes running tests concurrently). `shards` split the whole test suite across multiple separate machines/CI jobs (e.g., `--shard=1/4`), each shard then possibly running its own multiple workers — sharding scales beyond one machine's CPU limits.
- **Example:** "Locally we run 4 workers on one machine (matches CPU cores). In CI we run 4 shards across 4 GitHub Actions runners, each running 2 workers — cutting our ~45-minute suite down to under 7 minutes wall-clock."

**33. How do `projects` in config enable cross-browser/multi-device runs?**
- **Model Answer:** Each `project` entry defines its own `use` overrides (browser, viewport, device, storageState) — the same test files run once per matching project, so one spec file yields Chromium+Firefox+WebKit (or desktop+mobile) coverage without duplicating test code.
- **Example:** "We added a `mobile-chrome` project using `devices['Pixel 5']` alongside our default `chromium` project — the exact same `checkout.spec.ts` now runs against both without a single line of test code duplicated."

**34. What does `retries` config do, and how is it different from fixing flakiness?**
- **Model Answer:** `retries` automatically re-runs a failed test up to N times, and Playwright captures trace/video on the retry — it's a mitigation for tolerating genuine environment-level flakiness in CI, not a substitute for diagnosing and fixing a badly-written flaky test. Over-relying on retries hides real bugs and slows CI.
- **Example:** "We set `retries: 2` in CI only, but I treat any test that actually needs its retry to pass as a bug ticket — we track retry-pass rate in our reports and any test above a 5% retry-pass rate gets investigated, not just tolerated."

**35. How do `grep`/tags let you run subsets of tests?**
- **Model Answer:** Tag tests in titles (e.g., `test('checkout total @smoke', ...)`) or use `test.info().annotations`, then run via `npx playwright test --grep @smoke` to execute only matching tests — lets one suite serve multiple purposes (fast smoke gate vs full nightly regression).
- **Example:** "Every PR triggers just `--grep @smoke` (40 tests, ~4 minutes) as a merge gate, while the full `@regression` tag set (300+ tests) runs nightly — this kept PR feedback fast without sacrificing full coverage."

**36. Effect of parallel execution on shared backend state — how do you avoid collisions?**
- **Model Answer:** Parallel workers can race on shared mutable data (same test user, same DB row) causing intermittent failures that look like flakiness but are actually data races. Fix with per-test/per-worker unique data generation, dedicated test tenants, or DB-level isolation.
- **Example:** "Two parallel tests both modified the same seeded 'Test User #1' cart and stepped on each other intermittently. We fixed it by generating a unique user per test run via the API instead of reusing static seeded users."

### G. Network, API Testing & Mocking

**37. How do you make pure API calls without a browser?**
- **Model Answer:** The `request` fixture (or standalone `APIRequestContext` via `request.newContext()`) issues HTTP calls directly — useful for API-only tests, or for fast test-data setup/teardown without going through the UI.
- **Example:** "We seed test data (create a test order via `request.post('/api/orders')`) instead of manually clicking through the UI to create it — cut a 45-second UI setup step down to under a second per test."

**38. Difference between `page.route()` and `context.route()`.**
- **Model Answer:** `page.route()` intercepts network requests for that one page/tab only; `context.route()` applies the interception across every page opened within that browser context (useful when a flow opens a popup/new tab that also needs the same mock).
- **Example:** "For a flow where clicking 'Pay' opens a popup for a third-party payment provider, I used `context.route()` so the mocked response also applied inside that popup page, not just the parent."

**39. `route.fulfill()` vs `route.continue()`.**
- **Model Answer:** `fulfill()` short-circuits the real network call entirely and returns a fake response you construct — for full stubbing. `continue()` lets the real request proceed, optionally modifying headers/postData first — for partial interception/observation.
- **Example:** "To test a payment-timeout UI state without hitting the real payment gateway, I used `fulfill()` to return a fake 504. To just log/inspect requests without changing behavior, I used `continue()` and read the request in a callback."

**40. How would you simulate a slow network or failed API call?**
- **Model Answer:** `route.fulfill()` with a delayed/errored response, `context.setOffline(true)`, or `page.route()` with an artificial `await new Promise(r => setTimeout(r, ms))` before fulfilling/continuing, to test loading states and error handling.
- **Example:** "We had a race condition where a loading spinner never disappeared if the API took over 3 seconds. I reproduced it deterministically by delaying the mocked response by 5s in `route.fulfill()`, which would've been nearly impossible to reproduce reliably against the real, fast backend."

**41. API stubbing for UI tests vs dedicated API tests — when do you use each?**
- **Model Answer:** Stub APIs in UI tests to isolate frontend behavior from backend variability/cost (esp. for edge cases like errors/timeouts hard to trigger for real). Write dedicated API tests to actually validate the backend contract itself — status codes, payload shape, business logic — independent of any UI.
- **Example:** "Our checkout UI tests mock the payment API to test the UI's error-handling branches, but we have a *separate* API-only test suite hitting the real payment service's staging endpoint to verify the actual contract/response schema hasn't changed — mocking would hide a real backend regression."

### H. Authentication & Session Management

**42. How do you avoid UI login before every test? Explain `storageState`.**
- **Model Answer:** Log in once (ideally via API, faster and more stable than UI), save cookies/localStorage via `context.storageState({ path })`, then reuse it with `test.use({ storageState: 'path.json' })` so every test starts already authenticated.
- **Example:** "Across 300 tests, UI login took ~4s each — 20 minutes of pure overhead. Logging in once via API in global setup and reusing `storageState.json` dropped total suite time from 35 to 12 minutes."

**43. `globalSetup` vs Playwright's project "setup dependency" pattern.**
- **Model Answer:** `globalSetup` (older pattern) is a single script run once before the whole suite, outside the test/fixture system — good for simple one-time work but has no access to fixtures/tracing. The newer "setup project" pattern defines a dedicated `setup` test file as its own `project` that other projects declare as a `dependency` — runs as a real (traced, reportable) test, better suited when the setup itself is complex or worth debugging.
- **Example:** "We migrated from a `globalSetup.ts` script to a dedicated `auth.setup.ts` project dependency because when login itself broke, `globalSetup` gave us a bare stack trace with no trace/video — the setup-project pattern gives us the same trace-on-failure tooling for setup as for regular tests."

**44. How would you test two different user roles efficiently in the same suite?**
- **Model Answer:** Separate `storageState` files per role (admin, standard user), either as separate `projects` in config or per-test `test.use({ storageState })` overrides, avoiding UI re-login for either role.
- **Example:** "We keep `admin.storageState.json` and `user.storageState.json` generated in setup — permission tests just switch `test.use({ storageState: 'admin.storageState.json' })` per describe block instead of logging in through the UI for every role-based test."

### I. Debugging & Tooling

**45. What is Trace Viewer, and what does it show?**
- **Model Answer:** A visual, step-by-step timeline of a test run — DOM snapshots before/after each action, network requests, console logs, and screenshots — lets you "time travel" through a failed run instead of guessing from a stack trace.
- **Example:** "A test failed with 'element not visible' and no obvious reason from the error message alone. Trace Viewer showed a cookie-consent banner had covered the button — invisible in CI's headless run logs but obvious once I stepped through the DOM snapshots."

**46. How do you use Playwright Inspector / `PWDEBUG=1` / `--debug`?**
- **Model Answer:** Launches the browser headed with a step-through inspector UI — lets you pause execution, step action-by-action, and try locators live in a "pick locator" tool.
- **Example:** "When a new hire couldn't figure out why their locator matched the wrong element, we ran `npx playwright test login.spec.ts --debug` together and used the inspector's 'pick locator' tool to see exactly what Playwright resolved live."

**47. What does Codegen do?**
- **Model Answer:** `npx playwright codegen <url>` opens a browser that records your manual clicks/inputs and generates corresponding Playwright code — useful for quickly scaffolding a new test or discovering good locators, not meant as final production test code.
- **Example:** "I use Codegen to quickly find the best `getByRole` locator for a tricky custom component, then hand-write the actual test using proper POM structure — I never commit raw Codegen output as-is."

**48. How do you capture screenshots/videos only on failure?**
- **Model Answer:** Config options `screenshot: 'only-on-failure'` and `video: 'retain-on-failure'` (or `'on-first-retry'`) — avoids bloating CI artifacts with passing-test media while still giving full failure diagnostics.
- **Example:** "Recording video for every test regardless of pass/fail was filling up our CI artifact storage quota within days — switching to `retain-on-failure` cut artifact size by over 90% with zero loss of debugging info."

**49. How do you debug a test that fails only in CI, not locally?**
- **Model Answer:** Check environment differences (headless vs headed, parallel worker count/shared state, timezone/locale, viewport, resource constraints causing timeouts), pull the CI trace/video artifacts, try reproducing headless + multi-worker locally before assuming it's "just CI flakiness."
- **Example:** "A test failed only in CI's 4-worker run. Running locally with `--workers=4` (instead of my usual serial debug run) reproduced it immediately — it was a DB row collision between two parallel tests, not a CI-specific issue at all."

### J. Advanced UI Handling

**50. How do you interact with elements inside an `<iframe>`?**
- **Model Answer:** `page.frameLocator(selector)` scopes subsequent locators to inside that iframe — regular `page.locator()` calls won't reach into iframe content.
- **Example:** "Our payment form is a third-party iframe. `page.frameLocator('iframe[title=\"Payment\"]').getByLabel('Card number')` let us fill it in exactly like any other field, once we knew to scope through `frameLocator` first."

**51. How do you access Shadow DOM elements?**
- **Model Answer:** Playwright pierces open shadow roots automatically for standard locators — no special API needed for open shadow DOM (closed shadow roots aren't accessible from any browser automation tool, including Playwright).
- **Example:** "Our design system uses web components with shadow DOM for a custom date picker. Locators worked without any special handling since the shadow root was open — I didn't need any Shadow-DOM-specific code at all, which surprised me coming from Selenium where this was painful."

**52. How do you handle native browser dialogs?**
- **Model Answer:** Register a `page.on('dialog', handler)` listener *before* the action that triggers it, then call `dialog.accept()`/`dialog.dismiss()` inside the handler — dialogs block the page otherwise and must be handled or the action hangs.
- **Example:** "A 'Delete Account' button triggers a native `confirm()`. Forgetting to register the listener before clicking caused the test to hang until timeout — moving the `page.on('dialog', ...)` registration above the click fixed it."

**53. How do you handle a new tab/popup?**
- **Model Answer:** `Promise.all([page.waitForEvent('popup'), triggeringAction])` — you must set up the wait *before* triggering the action that opens the tab, since it's a race otherwise.
- **Example:** "Our 'Open in new tab' link test used to occasionally fail because the click fired before the wait was registered — wrapping both in `Promise.all` fixed the race condition."

**54. How do you handle file upload and download?**
- **Model Answer:** Upload via `locator.setInputFiles(path)` on a file input (works even if visually hidden). Download via `Promise.all([page.waitForEvent('download'), triggeringAction])`, then inspect via `download.path()`/`download.suggestedFilename()`, optionally reading file contents for assertions.
- **Example:** "For a CSV export feature, after triggering download I read the saved file's contents with Node's `fs` module and asserted the header row matched expected columns — not just that a download happened, but that its content was correct."

**55. How do you handle dynamic dropdowns/autocomplete/infinite scroll?**
- **Model Answer:** For custom (non-`<select>`) dropdowns, click to open then `getByRole('option')` to select. For autocomplete, type partial text and wait for the option to appear before clicking (auto-wait handles this). For infinite scroll, loop scrolling and re-querying until the target element is found or a max-attempts guard is hit.
- **Example:** "For a city-autocomplete field, I typed 'Mum' then used `getByRole('option', {name: 'Mumbai'})` — Playwright's auto-wait handled waiting for the async suggestion list to populate without any manual delay."

### K. Visual & Cross-Browser Testing

**56. How does `toHaveScreenshot()` work, and how do you handle cross-OS/CI rendering diffs?**
- **Model Answer:** Captures a screenshot and pixel-diffs it against a stored baseline, failing if the difference exceeds a threshold. Font rendering/anti-aliasing differs across OS, so baselines are typically generated and compared within the same OS/CI environment (e.g., always inside the same Docker image), and thresholds (`maxDiffPixelRatio`/`maxDiffPixels`) absorb minor anti-aliasing noise.
- **Example:** "Our baselines generated on a dev's Mac failed constantly in Linux-based CI due to font rendering differences. We fixed it by generating and updating baselines only via a CI job running the same Docker image production CI uses, never locally."

**57. How do you run the same suite across Chromium/Firefox/WebKit and handle browser-specific quirks?**
- **Model Answer:** Define each as a `project` in config; for genuine browser-specific behavior differences, conditionally branch in the test using `test.skip(browserName === 'webkit', 'reason')` rather than maintaining separate spec files.
- **Example:** "A date-picker keyboard-navigation test behaved slightly differently in WebKit due to a real engine quirk. Rather than duplicate the whole spec file, I used `test.skip(browserName === 'webkit', 'WebKit handles arrow-key focus differently — tracked in JIRA-501')` to keep one source of truth."

### L. CI/CD & Reporting

**58. How do you integrate Playwright into CI? What does your pipeline look like?**
- **Model Answer:** Install deps + browsers (`npx playwright install --with-deps`), run tests (often sharded), publish HTML report + trace artifacts, gate PR merges on smoke-tag pass, notify on failure.
- **Example:** "Our GitHub Actions pipeline: install → run `--grep @smoke` on every PR (blocking merge) → run full suite sharded 4-ways nightly → merge blob reports into one HTML report → post pass/fail summary with report link to Slack."

**59. How do you run Playwright in Docker, and why?**
- **Model Answer:** Use Microsoft's official `mcr.microsoft.com/playwright` image (pre-installed browsers + correct OS deps) to guarantee identical browser rendering/behavior between local dev, CI, and visual-baseline generation — avoids "works on my machine" drift.
- **Example:** "Before Dockerizing, visual regression tests were unusable because every developer's local Chromium rendered fonts slightly differently. Standardizing on the official Playwright Docker image for all visual test runs and baseline generation eliminated that noise entirely."

**60. What reporters have you used? How do you make failures actionable?**
- **Model Answer:** Built-in HTML/JSON/JUnit/list reporters, or third-party (Allure) for richer dashboards, or a custom reporter to push failure summaries to Slack/Teams with a direct trace link — actionability matters more than the report format itself.
- **Example:** "We use the HTML reporter for local debugging plus a custom reporter that posts a Slack message on any CI failure with the failing test names and a direct link to the hosted HTML report — this cut the 'why did CI fail' back-and-forth in PR threads significantly."

**61. How do you merge reports when running sharded tests across multiple CI machines?**
- **Model Answer:** Each shard outputs a "blob" report; a separate merge step (`npx playwright merge-reports`) combines all shards' blobs into one unified HTML report after all shard jobs complete.
- **Example:** "Our 4-shard CI job each uploads a blob report as an artifact; a final `merge-report` job downloads all 4, merges them, and publishes one combined HTML report — so reviewers see one report, not four disconnected ones."

### M. Quality, Flakiness & Best Practices

**62. Most common root causes of flaky tests, and how do you diagnose them?**
- **Model Answer:** Race conditions (asserting before async work finishes), shared/mutable test data under parallelism, environment timing differences (CI slower than local), overly broad/unstable locators, and animation/transition timing. Diagnose via Trace Viewer/video rather than guessing, and reproduce with the same parallelism/headless settings as CI.
- **Example:** "Our top flaky test list at one point was dominated by tests using `waitForTimeout`. Auditing and replacing all of them with `waitForResponse`/web-first assertions was the single highest-leverage flakiness fix we made — measurable in our CI retry-pass-rate dashboard."

**63. How do you decide if a failure is a real bug vs flaky/environment issue before re-running blindly?**
- **Model Answer:** Check the trace/screenshot for the actual failure reason before re-running — a real assertion mismatch (wrong value, wrong text) is a bug; an infra/timeout-looking error with no logical failure is worth a targeted re-run, but should still be tracked if recurring.
- **Example:** "A test failed asserting a discount total. I checked the trace first — the actual applied discount value was wrong, not a timing issue — so instead of re-running, I filed it as a real bug, which is exactly what it turned out to be."

**64. How do you manage test data to keep tests independent and re-runnable?**
- **Model Answer:** Generate unique data per test run (timestamps/random suffixes) for creation flows, use API-based setup/teardown instead of relying on pre-seeded shared fixtures, and clean up created data after tests where feasible.
- **Example:** "Registration tests used to fail intermittently with 'email already exists' on reruns against a shared environment. Generating a unique email per run (`qa+${Date.now()}@test.com`) made every run fully independent and re-runnable without manual DB cleanup."

**65. What's your approach to code review for test automation PRs?**
- **Model Answer:** Check for: fragile locators (CSS/XPath where a role/testid would do), hard waits, assertions inside POMs, test independence (no reliance on execution order/shared state unless intentionally serial), meaningful test names/descriptions, and whether the PR duplicates existing POM/fixture logic.
- **Example:** "I blocked a PR that added a new `waitForTimeout(2000)` and a raw `.nth(3)` CSS locator — asked the author to use `waitForResponse` and a `getByTestId` locator instead, which is now a documented convention in our contributing guide."

**66. Have you used BDD (Cucumber) with Playwright? Trade-offs vs plain Playwright Test?**
- **Model Answer:** `playwright-bdd` or similar lets you write Gherkin `.feature` files mapped to Playwright step definitions — pro: business-readable specs, good for stakeholder collaboration; con: extra abstraction layer, step-matching indirection can slow debugging, and loses some native Playwright Test tooling (fixtures ergonomics, some reporter integrations) unless carefully wired up.
- **Example:** "We evaluated Cucumber for a project where BAs wanted to co-author scenarios, but decided against it for our current team since none of our stakeholders actually read the `.feature` files day-to-day — the added indirection wasn't worth it for a pure QA/dev audience. I'd reconsider it for a project with real cross-functional Gherkin authorship."

---

## Part 3: Technical Round — Programming / Coding Questions

> These are typical "open your editor / share your screen" tasks. Sample solutions use TypeScript with `@playwright/test`. The code itself is the expected answer — when presenting it live, narrate *why* you chose each API (e.g., "I'm using `waitForResponse` here instead of a timeout because...") since interviewers weight reasoning as much as syntax.

### 1. Launch a browser, navigate, and assert the title
```ts
import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});
```

### 2. Write a Page Object class for a login page
```ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.getByTestId('login-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### 3. Custom fixture that provides an authenticated page
```ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = { authedPage: import('@playwright/test').Page };

export const test = base.extend<Fixtures>({
  authedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(process.env.QA_USER!, process.env.QA_PASS!);
    await expect(page.getByTestId('dashboard')).toBeVisible();
    await use(page);
  },
});
export { expect };
```

### 4. Reuse login via `storageState` + global setup (avoid UI login every test)
```ts
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL + '/login');
  await page.getByLabel('Email').fill(process.env.QA_USER!);
  await page.getByLabel('Password').fill(process.env.QA_PASS!);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

// playwright.config.ts
export default {
  globalSetup: require.resolve('./global-setup'),
  use: { storageState: 'storageState.json' },
};
```

### 5. Handle a dropdown (native `<select>`)
```ts
await page.getByLabel('Country').selectOption({ label: 'India' });
```

### 6. Handle a custom (non-native) dropdown / autocomplete
```ts
await page.getByRole('combobox', { name: 'City' }).click();
await page.getByRole('option', { name: 'Mumbai' }).click();
```

### 7. Handle a new tab/popup opened by a click
```ts
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open in new tab' }).click(),
]);
await popup.waitForLoadState();
await expect(popup).toHaveURL(/checkout/);
```

### 8. Handle file upload
```ts
await page.getByLabel('Upload resume').setInputFiles('testdata/resume.pdf');
```

### 9. Handle file download and verify it
```ts
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download report' }).click(),
]);
const path = await download.path();
expect(download.suggestedFilename()).toBe('report.csv');
```

### 10. Handle an `<iframe>`
```ts
const frame = page.frameLocator('iframe[title="Payment"]');
await frame.getByLabel('Card number').fill('4111111111111111');
```

### 11. Handle a native `confirm()` dialog
```ts
page.on('dialog', async (dialog) => {
  expect(dialog.message()).toContain('Are you sure?');
  await dialog.accept();
});
await page.getByRole('button', { name: 'Delete account' }).click();
```

### 12. Mock an API response with `route.fulfill()`
```ts
await page.route('**/api/payment/process', (route) =>
  route.fulfill({
    status: 504,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Gateway Timeout' }),
  })
);
await page.getByRole('button', { name: 'Pay now' }).click();
await expect(page.getByText('Payment failed, please retry')).toBeVisible();
```

### 13. Wait for a specific network response before asserting
```ts
const [response] = await Promise.all([
  page.waitForResponse((res) => res.url().includes('/api/orders') && res.status() === 200),
  page.getByRole('button', { name: 'Place order' }).click(),
]);
expect(await response.json()).toMatchObject({ status: 'confirmed' });
```

### 14. Pure API test using `request` fixture (no browser)
```ts
import { test, expect } from '@playwright/test';

test('create user via API', async ({ request }) => {
  const res = await request.post('/api/users', {
    data: { name: 'Prasad', email: 'prasad@test.com' },
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.id).toBeDefined();
});
```

### 15. Data-driven test from a JSON file
```ts
import { test, expect } from '@playwright/test';
import users from '../testdata/users.json';

for (const user of users) {
  test(`login fails for invalid user: ${user.email}`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByTestId('login-error')).toHaveText(user.expectedError);
  });
}
```

### 16. Visual regression test
```ts
test('dashboard visual snapshot', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png', { maxDiffPixelRatio: 0.02 });
});
```

### 17. Extract and verify data from a dynamic table
```ts
const rows = page.locator('table#orders tbody tr');
const count = await rows.count();
for (let i = 0; i < count; i++) {
  const status = await rows.nth(i).locator('td.status').innerText();
  expect(['Pending', 'Shipped', 'Delivered']).toContain(status);
}
```

### 18. `playwright.config.ts` — cross-browser + sharding + retries
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html'], ['junit', { outputFile: 'results.xml' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```
Run sharded: `npx playwright test --shard=1/4`

### 19. Locator chaining/filtering — find a list item by text, then click a button inside it
```ts
await page
  .locator('li.product-card')
  .filter({ hasText: 'Wireless Mouse' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

### 20. Soft assertions — collect multiple failures in one test
```ts
test('profile page fields', async ({ page }) => {
  await page.goto('/profile');
  await expect.soft(page.getByLabel('Name')).toHaveValue('Prasad Kadam');
  await expect.soft(page.getByLabel('Email')).toHaveValue('prasad@test.com');
  await expect.soft(page.getByLabel('Role')).toHaveValue('QA Engineer');
  // all three are checked and reported even if one fails
});
```

### 21. Two users interacting simultaneously (multi-context test)
```ts
test('chat message delivered between two users', async ({ browser }) => {
  const adminCtx = await browser.newContext({ storageState: 'admin.json' });
  const userCtx = await browser.newContext({ storageState: 'user.json' });
  const adminPage = await adminCtx.newPage();
  const userPage = await userCtx.newPage();

  await adminPage.goto('/chat');
  await userPage.goto('/chat');
  await adminPage.getByLabel('Message').fill('Hello!');
  await adminPage.getByRole('button', { name: 'Send' }).click();

  await expect(userPage.getByText('Hello!')).toBeVisible();
});
```

### 22. Bug-fix exercise — spot the problem
```ts
// Given this failing/flaky test, what's wrong and how do you fix it?
test('add item to cart', async ({ page }) => {
  await page.goto('/shop');
  await page.click('.add-to-cart');
  await page.waitForTimeout(2000);
  const count = await page.textContent('.cart-count');
  expect(count).toBe('1');
});
```
**Expected answer:** `.add-to-cart` is a fragile class-based selector (likely matches multiple elements → strict mode issue or wrong item); `waitForTimeout` is a blind wait instead of waiting on the actual state change; `expect(count).toBe('1')` is a plain assertion with no auto-retry. Fixed version:
```ts
test('add item to cart', async ({ page }) => {
  await page.goto('/shop');
  await page.getByRole('listitem', { name: 'Wireless Mouse' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

### 23. Full E2E scenario — add to cart → checkout → order confirmation
```ts
test('end-to-end purchase flow', async ({ page }) => {
  await page.goto('/shop');
  await page.getByRole('listitem', { name: 'Wireless Mouse' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByLabel('Card number').fill('4111111111111111');
  await page.getByLabel('Expiry').fill('12/28');
  await page.getByLabel('CVV').fill('123');
  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/orders') && res.ok()),
    page.getByRole('button', { name: 'Place order' }).click(),
  ]);
  expect((await response.json()).status).toBe('confirmed');
  await expect(page.getByText('Order placed successfully')).toBeVisible();
});
```

### 24. Emulate offline/slow network
```ts
test('shows offline banner', async ({ page, context }) => {
  await page.goto('/dashboard');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('You are offline')).toBeVisible();
});
```

### 25. Random/unique test data generator (avoid collisions in parallel runs)
```ts
export function uniqueEmail(prefix = 'qa'): string {
  return `${prefix}+${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
}
```

### 26. Custom reporter skeleton
```ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class SlackFailureReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status !== 'passed') {
      console.log(`FAILED: ${test.title} — ${result.error?.message}`);
      // post to Slack webhook here
    }
  }
}
export default SlackFailureReporter;
```

### 27. Access Shadow DOM elements
```ts
// Playwright pierces open shadow roots automatically with normal locators
await page.locator('custom-datepicker').getByRole('button', { name: 'Next month' }).click();
```

### 28. Global teardown
```ts
// global-teardown.ts
export default async function globalTeardown() {
  // e.g., clean up test users created during the run via API
  await fetch(process.env.BASE_URL + '/api/test/cleanup', { method: 'POST' });
}
// playwright.config.ts
export default { globalTeardown: require.resolve('./global-teardown') };
```

---

## Part 4: Scenario-Based / Judgment Questions

**1. Two days before release you find a bug on a low-traffic settings page with zero automated coverage — what do you do?**
- **Model Answer:** File the bug immediately regardless of automation status so it's visible for release-go/no-go decisions. Then triage automation effort by cost: if the page object and fixtures already exist, adding one assertion might take 10 minutes — do it now. If it needs new locators/setup from scratch, don't rush brittle automation under deadline pressure — rely on a manual regression note and file a follow-up ticket for post-release automation.
- **Example:** "I reported it in Jira within the hour so the release manager had visibility. Since the settings `PageObject` already existed from a prior sprint, adding the missing assertion took 15 minutes, so I shipped the coverage same-day rather than deferring it."

**2. Your suite passes locally but fails intermittently (~1 in 10 runs) only in CI — how do you approach root-causing it before "just adding a retry"?**
- **Model Answer:** Reproduce with the same conditions as CI (headless, same worker count, same parallelism) rather than your usual local headed/serial run; pull the trace/video from a failed CI run; look for race conditions, shared data collisions, or timing assumptions that only surface under load/parallel execution. Add a retry only as a stopgap while root-causing, never as the fix itself.
- **Example:** "Running locally with `--workers=4` instead of my default single-worker debug mode reproduced it in 2 out of 10 runs — it turned out two tests were reading/writing the same seeded record. I fixed the actual data collision and only then removed the temporary retry we'd added as a stopgap."

**3. A developer pushes a UI change that breaks 50 tests referencing old CSS classes overnight — how do you triage and prevent recurrence?**
- **Model Answer:** Triage: confirm it's a locator issue, not a real regression, via a quick trace check on a few failures; batch-fix via the shared component/POM layer rather than 50 individual edits if locators are centralized. Prevent recurrence: push for `data-testid`/role-based locators going forward, and consider a lightweight contract with frontend devs (e.g., don't remove `data-testid` attributes without QA sign-off) or a CI check that flags such removals.
- **Example:** "Because our locators lived in POM classes, not scattered inline, updating the ~50 broken references was actually just editing 6 POM files. Afterward we agreed with the frontend team that `data-testid` attributes are a stable contract — removing one now requires a heads-up in the PR description."

**4. You're asked to automate a legacy page with dynamic auto-generated IDs and no `data-testid` attributes — what's your approach?**
- **Model Answer:** First try structurally stable locators (role, label, text, position relative to stable landmarks) before resorting to regex-tolerant CSS/XPath. In parallel, raise it with the dev team — request `data-testid` attributes as a small, low-risk dev ask, framing it as reducing *their* future refactor risk too, not just a QA convenience.
- **Example:** "I automated it short-term using `getByRole` and relative positioning (e.g., the button inside the row containing specific text), then opened a small ticket asking devs to add `data-testid`s — framed it as 'this also protects your future refactors from silently breaking QA,' and they added them within the same sprint."

**5. Product wants '100% automation coverage' before next release in one week — how do you respond?**
- **Model Answer:** Push back with data, not just "no" — explain that 100% coverage isn't realistic or even valuable (diminishing returns on rarely-used/unstable UI), propose a risk-based coverage plan instead (critical paths first), and give a realistic number/timeline.
- **Example:** "I presented a coverage map ranking our ~60 flows by traffic and revenue risk, and committed to covering the top 20 (representing ~90% of actual user traffic) within the week — full 100% would have meant rushing brittle tests on rarely-used admin screens that would cost more in maintenance than they'd ever catch."

**6. A test that's been green for months suddenly fails after a third-party payment gateway update — walk through your steps.**
- **Model Answer:** Confirm it's a real behavior change (trace/response diff) not a flaky failure; check if it's a stubbed test (in which case the mock's assumed contract is now stale) or a real integration test (in which case the actual gateway behavior changed); coordinate with the team owning that integration before "fixing" the test, since the fix might need to be in app code, not test code.
- **Example:** "The trace showed the gateway now returned a different error code for declined cards. Rather than just updating my assertion to match, I flagged it to the backend team first — turned out our own error-handling code also hadn't been updated for the new code, so my 'test fix' would have masked a real production bug."

**7. You inherit a framework with no POM, inline locators everywhere, no CI integration — what's your 30/60/90-day plan?**
- **Model Answer:** 30 days: stabilize — get it running in CI at all (even without refactor), triage/quarantine known-flaky tests, understand current coverage. 60 days: introduce POM/fixtures incrementally for the highest-traffic flows (not a big-bang rewrite), add a smoke-tag subset as a fast PR gate. 90 days: extend patterns across the rest of the suite, add reporting/notifications, document conventions for the team.
- **Example:** "Month 1 I just got the existing suite running nightly in CI with the current (messy) code, so we had a coverage baseline. Month 2 I refactored the 3 highest-traffic flows into POM+fixtures and added a `@smoke` gate on PRs. Month 3 I extended that pattern to the rest of the suite and wrote a short contributing guide so new tests followed the same structure by default."

---

## Part 5: Quick Reference Cheat-Sheet

| Category | Key APIs |
|---|---|
| Locators | `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByTestId`, `getByTitle`, `getByAltText`, `.filter()`, `.and()`, `.or()`, `.nth()`, `.first()`, `.last()` |
| Waiting | `waitForSelector`, `waitForLoadState`, `waitForResponse`, `waitForRequest`, `waitForURL`, `waitForEvent` |
| Assertions | `expect(locator).toBeVisible/toHaveText/toHaveValue/toHaveCount`, `expect.soft`, `expect.poll`, `toHaveScreenshot` |
| Actions | `.click()`, `.fill()`, `.check()`, `.selectOption()`, `.setInputFiles()`, `.hover()`, `.dragTo()`, `.press()` |
| Network | `page.route()`, `context.route()`, `route.fulfill()`, `route.continue()`, `route.abort()`, `request` fixture |
| Context/Session | `storageState`, `browser.newContext()`, `context.addCookies()`, `context.setOffline()` |
| Debugging | `PWDEBUG=1`, `npx playwright test --debug`, `npx playwright codegen`, `npx playwright show-trace` |
| Config | `projects`, `retries`, `workers`, `use`, `reporter`, `grep`, `globalSetup`, `globalTeardown` |
| Test control | `test.skip`, `test.fixme`, `test.slow`, `test.step`, `test.describe.serial/parallel` |

---

*Tip while prepping: for every theory answer above, try to attach one real number from your own project (test count, time saved, % flakiness reduced) — interviewers weight concrete impact far higher than textbook definitions.*
