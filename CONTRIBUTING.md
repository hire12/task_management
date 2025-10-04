# Contributing to Orbit

Thank you for your interest in contributing to Orbit. We welcome bug reports, feature discussions, design improvements, and pull requests.

---

## Development Workflow

1. **Fork & Branch**: Fork the repo and create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Local Environment**:
   - Ensure PostgreSQL is running and your `.env` points to a local database.
   - Run `npx prisma db push` and `npm run db:seed` to prepare your environment.
3. **Code Style & Quality**:
   - We use TypeScript strict mode. Ensure `npx tsc --noEmit` passes without errors.
   - Follow the design system rules: use Google Lexend typography, Phosphor duotone icons, and the muted color tokens defined in `tailwind.config.ts` and `app/globals.css`.
   - Keep UI copy concise, human, and direct. Avoid unnecessary corporate filler or overly long labels.

---

## Commit Guidelines

We follow Conventional Commits:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code restructurings
- `docs:` for documentation updates
- `chore:` for dependency or build maintenance

Write clean, natural commit messages that describe what changed and why.

---

## Submitting Pull Requests

1. Test your build locally before submitting:
   ```bash
   npm run build
   ```
2. Open a Pull Request with a short summary of changes, any relevant screenshots, and reference issues if applicable.
