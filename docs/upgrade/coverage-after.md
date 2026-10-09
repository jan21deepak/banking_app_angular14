# Coverage after the Angular 18 upgrade

Measured on `upgrade/angular-18`. Angular 18.2, Node 22.23.3, Chrome 137 headless.
Same commands as the baseline, run once per project:

```bash
npx ng test <project> --code-coverage --watch=false --browsers=ChromeHeadlessCI
```

## After (Angular 18)

| Project | Statements | Branches | Functions | Lines | Specs |
|---|---:|---:|---:|---:|---:|
| `ui` | 100% (18/18) | 93.33% (14/15) | 100% (3/3) | 100% (16/16) | 7/7 |
| `analytics-sdk` | 82.14% (23/28) | 70% (7/10) | 70% (7/10) | 85.18% (23/27) | 2/2 |
| `digital-banking` | 43.28% (29/67) | 46.87% (15/32) | 32.14% (9/28) | 43.33% (26/60) | 7/7 |
| `wealth-portal` | 100% (7/7) | 100% (0/0) | 100% (3/3) | 100% (5/5) | 1/1 |

## Diff vs baseline (Angular 14, `coverage-baseline.md`)

Percentage points, after minus baseline.

| Project | Statements | Branches | Functions | Lines | Dropped? |
|---|---|---|---|---|---|
| `ui` | 100 → 100 (0) | 93.33 → 93.33 (0) | 100 → 100 (0) | 100 → 100 (0) | No |
| `analytics-sdk` | 81.48 → 82.14 (+0.66) | 70 → 70 (0) | 70 → 70 (0) | 84.61 → 85.18 (+0.57) | No |
| `digital-banking` | 42.42 → 43.28 (+0.86) | 46.87 → 46.87 (0) | 32.14 → 32.14 (0) | 42.37 → 43.33 (+0.96) | No |
| `wealth-portal` | 100 → 100 (0) | 100 → 100 (0) | 100 → 100 (0) | 100 → 100 (0) | No |

**No project dropped coverage.** No tests were added, removed, skipped or loosened. The one test
change across the upgrade is the wealth-portal row selector (`tr.mat-row` → `tr.mat-mdc-row`, hop 17),
which keeps the same 3-row assertion.

The small gains come from the denominator, not new tests: the removed `relativeLinkResolution`
option (hop 15) and the dropped `entryComponents` (hop 16) took uncovered statements out of the
instrumented code. The covered counts are unchanged.
