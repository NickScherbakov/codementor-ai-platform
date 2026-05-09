# Contributing to CodeMentor AI Platform

Thanks for considering a contribution.

## Quick start

1. Fork the repository.
2. Create a branch from `main`.
3. Run the project locally (`./scripts/dev.sh` or manual run from README).
4. Make focused changes.
5. Open a pull request using the PR template.

## Development checks

Run checks before opening a PR:

### Backend
```bash
cd backend
npm ci
npm test
```

### Frontend
```bash
cd frontend
npm ci --legacy-peer-deps
npm run type-check
npm run build
npm test
```

## Contribution types

- Bug fixes
- New learning/review scenarios
- UI/UX improvements
- Docs and onboarding improvements
- CI/CD reliability improvements

## Issue labels

- `good first issue` — beginner-friendly
- `help wanted` — maintainers are looking for help
- `bug` — defects
- `enhancement` — feature improvements
- `documentation` — docs-only changes

## Pull request expectations

- One logical change per PR.
- Clear problem statement and scope.
- Include screenshots/GIFs for UI updates where possible.
- Keep claims in docs and UI verifiable.

## Code of conduct

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
