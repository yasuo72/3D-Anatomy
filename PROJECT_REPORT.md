# Anatomy Lab 3D - Comprehensive Project Report

**Project Name:** Anatomy Lab 3D
**Author:** Rohit
**Version:** 1.0.0
**Description:** An interactive, high-performance 3D human anatomy explorer built with Three.js, React 19, and Next.js

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Core Features](#4-core-features)
5. [Architecture & How Things Work](#5-architecture--how-things-work)
6. [3D Rendering Pipeline](#6-3d-rendering-pipeline)
7. [Data Layer](#7-data-layer)
8. [Audio System](#8-audio-system)
9. [UI Components](#9-ui-components)
10. [Styling System](#10-styling-system)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Build & Dev Tooling](#12-build--dev-tooling)
13. [Testing](#13-testing)
14. [Assets & Static Files](#14-assets--static-files)
15. [Key File Reference](#15-key-file-reference)

---

## 1. Project Overview

Anatomy Lab 3D is a medical education web application that allows users to explore interactive 3D models of human organs. The application features:

- **9 anatomical organs**: Heart, Brain, Lungs, Liver, Kidneys, Eye, Intestine, Pancreas, Skin
- **Interactive 3D viewer** with rotation, zoom, cross-section, and exploded view
- **Light/Dark theme** with smooth transitions
- **ECG/Pulse HUD overlay** showing real-time waveform animations
- **Web Audio soundscapes** (heartbeat, breathing) and text-to-speech voiceovers
- **Quiz system** and personal notes with export to `.txt`
- **Responsive design** from desktop to mobile

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.6 | UI framework |
| Next.js | 16.2.6 | React meta-framework (SSR/RSC) |
| Three.js | 0.185.1 | 3D WebGL rendering |
| TailwindCSS | 4.2.1 | Utility-first CSS |
| GSAP | 3.15.0 | Animation library |
| Lucide React | 1.28.0 | Icon library |

### Backend / Infrastructure
| Technology | Version | Purpose |
|---|---|---|
| Vinext | 0.0.50 | Cloudflare Workers React framework |
| Vite | 8.0.13 | Build tool & dev server |
| Cloudflare Vite Plugin | 1.37.1 | Cloudflare Workers integration |
| Wrangler | 4.92.0 | Cloudflare Workers CLI |
| Drizzle ORM | 0.45.2 | SQL ORM (for D1 database) |
| Drizzle Kit | 0.31.10 | Database migrations |

### Dev Tooling
| Technology | Version | Purpose |
|---|---|---|
| TypeScript | 5.9.3 | Type safety |
| ESLint | 9.39.4 | Linting |
| Node.js | >= 22.13.0 | Runtime |

---

## 3. Project Structure

```
anatomy/
├── app/                          # Next.js App Router directory
│   ├── page.tsx                  # Root page (renders AnatomyApp)
│   ├── layout.tsx                # Root layout (fonts, metadata, OG tags)
│   ├── globals.css               # Global CSS design system (874 lines)
│   ├── chatgpt-auth.ts           # ChatGPT OAuth authentication helper
│   ├── components/
│   │   ├── AnatomyApp.tsx        # Main application shell & state management
│   │   ├── OrganViewer.tsx       # 3D viewer wrapper with tool controls
│   │   └── Ecghud.tsx            # Real-time ECG/pulse waveform canvas
│   └── lib/
│       ├── anatomy-data.ts       # Organ data models & definitions
│       ├── audio-synth.ts        # Web Audio API synthesizer
│       └── three/
│           ├── viewer.ts         # Core Three.js viewer class (701 lines)
│           ├── loaders.ts        # GLTF model loader & asset manager
│           ├── hotspots.ts       # 3D hotspot/label system
│           ├── tsl-materials.ts  # Three.js TSL shader nodes
│           └── dispose.ts        # Three.js disposal utilities
├── db/
│   ├── schema.ts                 # Drizzle DB schema (empty by default)
│   └── index.ts                  # D1 database connection
├── build/
│   └── sites-vite-plugin.ts      # Custom Vite plugin for OpenAI hosting
├── worker/
│   └── index.ts                  # Cloudflare Worker entry point
├── examples/
│   └── d1/                       # Example D1 database usage
│       ├── db/schema.ts          # Example notes table schema
│       └── app/api/notes/        # Example API route
├── public/
│   ├── models/                   # 3D organ models (.glb)
│   ├── anatomy/                  # 2D organ illustrations (.webp)
│   ├── draco/                    # Draco mesh decoder (WASM)
│   ├── basis/                    # Basis texture transcoder (WASM)
│   └── *.svg, *.png, *.jpg       # Icons, favicons, OG images
├── tests/
│   └── rendered-html.test.mjs    # Server-rendered HTML test
├── drizzle/                      # Generated DB migrations
├── dist/                         # Build output
├── package.json
├── tsconfig.json
├── vite.config.ts                # Vite + Vinext + Cloudflare config
├── next.config.ts                # Next.js config (minimal)
├── drizzle.config.ts             # Drizzle Kit config
├── postcss.config.mjs            # PostCSS config (TailwindCSS)
├── eslint.config.mjs             # ESLint config
├── vercel.json                   # Vercel deployment config
└── .openai/hosting.json          # OpenAI hosting metadata
```

---

## 4. Core Features

### 4.1 Interactive 3D Organ Viewer
- **GLTF Models**: 9 organs loaded as `.glb` files with Meshopt compression
- **Orbit Controls**: Drag to rotate, scroll to zoom (with damping)
- **Auto-Rotate**: Toggleable automatic rotation (0.65 speed)
- **Hotspot System**: Clickable dots on organ surfaces showing anatomical labels
- **Cross-Section**: Animated clipping plane that slices the model
- **Exploded View**: Dissects sub-meshes outward for internal exploration
- **X-Ray Mode**: Adjustable opacity slider (10%–100%)
- **Wireframe Toggle**: Layer view showing mesh topology
- **Isolation Mode**: Fades plinth/background for focused viewing
- **Cinema Mode**: Full-screen immersive viewer
- **Environment Presets**: Clinical, Dark Neon, X-Ray Blue, Warm lighting

### 4.2 Dual Light/Dark Theme
- CSS custom properties (`--ink`, `--canvas`, `--paper`, `--coral`, etc.)
- `html[data-theme="dark"]` selector for dark mode
- Smooth 0.3s transitions on background and colors
- Persisted to `localStorage`

### 4.3 ECG & Pulse HUD
- Canvas-based real-time waveform rendering
- Heart organ: anatomically-inspired ECG wave (P-QRST complex)
- Other organs: smooth sine pulse animation
- Animated pulsing dot indicator

### 4.4 Audio System
- **Heartbeat synth**: Oscillator-based lub-dub at configurable BPM
- **Breathing synth**: Filtered noise cycles (inhale/exhale)
- **UI clicks**: Triangle wave click feedback
- **Voiceover**: Web Speech API text-to-speech for organ descriptions
- **Mute toggle**: Global audio on/off

### 4.5 Learning Modals
- **Lesson modal**: Guided discovery view
- **Quiz modal**: Interactive Q&A with correct/incorrect feedback and XP scoring
- **Animation modal**: Function animation placeholder with heartbeat animation
- **System modal**: Organ placement within body system
- **Notes modal**: Personal study notes editor with `.txt` download

### 4.6 Organ Comparison
- Fixed bottom strip comparing selected organ vs. reference organ
- Shows function, size, and system info side-by-side

### 4.7 Responsive Design
- **Desktop** (1720px max): 3-column workspace (library | viewer | info)
- **Tablet** (< 1350px): Condensed columns
- **Mobile** (< 760px): Bottom drawer for library, stacked layout
- **Small mobile** (< 470px): Single column

---

## 5. Architecture & How Things Work

### 5.1 Rendering Flow

```
User Request
    │
    ▼
Cloudflare Worker (worker/index.ts)
    │  - Handles image optimization at /_vinext/image
    │  - Delegates SSR to vinext handler
    ▼
Vinext SSR (app-router-entry)
    │  - Server-side renders React components
    │  - Resolves fonts, metadata, initial HTML
    ▼
HTML Response → Browser
    │
    ▼
React Hydration (AnatomyApp.tsx)
    │  - Client-side "use client" component
    │  - Manages all app state (organ, theme, modals, etc.)
    │
    ├── OrganViewer → Three.js Viewer (viewer.ts)
    │     │  - Creates WebGLRenderer, PerspectiveCamera, OrbitControls
    │     │  - Builds environment (lights, plinth, shadow, particles)
    │     │  - Loads GLTF models via AnatomyAssetManager
    │     │  - Renders animation loop (requestAnimationFrame)
    │     │  - Manages hotspot layer (3D sprites)
    │     │
    │     └── Ecghud → Canvas 2D waveform
    │
    ├── Info Panel → Organ data display
    │
    ├── Learning Cards → Educational content grid
    │
    └── Learning Modal → Overlay dialogs
```

### 5.2 State Management

All state lives in `AnatomyApp.tsx` via React `useState`:

| State | Type | Purpose |
|---|---|---|
| `organId` | `OrganId` | Currently selected organ |
| `autoRotate` | `boolean` | Auto-rotation enabled |
| `compare` | `boolean` | Comparison strip visible |
| `modal` | `Modal \| null` | Active modal type |
| `query` | `string` | Organ search filter |
| `mobileLibrary` | `boolean` | Mobile drawer open |
| `theme` | `"light" \| "dark"` | Current theme |
| `notes` | `Record<string, string>` | Per-organ study notes |

### 5.3 Data Flow

1. `anatomy-data.ts` defines the `organs` array with all metadata
2. `AnatomyApp` maps over organs for the library sidebar
3. When an organ is selected, `OrganViewer` calls `viewer.setOrgan()`
4. `AnatomyAssetManager` loads/caches the `.glb` model
5. `HotspotLayer` attaches 3D sprite markers to the model
6. Info panel reads from the same `organ` object for descriptions

---

## 6. 3D Rendering Pipeline

### 6.1 Viewer Initialization (`viewer.ts`)

```
AnatomyViewer constructor(container, callbacks)
    │
    ├── Create WebGLRenderer
    │     - Antialiasing (disabled on low-power devices)
    │     - ACES Filmic tone mapping
    │     - sRGB color space
    │     - Local clipping enabled
    │     - Pixel ratio capped at 2 (1.5 on mobile)
    │
    ├── Create PerspectiveCamera (34° FOV)
    │
    ├── Create OrbitControls
    │     - Damping (0.055 factor)
    │     - Pan disabled
    │     - Distance range: 4.8 – 12
    │     - Auto-rotate at 0.65 speed
    │
    ├── Build Environment
    │     - Ambient light (0.42 intensity)
    │     - Hemisphere light (warm top, cool bottom)
    │     - Key directional light (warm white)
    │     - Fill directional light (cool blue)
    │     - Rim directional light (coral)
    │     - Point lights for warm glow
    │     - PMREM environment map (gradient probe)
    │     - Plinth cylinder (display pedestal)
    │     - Contact shadow (baked radial gradient)
    │     - Particle system (48 random points)
    │
    ├── ResizeObserver + IntersectionObserver
    │
    └── Animation loop (requestAnimationFrame)
          - Only renders when dirty or busy
          - Updates controls, hotspots, animations
```

### 6.2 Model Loading (`loaders.ts`)

```
AnatomyAssetManager
    │
    ├── GLTFLoader with MeshoptDecoder
    │     - Meshopt decompression for compact models
    │
    ├── load(url)
    │     - Check LRU cache (max 3 entries)
    │     - Parse GLTF → normalize to FIT_SIZE (3.8 units)
    │     - Center model at origin
    │     - Apply material optimizations:
    │       • Clamp roughness (0.42–0.62)
    │       • Zero metalness
    │       • Low envMap intensity (0.32)
    │       • Limit clearcoat (0.08–0.12)
    │       • Anisotropic filtering on all textures
    │     - Setup animation mixer if clips exist
    │     - Create pivot Group for animation
    │
    ├── LRU Cache (3 organs max)
    │     - Evicts oldest on overflow
    │     - Resets materials on cache hit
    │
    └── Prefetch via fetch() with low priority
```

### 6.3 Hotspot System (`hotspots.ts`)

```
HotspotLayer
    │
    ├── attach(pivot, hotspots, meshes)
    │     - snapToSurface(): projects authored positions onto mesh vertices
    │       • Direction-cone filtering (4 tiers: 0.94, 0.82, 0.6, -1.1)
    │       • Nearest vertex within cone
    │       • Surface lift (0.02 units along normal)
    │     - Creates Sprite dots (canvas-rendered halos)
    │     - Creates pulse ring sprites
    │
    ├── update(camera, delta, selectedId, hoveredId)
    │     - Per-frame facing test (dot product with camera)
    │     - Smoothstep opacity fade for backside markers
    │     - View-lift along camera ray (0.3 units)
    │     - Pulse animation for selected/hovered markers
    │
    └── pick(x, y, camera, width, height)
          - Screen-space projection (no mesh raycasting)
          - 24px hit radius
          - Returns nearest visible marker
```

### 6.4 Material System

- **Base**: `MeshStandardMaterial` from GLTF
- **Physical extensions**: `clearcoat`, `clearcoatRoughness` clamped
- **Depth prepass**: During fade-in, a depth-only proxy prevents transparency sorting artifacts
- **Clipping planes**: `THREE.Plane` for cross-section with animated constant
- **TSL nodes**: `medicalRimNode` for rim lighting (progressive WebGPU adoption)

### 6.5 Performance Optimizations

- **Render-on-demand**: Only renders when `dirty` flag is set or `busyUntil` timer active
- **IntersectionObserver**: Skips rendering when viewer is off-screen
- **Page visibility**: Pauses when tab is hidden
- **Low-power detection**: Reduced pixel ratio, disabled antialiasing on mobile
- **LRU model cache**: Reuses loaded organs without re-parsing
- **No shadow mapping**: Uses baked contact shadow texture instead
- **No frustum culling**: Organ meshes always in frame (prevents wrong culling)
- **Prefetch on hover**: Models start downloading before selection

---

## 7. Data Layer

### 7.1 Organ Data Model (`anatomy-data.ts`)

Each organ contains:

```typescript
type Organ = {
  id: OrganId;              // "heart" | "brain" | "lungs" | ...
  name: string;             // Display name
  scientificName: string;   // Latin name (e.g., "Cor")
  system: string;           // Body system (e.g., "Cardiovascular")
  model: string;            // Path to .glb file
  icon: string;             // Unicode glyph
  accent: string;           // Hex color for theming
  description: string;      // Short description
  poetic: string;           // Poetic subtitle
  size: string;             // Physical size
  weight: string;           // Physical weight
  location: string;         // Anatomical location
  function: string;         // Primary function
  dailyFact: string;        // Daily activity fact
  medical: string;          // Medical importance
  bloodSupply: string;      // Blood supply source
  funFact: string;          // "Did you know" fact
  tissue: string;           // Tissue type
  comparison: string;       // Comparison pair
  conditions: string[];     // 8 common conditions
  hotspots: Hotspot[];      // 3D clickable points
  illustrated: boolean;     // Has .webp illustrations
};
```

### 7.2 Hotspot Data

```typescript
type Hotspot = {
  id: string;                    // Unique identifier
  label: string;                 // Display label (e.g., "Aorta")
  detail: string;                // Short description
  position: [number, number, number]; // 3D position in FIT_SIZE space
  color: string;                 // Hex color for the dot
};
```

### 7.3 Database (Optional)

- **Drizzle ORM** configured for **Cloudflare D1** (SQLite)
- Schema is empty by default (`db/schema.ts` exports nothing)
- Example schema in `examples/d1/db/schema.ts` shows a `notes` table
- Database connection via `env.DB` binding in Cloudflare Workers

---

## 8. Audio System (`audio-synth.ts`)

### Class: `AnatomyAudioSynth`

| Method | Description |
|---|---|
| `toggleMute()` | Toggles audio on/off, returns mute state |
| `playHeartbeat(bpm)` | Synthesizes lub-dub heartbeat at given BPM |
| `playBreathing()` | Synthesizes inhale/exhale noise cycles |
| `playClick()` | Short UI feedback sound |
| `stopAmbient()` | Stops any playing ambient sound |
| `speakText(text)` | Web Speech API voiceover |

### Synthesis Details

- **Heartbeat**: Two sine oscillators (70Hz + 55Hz) with exponential frequency ramp, timed at lub-dub intervals
- **Breathing**: White noise buffer through biquad filter (lowpass for inhale, bandpass for exhale) with volume envelope
- **Click**: Triangle oscillator (800→200 Hz) with 40ms decay
- **Voiceover**: `SpeechSynthesisUtterance` at 0.95 rate, 1.0 pitch

---

## 9. UI Components

### 9.1 `AnatomyApp.tsx` (Main Shell)

- **Header**: Brand, navigation (Explore, Systems, Lessons, Library, Notes), search, theme toggle, profile
- **Workspace**: 3-column grid (Organ Library | 3D Viewer | Info Panel)
- **Learning Cards**: 6-card grid showing tissue, comparison, animation, clinical notes, system
- **Footer**: Attribution
- **Modals**: Lesson, Quiz, Animation, System, Notes

### 9.2 `OrganViewer.tsx` (3D Viewer)

- Mounts Three.js canvas via ref
- **Tool bar**: 10 tools (Rotate, Zoom, X-Ray, Isolate, Cross-section, Layers, Audio, Cinema, Compare, Reset)
- **Advanced controls panel**: Opacity slider, Dissection slider, Lighting presets
- **Hotspot callout**: Positioned label overlay
- **Loading indicator**: Orbital spinner with progress
- **ECG HUD**: Real-time waveform overlay

### 9.3 `Ecghud.tsx` (Waveform)

- Canvas-based 2D rendering
- Heart-specific ECG wave (P-QRST complex)
- Generic sine wave for other organs
- Scrolling animation via incrementing offset

---

## 10. Styling System (`globals.css`)

### Design Tokens (CSS Custom Properties)

```css
/* Light theme */
--ink: #2f2a27;        /* Primary text */
--muted: #8d847c;      /* Secondary text */
--canvas: #f7f0e7;     /* Page background */
--paper: rgba(255,251,244,0.82);  /* Card background */
--line: rgba(117,91,70,0.18);     /* Borders */
--coral: #eb7c6b;      /* Accent/CTA */
--lavender: #8d6bcc;   /* Secondary accent */
--sage: #769d74;       /* Success/green */

/* Dark theme overrides */
--canvas: #121110;
--coral: #ff8573;
--lavender: #a988eb;
```

### Fonts

- **Sans**: DM Sans (`--font-sans`)
- **Serif**: Cormorant Garamond (`--font-serif`)
- **Handwriting**: "Comic Sans MS" / "Bradley Hand" (for italic accents)

### Layout System

- **App shell**: Full viewport with 22px padding
- **Topbar**: 68px height, 4-column grid
- **Workspace**: 3-column grid (285px | flex | 330px), max 760px height
- **Learning cards**: 6-column grid (1.05fr + 5x 1fr)
- **Responsive breakpoints**: 1350px, 1040px, 760px, 470px

### Key CSS Patterns

- `backdrop-filter: blur()` for glassmorphism panels
- `color-mix()` for dynamic opacity colors
- CSS `@keyframes` for orbit spinner, pulse dot, heartbeat, callout-in
- `scrollbar-width: none` for clean scroll areas
- `prefers-reduced-motion` media query for accessibility

---

## 11. Deployment & Infrastructure

### 11.1 Cloudflare Workers (Primary)

- **Entry**: `worker/index.ts`
- **Runtime**: Workers with `nodejs_compat` flag
- **Image optimization**: Cloudflare Images binding at `/_vinext/image`
- **Static assets**: Served via `env.ASSETS` binding
- **D1 database**: Optional binding via `.openai/hosting.json`

### 11.2 Vercel (Alternative)

- **Config**: `vercel.json` with `nextjs` framework
- **Build**: `npm run build:next` (standard Next.js build)
- **OG image URL**: Resolved via `VERCEL_PROJECT_PRODUCTION_URL`

### 11.3 OpenAI Hosting

- `.openai/hosting.json` contains project metadata
- Custom Vite plugin (`build/sites-vite-plugin.ts`) copies hosting config to `dist/.openai/`
- D1/R2 bindings currently null (optional features)

---

## 12. Build & Dev Tooling

### 12.1 Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vinext dev` | Start dev server with HMR |
| `build` | `vinext build` | Production build for Cloudflare |
| `build:next` | `next build` | Production build for Vercel |
| `start` | `vinext start` | Start production server |
| `test` | `npm run build && node --test tests/` | Build + run tests |
| `lint` | `eslint . --ignore-pattern dist` | Lint source code |
| `db:generate` | `drizzle-kit generate` | Generate DB migrations |

### 12.2 Vite Configuration (`vite.config.ts`)

- **Plugins**: Vinext, custom sites plugin, Cloudflare Vite plugin
- **Environment**: RSC + SSR child environments
- **D1/R2**: Conditionally configured from hosting.json
- **HMR**: Polling mode for macOS Seatbelt sandbox

### 12.3 TypeScript Configuration

- Target: ES2017
- Module: ESNext with bundler resolution
- Strict mode enabled
- Path alias: `@/*` → `./*`
- Cloudflare Workers types included

---

## 13. Testing (`tests/rendered-html.test.mjs`)

- **Framework**: Node.js built-in `node:test` + `node:assert`
- **Approach**: Integration test that imports the built worker and makes an HTTP request
- **Assertions**:
  - Response status is 200
  - Content-Type is `text/html`
  - HTML contains `<title>Anatomy Lab 3D — Developed by Rohit</title>`
  - HTML contains "Anatomy Lab 3D" and "Developed by Rohit"

---

## 14. Assets & Static Files

### 14.1 3D Models (`public/models/`)

| File | Organ |
|---|---|
| `heart.glb` | Heart |
| `brain.glb` | Brain |
| `lungs.glb` | Lungs |
| `liver.glb` | Liver |
| `kidneys.glb` | Kidneys |
| `eyeball.glb` | Eye |
| `intestine.glb` | Intestine |
| `pancreas.glb` | Pancreas |
| `skin.glb` | Skin |

### 14.2 2D Illustrations (`public/anatomy/<organ>/`)

Each organ folder contains 5 WebP images:
- `thumb.webp` - Library thumbnail
- `organ.webp` - Main illustration
- `microscopic.webp` - Tissue microscopy view
- `location.webp` - Body placement diagram
- `compare.webp` - Comparison visual

### 14.3 Decoder Libraries

- `public/draco/` - Draco mesh decoder (WASM + JS wrapper)
- `public/basis/` - Basis texture transcoder (WASM + JS)

### 14.4 Icons & Meta

- `favicon.svg` - SVG favicon
- `icon-192.png`, `icon-512.png` - PWA icons
- `apple-touch-icon.png` - iOS icon
- `og.jpg` - Open Graph preview image (1200x675)

---

## 15. Key File Reference

| File | Lines | Purpose |
|---|---|---|
| `app/globals.css` | 874 | Complete CSS design system |
| `app/components/AnatomyApp.tsx` | 469 | Main app shell, state, modals |
| `app/lib/three/viewer.ts` | 701 | Core 3D viewer engine |
| `app/lib/three/hotspots.ts` | 371 | 3D hotspot label system |
| `app/lib/three/loaders.ts` | 213 | GLTF model loading & caching |
| `app/components/OrganViewer.tsx` | 290 | Viewer UI wrapper |
| `app/lib/anatomy-data.ts` | 311 | All organ data definitions |
| `app/layout.tsx` | 87 | Root layout with fonts & metadata |
| `app/lib/audio-synth.ts` | 162 | Web Audio synthesizer |
| `app/components/Ecghud.tsx` | 83 | ECG waveform canvas |
| `app/lib/three/tsl-materials.ts` | 8 | TSL shader nodes |
| `app/lib/three/dispose.ts` | 15 | Three.js cleanup utilities |
| `app/chatgpt-auth.ts` | 86 | ChatGPT OAuth helper |
| `worker/index.ts` | 47 | Cloudflare Worker entry |
| `vite.config.ts` | 59 | Build configuration |

---

*Report generated for Anatomy Lab 3D by Rohit*
