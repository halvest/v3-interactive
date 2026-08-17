# Codex Handoff Document

Welcome to the interactive surprise experience. This document outlines the project architecture, design system, and current state to ensure a smooth transition and prevent regressions.

## Project Overview
This project is an interactive, cinematic, responsive "digital scrapbook" surprise website intended primarily for mobile devices. It takes the recipient through a personal emotional journey ending with a date selection and a personal letter.

## Current Stack
- **Next.js**: 16.3.1
- **React**: 19.2.8
- **Tailwind CSS**: 4.x
- **GSAP**: 3.15.0 (with `@gsap/react` 2.1.2)
- **Lenis**: 1.3.26
- **Embla Carousel React**: 8.6.0

## Architecture
- **Interaction Flow**: Opening, Envelope, Question, two config-driven quizzes, accepted transition, then the continuous scroll story. The No target begins aligned with Yes, then is pointer/touch-playful inside a measured arena.
- **Scroll Experience**: Handled by `lenis` for smooth inertia, coupled tightly with `gsap/ScrollTrigger`.
- **Content Configuration**: Fully decoupled from UI logic. All personalized strings, images, and audio metadata reside in `content/surprise.ts`.
- **Client/Server Boundaries**: Strict separation. The root layout and `page.tsx` compose the experience, while interaction-heavy scenes (Envelope, Question, Audio) use `"use client"`.

## Main Components
- **`app/page.tsx`**: Main entry orchestrating the components.
- **`components/ui/ExperienceHeader.tsx`**: Floating music player with pure CSS animations and expandable/collapsible state.
- **`components/audio/AudioPlayerProvider.tsx`**: Global context wrapping native `HTMLAudioElement` to prevent unmounting across scenes.
- **`components/experience/OpeningScene.tsx`**: Initial cinematic hook.
- **`components/experience/EnvelopeScene.tsx`**: Interactive letter reveal.
- **`components/experience/QuestionScene.tsx`**: Evasive "Nggak" button logic.
- **`components/experience/QuizNameScene.tsx`**: Config-driven name quiz with a sky editorial paper composition.
- **`components/experience/QuizFavoriteScene.tsx`**: Config-driven favorite quiz with a sage/mustard cafe-note composition.
- **`components/experience/ScrollExperience.tsx`**: Lenis wrapper unlocking the rest of the site upon Question acceptance.
- **`components/sections/WhyYouSection.tsx`**: Stacked overlapping paper notes.
- **`components/sections/MemoryStory.tsx`**: Parallax photo layout with 3 alternating archetypes.
- **`components/sections/PolaroidStack.tsx`**: Embla carousel interaction.
- **`components/sections/DateChoice.tsx`**: Interactive perforated ticket selection.
- **`components/sections/SecretLetter.tsx`**: Typeset emotional letter.
- **`components/ui/Footer.tsx`**: Minimal restart utility.

## Motion Architecture
- **GSAP**: Main driver for timelines, staggered reveals, and scroll-linked actions.
- **`@gsap/react`**: `useGSAP` hook used exclusively to manage scoping and React strict mode cleanup safely.
- **ScrollTrigger**: Handles the parallax and fade-in effects as scenes enter the viewport.
- **Lenis**: Overrides native scroll for premium cinematic feel, paused when modals or critical interactions are active.
- **Embla**: Handles the touch-friendly swipe gesture for the Polaroid stack.
- **Reduced Motion**: Honored universally via `useReducedMotion.ts`, which bypasses complex GSAP timelines and disables Lenis.

## Design Direction
**Aesthetic:** Cinematic modern interactive editorial scrapbook.
- Use whitespace generously.
- Prefer elegant serif fonts (`Instrument Serif`) paired with clean sans (`Geist`) and handwritten annotations (`Caveat`).
- Employ tactile shadows (`shadow-paper`, `shadow-polaroid`) and overlapping layouts.

**Anti-patterns (DO NOT DO THIS):**
- Generic SaaS-like generic rounded boxes with gradients.
- Forced 100vh constraints causing overflow.
- Flashy neon colors or generic "Valentine's Day" pink overload.
- Constant chaotic animations. Keep it calm.

## Audio
- Relies purely on the native `HTMLAudioElement` via `AudioPlayerProvider.tsx`.
- Does NOT use Howler, WaveSurfer, or any heavy audio library.
- Configuration resides in `content/surprise.ts` under `surpriseConfig.audio`.

## Personalization
To customize the experience, replace assets in `public/` and update `content/surprise.ts`:
- **Audio**: The configured main track is `public/audio/river-flow.mp3`; its metadata and volume remain centrally owned by `content/surprise.ts`. `public/audio/cat.mp3` is the local No-button feedback effect.
- **Photos**: Add `.jpg/.webp` to `public/images/` and update `surpriseConfig.memories`.
- **Copy**: Update strings in `surpriseConfig` (Opening, Question, Reasons, DateChoices, Letter, Ending).

## Known Placeholder Assets
- `/audio/river-flow.mp3` (present) and `/audio/cat.mp3` (present); final cover artwork and final metadata are still placeholders.
- `/images/placeholder.svg` (Used for all memories).

## Known Remaining Issues
- Real audio file needs to be provided by the user.
- Real images need to be uploaded and mapped.

## Do Not Change Without Reason
- Do not modify `gsap-setup.ts` timeline creation patterns.
- Do not add Framer Motion (it conflicts conceptually with GSAP here).
- Do not switch to a global state manager (Redux/Zustand) unless absolutely required by a massive new feature.
- Do not modify the escape-button containment math in `QuestionScene` without testing on mobile touch devices.

## Next Recommended Work
**Professional UI refinement + personalization preparation.**
Focus on inserting real content and conducting final manual QA on the recipient's target device model. Do not attempt another architecture rewrite.
