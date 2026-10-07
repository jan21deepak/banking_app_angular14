# Digital Banking (Angular 14) — demo workspace

> Synthetic, self-contained demo codebase modeled on a large customer-facing retail banking web app.
> Not affiliated with or derived from any real Bank of America code.

An Angular **14.2** / Angular Material **14** workspace that mirrors the shape of an enterprise digital banking
front end — and therefore the hard parts of an Angular 14 → 18 upgrade.

| Project | Type | What it represents |
|---|---|---|
| `projects/ui` → `@bofa-demo/ui` | library | Shared internal component library + custom design system layered on Angular Material |
| `projects/analytics-sdk` → `@bofa-demo/analytics-sdk` | library | Proprietary analytics SDK (page views, `[anTrack]`, API timing beacons, PII redaction) |
| `src/` → `digital-banking` | application | Customer-facing app: Enterprise SSO + MFA, accounts, transactions, transfers, bill pay, third-party data providers |
| `projects/wealth-portal` | application | A **downstream team** consuming `@bofa-demo/ui` — its build must not break |

Integrations are mocked in-browser by `MockBackendInterceptor` (API gateway, SSO `/authorize` + `/mfa/verify`,
credit bureau, market data, account aggregation), so the app runs with no backend.

## Run it

Requires Node 16 (see `.nvmrc`).

```bash
npm ci
npm start              # builds libs, then serves http://localhost:4200
npm run start:wealth   # downstream consumer on http://localhost:4300
npm run verify         # build every project + run every test suite (what CI runs)
```

Demo login: `demo` / `Demo@1234`, MFA code `123456`.

## Upgrade surface (Angular 14 → 18)

These patterns are intentional — they are what a real 14-era enterprise codebase looks like and what the upgrade must handle:

| Area | Where | Change required |
|---|---|---|
| Material legacy → MDC components (v15) | `projects/ui/src/lib/theme/_theme.scss`, `dashboard.component.scss` | Design-system overrides target legacy classes (`.mat-form-field-outline`, `.mat-raised-button`, `.mat-chip`, `.mat-tab-label-active`) |
| `mat-chip-list` (removed with legacy chips) | `dashboard.component.html` | → `mat-chip-listbox` / `mat-chip-option` |
| Typography config API | `_theme.scss` | `define-typography-config` / `headline`/`title` levels → M2 typography levels |
| `relativeLinkResolution` (removed v15) | `app-routing.module.ts`, `wealth-portal` routing | Remove option |
| Class-based guards / resolvers (`CanActivate`, `CanLoad`, `Resolve`) | `core/auth/*.guard.ts`, `core/services/account.resolver.ts` | → functional guards, `canMatch` |
| `ComponentFactoryResolver` | `BofaToastService` | → `createComponent` / `ViewContainerRef` |
| `entryComponents` | `BofaUiModule` | Remove |
| `DATE_PIPE_DEFAULT_TIMEZONE` | `app.module.ts` | → `DATE_PIPE_DEFAULT_OPTIONS` |
| `toPromise()` | `AnalyticsService.flush` | → `firstValueFrom` / `lastValueFrom` |
| `HTTP_INTERCEPTORS` class interceptors / `HttpClientModule` | `CoreModule`, `AnalyticsModule` | Optional: `provideHttpClient(withInterceptors(...))` |
| NgModule-based app | everywhere | Optional: standalone components, `@if`/`@for` control flow (v17) |
| Toolchain | `package.json` | TypeScript 4.7 → 5.4+, zone.js 0.11 → 0.14, Node 16 → 18.19+/20, `browser` → `application` builder |

**Definition of done** for each major-version hop: `npm run verify` is green — both libraries build, *both* the
retail app and the downstream `wealth-portal` build, and all unit tests pass.

See [`docs/devin/angular-upgrade-playbook.md`](docs/devin/angular-upgrade-playbook.md) for the playbook Devin follows.
