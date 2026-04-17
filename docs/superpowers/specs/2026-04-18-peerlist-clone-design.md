# Peerlist Clone Design Specification
**Date:** 2026-04-18
**Topic:** 6-Route Peerlist Clone

## 1. Overview
The goal is to reverse-engineer and clone six Peerlist routes (`/`, `/scroll`, `/jobs`, `/search`, `/blog`, `/ads`) into a single Next.js 16 application using Tailwind v4 and shadcn/ui. The project requires a hybrid fidelity approach, focusing on pixel-perfect emulation for the core marketing routes and slightly lighter fidelity for functional routes, while simulating real application states (mock data flows, UI interactivity).

### Constraints & Requirements
- **Fidelity:** Pixel-perfect strictly enforced on `/` and `/scroll`; high-fidelity mockups for `/jobs`, `/search`, `/blog`, and `/ads?utm_source=left_panel`.
- **Content:** Exact Peerlist branding, copy, assets, and typography used.
- **Data Architecture:** Snapshot visual data structured with clean component seams. The UI components must accept data via props, allowing simple JSON mock data replacement, so the clone is structurally ready for a real backend.
- **Interactivity:** Full frontend simulation (filters, tabs, forms using React state/URL params).

## 2. Architecture & Route Strategy
We will use a single Next.js App Router application. 

### 2.1 Route Map
- `src/app/page.tsx` (Target: `peerlist.io/`)
- `src/app/scroll/page.tsx` (Target: `peerlist.io/scroll`)
- `src/app/jobs/page.tsx` (Target: `peerlist.io/jobs`)
- `src/app/search/page.tsx` (Target: `peerlist.io/search`)
- `src/app/blog/page.tsx` (Target: `peerlist.io/blog`)
- `src/app/ads/page.tsx` (Target: `peerlist.io/ads?utm_source=left_panel`)

### 2.2 Directory Structure
Based on the current scaffold, we will add the following organizational layers:
- `src/components/ui/*`: Pure shadcn/base primitives.
- `src/components/features/[route]/*`: Domain-specific or route-specific complex blocks (e.g., `src/components/features/jobs/JobCard.tsx`).
- `src/components/features/shared/*`: Cross-route components (e.g., the global left-panel navigation sidebar).
- `src/lib/data/`: Static JSON snapshots containing Peerlist data to inject into Server Components.
- `docs/research/components/`: Markdown spec files capturing `getComputedStyle()` extraction details per component.

## 3. Data & State Management

### 3.1 The "Clean Seams" Approach
Data will not be hardcoded deeply within JSX files. Instead, route files (Server Components) will fetch from local JSON snapshots (`src/lib/data/`) and pass this data downward as props.

Example:
```tsx
// src/app/jobs/page.tsx
import { getJobsSnapshot } from "@/lib/data/jobs";
import { JobBoard } from "@/components/features/jobs/JobBoard";

export default async function JobsPage() {
  const jobsData = await getJobsSnapshot();
  return <JobBoard initialData={jobsData} />;
}
```

### 3.2 Interactivity State
- Static interactions (hover states, simple scroll reveals) will be handled strictly via CSS (`tailwindcss`, `tw-animate-css`).
- Complex interactive states (tab switching on `/jobs`, search filtering on `/search`) will use minimal Client Components (`"use client"`), leveraging React state (`useState`/`useReducer`) or Next.js Search Params (`useSearchParams()`) to persist state in the URL for shareability.

## 4. Execution Pipeline (The Clone Method)

Given the complexity of 6 routes, we will employ a specialized extraction methodology:

### Phase 1: Foundation First
1. Run browser automation sweeps on Peerlist to extract global tokens (OKLCH colors, border radii, shadows, spacing).
2. Download global fonts (Geist), icons, and favicons.
3. Establish `src/app/globals.css` and the shadcn/ui config to exactly mirror the Peerlist global theme.

### Phase 2: Component Specification (Extraction)
For each route:
1. Extract CSS computed styles, responsive breakpoints, and interaction models (click vs. scroll).
2. Download required section assets.
3. Write an explicit Markdown component specification (e.g., `docs/research/components/hero-section.spec.md`).

### Phase 3: Parallel Construction
1. Dispatch parallel builder agents (worktrees) to construct individual components strictly according to their spec files.
2. Merge completed, build-passing component branches into the main branch.
3. Assemble the route pages from the merged components.

## 5. Next Steps
1. User reviews this specification.
2. If approved, we will transition to the `writing-plans` skill to build a step-by-step execution roadmap based on this document.
