# Working on the landing page

The landing page should help a visitor answer three questions: what is NetLave, who is working on it, and what needs to happen next? Keep changes focused on those questions. The simulation itself lives in the digital twin repository.

## How the page is assembled

`src/app/layout.tsx` wraps the page with the site header and footer. It also loads the shared fonts and emits metadata and structured data.

`src/app/page.tsx` puts the home-page sections in this order:

1. **Hero:** the short project introduction and calls to action.
2. **Idea:** how reclaimed water, renewable power and control connect.
3. **Project facts:** the common description and claim limits, with a link to `/ground-truth`.
4. **Founders:** existing names and portraits.
5. **Contact:** the next steps and public project-contact link.

Each section has a TSX component and a matching SCSS module. That keeps content and layout easy to find without creating a larger page framework.

## Where to make a change

| Change                               | Start with                                                  |
| ------------------------------------ | ----------------------------------------------------------- |
| Hero wording or call-to-action links | `src/components/Hero.tsx`                                   |
| Idea explanation                     | `src/components/Idea.tsx`                                   |
| Founder cards                        | `src/components/Founders.tsx` and `public/founders/`        |
| Contact wording                      | `src/components/Contact.tsx`                                |
| Navigation labels and anchors        | `src/components/navigationLinks.ts`                         |
| Colors, spacing and type sizes       | `src/styles/_tokens.scss`                                   |
| Glass buttons                        | `src/styles/buttons.module.scss`                            |
| Shared project facts                 | `src/content/ground-truth.json`, updated in all three repos |
| Search and social metadata           | `src/lib/seo.ts` and `src/app/layout.tsx`                   |

If a change affects a physical assumption, a scenario or a performance claim, check the Python twin first. Do not rewrite an outcome merely because a shorter or more optimistic sentence would look better.

## Example: update a founder portrait

Founder names come from the shared JSON. The component turns each name into a lowercase image path, such as `/founders/eyad.jpeg`.

To replace an existing portrait:

1. Keep the existing filename unless you also change the path logic.
2. Use a photo you are allowed to publish. Keep its subject clear when cropped into the card.
3. Check the card on a narrow screen and a desktop. The `Image` component uses `fill`, so its parent container defines the crop.
4. Keep the alternative text accurate. The current component describes the image as a portrait of the founder.

Adding a name means updating the shared reference in all three repositories and supplying its matching image. Role biographies and a contact email should only be published once they are actually supplied and verified; the page does not need placeholders to feel complete.

## Keep styling consistent

Use the existing tokens instead of adding another palette. The body and headings use Space Grotesk; labels and buttons use IBM Plex Mono. The shared font configuration belongs in `src/styles/fonts.ts`.

Primary and secondary buttons are rounded glass capsules. Their styles include solid alternatives for reduced transparency and avoid the active-scale motion when reduced motion is requested. Preserve those behaviors when adjusting a color or size.

Plain navigation links do not need to look like buttons. Keep the visual emphasis on the actions a visitor is expected to take.

## What the 3D background does

`NetLaveScene.tsx` waits until a section is near the viewport and the browser is idle before loading `createNetLaveScene.ts`. The renderer draws decorative water/forestry illustrations for each section. Its chosen shapes are visual explanations, not a physical simulation, species model or site plan.

Animation runs only while a scene is visible and stops for reduced motion. Cleanup disposes geometry, materials, textures and the GPU context. That matters during development remounts as well as normal navigation.

If WebGL2 is unavailable, the section remains readable without a scene. Do not make important project information depend on the canvas or turn a missing decorative background into a page error.

## MDX support

MDX is enabled in `next.config.ts`, with components defined in `src/mdx-components.tsx`. The current home page does not require MDX. If you add an MDX route, use the installed Next.js guides and keep it within the existing App Router structure; do not introduce a separate content system for one page.

## A small review checklist

Before opening a PR:

- Read the changed page without relying on the background. Is its meaning still clear?
- Check the header, anchors, founder crops and contact link on mobile and desktop.
- Use a keyboard to reach the skip link and calls to action.
- Try reduced motion and a browser without WebGL.
- Confirm `/ground-truth` still matches the other sites if you touched shared content.
- Run the checks listed in the [README](../README.md#check-your-changes).

For a missing image, blank background or hydration warning, continue with [development troubleshooting](development-troubleshooting.md). For logo regeneration and publishing metadata, use [brand and ground truth](brand-and-ground-truth.md).
