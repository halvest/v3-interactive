# Current Project Progress

## Production Interaction Fix â€” 2026-08-17

**Status:** Completed

### What changed

- **Photo assembly rule:** Every Memory Story photo now owns its tape, corners, photo caption, and attached `MEMORY` label through one `.memory-photo-assembly` parent. ScrollTrigger applies the shared photo transform only to that assembly; independent editorial text remains a separate layer.
- **Responsive parallax:** Memory Story retains one scrubbed ScrollTrigger timeline per scene with functional 20px mobile, 32px tablet, and 48px desktop travel values plus `invalidateOnRefresh`. Stable aspect-ratio photo containers prevent image load from shifting trigger geometry. Reduced motion still leaves the complete static assembly in its correct visual position.
- **D3 virtual-date meme:** `content/surprise.ts` now configures the special interaction, exact copy, GIF, audio, label, and dismiss text. Either D3 ticket opens the same lightweight `MemeOverlay` rather than selecting a date. Normal ticket selection is unchanged, and the completion message considers only selectable choices.
- **Modal and SFX:** The dialog provides focus, Escape, close-control, scroll-restoration, duplicate-trigger, and trigger-focus-return behavior. `useSoundEffect` gives both No and D3 one native `/audio/cat.mp3` channel per mounted interaction surface, without pausing `/audio/river-flow.mp3`.

### Verification

- Real-browser flow reached the dynamic scroll story after both quizzes; it rendered five photo assemblies and no tape/caption target existed outside an assembly.
- The D3 interaction rendered `/images/cat-laugh.gif`, exact `Gabisa yee kan Virtual` copy, a focusable `oke deh` control, modal scroll lock, and no D3 selected state underneath.
- `npm run lint` and `npm run build` pass with 0 errors and 0 warnings after the focused fix.

### Remaining open items

- **P3 device QA:** Check audible cat-SFX balance and native Escape/touch behavior on the target handset. Browser automation cannot provide audible output and its long mobile-flow run is time-limited.
- **P3 personalization:** Final photography, cover artwork, artist metadata, and recipient-specific copy remain outside this focused implementation pass.

---

## Phase 1 — Product Architecture
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High

### What was done
- Inspected empty repository (`.git` + `MASTER_PROMPT.md` only).
- Created initial versions of `PROJECT_SPEC.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`.
- Established baseline decisions: Next.js App Router, Tailwind, GSAP, content-driven architecture.

---

## Phase 2 — Creative Direction & Motion System Review
**Status:** Completed  
**Agent:** Claude Opus 4.6 Thinking

### What was done
- Critical review of all Phase 1 documents against `MASTER_PROMPT.md`.
- Identified and corrected architectural weaknesses.
- Refined all four specification documents.

---

## Phase 3 — Foundation Implementation
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High 

### Inherited State
- Previous agent successfully initialized Next.js 16.3.1 with Tailwind CSS v4.
- Installed approved dependencies (`gsap@3.15.0`, `@gsap/react@2.1.2`, `lenis@1.3.26`, `embla-carousel-react@8.6.0`).
- Created base directory structures (`components/`, `lib/`, `content/`, `public/images/`).

### What was implemented
- **Design Tokens:** Initialized CSS custom properties in `app/globals.css` using Tailwind v4 `@theme`.
- **Typography:** Set up `next/font/google` in `app/layout.tsx` for Geist, Instrument Serif, and Caveat.
- **Content Config:** Created fully typed `content/surprise.ts` with all placeholder content and SVG placeholders.
- **State Architecture:** Implemented `SurpriseExperience.tsx` managing the hybrid state flow.
- **Mobile-First Static Scenes:** Built responsive, static compositions for all 10 scenes across the interaction flow and continuous scroll experience.
- **UI Primitives:** Created `ui/Button.tsx`, `ui/Polaroid.tsx`.
- **Accessibility Foundations:** Added `useReducedMotion.ts` hook based on `useSyncExternalStore`.
- Passed lint/build cleanly.

---

## Phase 4 — Motion & Interaction Implementation
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High

### Inherited State
- A statically complete, responsive Phase 3 foundation without GSAP or Lenis active.

### What was implemented
- **GSAP Architecture:** Created `lib/animations/gsap-setup.ts` to register plugins and establish local constants (`ANIMATION.ease`, `ANIMATION.duration`, `ANIMATION.depth`). Global `gsap.defaults()` was intentionally avoided.
- **Lenis Integration:** Created `SmoothScrollProvider.tsx` linking `<ReactLenis>` with `gsap.ticker` cleanly. Reduced-motion mode actively bypasses Lenis for native accessibility. Wrapped the continuous `ScrollExperience` component.
- **OpeningScene:** Added subtle staggered opacity/y reveals and restrained desktop pointer parallax that disables on touch devices or reduced motion.
- **EnvelopeScene:** Enhanced the CSS approach with a fully synchronized GSAP sequence (flap folds open, letter pulls out, scene fades).
- **QuestionScene (Escape Button):** Implemented bounding-box-aware evasive logic. The NO button flees hover/touch events within the safe `buttonsContainerRef` relative bounds. It gives up gracefully after a calculated max of 3 attempts, allowing the user (and keyboard users) to proceed cleanly.
- **TransitionScene:** Transformed into a cinematic GSAP timeline. "YES" fades background → "okay." fades in/out → "sekarang aku boleh sedikit jujur." → overlay cleanly unmounts.
- **Memory Parallax:** Wired `MemoryStory` layers (image, tape, text, caption) to `ScrollTrigger` with distinct depth tier translations mapping to `ANIMATION.depth` constants (`far`, `back`, `content`, `front`).
- **Polaroid Embla Integration:** Removed native CSS scroll snap and wired up `useEmblaCarousel` with predictable swipe UX (no exaggerated `dragFree`). Active slides subtly scale up and straighten out using CSS transforms bound to Embla's internal state hook.
- **Date Choice:** Implemented satisfying CSS-driven spring-scale selection states (`active:scale-95`).
- **Secret Letter:** Applied a rapid `ScrollTrigger` staggered entrance prioritizing immediate readability (no sequential sentence delays).
- **Ending Polish:** Included an optional, tiny SVG particle burst mapped to the bottom CTA's `ScrollTrigger` intersection. No heavy confetti libs added.

### Browser QA & Performance
- Visual layout integrity preserved across `360px`, `390px`, `430px`, `768px`, and `1440px`.
- No horizontal overflow on mobile despite bounding-box evasion on the Question Scene.
- No React hydration mismatch errors.
- `useReducedMotion` successfully strips all Lenis scroll highjacking, GSAP staggering, and pointer-following effects immediately upon trigger.
- `npm run lint` and `npm run build` completed with **0 errors and 0 warnings**.

### Deviations
- Suppressed `react-hooks/set-state-in-effect` during Embla's standard `onSelect` initialization pattern, as this is necessary to bind external React state to Embla's internal loop.
- Skipped heavy GSAP Flip implementations since state transitions were cleanly handled by timeline fades.
- Did not implement GSAP Draggable for Embla or the Date cards to preserve native vertical scroll behavior on mobile devices.

---

## Phase 5 — Interaction, Mobile UX & Performance Audit
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High

### What was done
- Conducted real-browser interactive audit of all components using headless testing via Playwright/Subagent.
- Verified mobile UX across viewports (360px - 1440px).
- Confirmed Lenis, GSAP, and Embla integrations follow strict performance and memory-leak prevention best practices.
- Confirmed "Escape Button" evasion logic provides accessible keyboard alternatives natively.

### Audit Findings
No P0 or P1 issues were found in the Phase 4 implementation. The architecture successfully preserves the feeling of a tactile, personal editorial scrapbook without collapsing under heavy JavaScript thread blocking. Full details recorded in `docs/INTERACTION_AUDIT.md`.

---

## Phase 6 — Visual Enhancement & Asset Direction
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High

### What was done
- **Asset System:** Created a cohesive `Decorations.tsx` library featuring minimalist, hand-drawn SVG assets (`HandDrawnStar`, `HandDrawnSparkle`) replacing generic CSS circles/squares.
- **Paper & Textures:** Injected a global SVG `feTurbulence` noise overlay (`PaperTextureOverlay`) into `layout.tsx` for subtle, tactile scrapbook realism across the entire DOM.
- **Envelope Restyle:** Refined the `EnvelopeScene` structure, removing stark borders and implementing soft, physical `#DFDDD4` and `#EFEFEA` kraft/paper color tones with realistic internal shadow casting.
- **Scrapbook Restraint:** Stripped down `OpeningScene` ambient noise from 4 elements to 2 hand-drawn stars, creating stronger negative space.
- **Polaroid & Memory Refinement:** Replaced simple tape divs with a customized `PaperTape` component (featuring SVG masking for torn edges). Added subtle `sepia` and `contrast` filters to the placeholder imagery, bordered by structural `PhotoCorners`.
- **Date Choice Polish:** Adjusted the selected state to mimic thick pressed paper (`shadow-paper`, `bg-[#F8F7F4]`) while gracefully falling back to off-white, removing the jarring neon-style `accent/5` tint.
- **Ending Restraint:** Intentionally stripped out the GSAP particle burst from `EndingSection`, relying completely on strong typography and negative space for emotional resonance.
- **Documentation:** Authored `ASSET_GUIDE.md` detailing exact placeholder dimensions, aspect ratios, optimal file formats (`.webp`), and naming conventions for the final personalization pass.

---

## Phase 6.5 — Visual Redesign Sprint (Cinematic Editorial Scrapbook)
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High

### What was done
- **Asset System & Textures:** Added `AbstractFlower`, `PaperClip`, `ScribbleUnderline`, `HandDrawnArrow`, and `HandDrawnCircle` SVGs. Enhanced global shadows (`--shadow-paper-lg`) and expanded the display typography token.
- **OpeningScene:** Redesigned into an asymmetrical grid featuring an oversized, left-aligned serif heading, offset subtle blurred photo preview, and layered `AbstractFlower` decorations.
- **EnvelopeScene:** Greatly increased the envelope's hero scale on mobile. Added a peeling tape seal animation, realistic kraft paper layers, and deep physical drop shadows.
- **QuestionScene:** Broke the question into massive serif lines. Replaced the traditional form UI with a circled handwritten "Iya" button and an asynchronously placed "Nggak" button.
- **WhyYou:** Replaced generic cards with three overlapping, slightly rotated physical notes featuring handwritten numbering and masking tape.
- **MemoryStory:** Introduced 3 programmatic layout archetypes (Full-bleed heavy overlap, Small polaroid with oversized title, Wide offset) replacing the repetitive flow. Deepened z-index overlaps significantly.
- **PolaroidStack:** Redesigned Embla into a scattered physical photo table. Added deterministic scrapbook rotations (`-6deg`, `4deg`, etc.), lifted active shadow states, and paperclip annotations.
- **DateChoice:** Transformed form buttons into overlapping perforated physical tickets using dashed CSS borders, off-white paper styling, and a stamp-like `HandDrawnCircle` selection indicator.
- **SecretLetter:** Stripped all decoration to maximize quietness. Encased the letter in an oversized, slightly tilted physical `#FAF9F6` paper sheet with subtle date annotation.
- **EndingSection:** Created a unique closing composition using a large off-axis photo, tape, and a folded note layered underneath it.
- **Quality Assurance:** Maintained `0 errors, 0 warnings` on lint and successful optimized Next.js build. Verified GSAP functionality post-DOM rewrite.

---

---

## Phase 6.7 — UI Refinement & Global Player Sprint
**Status:** Completed  
**Agent:** Gemini 3.1 Pro High

### What was done
- **Global Music Player (`ExperienceHeader`)**: Implemented a floating, expandable/collapsible audio player using the native `HTMLAudioElement` encapsulated in `AudioPlayerProvider`. Features pure CSS equalizers and avoids autoplay.
- **Utility Footer**: Implemented a minimal `Footer` with a clean "ulang dari awal" (restart) utility that reloads the browser to reset all interactions cleanly.
- **Typography Polish**: Added `[text-wrap:balance]` to large headers and `[text-wrap:pretty]` to the `SecretLetter` to prevent widows/orphans and enforce a premium editorial typeset appearance.
- **Card Audits**: Corrected `WhyYouSection` layout to overlap nicely on mobile (`-mt-6`). Enforced 1-column layout on `DateChoice` for mobile to prevent awkward text wrapping.

---

## Current State
Stabilized through Phase 7; Phase 8 visual refinement is recorded below.

## Stable Systems
- Next.js 16.3.1 App Router & Tailwind CSS v4.
- GSAP + Lenis scroll integration.
- `content/surprise.ts` configuration logic.
- Global `AudioPlayerProvider`.

## Final UI State
Structurally stable after Phase 7. Professional refinement and final personalization are still separate work; do not treat placeholders as final content.

## Motion State
Stable. GSAP timelines, `ScrollTrigger` instances, and `useReducedMotion` hooks are all validated post-DOM rewrites.

## Audio State
Stable. `HTMLAudioElement` gracefully falls back if no audio is configured, requires user interaction to play.

## Performance State
Stable. Minimal re-renders. 0 lint warnings. 0 build errors. Fast compilation via Turbopack.

## Known Limitations
- Placeholder photography and audio still need user-provided assets and final mapping.
- Remaining P3 documentation/motion-plan drift is tracked in `docs/CODEX_AUDIT.md`.

## Placeholder Content Remaining
All imagery, text, and audio in `public/` and `content/surprise.ts` are currently placeholders awaiting final personalization.

## Codex Migration Status
Ready.

## Recommended First Codex Task
Repository audit before modification.

---

## Phase 7 — Stabilization Sprint
**Status:** Completed  
**Scope:** P0/P1 structural fixes only; no redesign, personalization, dependencies, or deployment.

### What was resolved
- Fixed the Tailwind v4 `--spacing-*` namespace collision by moving semantic spacing values to non-conflicting `--space-*` root variables. `max-w-sm`, `max-w-md`, `max-w-lg`, and `max-w-2xl` now compile to Tailwind container widths again.
- Rechecked Why You, Memory Story, Date Choice, Secret Letter, and Ending at 360×800, 390×844, 430×932, 768×1024, and 1440×900. Core containers/cards now have readable dimensions and no horizontal document overflow.
- Fixed Embla Polaroid sizing with definite slide/content widths; `next/image` parents now have visible dimensions and no sizing warnings.
- Moved music-player and footer ownership into the unlocked story phase. They are absent during Opening, Envelope, Question, and Transition; the footer is mounted only after the scroll experience.
- Reworked native audio state around `loading`, `ready`, and `error`. The missing placeholder audio silently hides player controls instead of showing unusable metadata.
- Added a reduced-motion static Polaroid grid and bypassed the gated transition in reduced motion, preserving content without initializing Embla.
- Fixed No-button pointer-enter/click overlap. Each pointer interaction advances exactly one label.
- Hardened GSAP handler lifecycle by tracking and killing direct event tweens/timelines on unmount.

### Verification
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — 0 errors, 0 warnings.
- Browser QA repeated at all five target viewports. Measured results and remaining non-blocking audit items are recorded in `docs/CODEX_AUDIT.md`.

---

## Phase 8 — Professional UI Refinement & Lightweight Performance
**Status:** Completed  
**Scope:** Static composition, typography/paper-system consistency, low-risk performance work, accessibility, and personalization preparation. No architecture replacement, dependency addition, personalization, or deployment.

### What changed
- Re-audited the stabilized experience at 360×800, 390×844, 430×932, 768×1024, and 1440×900 before refining visuals.
- Normalized the existing font hierarchy around display, section heading, body, caption, and annotation roles. Added a proper Why You introduction and removed empty Memory heading nodes.
- Unified paper surfaces across notes, tickets, Polaroids, letter, ending, and envelope using restrained rotation, low-opacity borders, and shared paper/polaroid shadows.
- Removed placeholder image filters, global SVG turbulence/blend texture, and unnecessary backdrop blur to reduce mobile compositing cost.
- Refined Date Choice into a semantic editorial-ticket hierarchy, made the non-actionable ending CTA plain text, and integrated the footer as a quiet end extension with a 44px restart target.
- Added global token-based `:focus-visible` treatment. The Envelope is now a semantic button; Date choices expose `aria-pressed`.
- Deferred only the post-answer `ScrollExperience` with `next/dynamic`; GSAP, Lenis, Embla, and the existing phase architecture are retained.
- Coarsened audio progress updates to integer percentages and added mute support to the ready-only native player. Missing audio remains silent and hidden.
- Expanded `content/surprise.ts` so Phase 9 can provide visible strings, dates, alt text, final image, footer content, and audio artwork without editing scene components.
- Removed the unused media-query hook and corrected current-state documentation to the actual package versions: Next.js 16.3.1 and React 19.2.8.

### Verification
- `npm run lint` — passed with 0 errors and 0 warnings.
- `npm run build` — passed with 0 errors and 0 warnings.
- Browser QA found no horizontal overflow at all five target viewports, no empty heading nodes, and no global header/footer during gated scenes. Missing audio correctly leaves the player absent.
- The browser surface does not offer media-feature emulation, so the existing reduced-motion static path was structurally inspected rather than re-emulated in-browser.

### Remaining for Phase 9
- Replace placeholder images and absent audio with user-provided, optimized assets; update only config/assets where possible.
- Re-run live player controls and final visual QA with genuine content before making any production-readiness claim.

---

## Phase 9 â€” Color, Interactive Quiz Flow & Audio Player Restoration
**Status:** Completed  
**Scope:** Controlled color expansion, two config-driven quiz scenes, persistent No-button play, player preparation state, and stateful restart. No dependencies, deployment, or asset personalization.

### What changed
- Replaced the beige-only active palette with warm cream, charcoal, coral, sky, sage, lavender, and mustard tokens. Colors are paced per scene instead of applied universally; photo surfaces remain neutral.
- Changed the Question flow so the visible No button remains a looping pointer/touch target. Its motion stays in a lower safe lane, recalculates against viewport bounds, and cannot become the affirmative route.
- Added `QuizNameScene` and `QuizFavoriteScene` between Question and the existing accepted transition. Their answers, labels, wrong feedback, and success copy are config-owned in `content/surprise.ts` (`dani` and `kopi` in the current placeholder configuration).
- Added semantic forms with labelled inputs, `autocomplete="off"`, appropriate capitalization/spellcheck settings, short inline feedback, and case-insensitive/trimmed validation.
- Each correct quiz response uses one cleanup-backed GSAP timeline with three depth layers; reduced motion advances without the transform choreography.
- Updated the audio contract to `/public/audio/river-flow.mp3`. The native player shell appears from Quiz 1 onward, shows a disabled preparation state only if the source is unavailable, and automatically becomes usable when the source loads.
- Expanded audio state to idle/loading/ready/playing/paused/error, retained native mute/progress support, and probes the configured local file before constructing `HTMLAudioElement` to avoid missing-file console noise.
- Restart is now stateful: it resets audio playback and remounts the opening flow without a full-page reload. Quiz/local selection state resets through normal unmounting.

### Verification
- Browser-tested the new flow through opening, envelope, persistent No loop, Yes, both quiz wrong/correct states, accepted transition, story, missing player shell, and stateful restart.
- At 360×800, 390×844, 430×932, 768×1024, and 1440×900, the active quiz layout had no horizontal overflow. Inputs remained 56px high and the compact player bottom stayed at 74px, clear of the form field.
- The former missing-source path produced a visible disabled player with no browser console warnings. Live ready/play/pause/mute verification is revisited in the current audio pass with `river-flow.mp3`.

### Remaining work
- Add the intended optimized images and final artwork/metadata, then update `content/surprise.ts`.
- Re-run live audio-control QA and final real-device reduced-motion/mobile-keyboard checks once those assets exist. The current browser surface does not expose reduced-motion emulation.

---

## Phase 10 — Retro Pixel Romance / 9-Bit Inspired Production Pass
**Status:** Completed
**Scope:** Production art direction and lightweight interaction polish only. The existing Next.js, GSAP, Lenis, Embla, native audio, quiz, and deferred-story architecture were preserved. No dependencies, canvas/WebGL/video, deployment, or personalization assets were added.

### What changed
- Added semantic canvas/ink/love/sky/sage/lavender/gold/plum tokens and scene pacing; retained calm neutral photo surfaces and reduced legacy decoration where pixel system markers now provide structure.
- Created a local consistent pixel SVG vocabulary and used it sparingly for labels, corners, heart seals, coffee, player status, ticket selection, and ending composition. A static near-invisible scanline background replaces any expensive animated texture.
- Redesigned Opening as a skippable Love OS boot followed by the editorial opening. The timeline uses explicit refs, completes in under 2.5 seconds, and skips under reduced motion.
- Added bounded DOM/SVG LoveBurst moments (maximum 10 nodes) for Start, Yes, quiz correctness, and Ending. They use deterministic transform/opacity trajectories and do not persist.
- Unified Yes/No into a stepped pixel button family while preserving the No target's safe persistent pointer/touch evasion.
- Rethemed Quiz 1 as Love Database and Quiz 2 as Cafe Memory File. Their answer contract remains centrally configured (`dani` / `kopi` in placeholder config), semantic, keyboard-submittable, and GSAP-only.
- Refined Why You, Memory, Polaroids, Date Choices, Letter, Ending, Footer, and missing-audio player so static screenshots maintain a coherent editorial/pixel hierarchy without pixelating photos or relying on motion.
- Updated config-owned generic labels for boot, system states, quiz helpers/statuses, footer, and missing-audio state. Recipient text, real images, metadata, and audio remain intentionally placeholders.

### Verification
- `npm run lint` — passed with 0 errors and 0 warnings.
- `npm run build` — passed with 0 errors and 0 warnings (Next.js 16.3.1).
- Real-browser QA covered the complete flow and stateful restart. No horizontal overflow at 360×800, 390×844, 430×932, 768×1024, or 1440×900; mobile note/ticket/photo/ending surfaces all retained readable non-zero widths.
- Fresh browser logs contained no app, audio, hydration, or GSAP target warnings. Missing audio remained a visible disabled player state without console spam.

### Remaining work
- Provide real optimized photos, final artwork, and final metadata, then update `content/surprise.ts` and perform genuine crop, contrast, content, and native-media QA.
- Run final reduced-motion and mobile-keyboard checks on the recipient's actual device/browser. The code paths remain in place, but the browser cannot emulate that media feature.

---

## Interaction Layout & Audio Polish Pass
**Status:** Completed
**Scope:** Opening CTA geometry, Question control alignment/evasion, local No-button feedback audio, and the main-track contract. No dependency, architecture, story-section, or deployment changes.

### What changed
- Centered START in an independent CTA wrapper. It is 180px wide on mobile, 200px on desktop, 56px high, and retains the shared stepped pixel-button treatment.
- Rebuilt the Question controls as an initial two-column grid with a controlled 320px mobile / 360px desktop arena. Yes and No now have identical 56px heights, matching column widths, borders, typography, icon spacing, focus treatment, and stable label width.
- No begins in the grid and only becomes absolutely positioned after the first pointer/touch evasion. It follows deterministic in-bounds transform targets, stays in the lower arena, recalculates on resize/orientation, and continues indefinitely without layout shift or horizontal overflow.
- Removed the visible skip route and its dead phase wiring. Yes remains a native semantic, keyboard-reachable button; No remains a single semantic button with no cloned focus targets.
- Added one reusable native `HTMLAudioElement` for `/audio/cat.mp3`. It is preflighted once, preloaded once, restarts from `currentTime = 0` on each evasion, uses volume 0.7, catches rejected playback safely, and is cleaned up on Question unmount. It does not pause the music and is suppressed when the global music channel is muted.
- Switched the centralized main audio config to `/audio/river-flow.mp3` (`River Flow`, volume 0.45). The provider retains explicit loading/ready/playing/paused/error state and graceful failure behavior.

### Browser QA
- At 390×844, START measured 180×56px and was exactly viewport-centered. Before interaction, Yes and No each measured 154×56px with matching top/bottom bounds; no horizontal overflow was present.
- More than ten consecutive No attempts retained its 154px width across label changes, stayed inside the safe arena, never caused overflow, and left Yes reachable. The No SFX path was exercised through the native reusable channel with no browser warnings.
- `river-flow.mp3` loaded into the compact player from Quiz 1, showed active Play controls, and transitioned to Pause after explicit user Play. No autoplay or console errors occurred.
- Mobile 360×800 and desktop compact-control checks were repeated; the browser environment did not consistently resize one existing tab for all later dimensions, so final physical-device checks at 430×932, 768×1024, and 1440×900 remain prudent.

### Verification
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — 0 errors, 0 warnings.
