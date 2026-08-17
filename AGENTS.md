# AI Agent Instructions (Codex)

Welcome. If you are an AI agent taking over this repository (e.g., Cursor/Codex), please observe the following constraints to ensure the interactive experience does not degrade.

## Immediate Tasks
1. Read `docs/CODEX_HANDOFF.md`.
2. Read `docs/PROGRESS.md`.
3. Inspect the repository before editing anything.

## Critical Rules
- **Preserve Current Architecture**: Do not rewrite the `GSAP` + `Lenis` integrations.
- **Do Not Add Dependencies**: Do not install Framer Motion, Three.js, Rive, or UI kits unless specifically instructed by the human. The current stack (Tailwind v4, Next.js App Router, GSAP, Embla) is sufficient.
- **Mobile Performance First**: Prioritize fluid transitions and avoid heavy filtering or massive repaints.
- **Run Verification**: Always run `npm run lint` and `npm run build` before considering a task complete.

Your primary mission should be the final **UI Refinement and Personalization Preparation**, replacing placeholder assets with genuine photography and text while keeping the cinematic scrapbook aesthetic intact.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
