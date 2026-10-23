# Development troubleshooting

Start with the terminal that launched Next.js and the browser console. A missing decorative background, an image failure and a hydration error have different causes; do not hide all three behind the same fallback.

## Quick checks

| Symptom                     | First check                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| The server will not start   | Is port 3000 already used by another site? Try `pnpm dev --port 3000` only when it is free.  |
| A founder image is missing  | Does its lowercase `.jpeg` filename exist in `public/founders/`? Check the network response. |
| The 3D background is absent | Does the browser support WebGL2, and is the section near the viewport?                       |
| A hydration warning appears | Reproduce in a clean profile and inspect which attributes differ.                            |
| The sitemap is empty        | Was a verified `SITE_URL` set before the build?                                              |

No Python server is needed for this site. Starting the twin backend will not fix a landing-page asset or build error.

## Port and install problems

All three Next.js repos default to port 3000. Use the [README's separate-port layout](../README.md#run-all-three-netlave-sites-together) when running them together. Stop servers from their original terminals with Ctrl+C. Identify a remaining process before terminating it.

Use `pnpm install --frozen-lockfile`. If it reports that the lockfile is out of date, inspect the dependency change rather than deleting the lockfile or installing with a different package manager. Run from this repository, not a parent folder.

## Next.js root detection

`next.config.ts` pins `turbopack.root` to the repo directory with a portable file URL. This prevents an unrelated home-directory lockfile from influencing root detection. Keep that configuration; do not fix a warning by hard-coding a user's Windows path or broadening the root to the whole home directory.

For changes to the installed Next.js version or configuration, use its local guides in `node_modules/next/dist/docs/` rather than assuming an older Next.js API still applies.

## Missing scenes and images

The scene loads near the viewport and when the browser is idle. It can take a moment to appear. Reduced motion stops its animation; WebGL2 being unavailable leaves the page readable without a background.

If WebGL2 exists but assets fail, inspect `/scene/` requests in the network panel. If a scene error reproduces in a clean supported browser, fix that error instead of disabling validation. Renderer cleanup must dispose resources and release the context, including during dev remounts.

Founder images use a card crop. A wrong crop is a layout/photo issue, not an absent file. Check the `Image` container and the `sizes` declaration on mobile and desktop. See the [site guide](site-guide.md#example-update-a-founder-portrait).

## Hydration and driver messages

A hydration report listing only added `fdprocessedid` attributes indicates browser-extension DOM injection in the observed case. Disable the injecting extension for localhost or use a clean profile. If other content differs, investigate that difference too; do not assume every hydration error comes from an extension or add global suppression.

Next.js's `cache-bypass-in-dev` message during a hard refresh is informational. It does not describe a production cache failure.

GPU/ANGLE shader precision and ReadPixels messages can come from the graphics driver. Check whether the scene actually renders and the page remains usable. Do not turn off shader validation solely to make the console look clean.

Some installed Next.js ESLint plugins declare peer ranges through ESLint 9 while this repo uses ESLint 10. The lint suite is the practical compatibility check. Do not downgrade to an unsupported version merely to remove a warning, or ignore an actual lint failure because the warning is known.

## Metadata does not update by changing a running production server

`SITE_URL` is read when the site is built. Set it to the verified production origin and rebuild before checking canonicals, social-image URLs and the sitemap. An empty sitemap without that setting is intentional; a guessed domain would be worse.

See [publishing guidance](brand-and-ground-truth.md#publishing-search-and-generative-discovery) for preview behavior. Crawler settings are not site access control.

## Confirm the fix

Run the [README checks](../README.md#check-your-changes), then revisit the changed section with mobile width, keyboard navigation and reduced motion.

With the sibling landing/product/twin dev servers on 3000/3001/3002 and API on 8000, run `pnpm exec node scripts/check-dev-sites.mjs` from the twin repo. That checks clean-profile console errors, mobile overflow and no-WebGL fallbacks. It does not make GPU-driver behavior or every browser extension part of the application's contract.
