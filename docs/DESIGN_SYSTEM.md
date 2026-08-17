# Design System

> Phase 2 revision — refined creative direction for premium editorial scrapbook aesthetic.

---

## 1. Design Philosophy

The website should feel like opening a beautifully designed personal artifact — something between a Kinfolk magazine spread and a hand-assembled scrapbook found in a drawer.

### Three Principles

**Editorial restraint.** Let typography, whitespace, and pacing do the heavy lifting. Resist the urge to fill every viewport with decoration.

**Tactile warmth.** Paper textures, soft shadows, and slight imperfection (a rotated photo, a slightly off-center doodle) create intimacy that perfect grids cannot.

**Progressive reveal.** Nothing appears all at once. The recipient discovers each moment through their own actions — scrolling, tapping, swiping.

### What This Is NOT

This is not a Valentine's landing page. It is not a SaaS dashboard. It is not a portfolio site with parallax. It is a story told through composition, typography, and carefully placed photographs.

---

## 2. Color Tokens

The palette is deliberately muted and warm. It should feel like aged paper under soft natural light.

| Token | Value | Tailwind Config Key | Usage |
|---|---|---|---|
| `--bg` | `#FAF8F5` | `bg` | Main page background |
| `--bg-deep` | `#F3EDE6` | `bg-deep` | Deeper background for contrast sections |
| `--surface` | `#EFE8E1` | `surface` | Paper cards, envelope, polaroid border area |
| `--surface-warm` | `#E8DFD5` | `surface-warm` | Slightly darker paper for layering |
| `--text` | `#1A1A1A` | `text-primary` | Primary typography |
| `--text-muted` | `#78736D` | `text-muted` | Dates, captions, secondary copy |
| `--text-faint` | `#A39E98` | `text-faint` | Placeholder-level text, annotations |
| `--accent` | `#B66C79` | `accent` | Dusty Rose — emotional emphasis, primary CTA |
| `--accent-hover` | `#A25A67` | `accent-hover` | Darker dusty rose for hover/pressed |
| `--sage` | `#768474` | `sage` | Secondary accent — used sparingly for balance |
| `--sage-light` | `#A8B5A6` | `sage-light` | Very light sage for subtle decoration |
| `--border` | `rgba(26,26,26,0.06)` | `border-subtle` | Card borders, separators |
| `--border-strong` | `rgba(26,26,26,0.12)` | `border-strong` | More visible borders when needed |

### Color Rules

- **Never** use saturated red, pink, or pure white backgrounds.
- **Never** use gradients as primary design elements. A subtle radial gradient on the background (warm center → slightly cooler edge) is acceptable.
- The `accent` color appears in small doses: CTA buttons, a date label, a subtle underline. It should feel like a blush, not a shout.
- `sage` is the counterbalance accent. Use it for small decorative elements (a leaf doodle, a tape strip, an annotation).

---

## 3. Typography

### Font Pairing

| Role | Font | Source | Weight |
|---|---|---|---|
| Primary (UI) | **Geist** | `next/font/local` (Vercel ships it) | 400, 500 |
| Editorial (Display) | **Instrument Serif** | `next/font/google` | 400 (Regular), 400 Italic |
| Handwriting (Accent) | **Caveat** | `next/font/google` | 400–500 |

### Why These Fonts

- **Geist** is clean, modern, and highly legible at small sizes. It's Vercel's own font, so it loads efficiently with `next/font/local`. It handles body text, buttons, and captions without ever feeling generic.
- **Instrument Serif** provides cinematic warmth for display headings. Its italic variant is particularly beautiful for short emotional phrases. It pairs naturally with Geist — the contrast between geometric sans and humanist serif creates editorial tension.
- **Caveat** (optional, used sparingly) provides a handwriting feel for photo annotations and scrapbook notes. It must never be used for body text or headings.

### Type Scale

| Level | Mobile | Desktop | Line Height | Weight | Family |
|---|---|---|---|---|---|
| `display` | 2.5rem (40px) | 4rem (64px) | 1.1 | 400 | Instrument Serif |
| `heading-1` | 1.75rem (28px) | 2.5rem (40px) | 1.2 | 400 | Instrument Serif |
| `heading-2` | 1.25rem (20px) | 1.5rem (24px) | 1.3 | 500 | Geist |
| `body-lg` | 1.125rem (18px) | 1.25rem (20px) | 1.6 | 400 | Geist |
| `body` | 1rem (16px) | 1rem (16px) | 1.6 | 400 | Geist |
| `caption` | 0.875rem (14px) | 0.875rem (14px) | 1.5 | 400 | Geist |
| `annotation` | 0.8125rem (13px) | 0.875rem (14px) | 1.4 | 400 | Caveat |

### Typography Rules

1. **Display type appears rarely.** It is reserved for the opening text, the question, and possibly "one last thing." At most 3–4 times in the entire experience.
2. **Never use display type for everything.** If every heading is `display`, nothing feels special.
3. **Instrument Serif italic** may be used for short emotional phrases within body text (e.g., *"entah kapan mulai nyaman"*).
4. **Caveat appears only** on Polaroid captions, memory annotations, and scrapbook doodle labels. Maximum ~15 words per usage.
5. **Line length:** Body text should never exceed `36rem` (~576px) on desktop. On mobile, full-width with `px-6` padding is fine.
6. **Letter spacing:** Geist at `caption` size may benefit from `tracking-wide` (0.025em). Display type should use `tracking-tight` (-0.02em).

---

## 4. Spacing System

Use Tailwind's default spacing scale, but establish named semantic tokens for consistency:

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px (p-1) | Tight inline spacing, icon gaps |
| `space-sm` | 8px (p-2) | Card internal padding (tight) |
| `space-md` | 16px (p-4) | Standard component padding |
| `space-lg` | 24px (p-6) | Section internal padding (mobile) |
| `space-xl` | 32px (p-8) | Desktop section padding |
| `space-2xl` | 48px (p-12) | Between major elements |
| `space-section` | 80px–120px (py-20 to py-30) | Between narrative sections |
| `space-scene` | 100dvh | Fullscreen scene height |

### Spacing Philosophy

- **Between sections:** Use generous vertical space (`space-section`). The whitespace itself creates pacing — it's a visual "breath" between narrative moments.
- **Within sections:** Tighter spacing. Elements in a section feel grouped together.
- **Mobile padding:** Minimum `px-5` (20px) horizontal padding on all content. Never let text touch the screen edge.

---

## 5. Radius Scale

| Element | Radius | Tailwind |
|---|---|---|
| Primary button | Full pill | `rounded-full` |
| Ghost/secondary button | Small | `rounded-md` |
| Paper / card | Slight | `rounded` (4px) |
| Polaroid | None to slight | `rounded-sm` (2px) |
| Photo within Polaroid | None | `rounded-none` |
| Memory photo | Slight | `rounded` (4px) |
| Large container | None | `rounded-none` |
| Envelope | Slight | `rounded` (4px) |

### Anti-pattern

Do NOT apply `rounded-2xl` or `rounded-3xl` to cards. This creates a SaaS dashboard aesthetic. Paper has clean edges or very subtle rounding.

---

## 6. Shadow System

Shadows should feel like natural light falling on layered paper, not floating UI cards.

| Element | Shadow | Tailwind Arbitrary |
|---|---|---|
| Paper card (resting) | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)` | `shadow-paper` |
| Polaroid (floating) | `0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)` | `shadow-polaroid` |
| Pressed state | None | `shadow-none` |
| Elevated (rare) | `0 8px 30px rgba(0,0,0,0.08)` | `shadow-elevated` |

### Shadow Rules

- Shadows are always low-opacity (`<10%`).
- No colored shadows.
- The shadow direction should feel like overhead light — never side-cast.
- **Most elements have NO shadow.** Only paper-like floating elements get shadows.

---

## 7. Composition Styles

### CRITICAL: Avoid the "centered landing page" trap

Phase 1's scene table implied every section is a centered, fullscreen block. This creates monotony. Each section should have a distinct compositional identity:

### Style A — Centered Cinematic (Scenes 01, 03, 04, 10)
```
          ┌─────────────┐
          │              │
          │     text     │
          │   centered   │
          │              │
          │    [CTA]     │
          │              │
          └─────────────┘
```
Full viewport height. Text centered vertically and horizontally. Generous whitespace. Used for dramatic pauses and questions.

### Style B — Editorial Stagger (Scene 05: Why You)
```
          ┌─────────────┐
          │  01          │
          │  ──────────  │
          │  paragraph   │
          │              │
          │        02    │
          │  ──────────  │
          │    paragraph │
          │              │
          │  03          │
          │  ──────────  │
          │  paragraph   │
          └─────────────┘
```
Cards stagger left/right. Numbers align to alternating edges. Creates visual rhythm and prevents the "stack of identical cards" problem.

### Style C — Layered Scrapbook (Scene 06: Memory Story)
```
          ┌─────────────┐
          │    ╔══════╗  │
          │    ║ photo ║  │
          │    ╚══════╝  │
          │  "caption"   │
          │      ✿       │
          │              │
          │  ╔══════╗    │
          │  ║ photo ║   │
          │  ╚══════╝    │
          │    "caption"  │
          │  ─ doodle ─  │
          └─────────────┘
```
Photos and text overlap slightly. Decorative elements (doodles, tape) peek between layers. Parallax creates depth. This is the scrapbook moment.

### Style D — Horizontal Stack (Scene 07: Polaroids)
```
    ┌────┐ ┌────┐ ┌────┐ ┌────┐
    │    │ │    │ │    │ │    │
    │foto│ │foto│ │foto│ │foto│
    │    │ │    │ │    │ │    │
    │note│ │note│ │note│ │note│
    └────┘ └────┘ └────┘ └────┘
    ◄──── swipe ────►
```
Horizontal carousel. Each slide is a Polaroid. Swipe to navigate.

### Style E — Choice Grid (Scene 08: Date Game)
```
          ┌─────────────┐
          │  pick our    │
          │  next date.  │
          │              │
          │ ┌───┐ ┌───┐ │
          │ │ A │ │ B │ │
          │ └───┘ └───┘ │
          └─────────────┘
```
Simple two-column choice. Cards side by side. Tap to select.

### Style F — Quiet Text (Scene 09: Secret Letter)
```
          ┌─────────────┐
          │              │
          │              │
          │  one last    │
          │  thing.      │
          │              │
          │  paragraph   │
          │  paragraph   │
          │  paragraph   │
          │              │
          │              │
          └─────────────┘
```
Maximum restraint. No decoration. No parallax. Just text on a warm background. Let the words carry the moment.

---

## 8. Component Specifications

### Buttons

**Primary CTA**
- Background: `accent` (`#B66C79`)
- Text: `#FFFFFF`
- Padding: `px-8 py-3` (mobile) / `px-10 py-3.5` (desktop)
- Radius: `rounded-full`
- Font: Geist, `text-sm`, `font-medium`, `tracking-wide`
- Hover: darken background to `accent-hover`, subtle lift `transform: translateY(-1px)`
- Press: `scale-[0.97]`, `shadow-none`
- Transition: `transition-all duration-150 ease-out`

**Ghost Button**
- Background: transparent
- Text: `text-muted`
- Border: `border border-border-subtle`
- Hover: `bg-surface`, text darkens
- Same padding and radius as primary

### Cards (Why You)
- Background: `surface`
- Border: `border-subtle`
- Radius: `rounded` (4px)
- Padding: `p-6` mobile, `p-8` desktop
- Shadow: `shadow-paper`
- Number: `text-faint`, `caption` size
- Title: `heading-2`, Geist medium
- Description: `body`, Geist regular, `text-muted`

### Polaroid
- Outer: `#FFFFFF` background, `shadow-polaroid`
- Photo area: square or 4:3, `rounded-none`
- Bottom padding: `pb-10` (space for handwritten caption)
- Caption: Caveat, `annotation` size, `text-muted`, centered
- Rotation: random between `-3deg` and `3deg` per photo (set via inline style from content config)
- Tape strip (optional): small SVG positioned at top, rotated slightly

### Envelope
- Body: `surface-warm` background
- Flap: triangular, same color with subtle border
- Interior: slightly darker (`bg-deep`)
- Shadow: `shadow-paper` while resting, elevates slightly on hover

---

## 9. Decoration & Density Rules

### Decoration Budget Per Scene

| Scene | Max Decorations | Types Allowed |
|---|---|---|
| 01 Opening | 3–5 | star, paper scrap, tiny flower, small doodle |
| 02 Envelope | 0–1 | the envelope IS the decoration |
| 03 Question | 0 | clean, dramatic, no distraction |
| 04 Transition | 0 | text only |
| 05 Why You | 1–2 | small doodle near a card edge, tape |
| 06 Memory Story | 3–6 | doodles, tape, annotations, scribbles |
| 07 Polaroids | 0–1 | tape on a Polaroid is sufficient |
| 08 Date Game | 0–1 | small star or heart near the heading |
| 09 Letter | 0 | absolute zero — text speaks alone |
| 10 Ending | 1–2 | small star, tiny celebration |

### Rules

- **The Memory Story section gets the most decoration.** This is the scrapbook moment.
- **The Letter section gets zero decoration.** This is the most intimate moment. Let the words breathe.
- **Decorations must be SVG**, loaded inline or as `<img>` tags. No raster doodles.
- **Decorations must have `pointer-events: none`.** They are visual, not interactive.
- **On mobile**, reduce decoration count by ~30% compared to desktop. Remove any element that crowds the viewport or slows rendering.

---

## 10. Photography Direction

### Aspect Ratios
- Memory photos: flexible (user's photos will vary). Display at `aspect-[3/4]` or `aspect-square` depending on composition.
- Polaroid photos: `aspect-square` or `aspect-[4/5]`.

### Image Treatment
- No filters. No Instagram-style overlays. The photos should feel natural.
- Subtle `rounded` (4px) on memory photos. No rounding on Polaroid inner photos.
- All photos use `next/image` with `sizes` attribute.
- Memory photos: `sizes="(max-width: 768px) 85vw, 400px"`
- Polaroid photos: `sizes="(max-width: 768px) 70vw, 300px"`

### Placeholder Strategy
When real photos are unavailable, use muted `surface-warm` rectangles with a faint icon or text: *"foto kamu di sini"*. This is better than stock photos, which would break the personal feeling.

---

## 11. Responsive Rules

### Mobile (360px – 430px) — Primary

- Stack everything vertically.
- `px-5` minimum horizontal padding.
- Interaction flow scenes use `100dvh`.
- Touch targets minimum `44px`.
- No hover effects (use `:active` instead).
- Reduce decoration density.
- Polaroid carousel is full-width.
- Date choice cards are side by side (2-column).

### Tablet (768px)

- Increase horizontal padding to `px-8`.
- Memory photos can be slightly larger.
- Why You cards can have more horizontal breathing room.
- Date choice cards get more padding.

### Desktop (1024px+)

- Max content width: `max-w-2xl` (672px) for text, `max-w-4xl` for photo compositions.
- Enable pointer-follow depth effect on Opening.
- Enable hover states on buttons and cards.
- Enable magnetic button effect on primary CTA (desktop only).
- Polaroid carousel can show partial next/prev slides.
- Why You cards can stagger more dramatically.

---

## 12. Interaction States

| State | Visual | Transition |
|---|---|---|
| Default | Base styles | — |
| Hover (desktop) | Slight lift, shadow increase, or color shift | `150ms ease-out` |
| Focus (keyboard) | `ring-2 ring-accent/50 ring-offset-2 ring-offset-bg` | instant |
| Active / Pressed | `scale-[0.97]`, shadow reduce | `100ms ease-out` |
| Selected (Date Game) | `accent` border, subtle `accent/5` background | `200ms ease-out` |
| Disabled | `opacity-50`, `cursor-not-allowed` | — |

---

## 13. Accessibility

- **Contrast:** `text` on `bg` = ~15:1 ✓. `text-muted` on `bg` = ~4.8:1 ✓ (passes AA).
- **Touch targets:** Minimum 44×44px for all interactive elements.
- **Focus rings:** Visible, uses `accent` color with offset.
- **Semantic HTML:** `<button>` for actions, `<main>` for content, `<section>` for scenes, `<figure>` for photos.
- **Alt text:** All memory/polaroid images must have descriptive alt text (from content config).
- **Screen readers:** The experience is a visual story, but all text content must be readable by screen readers in sequence.
- **Reduced motion:** See MOTION_SYSTEM.md. All animation disables or simplifies.

---

## Phase 9 â€” Color, quiz, and player update

### Active color system

The current implementation uses a warm, more colorful editorial palette. These are scene accents, not a requirement to color every element:

| Role | Token | Value | Use |
|---|---|---:|---|
| Canvas | `bg` | `#FFF8EE` | Warm cream base |
| Ink | `text-primary` | `#202124` | Primary readable type |
| Coral | `accent` | `#E9826B` | CTA and selected emphasis |
| Sky | `sky` / `sky-soft` | `#79AEE8` / `#E4F0FF` | Quiz 1 and small opening accents |
| Sage | `sage` / `sage-light` | `#88A97B` / `#E5F0DE` | Quiz 2 and restrained paper accents |
| Lavender | `lavender` / `lavender-soft` | `#A88AD5` / `#EEE6FA` | Main question and ending pacing |
| Mustard | `mustard` / `mustard-soft` | `#E2B55D` / `#FBF0CF` | Envelope, Date Choice, and annotation accents |

Use flat, low-saturation paper colors. Keep Polaroid/photo surfaces near-neutral so future real photography remains dominant. Color is reserved by scene: Opening uses cream/sky/coral; Question uses lavender/coral; Quiz 1 uses sky; Quiz 2 uses sage/mustard; Letter returns to quiet cream; Ending returns to lavender.

### Quiz interaction system

- The gated sequence is Opening â†’ Envelope â†’ Question â†’ Quiz Name â†’ Quiz Favorite â†’ accepted transition â†’ Scroll Story.
- Quiz answers and feedback belong in `content/surprise.ts`; validation trims whitespace and compares case-insensitively.
- Each quiz is a semantic form with a real label, input, and submit button. Enter submits naturally; wrong answers retain the typed value and use only a short inline annotation.
- Quiz success uses three compositional layers only: back, content, and front. Their transition distances remain modest (roughly 24px, 40px, and 80px) and use opacity/transforms rather than blur or loops.
- Reduced motion bypasses depth movement and immediately advances after a correct answer.

### Question and player accessibility

- The visual No target is pointer/touch-only playful behavior. It remains within a lower safe lane, loops its short labels, and never becomes an exit path.
- The No target begins as a sibling of Yes in a stable two-column grid, then may move only after a pointer/touch interaction. Yes remains the intended keyboard-reachable action.
- The player shell is intentionally visible from Quiz 1 onward. `public/audio/river-flow.mp3` is the configured main source; a failed source keeps the shell graceful rather than showing broken controls.
- With a valid `river-flow.mp3`, the native audio model progresses through loading, ready, playing, paused, and error states. The player uses no third-party audio library.

---

## 14. Design Anti-Patterns

These are explicitly forbidden:

| Anti-Pattern | Why It's Wrong | What To Do Instead |
|---|---|---|
| Neon gradients | Destroys the warm, intimate palette | Use flat colors or very subtle warm radials |
| `rounded-3xl` cards | SaaS dashboard aesthetic | `rounded` (4px) for paper elements |
| Heavy drop shadows (>12% opacity) | Looks like floating UI, not paper | Use `shadow-paper` (4% opacity) |
| Red hearts everywhere | Valentine template cliché | Use dusty rose accent sparingly |
| Pink background | "Alay" aesthetic | Warm off-white (`#FAF8F5`) |
| Handwriting font for headings | Looks cheap and childish | Instrument Serif for editorial headings |
| Every section centered | Monotonous, feels like a presentation | Use composition styles A–F |
| Decoration on every section | Visual noise, no breathing room | Follow decoration budget per scene |
| Full-width photos with no margin | Looks like a social media feed | Inset photos with compositional whitespace |
| Colored borders on cards | SaaS/dashboard aesthetic | `border-subtle` (6% opacity black) or no border |
| Emoji as design elements | Childish, unprofessional | Use SVG doodles or nothing |
| Stock photos | Destroys personal feeling | Use real photos or muted placeholders |
| Confetti explosion | Tacky, overused | 1–2 second subtle celebration, or nothing |

---

## Phase 10 — Retro Pixel Romance production layer

### Direction and proportions

The active direction is **70% modern editorial, 20% retro pixel, 10% physical scrapbook**. Instrument Serif, Geist, and Caveat retain their roles; pixel styling is limited to system labels, small icons, stepped control edges, scene metadata, and momentary celebration. Photography remains natural and visually dominant.

### Active production tokens

`canvas` (`#FFF6E9`), `ink` (`#1E1E24`), `love` (`#F06F68`), `love-deep` (`#D94D55`), `sky` (`#72A9E8`), `sage` (`#7FA47A`), `lavender` (`#9C82D4`), `gold` (`#E6B84C`), and `plum` (`#45364F`) are semantic Tailwind tokens. Existing aliases remain only for stable scene code. Components use token utilities rather than introducing literal color values.

Color pacing is intentional: plum/coral for boot and opening, lavender/coral for Question, sky/coral for Quiz 1, sage/gold for Quiz 2, warm neutral memory/polaroid surfaces, stronger ticket accents, and quiet cream/ink letter treatment.

### Pixel assets and controls

`components/ui/PixelAssets.tsx` is the only pixel-art asset vocabulary: shared-geometry hearts (fill, outline, broken; small and medium helpers), coffee, spark, arrow, cursor, and corner marks. Assets use simple SVG paths and consistent square-grid geometry. Do not add emoji, raster pixel overlays, visually unrelated SVGs, or blanket pixelation to photos.

`.pixel-label` is the small monospace narrative label. `.pixel-button` applies a compact stepped corner and static offset shadow. It is a modern control treatment, not a browser-button imitation; primary and secondary Question controls share it.

### Density and accessibility

The static scanline texture is a nearly invisible CSS background, not a fixed filter layer. Decorative pixel elements remain `pointer-events: none`; meaningful controls retain 44px minimum targets and the existing token-based focus-visible outline. The No target may move for pointer/touch only after its aligned initial state.
