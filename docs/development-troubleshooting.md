# Development troubleshooting

- `next.config.ts` pins `turbopack.root` to this repository with a portable file URL. Unrelated lockfiles in a home directory no longer influence root detection.
- The decorative scene requests WebGL2 before constructing a renderer and leaves content usable if unavailable. Cleanup disposes resources and explicitly releases the GPU context, including during development remounts.
- Driver shader precision / ReadPixels warnings are GPU diagnostics, not Next.js errors. Do not disable shader validation to hide them.
- Next.js `cache-bypass-in-dev` messages on hard refresh are informational and do not indicate a production caching failure.
- Hydration reports containing extra `fdprocessedid` attributes are from browser-extension DOM injection. Disable that extension for localhost or test in a clean profile; do not suppress hydration warnings globally.
- The current Next.js ESLint plugins declare peer ranges through ESLint 9, while this project uses the supported ESLint 10 and passes lint. Do not downgrade to unsupported ESLint 9 to make install warnings disappear.

Run lint, style, format, typecheck and production build before submitting a PR. With all three sibling dev servers running on ports 3000/3001/3002, run `pnpm exec node scripts/check-dev-sites.mjs` from the digital twin repo for browser checks.
