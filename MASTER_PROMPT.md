# PROJECT: “A LITTLE THING FOR YOU”

You are working inside an existing Google Antigravity project.

This project is a premium, mobile-first, interactive surprise website intended for a girlfriend, boyfriend, crush, or romantic partner.

The website must feel:

- personal
- intimate
- playful
- cinematic
- interactive
- elegant
- modern
- slightly cute
- memorable

But it MUST NOT feel:

- overly romantic
- childish
- “alay”
- Valentine-template-like
- full of hearts
- full of pink
- visually noisy
- gimmicky
- slow on mobile

The experience should feel closer to:

> interactive editorial storytelling  
> + digital scrapbook  
> + cinematic microsite  
> + subtle playful interactions

rather than a traditional love-letter website.

---

# 0. GLOBAL AGENT PROTOCOL

Every agent working on this project MUST follow these rules.

## Before modifying anything

Always inspect:

1. current repository structure
2. `package.json`
3. existing components
4. existing styles
5. existing documentation
6. existing implementation from previous agents

Then read:

```text
/docs/PROJECT_SPEC.md
/docs/DESIGN_SYSTEM.md
/docs/ARCHITECTURE.md
/docs/MOTION_SYSTEM.md
/docs/PROGRESS.md
```

if they exist.

Never blindly regenerate the project.

Never delete good work from previous agents simply because you would have implemented it differently.

---

# CONTINUITY RULE

After completing your assigned phase:

update:

```text
/docs/PROGRESS.md
```

with:

```md
## Phase Completed

### What was implemented

### Important architectural decisions

### Components created

### Components modified

### Dependencies added

### Known limitations

### Performance considerations

### Tasks for next agent
```

This document is the handoff between agents.

---

# AUTONOMY RULE

Do not ask the user unnecessary implementation questions.

Make reasonable senior-level decisions based on this specification.

Only ask the user if there is a genuine blocker involving:

- missing credentials
- missing private assets
- destructive action
- impossible contradictory requirement

Otherwise continue autonomously.

---

# QUALITY RULE

Never mark a task complete merely because the code compiles.

A feature is complete only when:

- it works
- it is responsive
- it behaves correctly on touch devices
- it does not create layout overflow
- it does not introduce console errors
- it follows the design system
- it respects reduced motion
- it does not unnecessarily hurt performance

---

# PRIMARY STACK

Use:

```text
Next.js
TypeScript
App Router
Tailwind CSS
GSAP
GSAP ScrollTrigger
GSAP Flip
GSAP Draggable where useful
Lenis
Embla Carousel
Rive only where it creates meaningful interactive value
Vercel
Supabase only when persistence is actually required
```

Do NOT introduce another animation framework unless there is an extremely strong technical reason.

Do NOT simultaneously use:

```text
GSAP
Framer Motion
Anime.js
Three.js
random animation libraries
```

for overlapping responsibilities.

GSAP must remain the primary motion engine.

---

# PERFORMANCE PHILOSOPHY

Mobile experience is the priority.

The website should still feel impressive on a mid-range Android phone.

Prefer:

```text
transform
translate3d
scale
rotate
opacity
```

for animation.

Avoid repeatedly animating layout-heavy properties such as:

```text
top
left
width
height
margin
padding
```

when a transform can accomplish the same effect.

Heavy interactions below the fold should be dynamically imported where appropriate.

Do not initialize every animation during first render.

---

# PERFORMANCE TARGETS

Treat these as project targets:

```text
LCP < 2.5 seconds
CLS < 0.1
INP < 200 ms
```

on a reasonable mobile connection when practical.

Keep the initial visual experience lightweight.

Optimize:

- JavaScript
- images
- fonts
- motion
- hydration
- third-party libraries

---

# IMAGE STRATEGY

Use:

```tsx
next/image
```

for user photos.

Use responsive sizing.

Preferred formats:

```text
AVIF
WebP
```

when available.

Do not render all gallery photos at full resolution.

Below-the-fold memories should lazy-load.

---

# FONT STRATEGY

Use `next/font`.

Preferred direction:

Primary UI:

```text
Geist
Manrope
Inter
```

Editorial accent:

```text
Instrument Serif
Cormorant Garamond
```

Handwriting fonts may only appear in very small amounts such as:

- photo annotation
- scrapbook note
- date label

Never use handwriting fonts for main body content.

---

# VISUAL DIRECTION

Target approximately:

```text
70% minimal editorial
30% digital scrapbook
```

Possible base palette:

```text
Background:
#FAF8F5

Primary text:
#191919

Muted text:
#77736E

Paper:
#EFE8E1

Dusty rose:
#B66C79

Sage:
#768474
```

These are starting references, not rigid constraints.

The design agent may refine them.

Avoid excessive gradients.

Avoid neon colors.

Avoid glassmorphism everywhere.

Avoid excessive rounded cards.

Avoid making every container look like a SaaS dashboard.

---

# VISUAL LANGUAGE

Use occasional elements such as:

- paper
- Polaroid
- tape
- subtle doodles
- star
- flower
- handwritten annotation
- envelope
- little ticket
- photo strips

But use them strategically.

The page should have substantial negative space.

---

# CORE EXPERIENCE

The website is a sequential interactive story.

Primary flow:

```text
OPENING

↓

ENVELOPE / ENTRY INTERACTION

↓

THE QUESTION

↓

YES TRANSITION

↓

WHY YOU

↓

MEMORY STORY

↓

INTERACTIVE POLAROIDS

↓

DATE CHOICE GAME

↓

SECRET LETTER

↓

ENDING
```

Do not use a traditional navigation bar.

The experience should feel continuous.

---

# SECTION 1 — OPENING

Full-screen mobile-first hero.

Example tone:

```text
hey.

aku bikin sesuatu.
cuma sebentar kok.
```

CTA:

```text
buka →
```

The first screen must load extremely quickly.

Do not load the complete memory gallery immediately.

---

# OPENING MOTION

There may be approximately 4–6 decorative objects.

Examples:

```text
small star
paper scrap
tiny photo
flower
doodle
small note
```

They should move slowly.

Motion example:

```text
translateY
rotate
very subtle floating
```

Do not make every object constantly bounce.

---

# POINTER / DEVICE DEPTH EFFECT

Desktop may use subtle pointer-following depth.

Example layers:

```text
background: 0.05
decoration: 0.15
photo: 0.25
foreground object: 0.4
```

Mobile may optionally use:

- touch direction
- scroll depth

Do NOT require device orientation permission.

---

# SECTION 2 — INTERACTIVE ENVELOPE

After opening:

show an envelope or paper interaction.

Preferred approach:

### Option A

CSS/SVG envelope.

### Option B

Rive asset if a suitable interactive `.riv` asset exists.

Do not block the application because a Rive asset is missing.

The app must work with the CSS/SVG fallback.

Interaction:

```text
tap envelope
↓
flap opens
↓
paper slides upward
↓
camera/viewport gently moves closer
↓
question appears
```

Animation should feel physical but understated.

---

# SECTION 3 — THE QUESTION

Main question:

```text
Maukah kamu jadi pacarku?
```

Buttons:

```text
Iya

Nggak
```

The YES button is normal.

The NO button is playful.

---

# ESCAPING NO BUTTON

The NO button should move when the pointer approaches or the user tries to tap it.

However:

DO NOT create a coercive interaction.

The NO interaction only exists as a short playful joke.

Example states:

```text
Attempt 1:
Nggak

Attempt 2:
Yakin?

Attempt 3:
Serius?

Attempt 4:
Kok dikejar 😭
```

After approximately 3–4 escapes:

replace or unlock it as:

```text
Aku pikir dulu
```

and allow it to be clicked.

The website must respect the recipient's choice.

---

# MOBILE ESCAPE BUTTON LOGIC

Ensure that the escaping button:

- never leaves the viewport
- never hides behind browser UI
- respects safe areas
- keeps adequate margins
- does not create horizontal scrolling
- remains reachable
- behaves correctly after orientation change

Use container bounds rather than naive `Math.random()` across the full screen.

---

# SUCCESS TRANSITION

If YES is selected:

Do NOT immediately trigger huge confetti.

Instead:

fade everything.

Display:

```text
okay.
```

Pause visually.

Then:

```text
sekarang aku boleh sedikit jujur.
```

Transition into the story.

This should be one of the most polished transitions in the website.

Consider GSAP Flip where appropriate.

---

# SECTION 4 — WHY YOU

Create three interactive cards.

Example:

```text
01
something I noticed

02
something I like

03
something I never told you
```

Interaction can include:

```text
tap
flip
reveal
slide
expand
```

But choose ONE coherent interaction style.

On mobile the cards must feel satisfying when tapped.

Desktop may have subtle hover movement.

---

# SECTION 5 — PARALLAX STORY

Create the website's signature visual sequence.

The section should resemble an interactive editorial scrapbook.

Suggested depth system:

```text
Layer 0
background texture
speed 0

Layer 1
distant decorative objects
speed ~0.15

Layer 2
doodles
speed ~0.3

Layer 3
photos
speed ~0.5

Layer 4
main content
speed 1

Layer 5
foreground objects
speed ~1.15
```

These numbers describe relative visual behavior, not mandatory literal multipliers.

---

# PARALLAX RULE

Parallax must not be excessive.

Movement should generally be:

```text
20px
40px
80px
120px
```

rather than objects flying hundreds of pixels unless the composition specifically requires it.

---

# SCROLL STORY

Possible sequence:

```text
pertama kenal

↓

pertama kali ngobrol lama

↓

mulai sering nyariin kamu

↓

entah kapan mulai nyaman

↓

and now you're here.
```

Each milestone may have:

- date
- photo
- 1 sentence
- small visual annotation

Avoid long paragraphs.

---

# PINNED MOMENT

Create at most 1–2 meaningful pinned sections.

Example:

A large photo remains centered while:

```text
memory 01
memory 02
memory 03
```

change around it.

Do not pin every section.

---

# LENIS

Use Lenis only to improve the scroll feel.

Do not create exaggerated delayed scrolling.

Mobile scrolling must remain responsive and familiar.

Synchronize Lenis properly with GSAP ScrollTrigger.

Ensure cleanup on unmount.

---

# SECTION 6 — POLAROID STACK

Create an interactive stack of approximately:

```text
4–6 photos
```

The recipient can:

```text
drag
swipe
throw gently
```

the top photograph away.

Then the next photograph appears.

Use GSAP Draggable if free-form dragging is appropriate.

Otherwise use Embla for predictable mobile swipe behavior.

Do NOT use both for the exact same interaction.

---

# POLAROID BEHAVIOR

Each photo may have:

```text
slight rotation
subtle shadow
paper border
small handwritten note
date
```

Example caption:

```text
one of my favorite days.
```

or:

```text
foto biasa,
orangnya nggak.
```

Keep romantic text subtle.

---

# SECTION 7 — MINI DATE GAME

Create:

```text
pick our next date.
```

Provide 3 rounds.

Example:

### Round 1

```text
Night Ride
vs
Movie
```

### Round 2

```text
Coffee
vs
Dinner
```

### Round 3

```text
City
vs
Nature
```

Use card interaction.

Potential behavior:

```text
tap
swipe
drag into selection zone
```

Choose whichever provides the best mobile UX.

---

# DATE RESULT

After selections:

display something understated such as:

```text
noted.

aku simpan buat nanti.
```

Store selections in React state.

Persist them to Supabase only if database functionality has been activated.

---

# SECTION 8 — SECRET LETTER

Transition back into a quieter layout.

Remove most floating decorations.

Display:

```text
one last thing.
```

Reveal the letter.

Letter should be editable through central content configuration.

Do NOT hard-code relationship text inside animation components.

---

# TEXT REVEAL

Use tasteful text reveal.

Possible effects:

```text
line mask reveal
opacity
small translateY
```

Avoid animating every individual character for long paragraphs.

Text must remain readable.

---

# SECTION 9 — ENDING

Final screen should be minimal.

Example:

```text
so...

see you on our first date?
```

or:

```text
thanks for being here.
```

Possible CTA:

```text
peluk aku nanti.
```

Small celebration animation may run once.

Maximum approximately:

```text
1–2 seconds
```

Do not run endless confetti.

---

# AUDIO

Do NOT autoplay music.

Optional audio control:

```text
♪ play
```

Only initialize audio after explicit interaction.

Audio controls must remain accessible.

The website must be perfectly usable without sound.

---

# CONTENT CONFIGURATION

Create a central data structure.

Example:

```ts
export interface SurpriseConfig {
  mode:
    | "confession"
    | "anniversary"
    | "birthday"
    | "just-because"

  recipient: string

  opening: {
    eyebrow?: string
    title: string
    subtitle?: string
  }

  question: {
    title: string
    yesLabel: string
    noLabel: string
  }

  reasons: Array<{
    title: string
    content: string
  }>

  memories: Array<{
    id: string
    date?: string
    title?: string
    caption?: string
    image: string
  }>

  dateChoices: Array<{
    id: string
    optionA: string
    optionB: string
  }>

  letter: {
    heading?: string
    body: string[]
  }

  ending: {
    title: string
    subtitle?: string
  }
}
```

The visual components should read from configuration.

This allows reuse without rewriting components.

---

# FILE ORGANIZATION TARGET

Use something similar to:

```text
app/
├── layout.tsx
├── page.tsx
└── for/
    └── [slug]/
        └── page.tsx

components/
├── experience/
│   ├── SurpriseExperience.tsx
│   ├── OpeningScene.tsx
│   ├── EnvelopeScene.tsx
│   ├── QuestionScene.tsx
│   ├── WhyYouScene.tsx
│   ├── MemoryStory.tsx
│   ├── PolaroidStack.tsx
│   ├── DateChoice.tsx
│   ├── SecretLetter.tsx
│   └── EndingScene.tsx
│
├── motion/
│   ├── SmoothScrollProvider.tsx
│   ├── ParallaxLayer.tsx
│   ├── MagneticButton.tsx
│   ├── EscapeButton.tsx
│   └── TextReveal.tsx
│
└── ui/

content/
└── surprise.ts

lib/
├── animations/
├── utils/
└── supabase/

public/
├── images/
├── textures/
├── audio/
└── rive/

docs/
├── PROJECT_SPEC.md
├── DESIGN_SYSTEM.md
├── ARCHITECTURE.md
├── MOTION_SYSTEM.md
└── PROGRESS.md
```

This is guidance, not an excuse to over-engineer.

---

# CLIENT COMPONENT RULE

Do not mark large parts of the application `"use client"` without need.

Server components should remain server components wherever practical.

Only interactive components should become client components.

Example client components:

```text
EscapeButton
PolaroidStack
DateChoice
Parallax sections
AudioController
Rive interaction
```

---

# ACCESSIBILITY

Support:

```text
prefers-reduced-motion
keyboard navigation
focus states
semantic buttons
image alt text
reasonable contrast
touch targets
```

Reduced motion mode must disable or simplify:

- intense parallax
- smooth scrolling
- pointer-following
- unnecessary floating
- large entrance animations

Content must remain fully understandable.

---

# RESPONSIVE BREAKPOINT PHILOSOPHY

Design mobile first.

Core target:

```text
360px
390px
430px
```

Then:

```text
tablet
desktop
large desktop
```

Never design desktop first and merely shrink it.

---

# SAFE MOBILE VIEWPORT

Use modern viewport handling where appropriate:

```text
dvh
svh
```

Account for:

- Safari browser controls
- Android browser controls
- safe-area inset
- landscape orientation

---

# ERROR PREVENTION

Avoid:

```text
hydration mismatch
window usage during SSR
GSAP duplicate registration
animation memory leaks
ScrollTrigger instances surviving navigation
Lenis RAF loops surviving unmount
ResizeObserver loops
layout overflow
negative z-index traps
pointer-blocking decoration
```

Decorative objects should generally have:

```css
pointer-events: none;
```

unless interactive.

---

# SUPABASE

Do NOT add Supabase during the initial prototype unless persistence is necessary.

Phase 1 should work completely without Supabase.

Later Supabase may support:

```text
multiple surprise pages
private slugs
responses
date choices
view timestamp
admin content
photo metadata
```

If Supabase is introduced:

- use environment variables
- never expose service role credentials
- create sensible RLS
- keep public access minimal
- validate server-side mutations
- avoid creating authentication for the recipient unless required

---

# VERCEL

The finished project should be deployable on Vercel without unusual infrastructure.

Before completion verify:

```text
npm run lint
npm run build
```

and available tests.

The production build must succeed.

---

# PLACEHOLDER ASSETS

If real user photos are unavailable:

generate or use neutral placeholders.

Clearly document where the user should replace them.

Example:

```text
/public/images/memories/memory-01.webp
/public/images/memories/memory-02.webp
```

Do not block implementation while waiting for personal photos.

---

# RIVE POLICY

Rive is optional, not mandatory.

Use it only for a high-value asset such as:

```text
interactive envelope
small mascot
flower opening
tiny character reacting to interaction
```

Do not put Rive everywhere.

Provide graceful fallback if the `.riv` asset is unavailable.

---

# THREE.JS POLICY

Do not use Three.js or React Three Fiber in the initial implementation.

The intended visual depth should primarily come from:

```text
CSS
SVG
GSAP
layering
parallax
Rive
```

Only introduce WebGL after profiling proves there is performance headroom and there is a compelling visual reason.

---

# MICRO-INTERACTIONS

Implement subtle feedback.

Buttons:

```text
hover:
small translate
small scale

press:
scale around .96–.98
```

Cards:

```text
small rotation
slight depth
soft shadow change
```

Photos:

```text
drag resistance
rotation based on movement
```

Desktop CTA may use a magnetic effect.

Disable magnetic interaction on touch devices.

---

# IMPORTANT

Do not confuse "interactive" with "constantly moving."

Most things should remain still until:

```text
scroll
pointer
tap
drag
swipe
selection
```

causes them to respond.

The recipient should feel that they are causing the story to unfold.

---

# =========================================================
# MULTI-AGENT EXECUTION PLAN
# =========================================================

Follow the phases below.

Do NOT have every model simultaneously modify the same files.

Each phase must have one primary owner.

A reviewer may inspect the result without modifying it until review is complete.

---

# PHASE 1 — PRODUCT ARCHITECTURE

## MODEL

Gemini 3.1 Pro High

## ROLE

You are the:

```text
Lead Product Architect
Senior UX Designer
Technical Planner
```

Do not build the entire site yet.

Your responsibility is to convert the master brief into an implementation plan.

---

## TASK

Inspect the repository.

Then create:

```text
/docs/PROJECT_SPEC.md
/docs/ARCHITECTURE.md
/docs/DESIGN_SYSTEM.md
/docs/MOTION_SYSTEM.md
```

Determine:

- experience flow
- component hierarchy
- data model
- responsive behavior
- animation responsibility
- GSAP strategy
- Lenis strategy
- Rive usage
- loading strategy
- image strategy
- accessibility strategy
- reduced motion strategy
- performance strategy

---

## CREATE A SECTION MAP

Document every scene:

```text
01 Opening
02 Envelope
03 Question
04 Success Transition
05 Why You
06 Memories
07 Polaroids
08 Date Game
09 Letter
10 Ending
```

For every scene document:

```text
purpose
layout
user interaction
mobile behavior
desktop enhancement
animation
performance risk
fallback
```

---

## ARCHITECTURE QUALITY GATE

Before finishing Phase 1, confirm:

- architecture is not over-engineered
- Supabase is not required for MVP
- initial loading remains light
- mobile is first-class
- animation responsibilities do not overlap
- content is separated from presentation

Then update:

```text
/docs/PROGRESS.md
```

STOP after planning.

Do not implement the full experience.

---

# PHASE 2 — DESIGN & MOTION REVIEW

## MODEL

Claude Opus 4.6 Thinking

## ROLE

You are a:

```text
Creative Director
Award-level Interactive Web Designer
Senior Motion Engineer
```

Do NOT begin implementation immediately.

Read all Phase 1 documents.

Critically evaluate them.

---

## OBJECTIVE

Make the design feel:

```text
premium
personal
subtle
playful
cinematic
touchable
```

without becoming:

```text
busy
slow
overly cute
romantic cliché
```

---

## TASK

Improve:

```text
DESIGN_SYSTEM.md
MOTION_SYSTEM.md
```

Define:

### Typography hierarchy

```text
display
heading
body
caption
handwritten note
```

### Spacing

Define consistent spacing.

### Radius

Avoid generic 24px rounded cards everywhere.

### Shadows

Use subtle paper/photo shadows only.

### Motion durations

Establish ranges for:

```text
micro
standard
cinematic
```

### Easing

Create a small easing vocabulary.

Do not use random easings everywhere.

---

## MOTION MAP

Create a timeline/interaction map showing:

```text
trigger
element
property
duration
easing
mobile adjustment
reduced-motion behavior
```

for every major scene.

---

## REVIEW

Identify anything that may:

- cause jank
- require excessive JS
- make mobile awkward
- appear childish
- feel template-like

Correct the specification.

Do not implement everything.

Update `PROGRESS.md`.

---

# PHASE 3 — FOUNDATION IMPLEMENTATION

## MODEL

Claude Sonnet 4.6 Thinking

## ROLE

You are the:

```text
Senior Next.js Engineer
Frontend Implementation Lead
```

Read all project documentation.

Implement the technical foundation.

---

## TASK

Create or refine:

```text
Next.js structure
Tailwind setup
global typography
design tokens
content configuration
responsive layout primitives
basic scene structure
loading strategy
```

Install only dependencies actually required.

---

## IMPLEMENT

Create initial versions of:

```text
SurpriseExperience
OpeningScene
QuestionScene
WhyYouScene
MemoryStory
PolaroidStack
DateChoice
SecretLetter
EndingScene
```

At this phase interactions may remain basic.

Focus on:

```text
semantic structure
responsive layout
correct configuration
clean TypeScript
reusable components
```

---

## IMPORTANT

Do not prematurely create giant GSAP timelines.

Do not introduce Supabase yet.

Do not implement decorative overkill.

---

## QUALITY GATE

Run:

```bash
npm run lint
npm run build
```

Fix all actual errors.

Verify at least:

```text
360px
390px
430px
768px
1440px
```

Update `PROGRESS.md`.

---

# PHASE 4 — CINEMATIC INTERACTION SYSTEM

## MODEL

Claude Opus 4.6 Thinking

## ROLE

You are the:

```text
Principal Creative Developer
GSAP Specialist
Interaction Engineer
```

This is the main motion phase.

Read:

```text
MOTION_SYSTEM.md
PROGRESS.md
```

and inspect the current implementation.

---

## PRIMARY TASKS

Implement:

```text
Lenis integration
GSAP initialization
ScrollTrigger lifecycle
parallax system
opening motion
envelope transition
success transition
text reveals
pinned memory moment
micro-interactions
```

---

## IMPORTANT ENGINEERING RULES

Every animation must have proper cleanup.

React development mode must not create duplicated timelines.

Animations must be scoped.

Resize behavior must work.

ScrollTrigger refresh must be handled appropriately.

Lenis must synchronize correctly.

---

## PARALLAX

Build reusable functionality such as:

```tsx
<ParallaxLayer speed={0.3}>
```

or an equivalent clean abstraction.

Avoid duplicating near-identical ScrollTrigger code across every section.

---

## MOTION QUALITY

Animation should have hierarchy.

Important scenes:

```text
larger motion
```

Secondary details:

```text
smaller motion
```

Do not animate everything equally.

---

## TOUCH TEST

Ensure:

```text
scroll remains easy
buttons remain tappable
drag does not interfere with vertical scroll
no content becomes inaccessible
```

---

## REDUCED MOTION

Implement reduced-motion alternatives now.

Not later.

---

## QUALITY GATE

Inspect mobile behavior.

Check console.

Run build.

Update `PROGRESS.md`.

---

# PHASE 5 — PLAYFUL INTERACTIONS

## MODEL

Claude Sonnet 4.6 Thinking

## ROLE

You are the:

```text
Interaction Implementation Engineer
Mobile UX Engineer
```

Implement the smaller interactive experiences.

---

## ESCAPE BUTTON

Implement robust bounded escape logic.

Requirements:

```text
pointer proximity on desktop
attempted tap behavior on touch
3–4 playful escapes
safe viewport bounds
orientation-safe
no overflow
accessible fallback
real "Aku pikir dulu" option
```

---

## POLAROID

Implement polished mobile photo interaction.

Choose:

```text
Draggable
OR
Embla
```

based on the design specification.

Not both.

---

## DATE GAME

Implement 3 lightweight choices.

Maintain selected state.

Provide satisfying but subtle interaction feedback.

---

## MAGNETIC BUTTON

Desktop only.

Disable on touch devices.

---

## AUDIO CONTROL

If the architecture includes audio:

implement an explicit user-controlled play button.

Never autoplay.

---

## QUALITY GATE

Test pointer and touch behavior.

Make sure drag gestures do not block normal scroll.

Update `PROGRESS.md`.

---

# PHASE 6 — OPTIONAL DATA LAYER

## MODEL

Claude Sonnet 4.6 Thinking

## CONDITION

ONLY execute this phase if persistence has been requested or clearly enabled.

Otherwise document:

```text
Supabase intentionally deferred.
```

and skip implementation.

---

## POSSIBLE SUPABASE STRUCTURE

If needed:

```text
surprises
memories
responses
date_choices
```

A surprise could contain:

```text
id
slug
mode
recipient_name
opening
question
letter
ending
created_at
```

---

## SECURITY

Implement appropriate RLS.

Do not expose administrative mutation anonymously.

Recipient should not need an account unless explicitly requested.

Do not expose private secrets.

---

# PHASE 7 — PERFORMANCE & ACCESSIBILITY AUDIT

## MODEL

Gemini 3.1 Pro High

## ROLE

You are now an independent reviewer.

DO NOT trust earlier implementation decisions automatically.

Audit the entire website.

---

## AUDIT

Inspect:

```text
initial JS
client component boundaries
image loading
font loading
dynamic imports
animation initialization
ScrollTrigger count
Rive usage
event listeners
layout shift
mobile overflow
touch performance
accessibility
reduced motion
```

---

## IDENTIFY

Categorize issues:

```text
P0 — broken
P1 — serious
P2 — important
P3 — polish
```

Write:

```text
/docs/AUDIT.md
```

Do not silently redesign the project.

Provide precise fixes.

---

# PHASE 8 — AUDIT FIXES

## MODEL

Claude Sonnet 4.6 Thinking

Read:

```text
/docs/AUDIT.md
```

Fix issues in order:

```text
P0
P1
P2
P3
```

Do not perform unrelated refactors.

After fixes:

run:

```bash
npm run lint
npm run build
```

Run tests if present.

Update `PROGRESS.md`.

---

# PHASE 9 — FINAL CREATIVE QA

## MODEL

Claude Opus 4.6 Thinking

## ROLE

Act as the final:

```text
Creative Director
Senior Frontend Reviewer
Interaction QA Engineer
```

Do not make large architectural changes unless something is clearly broken.

---

## REVIEW THE EXPERIENCE AS A HUMAN

Ask:

Does the opening create curiosity?

Does the question arrive at the right moment?

Is the NO button playful rather than annoying?

Does YES feel emotionally rewarding?

Does the scrapbook section feel personal?

Is parallax noticeable without being excessive?

Do photos feel tactile?

Does the date game feel natural?

Does the letter feel intimate?

Is the ending restrained?

Does the experience feel good on a phone?

---

## REMOVE

Anything that feels like:

```text
animation for animation's sake
design flexing
AI-generated filler
generic Valentine's template
over-engineering
```

---

## FINAL POLISH

Fix only high-value polish.

Check:

```text
spacing
typography
animation timing
mobile safe areas
loading behavior
transition continuity
content readability
```

Update `PROGRESS.md`.

---

# PHASE 10 — PRODUCTION CHECK

## MODEL

Claude Sonnet 4.6 Thinking

Perform final engineering verification.

Run:

```bash
npm run lint
npm run build
```

If tests exist:

```bash
npm test
```

or the project's appropriate test command.

---

## CHECK

No:

```text
console errors
TypeScript errors
broken routes
missing images
failed imports
hydration errors
horizontal mobile overflow
broken reduced-motion mode
```

---

## DOCUMENT

Create:

```text
README.md
```

covering:

```text
setup
development
content customization
photo replacement
optional audio
optional Supabase
Vercel deployment
environment variables
```

---

# FINAL DELIVERABLE

The finished project must feel like:

```text
a small interactive world
made specifically for one person.
```

Not:

```text
a romantic landing-page template.
```

Its strongest characteristics should be:

```text
storytelling
touch interaction
subtle motion
personal photos
editorial typography
depth
restraint
mobile performance
```

---

# FINAL DEFINITION OF DONE

Do not claim the project is finished unless all applicable items are true:

- [ ] Responsive from 360px upward
- [ ] Mobile is the primary polished experience
- [ ] Opening loads quickly
- [ ] No autoplay audio
- [ ] Question interaction works on touch and desktop
- [ ] NO interaction eventually allows a genuine alternative
- [ ] YES transition is polished
- [ ] Parallax is subtle and smooth
- [ ] Interactive photo section works
- [ ] Date selection works
- [ ] Letter is editable through configuration
- [ ] Reduced-motion mode works
- [ ] No horizontal overflow
- [ ] No console errors
- [ ] No hydration errors
- [ ] Animation cleanup is implemented
- [ ] Build succeeds
- [ ] Content can be changed without editing motion components
- [ ] Personal photos can easily be replaced
- [ ] README explains customization
- [ ] Vercel deployment is ready

The end result should prioritize emotional experience and craftsmanship over quantity of features.