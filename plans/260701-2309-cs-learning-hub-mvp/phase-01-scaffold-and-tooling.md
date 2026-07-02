# Phase 01 — Scaffold & Tooling

**Priority:** P0 · **Status:** pending · **Depends:** none

## Overview
Bootstrap Vite + React + TS project with all tooling. Establish deps + config so later phases just build components.

## Related Files (create)
- `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- `index.html`, `src/main.tsx`, `src/App.tsx`, `src/router.tsx`
- `.gitignore`, `vercel.json`

## Implementation Steps
1. `cd ~/Workspace/cs-learning-hub && yarn create vite . --template react-ts` (project already has docs/, plans/ — keep them).
2. Add deps: `react-router-dom`, `zustand`, `framer-motion`, `shiki`, `clsx`.
3. Add dev deps: `tailwindcss postcss autoprefixer`, `@types/node`. Run `npx tailwindcss init -p`.
4. Configure `tailwind.config.ts` content globs (`./index.html`, `./src/**/*.{ts,tsx}`); extend theme with CSS-var-backed colors (see Phase 02).
5. `vercel.json`: SPA rewrite `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
6. `router.tsx`: routes `/` → HomePage, `/phase/:phaseId/:topicSlug` → TopicPage (placeholder components ok).
7. Import `index.css` in `main.tsx`; wrap App in `<BrowserRouter>`.

## Todo
- [ ] Vite scaffold (preserve existing docs/plans dirs)
- [ ] Install runtime + dev deps
- [ ] Tailwind + PostCSS configured
- [ ] vercel.json SPA rewrite
- [ ] Router with 2 placeholder routes
- [ ] `yarn dev` runs clean; `yarn build` passes

## Success Criteria
`yarn dev` serves blank routed app on localhost; `yarn build` succeeds with no TS errors.

## Risks
- Vite scaffold may refuse non-empty dir → use `--template` in place; move existing files if needed then restore.
