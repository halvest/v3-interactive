# Asset Guide & Personalization Map

This document outlines how to replace the temporary placeholders with genuine personal assets, ensuring the premium editorial look is preserved.

## 1. Visual Asset Philosophy
- **Editorial Scrapbook:** The visual language relies on minimal, hand-drawn SVG assets, subtle physical textures, and generous negative space.
- **Photographs First:** Photos are the primary emotional drivers. Do not cover them with heavy decorative assets.
- **Restraint:** Avoid emoji, clipart, generic heart vectors, neon gradients, or decorative overload.

## 2. SVG Decoration Rules
- **Location:** `components/ui/Decorations.tsx`
- **Style:** Hand-drawn, minimal, `strokeWidth="1"` or `1.5`, monochromatic (`currentColor`), using structural opacity (e.g., `text-text-faint` or `opacity-40`).
- **Extensions:** If adding new shapes (e.g., a flower or an arrow), maintain the exact same stroke weight and loose, imperfect bezier curves as the `HandDrawnStar` and `HandDrawnSparkle`.

## 3. Photo Specifications
- **Format:** `.webp` or `.jpg` (WebP preferred for performance).
- **Target Size:** Keep images under 500KB each. Use tools like ImageOptim or Squoosh.
- **Style:** Natural, candid, minimal filters. The CSS handles slight sepia/contrast adjustments to unify the scrapbook aesthetic automatically.

## 4. Asset Mapping: Memory Story
These photos map to the vertical scrolling narrative section.
- **Aspect Ratio:** 3:4 (Vertical Portrait)
- **Target Dimensions:** ~800x1067 pixels minimum
- **Current Locations (`content/surprise.ts`):**
  - `public/images/memory-1.svg` -> Replace with `memory-1.webp`
  - `public/images/memory-2.svg` -> Replace with `memory-2.webp`
  - `public/images/memory-3.svg` -> Replace with `memory-3.webp`
  - *(Adjust paths in `content/surprise.ts` to match your new filenames)*

## 5. Asset Mapping: Polaroids
These photos map to the swipeable horizontal carousel.
- **Aspect Ratio:** 1:1 (Perfect Square)
- **Target Dimensions:** ~800x800 pixels minimum
- **Current Locations (`content/surprise.ts`):**
  - `public/images/polaroid-1.svg` -> Replace with `polaroid-1.webp`
  - `public/images/polaroid-2.svg` -> Replace with `polaroid-2.webp`
  - `public/images/polaroid-3.svg` -> Replace with `polaroid-3.webp`
  - `public/images/polaroid-4.svg` -> Replace with `polaroid-4.webp`
  - `public/images/polaroid-5.svg` -> Replace with `polaroid-5.webp`

## 6. Optional Audio
If background audio is desired:
- **Location:** Place it in `public/audio/bgm.mp3`
- **Format:** Highly compressed `.mp3` or `.ogg` (aim for under 2MB).
- **Note:** Audio autoplay is blocked by modern browsers until the user interacts. The Phase 7 agent will need to bind the audio `play()` trigger to the "Iya" or "buka ->" transition buttons.

## 7. Naming Conventions
- Keep filenames lowercase and kebab-case.
- **Good:** `first-date.webp`, `coffee-shop.webp`
- **Bad:** `IMG_9432.JPG`, `First Date!.jpg`

## 8. What Needs to be Replaced Later
When advancing to Phase 7, the following must be updated:
1. **Images:** Replace all 8 SVG placeholders in `public/images/` with real photos.
2. **Copy:** Rewrite all placeholder Indonesian text in `content/surprise.ts` with personal memories, inside jokes, and the final Secret Letter.
3. **Dates:** Update the Date Choice options in `content/surprise.ts`.
