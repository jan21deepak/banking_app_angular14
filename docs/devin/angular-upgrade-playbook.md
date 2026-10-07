# Playbook: Angular major-version upgrade (incremental, one major per PR)

## Overview
Upgrade this workspace from Angular 14 to the target version **one major version at a time** (14→15→16→17→18),
opening one pull request per hop. Every PR must leave the shared library, the retail app and every downstream
consumer building and passing tests.

## What's needed from the user
- Target version (default: 18) and whether to continue to a currently-supported LTS.
- Any packages that must stay pinned.

## Procedure
1. Read the README "Upgrade surface" table and DeepWiki for this repo. Map every consumer of `@bofa-demo/ui` and `@bofa-demo/analytics-sdk`.
2. Establish a baseline: `npm ci && npm run verify`. Record build output and test counts. Stop and report if baseline is red.
3. Post a written plan (per hop: packages, schematics, manual changes, risks) and wait for approval before changing code.
4. For each hop N → N+1, on branch `upgrade/angular-<N+1>`:
   1. Check the official update guide (https://angular.dev/update-guide) for N → N+1 and the required Node/TypeScript ranges; update `.nvmrc` and `engines` first if needed.
   2. Run `npx ng update @angular/core@<N+1> @angular/cli@<N+1>` then `npx ng update @angular/material@<N+1> @angular/cdk@<N+1>`. Commit schematic output separately from manual fixes.
   3. Fix remaining breakages by hand. For Material 15 (MDC), migrate design-system overrides in `projects/ui/src/lib/theme/_theme.scss` to the MDC class names/tokens; do **not** suppress with `legacy-*` imports in the final 15 PR unless approved.
   4. Bump the library `peerDependencies` in `projects/*/package.json` and the library version (major bump when the public API or theme mixin changes).
   5. Run `npm run verify`. All four projects must build; all tests must pass. Never delete or skip a failing test to get green.
   6. Run the app (`npm start`), sign in with the demo credentials and smoke-test: login → MFA → dashboard → account detail → transfer → bill pay. Attach screenshots to the PR.
   7. Open a PR titled `chore(angular): upgrade to Angular <N+1>` with: summary, schematic vs manual changes, breaking changes for downstream teams, verification evidence, risks/rollback.
5. Start the next hop from the previous hop's branch (stacked PRs) so each diff stays reviewable.

## Specifications
- One major version per PR; CI green on every PR.
- No changes to auth, MFA or PII-redaction behavior; any diff touching `core/auth`, `core/http` or `analytics.service.ts` is called out explicitly in the PR description.
- No new runtime dependencies without approval.

## Advice
- Material 15 is the largest hop (legacy → MDC). Budget most of the effort there and check the visual result.
- `ng update` may refuse to run on a dirty tree or a mismatched Node version — fix the environment rather than forcing.

## Forbidden actions
- Do not merge PRs. A human approves and merges.
- Do not use `--force` to bypass peer-dependency conflicts without explaining why in the PR.
- Do not disable tests, lint rules or TypeScript strictness.
