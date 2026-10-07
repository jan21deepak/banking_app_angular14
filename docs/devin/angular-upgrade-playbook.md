# Playbook: Angular major-version upgrade with decision gates (!angular_upgrade)

## Overview
Upgrade this workspace one Angular major at a time (14→15→16→17→18, or a supported LTS if the user approves),
opening one stacked PR per hop. Make mechanical changes on your own. When you hit a judgment call, stop and
present options and a recommendation to the named approver before changing code. Classes and gates are
defined in `docs/engineering/frontend-upgrade-policy.md`. That file is the source of truth.

## What's Needed From User
- Target version. Default: 18. Ask whether to continue to a currently supported LTS (gate G7).
- Approvers for each gate, if they differ from the policy (e.g. "AppSec = @jane").
- Any packages that must stay pinned.

## Procedure
1. Read `docs/engineering/frontend-upgrade-policy.md`, `.github/CODEOWNERS`, the README "Upgrade surface" table and this repo's DeepWiki. List every consumer of `@bofa-demo/ui` and `@bofa-demo/analytics-sdk`, plus every third-party package and its supported Angular range (`npm view <pkg> peerDependencies`; for `vendor/*.tgz`, read the package's README).
2. Establish the baseline with `npm ci && npm run verify`. Record build output and test counts. If the baseline is red, stop and report.
3. Dry-run each hop, without committing, to find blockers: `npx ng update @angular/core@<N+1> @angular/cli@<N+1>`. Capture peer-dependency conflicts and schematic output.
4. Post a plan and **wait for approval** before changing code. The plan has three tables:
   - **Proceeding autonomously (class A).** Per hop: change, files, why it's safe.
   - **Needs your decision (class B).** Per gate: what you found (with evidence), 2–3 options with trade-offs, your recommendation, the approver from the policy, and what the decision blocks.
   - **Deferred (deprecated but working, or class C).** Item, the version where it breaks, suggested owner.
5. On approval, for each hop N → N+1 on branch `upgrade/angular-<N+1>` (stacked on the previous hop):
   1. Update `.nvmrc`, `engines` and CI Node if the hop requires it (G6 must already be approved).
   2. Run `ng update` for core/cli, then material/cdk. Commit schematic output separately from manual fixes.
   3. Apply class A fixes, and the class B options that were approved, exactly as decided. Changes in another team's paths (G5) go in their own commit.
   4. Bump internal library `peerDependencies`. Bump the major version of `@bofa-demo/ui` if G4 changed its public API or visuals.
   5. Run `npm run verify` until green. Never delete, skip or loosen a test to get there.
   6. Run `npm start` and smoke-test login (`demo`/`Demo@1234`, MFA `123456`) → dashboard → account detail → transfer → bill pay. Capture screenshots.
6. If you find a new judgment call mid-hop (one not in the approved plan), stop and message the approver with evidence and options. Do not guess.
7. Open the PR `chore(angular): upgrade to Angular <N+1>`. The body contains: summary; schematic vs. manual changes; a **Decisions** table (gate, option taken, approved by); breaking changes for downstream teams; `verify` output and screenshots; **Deferred** items; rollback (revert the PR, since the previous hop's branch is green).
8. Request reviews from the CODEOWNERS of every touched path. Respond to review comments with follow-up commits.

## Specifications
- One major per PR, with CI green on every PR. Libraries and both apps (`digital-banking`, `wealth-portal`) build.
- Every class B change traces to an explicit approval recorded in the PR's Decisions table.
- Behavior of files marked `@security-reviewed` is unchanged unless AppSec approved otherwise.
- The vendor package `@fdp/market-widget` is unmodified.
- Validation: `npm run verify` passes, the manual smoke test passes, and the PR diff contains no class B change missing from the Decisions table.

## Advice and Pointers
- The Material 15 (MDC) hop is the largest. Expect G4 there, and attach before/after screenshots of the dashboard and transfer form.
- Class-based guards/resolvers and `toPromise()` are deprecated but still work through 18. They are Deferred items, not upgrade work.
- `@angular/flex-layout` stops at 15.0.0-beta.42, so G2 blocks the 15→16 hop. Raise it in the first plan, not at hop 16.
- `ng update` rejects mismatched Node versions and dirty trees. Fix the environment rather than forcing it.

## Forbidden Actions
- Do not merge PRs, approve your own PRs, or push to `main`.
- Do not use `--force`, `--legacy-peer-deps` or `overrides` to silence a peer conflict unless G1/G2 approved it.
- Do not modify anything under `vendor/`.
- Do not disable tests, lint rules, `strict` TypeScript options or CI jobs.
