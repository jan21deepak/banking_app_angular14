# Unit-test coverage baseline (Angular 14, before upgrade)

Captured on `main` (`bcd907e`) before any upgrade changes, to compare against after the Angular 18 hop.

- Toolchain: Node 16.20.2 (`.nvmrc`), Angular CLI 14.2.13, Karma 6.4 + karma-coverage 2.2, Chrome Headless 137
- Setup: `npm ci`, `npm run build:libs`
- Command, per project:
  `npx ng test <project> --code-coverage --watch=false --browsers=ChromeHeadlessCI`
- Output: karma-coverage HTML reports in `coverage/<project>/index.html` (git-ignored; the numbers below come from the karma `text-summary` reporter)
- `npm run verify` on `main`: green (all libraries and both apps build; 17/17 specs pass)

| Project | Specs | Statements | Branches | Functions | Lines |
|---|---|---|---|---|---|
| `ui` (`@bofa-demo/ui`) | 7/7 pass | 100% (15/15) | 93.33% (14/15) | 100% (2/2) | 100% (15/15) |
| `analytics-sdk` (`@bofa-demo/analytics-sdk`) | 2/2 pass | 81.48% (22/27) | 70% (7/10) | 70% (7/10) | 84.61% (22/26) |
| `digital-banking` | 7/7 pass | 42.42% (28/66) | 46.87% (15/32) | 32.14% (9/28) | 42.37% (25/59) |
| `wealth-portal` | 1/1 pass | 100% (5/5) | 100% (0/0) | 100% (2/2) | 100% (4/4) |

Notes:
- Coverage only counts files loaded by a spec; files with no spec are not in the denominator. That's why `wealth-portal` (one spec) shows 100%.
- `digital-banking` coverage is low because no spec imports the feature components (dashboard, transfers, bill pay) or the `@security-reviewed` interceptors.
