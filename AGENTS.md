<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NetLave landing page

A simple founder's landing page for NetLave. Keep it simple: build only what is asked, the way it is asked. No speculative abstractions, features or dependencies.

## Stack

- Next.js 16 (App Router, `src/app/`), React 19, TypeScript (strict)
- Styling: SCSS modules (`*.module.scss`), globals in `src/app/globals.scss`
- MDX pages are enabled (`next.config.ts`, `src/mdx-components.tsx`)
- Import alias: `@/*` → `src/*`

## Commands

Use **pnpm** only. Never npm or yarn, and never commit another lockfile.

| Command             | Purpose                         |
| ------------------- | ------------------------------- |
| `pnpm dev`          | Start the dev server            |
| `pnpm build`        | Production build                |
| `pnpm lint`         | ESLint (`next lint` is removed) |
| `pnpm lint:styles`  | Stylelint for CSS/SCSS          |
| `pnpm format`       | Prettier, write changes         |
| `pnpm format:check` | Prettier, check only            |
| `pnpm typecheck`    | Generate Next types, run `tsc`  |

A Husky pre-commit hook runs lint-staged (ESLint, Stylelint, Prettier on staged files) and then `pnpm typecheck`. Never bypass it with `--no-verify`. Fix the problem instead.

## Code style

- Clean, readable design. Give components, classes, CSS classes, variables and functions clear, descriptive names. No vague names like `data`, `tmp` or `x`.
- Let Prettier and the linters decide formatting. Don't hand-tune it.

## Git workflow

- `main` is protected: every change goes through a PR targeting `main`.
- Branch names: `<type>/<short-description>`, e.g. `ci-cd/precommit-and-linting`, `docs/add-agent-md`.
- Keep commits atomic and scoped: one logical change per commit.
- Write commit messages like a human: short, plain-English summaries of what changed.
- No AI attribution anywhere: no `Co-Authored-By` trailers or "Generated with" lines in commits, PRs or code.
