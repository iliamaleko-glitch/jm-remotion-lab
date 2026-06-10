# jm-remotion-lab

JuicyMania animation experiments and Remotion prototypes.

## JuicyManiaIntro

This repository contains a complete Remotion project with a single composition, `JuicyManiaIntro`.

### Video specs

- Duration: 14 seconds (`840` frames)
- FPS: `60`
- Size: `1920x1080`
- Style: luxury black background, deep purple glow (`#7A3CFF`), mysterious access-threshold atmosphere, and premium cinematic motion
- Motion arc: two-second void, fragmented keyhole discovery, slow awakening, accelerated approach, threshold crossing, white-purple bloom, and final access lockup
- Implementation: procedural SVG/CSS gradients, deterministic particles, transforms, and frame-driven Remotion animation; no images or heavy assets

### V3 story structure

- **0–2s — Void:** near-black frame with sparse dust and barely visible purple reflections.
- **2–4s — Discovery:** the keyhole gateway appears in fragments rather than as a full logo mark.
- **4–7s — Awakening:** restrained motion inside the aperture suggests a hidden world beyond it.
- **7–10s — Approach:** the camera begins a physical push toward the gateway with increasing tension.
- **10–12s — Crossing:** the threshold edge blooms as the viewer passes through the keyhole.
- **12–14s — Access:** the inner sanctum resolves into the drop opening screen: `DROP #001`, `CLEMENCE AUDIARD`, and `ACCESS IS EARNED`.

## How to preview locally

Install dependencies, then start Remotion Studio:

```bash
npm install
npm run preview
```

Open the local Studio URL printed in your terminal and choose the `JuicyManiaIntro` composition.

## How to render MP4

Render the composition to `out/juicymania-intro.mp4`:

```bash
npm run render
```

You can also render explicitly with Remotion:

```bash
npx remotion render src/index.ts JuicyManiaIntro out/juicymania-intro.mp4
```

## Project structure overview

```text
.
├── package.json                         # Remotion scripts and dependencies
├── remotion.config.ts                   # Rendering configuration
├── tsconfig.json                        # TypeScript settings
└── src
    ├── index.ts                         # Remotion root registration
    ├── Root.tsx                         # Composition registry
    └── components
        ├── JuicyManiaIntro.tsx          # 14-second drop intro animation
        └── juicymania-intro.css         # Lightweight procedural visual styling
```
