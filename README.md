# NetLave landing page

This is the founder-facing introduction to NetLave: the idea, the people behind it, and the work needed before taking the concept to a real site. NetLave explores treated-wastewater forestry in Egypt through a simulation-driven prototype.

The page introduces Eyad, Mahmoud, Omar and Hana, explains how water, energy and irrigation control connect, and links to the shared project facts. It does **not** run the simulation, display field telemetry or control irrigation equipment.

## Start here

| If you want to…                                     | Read…                                                    |
| --------------------------------------------------- | -------------------------------------------------------- |
| Run the page                                        | The setup below                                          |
| Change a section, portrait or style                 | [Site guide](docs/site-guide.md)                         |
| Update shared facts, logos or search metadata       | [Brand and ground truth](docs/brand-and-ground-truth.md) |
| Understand a dev warning or a missing 3D background | [Troubleshooting](docs/development-troubleshooting.md)   |
| Contribute a change                                 | [Repository rules](AGENTS.md)                            |

## Run locally

Use Node.js 24 and pnpm 10. Use **pnpm**, not npm or yarn, so dependency installs and hooks follow the repository's conventions.

From this repository:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. The first install and build need network access for dependencies and web fonts. The browser receives self-hosted font files after the build; it does not need to contact Google Fonts.

No Python server, database or account setup is needed for this page.

### Run all three NetLave sites together

Each Next.js app defaults to port 3000. Give them separate ports if you are opening them at the same time:

| Repository            | Command, run inside that repo | URL                   |
| --------------------- | ----------------------------- | --------------------- |
| `landing-netlave`     | `pnpm dev --port 3000`        | http://localhost:3000 |
| `netlave`             | `pnpm dev --port 3001`        | http://localhost:3001 |
| `digitalTwin-netlave` | `pnpm dev --port 3002`        | http://localhost:3002 |

The twin also needs `pnpm backend:dev` in its own terminal, on port 8000. The landing and product sites do not use that backend.

Stop each server with Ctrl+C in the terminal that started it. If a port is still occupied, identify the process before stopping it; do not stop an unrelated application.

## What is in this repo?

The stack is Next.js 16.4.2, React 19.3.0, TypeScript and SCSS modules. A lazy-loaded three.js background adds motion without becoming part of the page's meaning. MDX support is configured, although the current home page is composed of TSX components.

```text
src/app/page.tsx          Home-page section order
src/app/layout.tsx        Header, footer, fonts and metadata
src/app/ground-truth/     Shared public reference page
src/components/          Hero, idea, founders, contact and navigation
src/components/scene/    Decorative WebGL background and cleanup
src/content/             Shared project facts
src/styles/              Colors, spacing, fonts and glass buttons
public/founders/         Existing founder portraits
public/brand/            Supplied logo and generated assets
scripts/                 Brand generation and consistency checks
```

The page's text, portraits, links and reference page are server-rendered. If JavaScript or WebGL is unavailable, the background may be absent, but the project information is still readable. Reduced-motion preferences stop background animation.

## Keep the project facts honest

All three sites publish the same `src/content/ground-truth.json` and `/ground-truth` reference. The Python engine in [digitalTwin-netlave](https://github.com/MasterChief-Zaki/digitalTwin-netlave) owns the physical model. This site's copy explains it; it is not a second source of physics.

- Site parameters are synthetic assumptions, not measurements from an installation.
- Simulated comparisons do not establish field savings, proven self-power or regulatory approval.
- Smart hysteresis stays the default controller. Resource-aware scheduling is experimental and opt-in.
- The founder names and portraits are present. Detailed role biographies have not been supplied, and no contact email has been verified. The contact button opens the project repository homepage, not the issues page.

See the [shared guide](docs/brand-and-ground-truth.md) before changing facts used by the other sites.

## Check your changes

```bash
pnpm lint
pnpm lint:styles
pnpm format:check
pnpm typecheck
pnpm build
pnpm exec node scripts/check-shared-truth.mjs
```

These check code, styles, formatting, TypeScript, the production page and the shared reference's basic structure. Add `--siblings` to the last command when all three repos are next to each other; that also compares shared files across them.

For browser checks across all three running dev sites, use `pnpm exec node scripts/check-dev-sites.mjs` **from the digital twin repo**. This landing repository does not have its own Playwright test command.

Husky runs lint-staged and typechecking before commits. Keep the hooks enabled, fix reported problems, and submit changes through a PR to `main`. Commit messages should be short, plain-English descriptions of the change.

## Build and publish

```bash
pnpm build
pnpm start
```

This builds and serves the production app locally. For a public deployment, set `SITE_URL` to this site's verified production origin **before building**. That enables its canonical links, absolute social-card URLs and populated sitemap. Without it, no domain is guessed and the sitemap is empty.

The [brand and ground-truth guide](docs/brand-and-ground-truth.md#publishing-search-and-generative-discovery) explains the deployment checks and preview-indexing behavior. Search metadata helps readers find and interpret the project; it does not promise rankings or inclusion in generated answers.

## Historical notes

The original [layout plan](docs/superpowers/plans/2026-10-22-3d-layout-skeleton.md) records how the first page was planned. Use this README, the site guide and the current code for today's behavior; an old plan is not an implementation checklist.
