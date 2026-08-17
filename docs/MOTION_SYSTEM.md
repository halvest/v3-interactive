# Motion System

> Phase 2 revision — refined motion architecture, clear ownership boundaries, mobile safety rules.

---

## 1. Motion Philosophy

Motion exists to serve the story. Every animation should answer one of these questions:

- **Does this help the user understand what happened?** (feedback)
- **Does this guide the user's attention?** (directing)
- **Does this create an emotional moment?** (pacing)

If the answer to all three is "no," the animation should not exist.

### The Restraint Principle

The most powerful moments in this experience are the quiet ones:

- The pause after "okay."
- The first time a photo appears in the memory story.
- The final words of the letter.

These moments are powerful because the rest of the experience is restrained. If everything moves constantly, nothing stands out.

### Motion Hierarchy

```text
CINEMATIC    ████████████████  (few, high impact)
STANDARD     ████████           (moderate, functional)
MICRO        ████               (many, subtle)
AMBIENT      ██                 (very few, background)
```

---

## 2. Animation Ownership — Final

| Responsibility | Owner | Never Use |
|---|---|---|
| Hover/focus/press feedback | **CSS transitions** | GSAP for trivial state changes |
| Button `active:scale` | **CSS transitions** | JavaScript for press feedback |
| Opening text entrance | **GSAP Core** | CSS @keyframes (needs sequencing) |
| Opening doodle float | **GSAP Core** | CSS @keyframes (needs stagger control) |
| Envelope flap/paper | **GSAP Core** | CSS (too many coordinated pieces) |
| No button reposition | **GSAP Core** | CSS transitions (needs dynamic target) |
| YES transition sequence | **GSAP Core** | GSAP Flip (not a layout transition) |
| Card reveal (Why You) | **GSAP Core** | GSAP Flip (simple expand, not layout shift) |
| Scroll parallax | **GSAP ScrollTrigger** | CSS scroll-driven animations (browser support) |
| Scroll text entrance | **GSAP ScrollTrigger** | Intersection Observer (less control) |
| Pinned memory moment | **GSAP ScrollTrigger** | Custom scroll lock (fragile) |
| Letter line reveal | **GSAP ScrollTrigger** | SplitText per-character (too much) |
| Short heading split | **GSAP SplitText** (1–2 instances) | SplitText on paragraphs |
| Polaroid swipe | **Embla Carousel** | GSAP Draggable (scroll conflict risk) |
| Smooth scroll feel | **Lenis** | Custom scroll interpolation |
| Pointer-follow depth | **GSAP Core** (desktop) | CSS (needs dynamic calculation) |

### What Is NOT Used in MVP

| Tool | Status | Reason |
|---|---|---|
| **GSAP Flip** | DEFERRED | No scene requires measuring layout state before/after a change. Simple timelines suffice. Can be added in Phase 9 if a compelling use case emerges. |
| **GSAP Draggable** | NOT USED | Embla handles the Polaroid interaction with better mobile touch handling. |
| **Rive** | DEFERRED | No `.riv` asset exists. The CSS/SVG envelope is the MVP implementation. Rive can be added later as an enhancement layer. |
| **Three.js** | NOT USED | No 3D is needed. Depth is achieved through CSS layering and GSAP parallax. |
| **Framer Motion** | NOT USED | GSAP is the sole motion engine. |

---

## 3. Motion Duration Vocabulary

| Category | Range | Usage | Example |
|---|---|---|---|
| **Instant** | 0–50ms | State changes that should feel immediate | Focus ring, checkbox |
| **Micro** | 100–200ms | Direct feedback to user action | Button press `150ms`, hover lift `150ms` |
| **Standard** | 250–450ms | Functional transitions | Card reveal `350ms`, text entrance `400ms` |
| **Cinematic** | 600–1200ms | Emotional moments | Opening text `800ms`, YES transition `1000ms`, letter line reveal `600ms` |
| **Dramatic** | 1500–2500ms | Major transitions (at most 2 in entire experience) | Envelope open sequence `2000ms`, transition from question to story `2500ms` total |

### Duration Rules

1. **Never exceed 2500ms** for any single animation. The user should never feel like they're waiting.
2. **Staggered sequences** may total more than 2500ms, but each individual element should animate within the ranges above.
3. **Mobile durations should be ~80% of desktop** for animations >400ms. Mobile users are closer to the screen and perceive motion faster.
4. **Scroll-linked animations have no fixed duration.** Their "speed" is controlled by the scroll distance mapped to the animation progress.

---

## 4. Easing Vocabulary

Use a strict, named set. Do not invent custom easings per animation.

| Name | GSAP Easing | Usage |
|---|---|---|
| `ease-out-ui` | `power2.out` | Standard UI feedback (hover, press, card selection) |
| `ease-out-enter` | `power3.out` | Elements entering the viewport |
| `ease-in-exit` | `power2.in` | Elements leaving (rare — usually just opacity) |
| `ease-cinematic` | `expo.out` | Dramatic entrance (opening text, transition text) |
| `ease-gentle` | `sine.inOut` | Continuous ambient motion (floating doodles) |
| `ease-playful` | `back.out(1.7)` | No button evasion (overshoot for comedy) |

### CSS Equivalents (for CSS transitions)

```css
--ease-out-ui: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-enter: cubic-bezier(0.22, 1, 0.36, 1);
```

These should be defined as CSS custom properties in `globals.css` so Tailwind `transition-*` and CSS transitions can use them.

---

## 5. Parallax Depth System

Parallax is used exclusively in the **Memory Story** section (Scene 06). No other section uses parallax.

### Layers

| Layer | Content | ScrollTrigger `y` Travel | Mobile Travel |
|---|---|---|---|
| 0 | Background texture | `0px` (static) | `0px` |
| 1 | Distant decoration (faint doodles) | `20–30px` | `10–15px` |
| 2 | Mid-ground decoration (tape, scribble) | `40–60px` | `20–30px` |
| 3 | Photos | `60–90px` | `30–50px` |
| 4 | Text content | Normal scroll | Normal scroll |
| 5 | Foreground decoration (close doodle) | `-20 to -40px` (moves opposite) | `-10 to -20px` |

### Parallax Rules

1. **Total parallax travel must never exceed 120px** on any layer. Phase 1 was correct here.
2. **Mobile parallax is reduced to ~50%** of desktop values. On a 6" screen, 90px of parallax travel is visually equivalent to 200px on desktop.
3. **Parallax uses `y` transforms only.** No horizontal parallax — it creates a seasick effect.
4. **All parallax elements use `will-change: transform`** during scroll, removed when ScrollTrigger deactivates.
5. **Parallax is disabled entirely** when `prefers-reduced-motion` is active.

### ParallaxLayer Abstraction

```tsx
// Conceptual API — not implementation
<ParallaxLayer
  speed={0.3}          // relative speed factor
  mobileSpeed={0.15}   // reduced for mobile
  direction="up"       // or "down"
  className="..."
>
  <DoodleStar />
</ParallaxLayer>
```

This component wraps a ScrollTrigger `scrub` animation internally. The `speed` factor maps to a `y` transform range.

---

## 6. Scene-by-Scene Motion Map

### Scene 01 — Opening

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Eyebrow text ("hey.") | `opacity`, `y` | 600ms | `ease-cinematic` | Page load (after 300ms delay) |
| Title text | `opacity`, `y` | 800ms | `ease-cinematic` | After eyebrow (200ms stagger) |
| Subtitle text | `opacity`, `y` | 600ms | `ease-cinematic` | After title (200ms stagger) |
| CTA button | `opacity` | 400ms | `ease-out-enter` | After subtitle (400ms stagger) |
| Decorations (3–5) | `y`, `rotate` | Continuous, slow | `ease-gentle` | After all text visible, very subtle float |

**Mobile adjustment:** Reduce decoration count to 3. Remove pointer-follow depth.  
**Desktop enhancement:** Add pointer-follow depth on decoration layers.  
**Reduced motion:** All text appears instantly (no stagger). No floating. CTA visible immediately.

### Scene 02 — Envelope

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Flap | `rotateX` | 600ms | `ease-out-enter` | User taps envelope |
| Paper slide | `y` | 800ms | `ease-cinematic` | After flap opens (200ms delay) |
| Envelope scale | `scale` | 600ms | `ease-cinematic` | Simultaneous with paper slide |
| Scene fade out | `opacity` | 400ms | `ease-in-exit` | After paper fully visible |

**Mobile adjustment:** Same behavior (tap is tap).  
**Desktop enhancement:** Hover hint on envelope (slight scale `1.02`).  
**Reduced motion:** Instant cut — envelope disappears, question appears. No animation.

### Scene 03 — Question

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Question text | `opacity`, `y` | 600ms | `ease-cinematic` | Scene enters |
| Yes button | `opacity` | 400ms | `ease-out-enter` | After question text (300ms) |
| No button | `opacity` | 400ms | `ease-out-enter` | After Yes button (100ms) |
| No button escape | `x`, `y` | 300ms | `ease-playful` | Hover proximity (desktop) / tap (mobile) |

**Mobile adjustment:** No button repositions on tap attempt (within container bounds). Escape distance is limited to prevent scroll.  
**Desktop enhancement:** No button repositions on pointer proximity (distance threshold ~80px).  
**Reduced motion:** No button does not escape. It simply shows next label text on tap. After 3–4 taps, becomes "Aku pikir dulu."

### Scene 04 — Transition ("okay.")

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Previous scene | `opacity` | 500ms | `ease-in-exit` | User taps Yes / Aku pikir dulu |
| "okay." text | `opacity` | 800ms | `ease-cinematic` | After 600ms pause |
| "okay." hold | — | 1500ms | — | Static hold |
| "sekarang aku..." | `opacity`, `y` | 800ms | `ease-cinematic` | After hold |
| Scene exit | `opacity` | 600ms | `ease-in-exit` | After 1000ms hold |
| Scroll experience mount | — | — | — | After exit completes |

**This is the signature transition of the entire experience.** Total duration ~5–6 seconds. It should feel like a held breath.

**Mobile adjustment:** Same timing. This moment is identical on all devices.  
**Reduced motion:** Text appears without animation. Pauses are preserved (timing is emotional, not decorative).

### Scene 05 — Why You (scroll)

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Section heading | `opacity`, `y` | 400ms | `ease-out-enter` | ScrollTrigger: enter viewport |
| Card (each) | `opacity`, `y` | 350ms | `ease-out-enter` | ScrollTrigger: stagger by 150ms |
| Card tap reveal | `height`, `opacity` | 350ms | `ease-out-ui` | User taps card |

**Mobile adjustment:** Cards are full-width, stacked.  
**Desktop enhancement:** Cards stagger left/right (editorial composition style B).  
**Reduced motion:** Cards visible immediately. Tap still toggles content (no height animation — instant toggle).

### Scene 06 — Memory Story (scroll)

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Each memory block | `opacity`, `y` | 500ms | `ease-out-enter` | ScrollTrigger: enter viewport |
| Parallax layers | `y` | Scrub | Linear | ScrollTrigger: scrub |
| Pinned photo | `pin` | — | — | ScrollTrigger: pin while 3 captions scroll past |
| Photo entrance | `opacity`, `scale` | 400ms | `ease-out-enter` | ScrollTrigger: enter viewport |

**Mobile adjustment:** Parallax travel reduced 50%. Pinned section scroll distance reduced.  
**Desktop enhancement:** Full parallax. Photos can be slightly larger.  
**Reduced motion:** No parallax (all layers scroll naturally). No pin. Photos and text appear immediately on viewport enter.

### Scene 07 — Polaroids (scroll)

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Section entrance | `opacity`, `y` | 400ms | `ease-out-enter` | ScrollTrigger: enter viewport |
| Swipe interaction | Managed by Embla | — | Built-in physics | User swipe/drag |

**Mobile adjustment:** Full-width slides, `touch-action: pan-y pinch-zoom`.  
**Desktop enhancement:** Partial next/prev slide visible. Mouse drag enabled.  
**Reduced motion:** Static grid layout (no carousel). All photos visible simultaneously.

### Scene 08 — Date Choice (scroll)

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Section entrance | `opacity`, `y` | 400ms | `ease-out-enter` | ScrollTrigger: enter viewport |
| Card selection | `borderColor`, `backgroundColor`, `scale` | 200ms | `ease-out-ui` | User taps |
| Non-selected card | `opacity` | 200ms | `ease-out-ui` | Other card selected |
| Round transition | `opacity` | 300ms | `ease-out-enter` | After selection, next round appears |

**Mobile/Desktop:** Identical behavior.  
**Reduced motion:** Instant selection state change (no scale animation).

### Scene 09 — Secret Letter (scroll)

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| "one last thing." | `opacity`, `y` | 600ms | `ease-cinematic` | ScrollTrigger: enter viewport |
| Letter paragraphs | `opacity`, `y` | 400ms each | `ease-out-enter` | ScrollTrigger: stagger on scroll |

**NO SplitText on the letter body.** Per-character animation on personal text is distracting and feels gimmicky. Simple paragraph-level opacity reveals are more intimate.

**SplitText may be used** on the heading "one last thing." — this is a short, display-level phrase where character-level reveal adds cinematic weight.

**Mobile/Desktop:** Same behavior.  
**Reduced motion:** All text visible immediately.

### Scene 10 — Ending (scroll)

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Title | `opacity`, `y` | 600ms | `ease-cinematic` | ScrollTrigger: enter viewport |
| Subtitle | `opacity` | 400ms | `ease-out-enter` | After title (200ms) |
| Small celebration | `opacity`, `scale` | 1500ms | `ease-cinematic` | After subtitle (optional, max 1–2 seconds) |

**Celebration is OPTIONAL.** If implemented, it should be a tiny burst (a few particles, a small bloom) that fades in under 2 seconds. Not confetti. Not fireworks.

**Reduced motion:** No celebration. Text appears immediately.

---

## 7. Desktop vs. Mobile Motion Rules

### Desktop Enhancements (fine pointer only)

These are ONLY active when `@media (pointer: fine)`:

1. **Pointer-follow depth** on Opening scene — decoration layers shift subtly toward the cursor.
2. **Hover lift** on buttons and cards — `translateY(-2px)`, shadow increase.
3. **Magnetic CTA** on Opening — button subtly pulls toward cursor when within ~100px.
4. **No button proximity evasion** — repositions when cursor approaches within ~80px.

### Mobile Behavior (coarse pointer)

1. **No hover effects.** Use `:active` for press feedback only.
2. **Tap to trigger** all interactions. No proximity detection.
3. **No pointer-follow.** Decorations are static or use ambient float only.
4. **No magnetic effects.** Buttons are stationary.
5. **Reduced parallax travel** (50% of desktop values).

### Detection

```tsx
const isCoarse = window.matchMedia("(pointer: coarse)").matches;
// or usePointerType() custom hook
```

Use this to conditionally enable/disable desktop enhancements. Never rely on user agent sniffing.

---

## 8. Reduced Motion Strategy

When `prefers-reduced-motion: reduce` is active:

### Disabled
- All parallax (layers scroll naturally).
- All floating/ambient animation.
- Pointer-follow depth.
- Magnetic button.
- No button evasion movement (button stays in place, labels change on tap).
- Embla drag physics (show static grid).
- SplitText reveals.
- Scale/transform entrance animations.

### Preserved
- Opacity fades (at reduced duration, ~200ms).
- Transition scene pauses (the emotional beats are about timing, not motion).
- Color state changes (selection highlighting).
- Content visibility changes (tap to reveal still works, just instant).

### Implementation

```tsx
// useReducedMotion.ts
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```

This hook is checked at the top of every `useGSAP` block. If `true`, skip animation creation and show static/instant states.

---

## 9. React / GSAP Lifecycle Rules

### Rule 1: Always use `useGSAP` with `scope`

```tsx
const containerRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  // All selectors are scoped to containerRef
  gsap.from(".title", { opacity: 0, y: 20, duration: 0.6 });
}, { scope: containerRef });

return <div ref={containerRef}>...</div>;
```

### Rule 2: Register plugins once, at module level

```tsx
// lib/animations/gsap-setup.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

Import from this file everywhere. Never call `gsap.registerPlugin()` inside a component.

### Rule 3: Event handlers use `contextSafe`

```tsx
const { contextSafe } = useGSAP(() => { ... }, { scope: containerRef });

const handleClick = contextSafe(() => {
  gsap.to(".element", { scale: 1.1, duration: 0.2 });
});
```

### Rule 4: ScrollTrigger refresh on layout change

If a component changes height (e.g., card expand/collapse), call:

```tsx
ScrollTrigger.refresh();
```

after the layout settles. Use `gsap.delayedCall(0.1, () => ScrollTrigger.refresh())` to wait for the DOM update.

### Rule 5: Lenis cleanup

Lenis RAF sync is added via `gsap.ticker.add()`. The cleanup function removes it via `gsap.ticker.remove()`. This happens in the `SmoothScrollProvider` effect cleanup.

### Rule 6: No animations outside useGSAP

Never create a `gsap.to()` in a raw `useEffect`, `onClick`, or inline handler. Always use `useGSAP` + `contextSafe`.

---

## 10. Pinned Scroll Strategy

### One pinned scene: Memory Story

The Memory Story section contains one meaningful pinned moment:

**A central photo stays pinned** while 2–3 short text captions scroll past it. This creates the feeling of lingering on a memory while the story moves forward.

```text
┌──────────────────┐
│                  │  ← user scrolls
│   ╔════════╗     │
│   ║ PINNED ║     │
│   ║ PHOTO  ║     │     caption 1 scrolls in
│   ╚════════╝     │     caption 2 scrolls in
│                  │     caption 3 scrolls in
│                  │
└──────────────────┘
                       ← photo unpins, scroll continues
```

### Pin Rules

1. **Maximum 1 pinned section** in the entire experience.
2. Pin duration: approximately `200vh` of scroll distance (2 viewport heights).
3. On mobile, reduce to `150vh` — mobile users are less patient with pinned content.
4. Pin must use `ScrollTrigger.pin()` — not `position: sticky` (which doesn't integrate with GSAP scrub).
5. **Reduced motion:** No pin. The photo scrolls normally with the rest of the content.

---

## 11. Motion Anti-Patterns

| Anti-Pattern | Why It's Wrong | What To Do Instead |
|---|---|---|
| Per-character SplitText on paragraphs | Feels like a PowerPoint typewriter effect. Distracting, slow, childish. | Per-line or per-paragraph opacity reveals. |
| Continuous bounce on decorations | "Alay" aesthetic. Nothing in real life bounces forever. | Very slow, gentle float with long periods of stillness. |
| Every element has an entrance animation | Creates an overwhelming cascade. User can't focus. | Only animate elements that are narratively important. |
| Different easing for every animation | No visual coherence. Feels random. | Use the 6 named easings from the vocabulary. |
| Parallax on every section | Motion fatigue. Loses its specialness. | Parallax only in Memory Story (Scene 06). |
| Long delays before content is usable | User thinks the page is broken. | Maximum 300ms delay before first content appears. |
| Animation blocks scrolling | User feels trapped. | Only the Transition scene (04) locks interaction, and it resolves in <6 seconds. |
| GSAP Flip for simple opacity changes | Over-engineering. Flip is for measured layout transitions. | Use `gsap.to()` with `opacity` and `y`. |
| Hover effects on mobile | Sticky hover states on touch devices. | Check `pointer: coarse` and disable. |

---

## 12. Mobile Motion Safety Rules

1. **Never animate `width`, `height`, `top`, `left`, `margin`, `padding`.** Use `transform` and `opacity` exclusively.
2. **Limit concurrent ScrollTrigger instances to <15** across the entire scroll experience.
3. **Parallax elements must use `will-change: transform`** only while actively scrolling. Remove it when idle.
4. **Test on throttled CPU** (Chrome DevTools: 4x slowdown) to simulate mid-range Android.
5. **Embla carousel must set `touch-action: pan-y pinch-zoom`** on its viewport element to prevent vertical scroll interference.
6. **No button must stay within `container.getBoundingClientRect()`** minus button dimensions and 16px margin.
7. **Floating decorations must have `pointer-events: none`** so they never block tap targets.
8. **Font loading must not cause layout shift.** Use `next/font` with `display: swap` and reserve space via line-height.
9. **Images in the Memory Story must lazy-load** (`loading="lazy"` via `next/image` default below-fold behavior).
10. **The total JS bundle for the opening scene must be <100KB gzip.** Heavy components (Embla, full ScrollTrigger setup) are dynamically imported after the user passes the question.

---

## 13. Performance Budget

| Metric | Target | Measured Where |
|---|---|---|
| LCP | <2.5s | Opening scene on 4G throttle |
| CLS | <0.1 | Full scroll experience |
| INP | <200ms | Tap interactions (button press, card select) |
| Total JS (initial) | <150KB gzip | Before user interaction |
| Total JS (full) | <350KB gzip | After all dynamic imports |
| ScrollTrigger count | <15 | Across entire scroll experience |
| Image payload (above fold) | <200KB | Opening scene |
| Font payload | <100KB | All fonts combined |

---

## 14. Dependency Decisions

| Dependency | Status | Reason |
|---|---|---|
| `gsap` | **KEEP** | Primary motion engine. Core, ScrollTrigger, SplitText. |
| `@gsap/react` | **KEEP** | `useGSAP` hook for proper React lifecycle management. |
| `lenis` (+ `lenis/react`) | **KEEP** | Smooth scroll feel. Synced to GSAP ticker. Disable on reduced motion. |
| `embla-carousel-react` | **KEEP** | Polaroid horizontal swipe. Handles touch/scroll conflict correctly. |
| GSAP Flip | **DEFER** | No scene requires it in MVP. Can add in Phase 9 polish. |
| GSAP Draggable | **REMOVE** | Replaced by Embla for Polaroids. Not needed elsewhere. |
| Rive (`@rive-app/react-webgl`) | **DEFER** | No `.riv` asset exists. CSS/SVG envelope is the MVP. |
| CSS Modules | **REMOVE** | Tailwind CSS covers all styling needs. |
| Supabase | **DEFER** | No persistence needed for MVP. |
| Three.js | **REMOVE** | No 3D needed. Excluded from all phases. |
| Framer Motion | **REMOVE** | Conflicts with GSAP ownership. Never install. |
| Zustand/Redux | **REMOVE** | Local React state is sufficient. |

---

## Phase 10 — Pixel romance motion guardrails

- Opening starts with a 1.5–2.5 second skippable Love OS boot: cursor/status, seven progress blocks, pixel heart, then the editorial opening. It is one explicit-ref GSAP timeline with no global loop and skips entirely for reduced motion.
- `LoveBurst` is the only particle primitive. It uses DOM/SVG nodes, opacity and transforms only, deterministic trajectories, and removes itself when its parent scene unmounts. It is capped at 10 simultaneous hearts and fires only for Start, Yes, correct quiz answers, and Ending.
- Quiz success retains exactly three depth layers. Mobile travel remains approximately 25/50/80px or less; no filters, canvas, WebGL, or continuous parallax are introduced.
- Reduced motion disables boot, bursts, input shake, and depth choreography. Semantic scene state plus quiz/player controls remain usable through immediate transitions.
- Pixel micro-motion is limited to CSS press/hover feedback and the existing ready-only player equalizer. Equalizer bars are three transform-only CSS bars and remain static under the global reduced-motion preference rule.
- New GSAP targets use explicit refs or scoped `useGSAP` ownership. Do not use string selectors that can target an unmounted scene node.
