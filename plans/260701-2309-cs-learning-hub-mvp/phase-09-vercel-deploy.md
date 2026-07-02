# Phase 09 — Vercel Deploy

**Priority:** P1 (final) · **Status:** pending · **Depends:** all

## Overview
Git init + push to GitHub + Vercel auto-deploy. Verify mobile + progress persistence in production.

## Related Files
- `vercel.json` (from P01), `.gitignore`
- `README.md` (brief: what it is, dev commands)

## Implementation Steps
1. `git init`, commit (conventional). Create GitHub repo via `gh repo create cs-learning-hub --private --source=. --push`.
2. Vercel: import repo (dashboard or `vercel` CLI). Framework preset = Vite; build `yarn build`; output `dist`.
3. Confirm SPA rewrite works (deep-link `/phase/phase1/binary-and-bits` reloads OK).
4. Test on real phone: layout, quiz taps, no horizontal scroll.
5. Lighthouse mobile ≥ 85; page load < 2s on 4G.
6. (Optional) custom domain later.

## Todo
- [ ] git repo + GitHub push
- [ ] Vercel import + build config
- [ ] SPA deep-link verified in prod
- [ ] mobile smoke test
- [ ] Lighthouse ≥ 85

## Success Criteria
Live on `*.vercel.app`; deep links work; mobile-clean; progress persists in prod browser.

## Security
Public repo-safe: no secrets, no API keys (all content static). Keep repo private if preferred.
