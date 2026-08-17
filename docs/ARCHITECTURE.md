# Architecture Document

> Phase 2 revision — critically reviewed and refined by Creative Direction & Motion Systems Review.

---

## 1. Current Repository Assessment

The repository contains only `.git`, `MASTER_PROMPT.md`, and `docs/`. A fresh Next.js App Router project must be initialized in Phase 3.

### Phase 1 Audit Notes

Phase 1 established a reasonable foundation but had several weaknesses:

- **State architecture was over-unified.** Putting all 10 scenes into a single `useReducer` state machine forces the entire experience into one monolithic client component tree. This is unnecessary — the experience has a natural split point.
- **CSS Modules were listed without justification.** There is no clear boundary for when Tailwind stops and CSS Modules begin. This creates style fragmentation.
- **Embla vs. Draggable was left unresolved.** This must be decided before implementation.
- **GSAP Flip was over-recommended.** Flip is powerful but requires careful DOM measurement; it was suggested for scenes where a simple GSAP timeline would be cleaner.
- **Content type model was too shallow.** Missing fields for visual annotations, decoration hints, and transition text.

---

## 2. Recommended Application Architecture

```text
Framework:      Next.js (App Router)
Language:       TypeScript (strict)
Styling:        Tailwind CSS only (no CSS Modules)
Motion Engine:  GSAP (Core, ScrollTrigger, SplitText)
Scroll Feel:    Lenis (synced to GSAP ticker)
Polaroids:      Embla Carousel (horizontal swipe)
Data/State:     Local React state (hybrid architecture)
Deployment:     Vercel
```

### Why No CSS Modules

Tailwind CSS handles all styling needs for this project:
- Utility classes for layout, spacing, typography, color.
- Arbitrary values `[]` for bespoke one-off values.
- `@apply` in global CSS for reusable component patterns (e.g., `.polaroid`, `.paper-card`).
- CSS custom properties in `:root` for design tokens that need runtime access (e.g., GSAP reading a CSS variable).

Adding CSS Modules creates a second styling paradigm with no benefit. Every component should use Tailwind. Global CSS (`globals.css`) is sufficient for base styles, font-face, custom properties, and a few component classes via `@apply`.

---

## 3. Hybrid Architecture — The Core Structural Decision

### The Problem with a Single State Machine

Phase 1 proposed a single `ExperiencePhase` state controlling all 10 scenes. This has several issues:

1. **Scenes 01–04 are genuinely stateful** — the user makes a choice (Yes/No) that gates the rest of the experience.
2. **Scenes 05–10 are a continuous scroll** — once the user says "yes" (or "I'll think about it"), the remaining content is a long, scrollable editorial page. There is no branching, no gating, no reason for React state to control visibility.

Forcing scenes 05–10 into a state machine means either:
- Conditional rendering that creates mount/unmount churn (bad for ScrollTrigger).
- All scenes mounted but with visibility toggling (unnecessary complexity).

### The Hybrid Solution

```text
┌─────────────────────────────────────────┐
│  INTERACTION FLOW  (React state-driven) │
│                                         │
│  Opening → Envelope → Question → Answer │
│                                         │
│  Controlled by ExperiencePhase state    │
│  Scenes mount/unmount as user proceeds  │
│  No scrolling — fullscreen viewport     │
└───────────────┬─────────────────────────┘
                │
                │  on "accepted" or "thinking"
                │
┌───────────────▼─────────────────────────┐
│  SCROLL EXPERIENCE  (scroll-driven)     │
│                                         │
│  Why You                                │
│  ↓                                      │
│  Memory Story (parallax)                │
│  ↓                                      │
│  Polaroids                              │
│  ↓                                      │
│  Date Choice Game                       │
│  ↓                                      │
│  Secret Letter                          │
│  ↓                                      │
│  Ending                                 │
│                                         │
│  All mounted simultaneously             │
│  Animated via ScrollTrigger on scroll   │
│  No React state gating                  │
└─────────────────────────────────────────┘
```

### Benefits

1. **Server Components for scroll content.** The scroll experience sections can be rendered as server components (or at least static HTML), with only the interactive leaves (`PolaroidStack`, `DateChoice`) being client components.
2. **ScrollTrigger stability.** All scroll sections are in the DOM simultaneously, so ScrollTrigger can measure and pin reliably.
3. **Simpler state.** `ExperiencePhase` only needs 4 states instead of 9.
4. **Natural loading boundary.** The scroll experience can lazy-load while the interaction flow is lightweight.

### State Model

```ts
type ExperiencePhase =
  | "opening"
  | "envelope"
  | "question"
  | "accepted"     // transitions to scroll experience
  // "thinking" is a sub-state of "accepted" — same scroll content is shown
```

The `"accepted"` state unmounts the interaction flow and reveals the scroll experience. Whether the user chose "Iya" or eventually clicked "Aku pikir dulu", the scroll content is the same — the only difference is the transition text (configurable).

---

## 4. Folder Structure

```text
app/
  layout.tsx              # Root layout: fonts, metadata, Lenis provider
  page.tsx                # Renders <SurpriseExperience />
  globals.css             # Tailwind directives, design tokens, base styles

components/
  experience/
    SurpriseExperience.tsx # Top-level client component (interaction flow state)
    OpeningScene.tsx       # Fullscreen opening
    EnvelopeScene.tsx      # Envelope interaction
    QuestionScene.tsx      # Question + EscapeButton
    TransitionScene.tsx    # "okay." → "sekarang aku boleh sedikit jujur."
    ScrollExperience.tsx   # Wrapper for the scroll content (mounts after accepted)
  sections/
    WhyYouSection.tsx      # 3 interactive cards
    MemoryStory.tsx        # Parallax editorial story
    PolaroidStack.tsx      # Embla-powered photo swipe
    DateChoice.tsx         # 3-round date game
    SecretLetter.tsx       # Quiet text reveal
    EndingSection.tsx      # Final screen
  motion/
    SmoothScrollProvider.tsx  # Lenis wrapper with GSAP sync
    ParallaxLayer.tsx         # Reusable scroll-linked parallax
    TextReveal.tsx            # Scroll-triggered text entrance
    EscapeButton.tsx          # Playful evasion button
  ui/
    Button.tsx
    Card.tsx
    Polaroid.tsx

content/
  surprise.ts             # Central typed content configuration

lib/
  animations/
    gsap-setup.ts          # Plugin registration, shared utilities
    easings.ts             # Named easing presets
  hooks/
    useReducedMotion.ts    # prefers-reduced-motion hook
    useMediaQuery.ts       # Responsive breakpoint hook
    usePointerType.ts      # fine vs coarse detection
  utils/
    cn.ts                  # Tailwind class merge utility

public/
  images/
    memories/              # Memory photos (user replaces these)
    polaroids/             # Polaroid photos
  textures/                # Paper grain, noise (SVG/CSS)
  audio/                   # Optional background music

docs/
```

### Key Differences from Phase 1

- `components/experience/` contains only the **stateful interaction flow** components.
- `components/sections/` contains the **scroll experience** sections — these are structurally independent.
- `components/motion/` contains reusable motion primitives.
- No `lib/supabase/` — deferred.
- No `public/rive/` — deferred.

---

## 5. Server / Client Component Boundaries

### Server Components (default)

- `app/layout.tsx` — font loading, metadata, HTML structure.
- `app/page.tsx` — renders the top-level component.
- Static text content within scroll sections (where possible).

### Client Components (`"use client"`)

```text
SurpriseExperience.tsx    — owns interaction flow state
OpeningScene.tsx          — GSAP entrance animation
EnvelopeScene.tsx         — GSAP envelope animation
QuestionScene.tsx         — EscapeButton state logic
TransitionScene.tsx       — GSAP cinematic transition
ScrollExperience.tsx      — Lenis + ScrollTrigger initialization
WhyYouSection.tsx         — card interaction (tap to reveal)
MemoryStory.tsx           — ScrollTrigger parallax
PolaroidStack.tsx         — Embla carousel
DateChoice.tsx            — selection state
SecretLetter.tsx          — GSAP text reveal
EndingSection.tsx         — final GSAP fade
SmoothScrollProvider.tsx  — Lenis lifecycle
EscapeButton.tsx          — pointer/touch evasion
```

### Rationale

In this project, nearly every visual section has some animation or interaction, so most leaf components will be client components. However, the **structure** remains important:

- `layout.tsx` stays a server component for font/metadata optimization.
- `page.tsx` stays a server component — it just renders `<SurpriseExperience />`.
- Content from `content/surprise.ts` is imported statically (no dynamic fetching), so it works in both server and client contexts.

The goal is not to have many server components, but to avoid wrapping the entire page in a single massive client boundary. Each section is its own client component with its own `useGSAP` scope.

---

## 6. Content Architecture

```ts
// content/surprise.ts

export type SurpriseMode = "confession" | "anniversary" | "birthday" | "just-because";

export interface OpeningContent {
  eyebrow?: string;          // e.g., "hey."
  title: string;             // e.g., "aku bikin sesuatu."
  subtitle?: string;         // e.g., "cuma sebentar kok."
  cta: string;               // e.g., "buka →"
}

export interface QuestionContent {
  text: string;              // e.g., "Maukah kamu jadi pacarku?"
  yesLabel: string;
  noLabel: string;
  noEscapeLabels: string[];  // ["Yakin?", "Serius?", "Kok dikejar 😭"]
  noFinalLabel: string;      // "Aku pikir dulu"
}

export interface TransitionContent {
  acceptedLine1: string;     // "okay."
  acceptedLine2: string;     // "sekarang aku boleh sedikit jujur."
  thinkingLine1?: string;    // alternative if "aku pikir dulu" was chosen
  thinkingLine2?: string;
}

export interface Reason {
  id: string;
  number: string;            // "01", "02", "03"
  title: string;             // "something I noticed"
  description: string;       // the actual content
}

export interface Memory {
  id: string;
  date?: string;             // "Maret 2024"
  title?: string;            // "pertama kenal"
  caption?: string;          // 1 sentence
  image: string;             // path in /public/images/memories/
  annotation?: string;       // small handwritten note
}

export interface DateChoiceRound {
  id: string;
  optionA: string;
  optionB: string;
}

export interface LetterContent {
  heading?: string;          // "one last thing."
  body: string[];            // array of paragraphs
}

export interface EndingContent {
  title: string;             // "so..."
  subtitle?: string;         // "see you on our first date?"
  cta?: string;              // "peluk aku nanti."
}

export interface SurpriseConfig {
  mode: SurpriseMode;
  recipient: string;
  opening: OpeningContent;
  question: QuestionContent;
  transition: TransitionContent;
  reasons: Reason[];
  memories: Memory[];
  dateChoices: DateChoiceRound[];
  letter: LetterContent;
  ending: EndingContent;
}
```

### Improvements over Phase 1

- Added `TransitionContent` — the "okay" moment needs separate content for accepted vs. thinking paths.
- Added `noEscapeLabels` and `noFinalLabel` to `QuestionContent` — the escape button labels are content, not hardcoded strings.
- Added `annotation` to `Memory` — supports the scrapbook handwritten note aesthetic.
- `letter.body` is `string[]` (paragraphs) instead of a single string — allows per-paragraph reveal animation.

---

## 7. Animation Ownership — Refined

| Responsibility | Owner | Notes |
|---|---|---|
| Hover, focus, press | CSS transitions | `transition-*` utilities in Tailwind |
| Button scale feedback | CSS transitions | `active:scale-95 transition-transform` |
| Opening entrance | GSAP Core | Timeline: text fade, doodle float |
| Envelope open | GSAP Core | Timeline: flap rotate, paper slide, scale |
| No button evasion | GSAP Core | `gsap.to()` for repositioning |
| YES transition | GSAP Core | Fade timeline, NOT Flip |
| Card reveal (Why You) | GSAP Core | Height/opacity animation |
| Parallax layers | GSAP ScrollTrigger | Scrub-linked `y` transforms |
| Text entrances (scroll) | GSAP ScrollTrigger | Fade + translateY on viewport enter |
| Pinned moment | GSAP ScrollTrigger | 1 pinned scene in Memory Story |
| Letter text reveal | GSAP ScrollTrigger | Line-by-line opacity (NOT SplitText per-char) |
| Polaroid swipe | Embla Carousel | Horizontal swipe with physics |
| Smooth scroll feel | Lenis | Synced to GSAP ticker |
| Pointer-follow depth | GSAP Core (desktop) | `mousemove` handler, `gsap.to()` |

### Phase 1 Corrections

1. **GSAP Flip removed from YES transition.** Flip requires measuring DOM state before and after a layout change. The YES transition is a sequential fade: old content fades out → "okay." fades in → "sekarang aku..." fades in → scroll experience mounts. This is a timeline, not a layout transition. Flip adds complexity without benefit here.

2. **GSAP Flip removed from Why You cards.** Tap-to-reveal cards are better served by a simple GSAP height/opacity animation. Flip is warranted when an element visually moves between two layout positions — that's not happening here.

3. **SplitText downgraded for Secret Letter.** Per-character animation on a long letter is excessive and creates a childish effect. Use per-line or per-paragraph opacity reveals instead. SplitText may be used for 1–2 short display-size lines (like "one last thing.") if tasteful.

4. **GSAP Draggable removed.** Embla handles the Polaroid interaction. See section 8.

---

## 8. Polaroid Decision: Embla Carousel

### Why Embla, Not GSAP Draggable

| Consideration | Embla | GSAP Draggable |
|---|---|---|
| Touch scroll conflict | Solved: `touch-action: pan-y pinch-zoom` allows vertical scrolling while capturing horizontal swipe | Risk: Draggable captures all touch events on the element, can interfere with page scroll |
| Swipe physics | Built-in momentum, snap points, spring physics | Must be manually implemented |
| Accessibility | Tab navigation between slides, ARIA support | None built-in |
| Bundle size | ~6KB gzip (embla-carousel + react wrapper) | Already included with GSAP, but requires Draggable + InertiaPlugin |
| Mobile predictability | Battle-tested swipe behavior | Free-form drag is fun but riskier on mobile |

### The key issue

GSAP Draggable's free-form "toss away" interaction sounds exciting but creates real mobile problems:

1. **Drag vs. scroll conflict.** When the user touches a Draggable element and moves vertically, should the page scroll or should the photo move? This requires careful `touch-action` and threshold management that Draggable doesn't handle automatically.
2. **Z-index management.** "Tossing" photos requires managing a stack of absolutely-positioned elements with dynamic z-index. Embla's slide model is simpler.
3. **Reduced motion fallback.** A carousel degrades to a static grid or simple tap-through. A physics-based toss system has no clean fallback.

### Decision

**Use Embla Carousel** for the Polaroid section. Style each slide to look like a Polaroid (white border, slight rotation, shadow). The swipe interaction will feel satisfying on mobile without risking scroll interference.

On desktop, add subtle hover rotation via CSS. The carousel itself works identically via mouse drag.

---

## 9. Scroll Architecture

### Lenis Integration (per Context7 docs)

```tsx
// SmoothScrollProvider.tsx — simplified reference
"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
```

### Important Rules

1. Lenis must have `autoRaf: false` when synced with GSAP.
2. `gsap.ticker.lagSmoothing(0)` is required for smooth sync.
3. Lenis is only active during the **scroll experience** phase. During the interaction flow (opening, envelope, question), there is no scrollable content — the viewport is locked.
4. On reduced motion: disable Lenis entirely (use native scroll).

---

## 10. Routing Architecture

- **MVP:** Single route `/`. The entire experience lives in `page.tsx`.
- **Future:** `app/for/[slug]/page.tsx` — loads a different `SurpriseConfig` based on slug. The component tree remains identical; only the content changes.
- **No API routes needed** for MVP.

---

## 11. Loading Architecture

```text
IMMEDIATE (critical path)
├── Shell (layout, fonts, global CSS)
├── SurpriseExperience (state controller)
├── OpeningScene (first visual)
└── Content config (static import, no fetch)

ON INTERACTION (when user taps "buka →")
├── EnvelopeScene
└── QuestionScene + EscapeButton

ON ACCEPTED (when user proceeds past question)
├── ScrollExperience wrapper
├── Lenis initialization
├── WhyYouSection
├── MemoryStory (images lazy-loaded)
├── PolaroidStack (Embla loaded)
├── DateChoice
├── SecretLetter
└── EndingSection
```

### Dynamic Imports

Use `next/dynamic` for heavy components that are not needed at first paint:

```ts
const ScrollExperience = dynamic(() => import("./ScrollExperience"), {
  loading: () => <LoadingShell />,
});
```

This keeps the initial JS bundle small — only the opening scene code ships on first load.

---

## 12. Error / Fallback Architecture

| Asset | Fallback |
|---|---|
| Memory photo fails | Show a muted `Surface` color rectangle with the caption still visible |
| Polaroid photo fails | Same as above, inside the Polaroid frame |
| Audio fails to load | Hide the audio button entirely |
| Rive fails (future) | Show CSS/SVG envelope |
| GSAP fails to load | Static HTML renders without animation (content is still readable) |
| Font fails to load | System font stack (`system-ui, sans-serif`) |

---

## 13. Supabase Decision

**NOT REQUIRED FOR MVP.** Confirmed.

All content is static. Date choices are stored in local React state. No persistence needed.

Future Supabase integration points are designed into the content architecture (the `SurpriseConfig` interface could be fetched from Supabase instead of imported statically) but no database code should be written in Phase 3.

---

## 14. Vercel Strategy

Standard Next.js deployment. No edge functions, no middleware, no ISR needed for MVP.

Pre-deployment checklist:
```bash
npm run lint
npm run build
```

Both must pass cleanly.

---

## 15. ADRs

### ADR-001: GSAP is the sole motion engine
No Framer Motion, Anime.js, or other animation libraries. CSS transitions handle trivial states.

### ADR-002: Supabase deferred for MVP
Static content configuration. No database.

### ADR-003: Three.js / WebGL excluded
Depth achieved via CSS layering, GSAP parallax, and editorial composition. WebGL is unnecessary overhead for the target mid-range mobile devices.

### ADR-004: Content is configuration-driven
All personal text, labels, and image paths live in `content/surprise.ts`. Components never contain hardcoded personal content.

### ADR-005: Mobile is the primary target
Design at 360px first. Desktop is an enhancement layer.

### ADR-006: Rive deferred for MVP
The envelope must work with CSS/SVG. Rive can be added later as an enhancement if a `.riv` asset is created.

### ADR-007: No-button eventually provides a genuine alternative
After 3–4 escape attempts, the button becomes "Aku pikir dulu" and is clickable. The experience proceeds regardless.

### ADR-008: Hybrid architecture (interaction flow + scroll experience)
Scenes 01–04 are state-driven. Scenes 05–10 are scroll-driven. This replaces the Phase 1 monolithic state machine.

### ADR-009: Embla Carousel for Polaroids
Chosen over GSAP Draggable for predictable mobile swipe behavior and zero scroll interference.

### ADR-010: No CSS Modules
Tailwind CSS only. Global CSS for base styles and `@apply` component classes.

### ADR-011: GSAP Flip not used in MVP
Flip is powerful but not warranted for the transitions in this project. Simple GSAP timelines are cleaner and more predictable.

### ADR-012: SplitText used sparingly
Only for 1–2 short display-level headings. Never for paragraph-length content.

---

## 16. Architectural Risks

| Risk | Severity | Mitigation |
|---|---|---|
| ScrollTrigger jank on mobile | High | Animate only `transform`/`opacity`. Limit total ScrollTrigger count to <15. |
| Lenis + ScrollTrigger desync | Medium | Use documented GSAP ticker sync pattern. Disable `autoRaf`. |
| EscapeButton overflow | High | Bound movement to a measured container rect, not viewport. Account for button dimensions and safe-area insets. |
| Large image payload | Medium | Lazy-load all memory/polaroid images. Use `next/image` with `sizes`. |
| React Strict Mode double-mount | Medium | Use `useGSAP` hook with `scope` ref. Never create animations outside the hook. |
| Embla + Lenis scroll conflict | Low | Embla's `touch-action: pan-y pinch-zoom` allows vertical scrolling. Lenis should not interfere with Embla's internal drag handling. |
| Font loading CLS | Low | Use `next/font` with `display: swap`. Reserve space for text with appropriate line-heights. |
| Client component tree too large | Medium | Each section is its own client boundary. No single massive client wrapper. |

---

## 17. Implementation Rules for Phase 3

1. **Initialize Next.js** with App Router, TypeScript, Tailwind CSS, ESLint.
2. **Install only:** `gsap`, `@gsap/react`, `lenis`, `embla-carousel-react`.
3. **Do NOT install:** Supabase, Rive, Three.js, Framer Motion, Zustand.
4. **Build mobile-first** at 360px. Use `dvh` for fullscreen interaction flow scenes.
5. **Create `content/surprise.ts`** with placeholder content matching the `SurpriseConfig` interface.
6. **Each section is its own component file** with its own `useGSAP` scope.
7. **Lenis wraps only the scroll experience**, not the interaction flow.
8. **Register GSAP plugins once** in a shared setup file, imported at the top of the component tree.
9. **Do NOT create complex GSAP timelines yet.** Phase 3 builds structure and layout. Phase 4 adds cinematic motion.
10. **Test at 360px, 390px, 430px** before testing desktop.
