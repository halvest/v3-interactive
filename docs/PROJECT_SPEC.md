# Project Specification

> Phase 2 revision — refined experience architecture and scene definitions.

---

## 1. Project Vision

Create a premium, mobile-first, interactive surprise website that feels like opening a handcrafted personal artifact. The experience merges cinematic editorial storytelling with a digital scrapbook aesthetic — intimate, playful, and deeply personal.

It is a "small interactive world" built specifically for one person.

---

## 2. Experience Goals

- **Personal & Intimate:** Every element must feel designed specifically for the recipient. No generic templates.
- **Playful:** Micro-interactions create joy and surprise, but never at the cost of dignity.
- **Cinematic:** Structured narrative with graceful transitions and emotional pacing.
- **Restrained:** 70% minimal editorial, 30% digital scrapbook. Negative space is an intentional design element.
- **Tactile:** The experience should feel physical — paper, photographs, handwritten notes.

---

## 3. Target Audience/Device

- **Primary:** Mobile devices (360px, 390px, 430px viewport widths). The recipient will likely open this on their phone via a shared link.
- **Secondary:** Tablets (768px) and desktops (1024px+) with hover/pointer enhancements.
- **Target hardware:** Mid-range Android phones. Must remain smooth.

---

## 4. Emotional Pacing

```text
CURIOSITY          "hey. aku bikin sesuatu."
     ↓
ANTICIPATION       tapping the envelope
     ↓
PLAYFUL TENSION    the escaping No button
     ↓
EMOTIONAL SHIFT    "okay. sekarang aku boleh sedikit jujur."
     ↓
VULNERABILITY      "something I never told you"
     ↓
NOSTALGIA          memory photos and dates
     ↓
TACTILE JOY        swiping through Polaroids
     ↓
LIGHTNESS          choosing a date together
     ↓
INTIMACY           the secret letter
     ↓
QUIET RESOLUTION   "see you on our first date?"
```

---

## 5. Full User Journey

### Part 1: Interaction Flow (state-driven, fullscreen)

| # | Scene | User Action | Gate |
|---|---|---|---|
| 01 | Opening | Tap "buka →" | Proceeds to Envelope |
| 02 | Envelope | Tap envelope | Proceeds to Question |
| 03 | Question | Tap "Iya" / resolve "No" | Proceeds to Transition |
| 04 | Transition | None (auto) | Mounts Scroll Experience |

### Part 2: Scroll Experience (scroll-driven, continuous)

| # | Scene | User Action |
|---|---|---|
| 05 | Why You | Scroll + tap cards to reveal |
| 06 | Memory Story | Scroll (parallax) |
| 07 | Polaroids | Swipe horizontally |
| 08 | Date Choice Game | Tap selections |
| 09 | Secret Letter | Scroll to reveal |
| 10 | Ending | Scroll to final screen |

---

## 6. Scene Breakdown

### Scene 01 — Opening

| Aspect | Detail |
|---|---|
| **Purpose** | Hook the user with minimal, intriguing text |
| **Primary content** | "hey." / "aku bikin sesuatu." / "cuma sebentar kok." / "buka →" |
| **Layout** | Centered cinematic (Composition A) — full viewport height |
| **Interaction** | Tap CTA to proceed |
| **Mobile** | `100dvh`, `px-5`, tap CTA |
| **Desktop** | Pointer-follow depth on decorations, magnetic CTA |
| **Animation owner** | GSAP Core (entrance timeline) |
| **Loading** | Immediate — this is the first paint |
| **Performance risk** | Low (text only + small SVG decorations) |
| **Fallback** | Static text, no animation |
| **Reduced motion** | Text appears instantly, no float |

### Scene 02 — Envelope

| Aspect | Detail |
|---|---|
| **Purpose** | Tactile entry point, build anticipation |
| **Primary content** | CSS/SVG envelope with paper inside |
| **Layout** | Centered cinematic (Composition A) |
| **Interaction** | Tap envelope → flap opens → paper slides up → question appears |
| **Mobile** | Tap to open |
| **Desktop** | Hover hint (slight scale), tap to open |
| **Animation owner** | GSAP Core (sequenced timeline) |
| **Loading** | Pre-loaded (lightweight SVG/CSS) |
| **Performance risk** | Low (CSS/SVG only). Medium if Rive is used later. |
| **Fallback** | Instant cut to question |
| **Reduced motion** | Instant cut — envelope disappears, question appears |

### Scene 03 — Question

| Aspect | Detail |
|---|---|
| **Purpose** | The core playful interaction |
| **Primary content** | "Maukah kamu jadi pacarku?" / "Iya" / "Nggak" |
| **Layout** | Centered cinematic (Composition A) |
| **Interaction** | Yes is normal. No evades 3–4 times then becomes "Aku pikir dulu" |
| **Mobile** | No button moves on tap (within container bounds) |
| **Desktop** | No button moves on pointer proximity |
| **Animation owner** | GSAP Core (button repositioning) + React State (escape count, label) |
| **Loading** | Pre-loaded |
| **Performance risk** | Medium — EscapeButton viewport overflow if bounds are wrong |
| **Fallback** | Standard static buttons |
| **Reduced motion** | No movement — label changes on tap, always clickable |

### Scene 04 — Transition

| Aspect | Detail |
|---|---|
| **Purpose** | The emotional pivot of the entire experience |
| **Primary content** | "okay." → pause → "sekarang aku boleh sedikit jujur." |
| **Layout** | Centered cinematic (Composition A) |
| **Interaction** | None — auto-progression |
| **Mobile** | Identical to desktop |
| **Desktop** | Identical to mobile |
| **Animation owner** | GSAP Core (fade timeline with timed pauses) |
| **Loading** | Pre-loaded |
| **Performance risk** | Low |
| **Fallback** | Text appears without animation |
| **Reduced motion** | Text appears instantly, pauses preserved |

### Scene 05 — Why You

| Aspect | Detail |
|---|---|
| **Purpose** | Share 3 personal reasons |
| **Primary content** | Numbered cards: "01 — something I noticed", etc. |
| **Layout** | Editorial stagger (Composition B) — alternating left/right |
| **Interaction** | Tap card to reveal full description |
| **Mobile** | Full-width stacked cards |
| **Desktop** | Staggered layout, hover lift |
| **Animation owner** | GSAP ScrollTrigger (entrance), GSAP Core (expand) |
| **Loading** | Lazy (mounted with scroll experience) |
| **Performance risk** | Low |
| **Fallback** | Static visible cards |
| **Reduced motion** | Cards visible, tap toggles content instantly |

### Scene 06 — Memory Story

| Aspect | Detail |
|---|---|
| **Purpose** | The signature visual section — editorial parallax scrapbook |
| **Primary content** | 4–5 memories with dates, photos, captions, annotations |
| **Layout** | Layered scrapbook (Composition C) — photos, text, decorations at different depths |
| **Interaction** | Scroll to reveal, parallax depth |
| **Mobile** | Reduced parallax (50%), fewer decorations |
| **Desktop** | Full parallax depth, pointer-follow on decorations |
| **Animation owner** | GSAP ScrollTrigger (parallax, entrances, pin) |
| **Loading** | Images lazy-loaded |
| **Performance risk** | HIGH — most ScrollTrigger-heavy section |
| **Fallback** | Static stacked layout |
| **Reduced motion** | No parallax, no pin, static layout |

### Scene 07 — Polaroids

| Aspect | Detail |
|---|---|
| **Purpose** | Tactile photo memory |
| **Primary content** | 4–6 Polaroid-styled photos with captions |
| **Layout** | Horizontal carousel (Composition D) |
| **Interaction** | Swipe/drag horizontally |
| **Mobile** | Full-width Embla carousel, `touch-action: pan-y pinch-zoom` |
| **Desktop** | Mouse drag, partial next/prev visible |
| **Animation owner** | Embla Carousel |
| **Loading** | Lazy (images + Embla dynamic import) |
| **Performance risk** | Medium — drag vs scroll conflict |
| **Fallback** | Static grid of photos |
| **Reduced motion** | Static grid, no carousel |

### Scene 08 — Date Choice Game

| Aspect | Detail |
|---|---|
| **Purpose** | Lighten the mood, look to the future together |
| **Primary content** | 3 rounds: "Night Ride vs Movie", "Coffee vs Dinner", "City vs Nature" |
| **Layout** | Choice grid (Composition E) — 2 cards side by side per round |
| **Interaction** | Tap to select, next round appears |
| **Mobile** | Tap cards |
| **Desktop** | Hover states, tap to select |
| **Animation owner** | React State + CSS transitions |
| **Loading** | Lightweight (text only) |
| **Performance risk** | Low |
| **Fallback** | Static text |
| **Reduced motion** | Instant selection, no scale animation |

### Scene 09 — Secret Letter

| Aspect | Detail |
|---|---|
| **Purpose** | The most intimate moment — raw personal text |
| **Primary content** | "one last thing." + multi-paragraph letter |
| **Layout** | Quiet text (Composition F) — maximum negative space |
| **Interaction** | Scroll to reveal paragraphs |
| **Mobile** | Full-width text, generous padding |
| **Desktop** | `max-w-xl` centered text column |
| **Animation owner** | GSAP ScrollTrigger (paragraph fade) |
| **Loading** | Lightweight |
| **Performance risk** | Low |
| **Fallback** | Static visible text |
| **Reduced motion** | All text visible immediately |

### Scene 10 — Ending

| Aspect | Detail |
|---|---|
| **Purpose** | Gentle, understated close |
| **Primary content** | "so..." / "see you on our first date?" |
| **Layout** | Centered cinematic (Composition A) |
| **Interaction** | None |
| **Mobile** | Centered text |
| **Desktop** | Centered text |
| **Animation owner** | GSAP Core (gentle fade) |
| **Loading** | Lightweight |
| **Performance risk** | Low |
| **Fallback** | Static text |
| **Reduced motion** | Instant visibility |

---

## 7. Functional Requirements

1. Must display a sequential, interactive story without traditional navigation (no navbar, sidebar, footer).
2. Interaction flow (scenes 01–04) is state-gated — the user must progress through each scene.
3. Scroll experience (scenes 05–10) is a continuous scroll — all sections are mounted simultaneously.
4. Content must be driven by `content/surprise.ts` — no hardcoded personal text in components.
5. The No button must eventually expose a genuine clickable alternative ("Aku pikir dulu") after 3–4 escape attempts.
6. Audio (if any) must be strictly opt-in. Never autoplay.
7. All photos must use `next/image` with responsive `sizes`.
8. Every interactive element must provide immediate visual feedback.

---

## 8. Non-functional Requirements

- **Mobile-first:** Perfect on 360px–430px before considering desktop.
- **Performance:** Smooth 60fps animation on mid-range Android.
- **Maintainability:** Content is editable without touching component code.
- **Reliability:** Graceful fallbacks for all external assets (images, fonts, optional Rive).
- **Accessibility:** Keyboard navigable, screen reader compatible, `prefers-reduced-motion` respected.

---

## 9. Performance Requirements

| Metric | Target |
|---|---|
| LCP | < 2.5s (opening scene on 4G) |
| CLS | < 0.1 |
| INP | < 200ms |
| Initial JS | < 150KB gzip |
| Full JS | < 350KB gzip |
| ScrollTrigger count | < 15 total |
| Above-fold images | < 200KB total |

---

## 10. Accessibility Requirements

- Semantic HTML: `<button>`, `<main>`, `<section>`, `<figure>`.
- `prefers-reduced-motion` disables all parallax, float, and complex transitions.
- Minimum 4.5:1 contrast for body text.
- Minimum 44×44px touch targets.
- Visible focus rings for keyboard navigation.
- Alt text on all images (from content config).
- The No button's final "Aku pikir dulu" state must be keyboard-focusable and clickable.

---

## 11. MVP Scope

- Single-page experience at `/`.
- Static content from `content/surprise.ts`.
- CSS/SVG envelope (no Rive).
- Embla carousel for Polaroids.
- Local React state for date choices and experience progression.
- Placeholder images in `public/images/` (user replaces later).
- No database, no authentication, no API routes.

---

## 12. Out-of-scope Items

- User authentication.
- Backend tracking / analytics.
- Three.js / WebGL.
- Rive interactive assets (deferred, not blocked).
- Supabase persistence.
- Multi-recipient routing (`/for/[slug]`).
- Admin dashboard.

---

## 13. Future Enhancement Possibilities

- `/for/[slug]` dynamic routing with different `SurpriseConfig` per recipient.
- Supabase integration: persist date choices, record view timestamp, private slugs.
- Rive envelope: replace CSS/SVG with interactive `.riv` asset.
- Audio integration: optional ambient background music with user-controlled play button.
- Admin editor: web interface to edit content without touching code.

---

## 14. Definition of Done

- [ ] Works flawlessly on mobile 360px – 430px.
- [ ] Scales gracefully to tablet and desktop.
- [ ] No horizontal overflow on any viewport.
- [ ] Touch behaviors feel natural (no drag/scroll conflicts).
- [ ] Desktop hover/pointer enhancements work and safely degrade on mobile.
- [ ] `prefers-reduced-motion` fully implemented for every animation.
- [ ] All content editable via `content/surprise.ts` without modifying components.
- [ ] All photos replaceable via `public/images/` paths.
- [ ] Production build (`next build`) succeeds with zero errors.
- [ ] No hydration warnings.
- [ ] No console errors.
- [ ] All GSAP animations clean up on unmount.
- [ ] Lenis RAF loop cleaned up on unmount.
- [ ] The experience feels deeply personal, not template-like.
