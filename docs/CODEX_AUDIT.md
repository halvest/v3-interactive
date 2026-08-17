# Independent Migration Audit

## Production Data + Media Lifecycle Pass â€” 2026-08-17

### Resolved / changed findings

- **P2 opening-media composition â€” resolved.** `OpeningScene` now places its personalized image in an explicit square photo assembly after the text/content layer. The wrapper is responsive, has no text overlap, and owns its corner decoration; the image remains `object-cover` and is not a giant absolute background.
- **P2 response handling and privacy â€” resolved.** The only client telemetry target is same-origin `/api/response`, fired asynchronously on deliberate actions only. Session grouping uses a random `crypto.randomUUID()` stored in `sessionStorage` for the current tab. Quiz inputs are never sent on change; only the submitted answer is forwarded. Question/answer copy supplied by the client is not trusted for Telegram formatting.
- **P2 Telegram secret boundary â€” resolved.** The Route Handler is the sole Telegram caller and reads unprefixed `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` on the server. It limits body size, validates documented event types and known content IDs, rejects malformed input with 400, uses the server receipt time, and never returns Telegram details or credentials to the browser. Missing configuration yields a harmless disabled response.
- **P2 media lifecycle â€” resolved.** One provider-owned page lifecycle effect pauses background music and stops active cat SFX on `pagehide` and document hidden. No listeners are installed per re-render, no extra RAF is introduced, the header receives the native paused event, and return visibility does not resume music.

### QA evidence

- Real browser inspection at 360Ã—800, 390Ã—844, 430Ã—932, 768Ã—1024, and 1440Ã—900 measured the opening assembly as square (268â€“417px bounds), with `object-cover`, no heading collision, and no horizontal document overflow.
- Full-flow spot QA confirmed relationship/quiz progression and normal versus D3 date behavior. D3 showed the existing meme while remaining unselected; normal date choice remained selected. The disclosure is visible before affirmative Question submission.
- With Telegram environment variables absent, `POST /api/response` returned HTTP 200 `{ "ok": true, "disabled": true }`; an unknown event produced HTTP 400. Source and client-static scans found no Telegram secret references outside the server route and no direct Telegram browser call.

### Remaining open items

- **P3 Telegram delivery QA:** Configure the two server-only environment variables in the eventual host and confirm messages arrive. No credentials were created, read, or exposed during this pass.
- **P3 actual-device lifecycle QA:** Browser automation cannot audibly verify the SFX mix or reliably simulate every browser/pagehide implementation. The native listener paths are in code and must not auto-resume music.

## Production Interaction Fix â€” 2026-08-17

### Resolved / changed findings

- **P2 scrapbook parallax ownership â€” resolved.** `MemoryStory` no longer applies separate ScrollTrigger transforms to image, tape, and caption. Each scene now has one shared `.memory-photo-assembly` transform parent containing the photograph and every physically attached surface. Captions/text that are intentionally editorial remain an independent layer. The five existing scenes retain one scrubbed timeline each, use `invalidateOnRefresh`, and calculate restrained 20/32/48px responsive transforms on refresh.
- **P2 D3 unavailable-date interaction â€” resolved.** Date Choice is configuration-driven: D3 owns a `specialInteraction` payload for `/images/cat-laugh.gif`, `/audio/cat.mp3`, exact copy, and panel labels. Neither D3 option mutates selected state; both route to a single reusable modal. Normal choices remain selectable and completion tracks only available choices.
- **P2 modal/accessibility â€” resolved.** `MemeOverlay` is an event-driven dialog with explicit ARIA labelling, initial focus, Escape and button dismissal, focus restoration, safe-area-aware constrained panel/GIF sizing, and scroll restoration. It ignores duplicate triggers while mounted and has no added ScrollTrigger, RAF, or persistent GIF node.
- **P2 SFX lifecycle â€” resolved.** The new local `useSoundEffect` hook preflights and preloads one native audio object, restarts it safely, catches rejected play promises, resets on close/unmount, and respects global mute. Main `river-flow.mp3` continues independently.

### QA evidence

- Live browser inspection completed the gated flow through both quizzes and loaded the story with five `.memory-photo-assembly` nodes. Attachment queries found no `memory-tape` or `memory-caption` node outside an assembly.
- D3 option A opened one dialog with `LOVE SYSTEM / REQUEST DENIED`, the configured GIF, exact `Gabisa yee kan Virtual` copy, and a focused `oke deh` close control. Its underlying `aria-pressed` state remained `false`; body scrolling locked while open.
- Production lint and build both pass with no errors or warnings. Browser console review prior to the browser-session timeout showed no application, GSAP, hydration, or image errors.

### Remaining open items

- **P3 physical device evidence:** A target handset should confirm the audible SFX balance and final native touch/Escape behavior. The code and browser-visible interaction meet the contract; automated browser audio is not audible and long multi-scene mobile runs can exceed its session limit.
- **P3 personalization:** this pass did not alter the existing personalized photos or text. Final content/crop/contrast sign-off remains separate.

**Date:** 2026-08-17  
**Scope:** Current repository implementation, not prior handoff claims. No application code was modified.

## Verification performed

- Read the required project, architecture, design, motion, progress, interaction-audit, content, and package files in full.
- Inspected the complete current component tree and generated Tailwind CSS.
- Ran `npm run lint` — passed.
- Ran `npm run build` — passed (the sandbox initially blocked Next's type-check worker with `spawn EPERM`; the same production build completed successfully with the required worker permission).
- Ran the local application in a real browser at **360×800, 390×844, 430×932, 768×1024, and 1440×900**.
- Exercised Opening → Envelope → Question → No-button attempts → Yes → Transition → Why You → Memory Story → Polaroids → Date Choices → Letter → Ending → Footer/Restart. Also inspected the expanded/collapsed player, failed placeholder-audio playback, and restart behavior.
- Browser media emulation was not exposed by the available browser surface, so reduced-motion findings combine source inspection with verification of the static layout. This is called out explicitly below.

## Executive assessment

The underlying choices are sensible: App Router, native audio, GSAP, Lenis, Embla, and a configuration file are appropriate for the experience. The production experience is nevertheless **not ready for UI refinement or personalization**. A Tailwind token collision collapses central layouts across every required viewport; it makes the accepted story visibly broken even though lint and build pass. The previous “pristine/no P1 issues” report is therefore not accurate.

## Findings

### P0 — Broken

#### P0-1 — Semantic spacing tokens override Tailwind container widths and collapse core layouts

- **Component/file:** `app/globals.css`; impacts `WhyYouSection.tsx`, `DateChoice.tsx`, `EndingSection.tsx`, and any `max-w-sm`, `max-w-md`, `max-w-lg`, or `max-w-2xl` usage.
- **Issue:** Custom `@theme` declarations such as `--spacing-md: 16px`, `--spacing-lg: 24px`, and `--spacing-2xl: 48px` collide with Tailwind v4's size namespace. The compiler consequently emits `.max-w-md { max-width: var(--spacing-md) }` and `.max-w-2xl { max-width: var(--spacing-2xl) }`, rather than the intended container sizes.
- **Evidence:** Generated CSS contains `.max-w-2xl { max-width: var(--spacing-2xl) }`. In the live accepted story, the Why You container and Date Choices container measured **48px wide** at 360, 390, 430, 768, and 1440px; Why cards measured roughly 30–31px after rotation. The Ending note measured 71px at mobile and 105px at desktop. Screenshots at 360px and 1440px show vertically wrapped, unreadable cards.
- **Recommended fix:** Remove or rename the custom `--spacing-*` declarations so they do not redefine Tailwind's built-in utility namespace. Use a separate semantic token prefix outside the Tailwind theme (for example `--space-section-mobile`) and retain Tailwind's container tokens. Re-verify every `max-w-*` utility afterward.
- **Expected visual/performance impact:** Restores intended card and composition widths across all viewports with no runtime cost. It is the necessary first implementation task.

### P1 — Serious UX/performance issue

#### P1-1 — The player and footer are mounted during the gated fullscreen flow, creating scroll and visual interference

- **Component/file:** `app/layout.tsx`, `components/ui/ExperienceHeader.tsx`, `components/ui/Footer.tsx`.
- **Issue:** The fixed header appears two seconds after mount, not after the user's first interaction or story unlock. The footer is rendered in normal document flow while Opening, Envelope, and Question are fixed layers.
- **Evidence:** At 360×800, the player is visible over the opening composition. The page has a 992px scroll height during a fixed 800px question scene, leaving a visible scrollbar and footer below the locked scene. The source confirms that layout always renders both `ExperienceHeader` and `Footer`; the header uses only a 2-second timeout.
- **Recommended fix:** Make story chrome phase-aware: keep both player and footer out of the gated flow, then render or reveal them once the scroll experience is available. Reserve a compact safe area for the player within scroll sections instead of covering their content.
- **Expected visual/performance impact:** Removes false scroll affordance and visual obstruction in the highest-attention scenes; makes the footer feel like a conclusion rather than a separate page shell.

#### P1-2 — Missing audio does not use the claimed fallback

- **Component/file:** `content/surprise.ts`, `components/audio/AudioPlayerProvider.tsx`, `components/ui/ExperienceHeader.tsx`.
- **Issue:** The configured `/audio/placeholder.mp3` does not exist, but `hasAudio` only checks whether a config object exists. The player is displayed with fake title/artist data and its Play control quietly returns to the stopped state after failure.
- **Evidence:** `public/audio/placeholder.mp3` is absent. Live clicking Play left the button labelled Play and no usable playback state; the full header remained visible. This contradicts the documented fallback “hide the audio button entirely.”
- **Recommended fix:** Track media readiness/error separately from configuration. Hide or disable the player with a clear non-interactive fallback after `error`/failed `play()`, and do not ship placeholder music metadata as production UI.
- **Expected visual/performance impact:** Prevents a broken global control from occupying the opening and scroll experience; avoids misleading interaction before personalization.

#### P1-3 — Polaroid carousel renders zero-size photos

- **Component/file:** `components/sections/PolaroidStack.tsx`, `components/ui/Polaroid.tsx`.
- **Issue:** The slide's immediate wrapper is shrink-to-fit while the Polaroid asks for `w-full`; that percentage has no definite parent width. The image wrapper therefore resolves to zero width/height in the live carousel. This is separate from the Tailwind `max-w-*` collision.
- **Evidence:** At 360×800, visible Polaroid images measured `0 × 0`; the only visible artifact was a narrow white strip and annotation. Next emitted: image with `fill` has a parent with height 0. The carousel's section heading rendered, but the promised photos did not.
- **Recommended fix:** Give the direct slide child a concrete width, such as `w-full max-w-[300px]`, or make the Polaroid itself the flex item with a definite basis. Then verify drag and partial-slide composition at each target width.
- **Expected visual/performance impact:** Restores the central photography interaction and removes zero-height image warnings without adding runtime work.

#### P1-4 — Reduced-motion behavior does not meet the documented static fallback

- **Component/file:** `components/sections/PolaroidStack.tsx`, `components/experience/EnvelopeScene.tsx`, `components/experience/OpeningScene.tsx`, `components/experience/QuestionScene.tsx`.
- **Issue:** Reduced motion only removes active Polaroid rotation/scale; Embla is still initialized with `watchDrag: true` rather than replaced by the documented static grid. Envelope entrance animation is unconditional, and several handlers create GSAP tweens outside a reduced-motion-specific path.
- **Evidence:** Source inspection: `useEmblaCarousel()` always runs; the reduced-motion boolean only changes slide transforms. Envelope's entrance `useGSAP` always animates, while the global CSS rule cannot cancel GSAP inline tweening. The browser surface did not expose media-feature emulation, so this item could not be fully runtime-emulated without changing the test environment.
- **Recommended fix:** Branch to a semantic static Polaroid list/grid before initializing Embla, and make reduced mode use immediate state changes for all gated scenes. Test with `prefers-reduced-motion: reduce` in a browser that supports media emulation.
- **Expected visual/performance impact:** Makes the experience professional and readable without motion, lowers CPU work, and meets the stated accessibility contract.

### P2 — Meaningful visual/technical improvement

#### P2-1 — Initial client boundary ships the whole experience instead of deferring the post-answer story

- **Component/file:** `components/experience/SurpriseExperience.tsx`, `components/experience/TransitionScene.tsx`, `components/experience/ScrollExperience.tsx`.
- **Issue:** Conditional rendering does not defer imports. `SurpriseExperience` imports Transition, Transition imports ScrollExperience, and ScrollExperience statically imports all sections, Lenis, GSAP, and Embla.
- **Evidence:** The source dependency chain is present on first render; there is no `next/dynamic` boundary despite the architecture document's explicit loading plan. This makes the opening client boundary larger than necessary.
- **Recommended fix:** Add a narrowly scoped dynamic import for the post-answer scroll experience/transition boundary while preserving the existing GSAP + Lenis architecture.
- **Expected visual/performance impact:** Improves opening parse/evaluation cost and responsiveness on mobile; no visual change.

#### P2-2 — Several GSAP event tweens are outside `useGSAP` context cleanup

- **Component/file:** `OpeningScene.tsx`, `EnvelopeScene.tsx`, `QuestionScene.tsx`.
- **Issue:** `handleComplete`, `handleTap`, `handleYesClick`, `handleNoClick`, and the Question `useEffect` create direct GSAP tweens rather than context-safe handlers. This deviates from the project’s lifecycle rules and makes cleanup/reversion less certain during unmounts or rapid interaction.
- **Evidence:** Each named handler directly invokes `gsap.to()`/`gsap.timeline()`; only the entrance timelines live inside scoped `useGSAP` calls.
- **Recommended fix:** Use each component's `contextSafe` handler or explicit tween references with cleanup. Preserve the present animations; this is a lifecycle correction, not an architecture change.
- **Expected visual/performance impact:** Prevents stray transforms/tweens under rapid navigation and React strict-mode remounting; no intentional visual change.

#### P2-3 — No-button input can increment twice from a single pointer click

- **Component/file:** `components/experience/QuestionScene.tsx`.
- **Issue:** The wrapper handles `onPointerEnter` and the nested button handles `onClick`; clicking can fire both while `isEvading` is still true.
- **Evidence:** In the real browser, the first click changed `Nggak` directly to `Serius?`, skipping `Yakin?`. The next click made it `Aku pikir dulu`, so the intended three-step interaction was shortened.
- **Recommended fix:** Choose one event path per pointer modality, or suppress the click action when the current pointer-enter evasion consumed the interaction. Keep keyboard focus/activation independent.
- **Expected visual/performance impact:** Restores predictable playful behavior and reduces unnecessary state updates.

#### P2-4 — Audio progress propagates needless context updates through a global provider

- **Component/file:** `components/audio/AudioPlayerProvider.tsx`, `components/ui/ExperienceHeader.tsx`.
- **Issue:** Every `timeupdate` calls `setProgress`, recreating the provider value and notifying all audio consumers. The global provider also wraps the entire application.
- **Evidence:** `progress` is React state updated from the native audio event; Header and Footer both consume the same context even though Footer only needs `pause`.
- **Recommended fix:** Split stable controls from playback-progress state, or throttle progress updates to the visual requirement. Keep the native `HTMLAudioElement` provider.
- **Expected visual/performance impact:** Less work while music plays, especially on lower-end devices; no visual loss if the progress bar updates at a modest cadence.

#### P2-5 — Photography and decoration treatment contradict the design direction and adds avoidable compositing work

- **Component/file:** `OpeningScene.tsx`, `MemoryStory.tsx`, `Polaroid.tsx`, `Decorations.tsx`, `ExperienceHeader.tsx`.
- **Issue:** Placeholder photos receive sepia/contrast/grayscale treatment; the app also has a permanent full-viewport SVG turbulence overlay with `mix-blend-mode`, multiple backdrop blurs, and animated equalizer bars.
- **Evidence:** The source applies image filters in Opening, Memory, Polaroid, and Ending; inactive carousel slides use grayscale. `PaperTextureOverlay` is fixed at z-index 100 with `feTurbulence`; header and paper tape use `backdrop-filter`.
- **Recommended fix:** When real photography arrives, remove image filters and limit the fixed texture/blur layers after profiling a mid-range mobile device. Treat paper texture as a subtle optional enhancement rather than a global compositor layer.
- **Expected visual/performance impact:** More authentic photography, cleaner editorial depth, and less GPU/compositing pressure.

#### P2-6 — Typography hierarchy and content composition are weak before motion is considered

- **Component/file:** `WhyYouSection.tsx`, `MemoryStory.tsx`, `DateChoice.tsx`, `EndingSection.tsx`, `Footer.tsx`.
- **Issue:** Why You has no section heading; first/second Memory archetypes render empty headings when a memory has no `title`; Date Choices relies on repeated large display type; Ending ends in a cursor-pointer `span` without an action. The global footer uses hard-coded, low-emphasis text and is visually detached from the ending.
- **Evidence:** Current config leaves the first two memory titles undefined, producing empty `h3` elements in the live DOM. The final CTA is a `span`, not a button or link. The desktop and mobile layouts show no readable hierarchy for the collapsed cards.
- **Recommended fix:** After P0-1, establish a concise section heading/lead for Why You; omit empty heading nodes; make the ending CTA either actionable or plain text; integrate the footer's restart affordance into the ending composition.
- **Expected visual/performance impact:** Higher perceived craft and clearer narrative hierarchy at no runtime cost.

#### P2-7 — Header and button focus treatment is below the documented accessibility standard

- **Component/file:** `components/ui/Button.tsx`, `components/ui/ExperienceHeader.tsx`, `components/ui/Footer.tsx`, `app/globals.css`.
- **Issue:** Interactive controls have hover/active classes but no deliberate `:focus-visible` ring/offset. The documented focus treatment is not implemented.
- **Evidence:** Source search finds no `focus:` or `focus-visible:` classes in application controls. Native focus therefore depends on browser defaults and can be hard to see over paper textures.
- **Recommended fix:** Add a shared `focus-visible` ring and offset matching the design tokens to Button, player controls, footer restart, choice tickets, and carousel controls.
- **Expected visual/performance impact:** Reliable keyboard affordance with negligible runtime cost.

#### P2-8 — Personalization is structurally partial, not ready to ship

- **Component/file:** `content/surprise.ts`, `components/experience/EnvelopeScene.tsx`, `components/sections/SecretLetter.tsx`, `components/ui/Footer.tsx`.
- **Issue:** All memory images and the final image use the same placeholder; audio is absent; several user-facing strings are hard-coded outside config (`for you.`, `hi.`, `tap to open`, `Yours.`, footer copy/year). Content types also lack dedicated descriptive alt text.
- **Evidence:** All five memories target `/images/placeholder.svg`; final image is hard-coded; no audio file exists; UI strings cited above are present in components. Image alt falls back to title/caption and becomes generic for several memories.
- **Recommended fix:** Extend the configuration with per-image `alt`, opening/envelope/supporting labels, sign-off/footer copy, ending image, and a deliberate date value. Map real optimized photos and audio before visual sign-off.
- **Expected visual/performance impact:** Makes the experience genuinely personal and accessible; real photos will also make compositional decisions easier to evaluate.

### P3 — Optional polish

#### P3-1 — Unused media-query hook and stale planning/documentation drift

- **Component/file:** `lib/hooks/useMediaQuery.ts`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`.
- **Issue:** `useMediaQuery` has no imports. Several documents prescribe server-heavy leaves, a dynamic scroll import, a pinned memory scene, an interactive Why You reveal, and a static reduced-motion carousel that the code does not implement.
- **Evidence:** Repository search finds only the hook's definition. Source and live behavior differ from the documented plans in the listed areas.
- **Recommended fix:** Remove unused code when convenient and update documentation after implementation behavior is settled; do not treat aspirational architecture text as proof of behavior.
- **Expected visual/performance impact:** Reduces maintenance ambiguity; no direct runtime change.

#### P3-2 — Runtime date and hard-coded final details reduce determinism

- **Component/file:** `components/sections/SecretLetter.tsx`, `components/ui/Footer.tsx`.
- **Issue:** The letter date is generated with `new Date()` at render time while the footer year is fixed to 2026. Neither is controlled by the content config.
- **Evidence:** The live letter rendered “17 Agustus 2026”; source computes the date at render time.
- **Recommended fix:** Put intentional date/sign-off/footer values in configuration, or omit them until personalization is supplied.
- **Expected visual/performance impact:** Prevents date drift and makes the artifact feel authored rather than templated.

#### P3-3 — Header timeout has no cleanup and scroll state can be simplified

- **Component/file:** `components/ui/ExperienceHeader.tsx`.
- **Issue:** The visibility timeout is not cleared on unmount. The scroll listener sends state updates on every scroll event even when the boolean has not changed.
- **Evidence:** The first effect calls `setTimeout` without retaining its handle; `handleScroll` always calls `setIsScrolled`.
- **Recommended fix:** Clear the timeout and only commit the scroll state at threshold crossings.
- **Expected visual/performance impact:** Small cleanup and event-work reduction.

## What should be preserved

- The App Router / TypeScript / Tailwind / GSAP / Lenis / Embla stack; no extra animation or UI library is needed.
- The hybrid gated-flow followed by a continuous scroll narrative.
- Native `HTMLAudioElement` ownership in a provider, rather than adding an audio dependency.
- Scoped `useGSAP` entrance and ScrollTrigger timelines already present in the scroll sections.
- Lenis' `autoRaf: false` plus GSAP ticker synchronization and ticker cleanup.
- The restrained palette, serif/sans/annotation font roles, and intentional use of SVG decorations.

## What is genuinely strong

- Lint is clean and the production build succeeds.
- The root server layout and page remain server components; client behavior is compartmentalized into meaningful files.
- ScrollTrigger count is modest: the current source creates five Memory timelines plus one trigger each for Date Choice, Secret Letter, and Ending, staying below the stated threshold.
- The transition is narratively clear, restart truly returns to Opening, and the audio player's expanded/collapsed controls are operable.
- The Question flow retains a genuine eventual alternative rather than trapping the user indefinitely.

## What still looks weak

- The accepted experience is visually broken at every tested viewport because central cards collapse to narrow strips.
- The opening is contaminated by placeholder music UI and a global header before the story begins.
- The carousel currently shows annotations and blank slivers rather than photographs.
- Without animation, the composition has no dependable static reduced-motion fallback for the carousel and several gated scenes.
- Placeholder imagery/copy, hard-coded support text, and filtered photos make it feel like a template rather than a personal artifact.

## Top five UI improvements: highest impact, lowest runtime cost

1. Fix the Tailwind token collision (P0-1).
2. Give the Polaroid slide content a definite width (P1-3).
3. Make header/footer phase-aware and reserve space for the player only in the unlocked story (P1-1).
4. Rebuild the reduced-motion experience as a clear static layout, especially the Polaroids (P1-4).
5. Establish static typography hierarchy: Why You heading, non-empty memory headings, actionable/quiet ending, and integrated restart (P2-6).

## Technical risks

- Direct GSAP handler tweens sit outside the lifecycle context prescribed by the repository.
- No-button pointer enter/click overlap produces non-deterministic progress.
- The current client import graph defeats the intended post-answer loading boundary.
- Documentation is materially ahead of implementation in several motion/accessibility areas, so code and browser checks must remain the source of truth.

## Performance risks

- Whole-story client code, including Embla and scroll systems, is loaded from the initial interaction tree.
- Audio `timeupdate` triggers global provider updates.
- Persistent turbulence/blend layers, image filters, and backdrop blurs can be costly on mobile GPUs.
- Reduced motion still initializes Embla, leaving avoidable interaction and layout work.

## Personalization readiness

**Not ready.** The model is a useful start, but every photograph is the same placeholder, the configured audio file is missing, metadata is placeholder copy, and visible support strings/date/footer content live outside configuration. First make the static layout correct; then add image alt text and map genuine photos/audio through an expanded config.

## Recommended first implementation task

**Repair the Tailwind spacing-token namespace collision in `app/globals.css`, then rerun the complete five-viewport visual audit before any cosmetic changes.** This single correction unlocks meaningful evaluation of card proportions, typography, spacing, composition, and photography without changing the application architecture.

---

## Stabilization sprint update — 2026-08-17

### Resolved P0/P1 items

- **P0-1 — Resolved.** Semantic spacing tokens moved from Tailwind's `--spacing-*` theme namespace to non-conflicting `--space-*` root variables. Production CSS now supplies Tailwind containers (`--container-sm: 24rem`, `--container-md: 28rem`, `--container-lg: 32rem`, and `--container-2xl: 42rem`) to the corresponding `max-w-*` utilities.
- **P1-1 — Resolved.** Header and footer are now owned by the `story` phase in `SurpriseExperience`; they are absent from Opening, Envelope, Question, and Transition. A 360×800 gated scene now measures exactly 800px document height with no header/footer DOM.
- **P1-2 — Resolved.** Native audio now exposes `loading`, `ready`, and `error` states. The player renders only after `canplay`; the absent placeholder file produces no header, fake controls, or browser console warnings.
- **P1-3 — Resolved.** Embla slides and their direct content wrappers now have definite responsive widths. At 390×844, a live Polaroid image measured 243×243px with no `next/image` sizing warning.
- **P1-4 — Resolved in implementation.** Reduced motion bypasses the transition phase, Lenis and Memory parallax remain bypassed, and Polaroids render a static semantic grid without initializing Embla. The available in-app browser does not expose media-feature emulation, so this fallback was verified structurally rather than with an emulated `prefers-reduced-motion` browser session.

### Additional stabilization completed

- No-button pointer enter/click overlap is fixed. Real-browser click progression is now `Nggak` → `Yakin?` → `Serius?` → `Aku pikir dulu` without skipped labels.
- Direct event-handler GSAP tweens/timelines are explicitly retained and killed on component unmount; gated reduced-motion actions complete immediately.
- Why You clips only decorative edge overflow, preventing it from expanding the document width.

### Post-fix browser measurements

All values are CSS pixels. `overflow` was false at every target viewport.

| Viewport | Why container | Why card | Date container | Ticket | Polaroid card | Ending note |
|---|---:|---:|---:|---:|---:|---:|
| 360×800 | 305×518 | 330×200 | 305×888 | 302×125 | 253×295 | 309×175 |
| 390×844 | 335×501 | 358×204 | 335×888 | 302×125 | 268×308 | 335×175 |
| 430×932 | 375×511 | 394×208 | 375×888 | 302×125 | 298×338 | 369×176 |
| 768×1024 | 672×739 | 455×236 | 672×591 | 223×169 | 263×303 | 452×254 |
| 1440×900 | 672×739 | 455×236 | 672×591 | 223×169 | 320×360 | 452×254 |

### Verification after stabilization

- `npm run lint` — passed with 0 errors and 0 warnings.
- `npm run build` — passed with 0 errors and 0 warnings.
- Browser QA repeated at 360×800, 390×844, 430×932, 768×1024, and 1440×900.
- The experience no longer exposes global chrome during gated scenes; the missing-audio path is quiet; Polaroids have visible image dimensions; and the accepted story has natural, readable card widths.

---

## Phase 8 refinement update — 2026-08-17

### Re-audit outcome

The post-stabilization layout is materially different from the original audit: container geometry is sound at all target widths, but the visual system still needed a restrained typography and paper-composition pass. The principal weaknesses were abrupt Why You entry, excessive decorative rotation, empty Memory headings, filtered placeholders, form-like date tickets, a runtime-authored letter date, and a footer that read as a detached page shell.

### Resolved P2/P3 items

- **P2-1 — Resolved.** `ScrollExperience` is now a narrow `next/dynamic` client boundary. Opening, Envelope, Question, and Transition no longer eagerly import Lenis, Embla, or post-answer sections. The loading shell is only reachable after the story unlocks.
- **P2-4 — Resolved.** Native `timeupdate` progress is coarsened to integer percentage changes before updating provider state. This preserves the progress bar while avoiding event-level context churn. The player also has an explicit native mute control when audio is ready.
- **P2-5 — Resolved.** Removed the permanent full-screen `feTurbulence`/blend overlay, image sepia/contrast/grayscale filters, and small backdrop blurs. Paper depth now comes from low-opacity borders and documented paper/polaroid shadows instead of compositing-heavy effects.
- **P2-6 — Resolved.** Why You has a semantic editorial introduction; Memory headings are omitted when content has no title; date choices use a deliberate label/heading/supporting-line hierarchy; the ending CTA is plain text because it has no action; and the footer is now a quiet continuation with a real restart button.
- **P2-7 — Resolved.** A single accent `:focus-visible` outline and offset now covers buttons and button-like controls, including tickets, player controls, envelope, and restart. The envelope is a semantic button, so the gated flow is keyboard reachable.
- **P2-8 — Structurally resolved; asset delivery remains open.** Config now owns opening preview/image alt, envelope labels, Why You/date-choice supporting copy, per-memory alt text, letter date/sign-off, ending image/alt, footer copy/year/restart, and audio cover alt. Real photos/audio are intentionally still absent pending Phase 9 personalization.
- **P3-1 — Partially resolved.** Removed unused `useMediaQuery`. Package-version drift in current-state documentation has been corrected to Next.js 16.3.1 / React 19.2.8 and the actual installed animation stack. Aspirational motion-plan drift remains documentation-only and should be reconciled only when the implementation changes.
- **P3-2 — Resolved.** The letter date is deterministic configuration, not `new Date()`, and the footer year is config-owned.

### Browser QA after refinement

- Checked Opening, Envelope, Question, Why You, Memory Story, Polaroids, Date Choice, Secret Letter, Ending, footer/restart, and the missing-audio story path at 360×800, 390×844, 430×932, 768×1024, and 1440×900.
- No horizontal overflow at any target size. Section widths at the browser's scrollbar-adjusted content area were 345px/375px/415px/753px/1425px respectively, with all primary section surfaces remaining non-zero and readable.
- At 360px, Date tickets measure 306×131px and restart measures 126×44px. Polaroid slides retain intentional partial neighboring-card visibility, and the static Why You stack is readable without relying on animation.
- The missing configured audio file keeps the phase-aware player out of the DOM; no fake controls are displayed. The ready-player UI has been reviewed structurally after adding mute, truncation, safe-area placement, and focus treatment; playback cannot be exercised until an actual audio asset is supplied.
- Keyboard focus was verified in the real browser: the active control receives the accent outline and 4px offset. The envelope is now keyboard-semantic. The browser harness did not expose media-feature emulation, so reduced-motion behavior remains verified from the explicit static branches introduced in Phase 7 rather than a second emulated session.

### Remaining open items

- **P3 — Personalization assets:** replace every placeholder image and the absent audio file with optimized real assets, then do a final content/contrast pass with those assets. This is intentionally deferred to Phase 9.
- **P3 — Player live-media QA:** verify play/pause, mute, artwork crop, and progress behavior once a real audio source exists. The current missing-source fallback is the expected state.
- **P3 — Motion-documentation drift:** `docs/MOTION_SYSTEM.md` still contains aspirational details not present in the implementation (for example, a pinned Memory scene). Keep code/browser behavior as the source of truth until such features are explicitly commissioned.
- **P3 — Visual sign-off:** placeholders cannot establish final photography treatment, emotional copy fit, or true mobile paint cost. The composition is ready for that final pass, not declared production-ready.

---

## Phase 9 implementation update — 2026-08-17

### Resolved / changed findings

- **P2-6 follow-up — Resolved.** The static composition now has deliberate color pacing: controlled sky, sage, lavender, coral, and mustard accents distinguish scenes while Polaroids/photos remain neutral. No full-screen texture, photo filter, or high-cost blur was reintroduced.
- **P2-8 follow-up — Improved.** Quiz prompts, accepted answers, feedback, and the central audio contract are owned by `content/surprise.ts`. The remaining personalization work is asset/copy replacement, not scene-logic work.
- **P3 player fallback — Changed by product requirement.** A missing configured file no longer hides the header. The phase-aware shell stays visible from Quiz 1 onward with disabled controls and `music belum tersedia`; a lightweight HEAD probe suppresses native-media missing-file console spam. A valid configured source activates the native player automatically.
- **P3 restart — Resolved.** Restart no longer reloads the page. It resets native audio and remounts the gated flow, which clears quiz and story-local interaction state.

### New QA evidence

- The complete new route was exercised in a real browser: Opening → Envelope → persistent No attempts → Yes → wrong/correct name quiz → wrong/correct favorite quiz → accepted transition → Story → player preparation state → stateful restart.
- `dani`, `DANI`, and whitespace-padded `DANI` pass Quiz 1; `kopi` is the case-insensitive Quiz 2 answer. Wrong answers leave the input value in place and show short inline feedback.
- After five pointer attempts at 390×844, the No label loop returned to `yakin?` and its measured bounds were 136px–247px horizontally and 575px–620px vertically, inside the 390×844 viewport; document overflow remained zero.
- Quiz form checks at 360×800, 390×844, 430×932, 768×1024, and 1440×900 found zero horizontal overflow. Input heights were 56px at every size; the compact player ended at 74px from the viewport top, well above the input.
- Fresh browser logs were empty during the missing-audio path. The browser harness cannot emulate `prefers-reduced-motion`, so Phase 9 reduced-motion verification remains code-path/structural rather than emulated runtime evidence.

### Remaining open items

- **P3 — Real audio QA:** validate native play/pause/mute/progress and artwork crop in the ready state after final media metadata is provided.
- **P3 — Final personalization:** placeholders still prevent final image composition, contrast, and copy-fit sign-off.
- **P3 — Device QA:** validate native mobile keyboard resize and reduced-motion behavior on the target phone/browser when available.

---

## Phase 10 production visual pass — 2026-08-17

### Resolved / improved P2 visual follow-up

- **P2 visual language — improved.** The stabilized composition now has a single retro-modern asset system: semantic production tokens, local lightweight pixel SVGs, compact system labels, and one stepped button family. Legacy flowers, scribble circles, and paperclips were reduced where the pixel system now carries structure; paper/photos remain calm and readable.
- **P2 opening distinction — resolved.** Opening now begins with a skippable Love OS pixel boot, then reveals the editorial opening rather than replacing it with game UI. The sequence uses explicit mounted refs and produces no GSAP target warnings.
- **P2 question coherence — resolved.** Yes and No share physical geometry, height, padding, border, shadow, and focus treatment. The pointer/touch No target continues to evade only inside its measured lower safe lane.
- **P2 quiz and player — improved.** Quiz 1 is a sky/coral Love Database note; Quiz 2 is a sage/gold Cafe Memory File with local pixel coffee. The native player remains an intentional rectangular shell from Quiz 1 onward; missing audio displays a disabled preparation state with no native-media error noise.

### QA evidence

- A fresh real-browser run at 390×844 completed boot → Start → Envelope → evasive No → Yes → wrong/right Name → wrong/right Favorite → Transition → Story → Restart. Correct whitespace/case-insensitive values passed; wrong answers stayed inline; restart restored boot, scroll position 0, and removed player chrome.
- Responsive inspection at **360×800, 390×844, 430×932, 768×1024, and 1440×900** found no horizontal overflow. Mobile Why notes measured 306–377px wide, tickets 306–341px, Polaroid photo surfaces 306–366px, and ending notes 307–377px; tablet/desktop cards were likewise non-zero and readable.
- Fresh browser logs contained only development information; there were no application, hydration, audio, or GSAP target errors. Production lint and build are clean.

### Remaining open items

- **P3 personalization assets:** every configured photograph remains `/images/placeholder.svg`; no final image crop, contrast, or emotional-copy evaluation is possible until user assets are supplied.
- **P3 live audio QA:** ready/play/pause/mute/progress must be rechecked after final cover artwork and metadata are supplied.
- **P3 device preference QA:** the browser tooling did not expose `prefers-reduced-motion` emulation or an actual mobile virtual keyboard. Explicit reduced-motion/static branches remain in code, but target-device validation is advisable.

---

## Interaction Layout & Audio Polish Pass — 2026-08-17

### Resolved interaction/audio follow-up

- **P2 Question control geometry — resolved.** START now has a dedicated centered 180/200px CTA zone. Initial Yes/No are equal-size grid siblings rather than an asymmetrical static/absolute pair. Their entrance no longer applies a geometry-changing transform.
- **P2 No interaction — resolved.** After the first genuine pointer/touch attempt, No alone switches into a measured absolute arena. GSAP animates only transforms over 220ms; targets are deterministic, edge-padded, resize-safe, indefinitely repeatable, and preserve document width. The visible skip route and associated state wiring are removed.
- **P2 audio contract — resolved.** Main music now uses the existing `/audio/river-flow.mp3` through the centralized provider at volume 0.45. `/audio/cat.mp3` is a single local reusable native SFX channel at volume 0.7; it restarts cleanly, never blocks evasion, does not pause music, and honors global music mute when available.

### QA evidence

- At 390×844, START measured 180×56px and was centered. Before No interaction, both Question controls measured 154×56px and shared exact top/bottom bounds. Ten-plus No attempts stayed within the safe arena, retained fixed width through label changes, caused no overflow, and kept Yes reachable.
- The `river-flow.mp3` player reached ready and playing state after an explicit Play action, exposing Pause with no autoplay or console errors. The cat SFX code path was exercised on repeated pointer attempts without warnings or extra audio-instance construction.

### Remaining open items

- **P3 device QA:** validate native audio loudness balance, touch scrolling near No, mobile keyboard behavior, and reduced-motion behavior on the recipient device/browser. The automated browser cannot provide audible verification or reliable repeated viewport resizing in one tab.
- **P3 personalization:** real images, player cover artwork, and final artist metadata are still placeholder-level content work.
