# NetLave landing page

The founder landing page for NetLave, a simulation-driven prototype of treated-wastewater forestry in Egypt. It introduces the idea, Eyad, Mahmoud, Omar and Hana, and the next steps toward site measurements and validation. Built with Next.js 16, React 19, TypeScript, SCSS modules and a browser-only three.js backdrop; MDX is enabled.

## Run locally

Use Node.js 24 and pnpm. Do not use npm or yarn.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Production: `pnpm build`, then `pnpm start`.

See [development troubleshooting](docs/development-troubleshooting.md) for root detection, WebGL cleanup and browser-extension hydration diagnostics.

## Checks

```bash
pnpm lint
pnpm lint:styles
pnpm typecheck
pnpm format:check
pnpm build
pnpm exec node scripts/check-shared-truth.mjs
```

Add `--siblings` to the final command when all three NetLave repos are adjacent. Follow [AGENTS.md](AGENTS.md) for atomic plain-English commits, branch naming, required hooks and PRs to `main`.

## Content, branding and discovery

- `src/content/ground-truth.json` and `/ground-truth` contain the same reference as the product site and digital twin. Python in the twin remains the physical authority; this site does not run a simulation or show field telemetry.
- Assumptions and outcomes are synthetic, not measured savings or regulatory approval. Resource-aware scheduling is experimental, not a replacement for the default smart hysteresis controller.
- Founder portraits remain in `public/founders/`. Unprovided biographies/roles and the placeholder email are not published; the verified public repository issue tracker provides project contact.
- The supplied logo, generated favicons, matching fonts, synchronization steps and SEO/GEO setup are documented in [brand and ground truth](docs/brand-and-ground-truth.md).
- Set `SITE_URL` to this site's verified production origin at build time for canonicals, social cards and sitemap URLs. No production domain is assumed. Preview deployments should remain unindexed.

The WebGL backdrop is decorative. Text, links, portraits and the reference page remain server-rendered and usable without JavaScript.
