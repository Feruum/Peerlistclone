# Peerlist Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clone six Peerlist routes (/, /scroll, /jobs, /search, /blog, /ads) into a Next.js 16 App Router application with a hybrid fidelity approach.

**Architecture:** We will set up a global CSS token foundation extracted from Peerlist, create JSON mock data snapshots for "clean seams", and dispatch builder subagents per section to build pixel-perfect UI components and assemble the routes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui

---

### Task 1: Global Foundation Setup

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Extract Global Tokens via Browser MCP**
Run a browser agent sweep on `https://peerlist.io` to extract global OKLCH colors, radii, shadows, and spacing.
Run: `agent-browser open https://peerlist.io && agent-browser eval 'JSON.stringify({...})'`

- [ ] **Step 2: Update global CSS**
Update `src/app/globals.css` with the extracted variables in `:root` and `.dark`.
```css
@theme inline {
  --color-background: var(--background);
  /* Add all extracted tokens */
}
:root {
  --background: oklch(...);
}
```

- [ ] **Step 3: Update fonts in layout**
Update `src/app/layout.tsx` to use the correct fonts (Geist).

- [ ] **Step 4: Commit Foundation**
Run: `git add src/app/globals.css src/app/layout.tsx`
Run: `git commit -m "chore: setup global design tokens and fonts"`

---

### Task 2: Data Snapshots Architecture

**Files:**
- Create: `src/lib/data/jobs.json`
- Create: `src/lib/data/search.json`
- Create: `src/lib/data/blog.json`

- [ ] **Step 1: Extract and save mock data**
Extract sample data from Peerlist for jobs, search, and blog routes, and save them as static JSON files in `src/lib/data/`.
Example format for `src/lib/data/jobs.json`:
```json
{
  "jobs": [
    { "id": "1", "title": "Frontend Engineer", "company": "Peerlist" }
  ]
}
```

- [ ] **Step 2: Commit Data Seams**
Run: `git add src/lib/data/`
Run: `git commit -m "chore: add mock data snapshots for functional routes"`

---

### Task 3: Home Route (/) Extraction & Build

**Files:**
- Create: `docs/research/components/home.spec.md`
- Create: `src/components/features/home/Hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Extract Home Route**
Run the `clone-website` extraction script on `https://peerlist.io/` to generate `docs/research/components/home.spec.md`.

- [ ] **Step 2: Build Home Route Components**
Using the spec, dispatch builder agents to implement the `Hero.tsx` and other sections.
```tsx
export function Hero() {
  return <section className="..."></section>
}
```

- [ ] **Step 3: Assemble Home Route**
Assemble components in `src/app/page.tsx`.

- [ ] **Step 4: Commit Home Route**
Run: `git add docs/research/components/home.spec.md src/components/features/home/ src/app/page.tsx`
Run: `git commit -m "feat: implement pixel-perfect home route"`

---

### Task 4: Scroll Route (/scroll) Extraction & Build

**Files:**
- Create: `docs/research/components/scroll.spec.md`
- Create: `src/components/features/scroll/ScrollFeed.tsx`
- Create: `src/app/scroll/page.tsx`

- [ ] **Step 1: Extract Scroll Route**
Run extraction on `https://peerlist.io/scroll` to create `scroll.spec.md`.

- [ ] **Step 2: Build Components**
Implement `ScrollFeed.tsx` using pure CSS animations/scroll behavior as per spec.

- [ ] **Step 3: Assemble Scroll Route**
Assemble `src/app/scroll/page.tsx`.

- [ ] **Step 4: Commit Scroll Route**
Run: `git add .`
Run: `git commit -m "feat: implement scroll route"`

---

### Task 5: Interactive Routes (Jobs, Search, Blog, Ads)

**Files:**
- Create: `src/components/features/jobs/JobBoard.tsx`
- Create: `src/app/jobs/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/ads/page.tsx`

- [ ] **Step 1: Build Job Board**
Implement `JobBoard.tsx` (Client Component) using `src/lib/data/jobs.json` to simulate filtering.

- [ ] **Step 2: Assemble Interactive Pages**
Create the page files for `/jobs`, `/search`, `/blog`, and `/ads`, passing the snapshot data down to interactive components.

- [ ] **Step 3: Commit Interactive Routes**
Run: `git add src/app/jobs/ src/app/search/ src/app/blog/ src/app/ads/ src/components/features/`
Run: `git commit -m "feat: implement interactive functional routes"`
