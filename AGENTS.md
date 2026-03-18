# AGENTS.md

This file is guidance for agentic coding tools working in this repository.

## Project Snapshot

- Stack: Vite 5 + React 18 + TypeScript.
- Routing: `react-router-dom` with a protected home route and a `/login` route.
- Styling: plain CSS in `src/styles/global.css`.
- Data access: native `fetch` wrapped by `src/lib/api.ts`.
- Auth: JWT token persisted in `localStorage` via `src/lib/auth.ts`.
- Current app purpose: internal login and consultation of text models from remote APIs.

## Rule Files Present

- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
- No `.github/copilot-instructions.md` file found.
- If any of those files are added later, merge their guidance into this document and follow the stricter rule where guidance conflicts.

## Workspace Layout

- `src/App.tsx`: top-level routes and theme persistence.
- `src/pages/`: route-level pages such as login and modelos list/detail.
- `src/components/`: reusable UI pieces.
- `src/lib/`: auth, API, and domain-specific request helpers.
- `src/types/`: shared TypeScript interfaces.
- `src/styles/global.css`: global styling and theme variables.
- `vite.config.ts`: Vite config plus dev proxy for API routes.

## Build, Run, and Verification Commands

Use `npm` in the repo root.

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production bundle: `npm run preview`

## Lint and Test Status

- There is currently no lint script configured in `package.json`.
- There is currently no test runner configured in `package.json`.
- There is currently no single-test command because no test framework is installed.

If you add tooling, prefer these conventions:

- Lint all: `npm run lint`
- Type-check/build validation: keep `npm run build`
- Test all: `npm test`
- Single test file: `npm test -- path/to/file.test.tsx`
- Single test name: `npm test -- -t "test name"`

Do not document those future commands as available unless you also add the scripts.

## Environment and API Notes

- The app expects `BASE_URL_API` in `.env`.
- In development, Vite proxies `/scsdp` and `/candidato` to `BASE_URL_API`.
- In production builds, `src/lib/api.ts` prefixes requests with `BASE_URL_API`.
- Login returns plain text JWT, not JSON.
- Model list and detail endpoints may return either raw objects or `{ mensagem, dados }` envelopes.

## General Editing Expectations

- Preserve the current architecture unless a refactor is clearly justified.
- Prefer small, local changes over broad rewrites.
- Keep the app working in both desktop and mobile layouts.
- Do not introduce a UI library unless the task explicitly needs one.
- Avoid adding dependencies for simple problems that native React/TypeScript/CSS can solve.

## TypeScript Guidelines

- Keep `strict` TypeScript compatibility.
- Do not suppress type errors with `any` unless there is no practical alternative.
- Prefer explicit interfaces/types for API payloads and component props.
- Use union types for finite state like theme values.
- Keep domain types in `src/types/` when shared across files.
- Use `import type` for type-only imports.
- Preserve nullability where the API can omit fields.
- When parsing API responses, validate shapes defensively before using them.

## Imports and Module Organization

- Use relative imports as the repo currently does; no path aliases are configured.
- Group imports with external modules first, then internal modules.
- Keep import lists short and remove unused imports immediately.
- Prefer one responsibility per module:
  - UI components in `src/components/`
  - page orchestration in `src/pages/`
  - side effects and HTTP in `src/lib/`
  - shared types in `src/types/`

## Naming Conventions

- Components: PascalCase, e.g. `ModelDetailPanel`.
- Page components: PascalCase with `Page` suffix, e.g. `LoginPage`.
- Utility functions: camelCase, e.g. `buildUrl`, `unwrapEnvelope`.
- Constants: `UPPER_SNAKE_CASE` for module-level constants, e.g. `THEME_KEY`.
- Props interfaces: `ComponentNameProps`.
- Type aliases/interfaces for domain entities: singular PascalCase, e.g. `ModeloDetail`.
- CSS classes: kebab-case-like lowercase with hyphens, e.g. `detail-panel`, `theme-toggle`.

## React Guidelines

- Use function components only.
- Keep components focused and composable.
- Put route-level data loading and navigation logic in page files.
- Keep presentational rendering in components when possible.
- Prefer hooks and local state over adding global state libraries.
- Use `useCallback`, `useMemo`, and `useEffect` only when they help correctness or stability.
- Preserve current controlled form patterns for login fields.
- When syncing UI with the URL, use `react-router-dom` primitives rather than direct history manipulation.

## Styling Guidelines

- Centralize global theme tokens in `src/styles/global.css`.
- Reuse existing CSS variables before adding new hard-coded colors.
- Keep light and dark theme support in sync.
- When adding new interactive UI, style both default and selected/hover/focus states.
- Ensure dark mode text has sufficient contrast.
- Prefer extending existing class patterns instead of creating parallel styling systems.
- Keep responsiveness intact at current breakpoints (`960px` and `640px`) unless there is a strong reason to change them.

## Error Handling and API Conventions

- Route all HTTP calls through `src/lib/api.ts` unless there is a strong reason not to.
- Throw or propagate `ApiError` for HTTP failures.
- Preserve the current behavior of clearing auth on `401` responses.
- Avoid logging tokens, passwords, or full auth payloads.
- Show user-friendly Portuguese messages in UI-facing errors.
- Treat optional API fields defensively; the UI convention is to show `-` for empty values.
- When rendering API-provided HTML, remember the code currently trusts internal HTML via `dangerouslySetInnerHTML`; sanitize only if requirements change.

## Formatting Conventions

- Follow the existing no-semicolon style.
- Prefer single quotes in TypeScript/TSX, matching current files.
- Keep trailing commas only where the existing formatter/style already uses them.
- Use concise early returns for loading, empty, and error states.
- Do not add comments for obvious code; comment only when behavior is non-obvious.
- Keep functions reasonably small and readable.

## Commit Message Convention

- Write commit messages in Portuguese.
- Keep conventional commit prefixes in English.
- Preferred prefixes include `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Example: `fix: corrige carregamento do detalhe do modelo`.

## Verification Expectations for Changes

- At minimum, run `npm run build` after meaningful code changes.
- If you add a new script, run it and document the result in your handoff.
- For UI changes, verify both light and dark themes when relevant.
- For routing changes, verify direct-link loading and in-app navigation.
- For API changes, verify envelope parsing and unauthorized behavior if touched.

## Safe Change Checklist

- Did you keep JWT handling out of logs?
- Did you preserve URL-driven modelo selection if touching `ModelosPage`?
- Did you keep dark mode working if touching colors or surfaces?
- Did you avoid breaking the Vite proxy behavior?
- Did you keep `npm run build` passing?

## When Unsure

- Prefer consistency with nearby code over abstract best practices.
- Read the relevant page/component/lib file before refactoring.
- Make the smallest change that fully solves the task.
