# PRD: CS Learning Hub
**Product Requirements Document**  
**Created:** 2026-07-01  
**Author:** Duy Tang  
**Status:** Draft → Ready for Implementation

---

## 1. Product Overview

A personal static learning website covering core CS fundamentals for a full-stack engineer preparing for layoff-proofing and senior-level interviews. Built to learn on both desktop and mobile. Shared publicly on Vercel.

**Tagline:** *Computer Science — explained visually, learned interactively.*

---

## 2. Target User

- Primary: Self (Node.js/Ruby dev, ~5 years exp, no formal CS degree)
- Secondary: Other self-taught developers wanting structured CS review
- Device split: Desktop (deep study) + Mobile (commute/free time)

---

## 3. Curriculum Structure

10 phases, 37 weeks total:

| Phase | Weeks | Topic |
|---|---|---|
| 1 | 1-3 | Computer Fundamentals |
| 2 | 4-7 | Programming Foundations |
| 3 | 8-12 | Data Structures |
| 4 | 13-17 | Algorithms |
| 5 | 18-21 | Operating Systems |
| 6 | 22-25 | Computer Networks |
| 7 | 26-28 | Databases |
| 8 | 29-31 | System Design |
| 9 | 32-35 | Design Patterns |
| 10 | 36-37 | Software Engineering Best Practices |

Reference: https://github.com/jwasham/coding-interview-university

---

## 4. Design System

### 4.1 Visual Style Reference
Based on the existing design-pattern site (vanilla HTML, local at `/Volumes/KINGSTON/design-pattern/`).

### 4.2 Color Palette
```css
--bg-primary:    #0d0d1a;   /* deep dark navy — page background */
--bg-card:       #1a1a2e;   /* card/panel background */
--bg-panel:      #16213e;   /* secondary panel background */
--bg-code:       #0f0f23;   /* code block background */
--text-primary:  #ffffff;   /* headings */
--text-secondary:#a0a0b0;   /* descriptions, labels */
--text-muted:    #6060a0;   /* placeholder, inactive */
--accent-orange: #f5a623;   /* primary CTA, highlights, selected */
--accent-green:  #4ade80;   /* success, selected toggles */
--accent-blue:   #60a5fa;   /* links, code keywords */
--accent-purple: #a78bfa;   /* secondary accent */
--border:        rgba(255,255,255,0.08); /* card borders */
```

### 4.3 Typography
```css
font-family: 'Inter', system-ui, sans-serif;

--text-hero:    2.5rem / 700  /* page title */
--text-h1:      1.75rem / 700 /* topic title */
--text-h2:      1.25rem / 600 /* section heading */
--text-body:    1rem / 400    /* content */
--text-code:    0.875rem / 400 /* 'JetBrains Mono' or 'Fira Code' */
--text-label:   0.75rem / 500 /* badges, tags */
```

### 4.4 Spacing & Radius
```css
--radius-card: 16px;
--radius-btn:  8px;
--gap-grid:    24px;
--padding-card: 28px;
```

---

## 5. Page Architecture

### 5.1 Home Page — Card Grid Dashboard

Layout: Full-width dark page, centered max-width container (~1200px).

**Header section:**
- Site title (large, white, with emoji icon)
- Subtitle: brief tagline
- Overall progress bar: "X / 37 weeks completed"

**Phase sections** (collapsible, each with its own progress):
```
Phase 1: Computer Fundamentals  ████░░░░ 33%
  [Card] [Card] [Card]
Phase 2: Programming Foundations ░░░░░░░░ 0%
  [Card] [Card] [Card] [Card]
```

**Topic Card:**
```
┌─────────────────────────┐
│                         │
│    [CSS icon/SVG]       │  ← 80x80px geometric illustration
│                         │
│  Topic Title            │  ← white, 1.1rem, bold
│  Short analogy desc     │  ← gray, 0.875rem, 2-3 lines
│                         │
│  Open →                 │  ← accent color, hover underline
│  ✓ Read  · Quiz: 80%   │  ← progress indicators (if started)
└─────────────────────────┘
```

Card states:
- Default: dark bg, subtle border
- Hover: slightly lighter bg, border glow (accent color)
- Completed: green checkmark badge top-right
- In progress: partial fill indicator

### 5.2 Topic Page — 3-Column Interactive Layout

```
← Back to all topics

        [Topic Title]
        [Short subtitle / analogy]

┌──────────────┬────────────────────┬──────────────────┐
│   CONTROLS   │   VISUALIZATION    │   CODE PANEL     │
│              │                    │                  │
│ Interactive  │ SVG/CSS animation  │ [Tab: Runtime]   │
│ inputs,      │ that updates live  │ [Tab: Concept]   │
│ selectors,   │ based on controls  │                  │
│ step buttons │                    │ syntax-highlighted│
│              │ Caption below      │ code block       │
│ [Receipt /   │                    │                  │
│  summary]    │                    │ 💡 Why use this? │
│              │                    │ explanation card │
└──────────────┴────────────────────┴──────────────────┘

[Deep Dive Section - full width, below the 3 columns]
  Explanation paragraphs, key concepts, analogies

[Quiz Section]
  10 questions, MCQ + short answer
  Score tracked in localStorage
```

**Mobile layout** (< 768px): Stack vertically — Controls → Visualization → Code → Deep Dive → Quiz

### 5.3 Sidebar Navigation (Desktop only)

Left sidebar, collapsible, ~240px wide:
```
☰ CS Learning Hub

Phase 1: Fundamentals ▼
  ○ How Computers Work
  ✓ Data Representation
Phase 2: Programming ▶ (collapsed)
Phase 3: Data Structures ▶
...

Overall: 3/37 ████░ 8%
```

On mobile: hamburger menu → full-screen drawer overlay.

---

## 6. Feature Requirements

### 6.1 Progress Tracking (localStorage)
```typescript
interface TopicProgress {
  read: boolean;
  readAt?: string;        // ISO date
  quizScore?: number;     // 0-100
  quizAttempts: number;
  lastVisited?: string;
}

interface AppState {
  progress: Record<string, TopicProgress>; // key = "phase1_week1_topic-slug"
  lastVisited: string;                     // topic slug
  sidebarOpen: boolean;
}
```

- Auto-mark as "read" after scrolling to bottom of deep dive section
- Quiz score recorded per attempt; show best score
- Resume from last visited on app open

### 6.2 Algorithm Visualizers

**Strategy A — VisuAlgo embed (preferred for complex):**
- Topics: sorting, graph traversal, BST, heap
- Embed via `<iframe src="https://visualgo.net/...">` in visualization panel
- Zero dev time

**Strategy B — Custom CSS/React animations (for simple concepts):**
- Topics: binary representation, stack push/pop, queue FIFO, hash collision
- Built with Framer Motion or pure CSS transitions
- Each custom visualizer is a self-contained React component

### 6.3 Code Panel
- Syntax highlighting: **Shiki** or **Prism.js** (lightweight)
- Two tabs per topic:
  - "Runtime" tab: step-through execution trace, shows variables changing
  - "Concept" tab: clean class/function definition showing structure
- Copy button on code blocks
- Language: JavaScript (most accessible for web devs)

### 6.4 Quiz Component
- 10 questions per topic (MCQ + optional short answer)
- Immediate feedback on selection (green ✓ / red ✗ + explanation)
- Progress bar while answering
- Final score screen with "Retry" and "Next Topic →" CTAs
- Score persisted in localStorage

### 6.5 Deep Dive Content
- Generated by Claude (me) in-session, saved as JSON
- Rendered as rich HTML: paragraphs, `<code>` inline, lists, callout boxes
- ~1500 words per topic
- Structure per topic JSON:
```json
{
  "id": "phase1_week1_binary-bits",
  "title": "Binary & Bits",
  "phase": 1, "week": 1,
  "icon": "binary",
  "tagline": "How computers count using only 0 and 1",
  "readTime": "15 min",
  "sections": [
    { "type": "intro",        "content": "..." },
    { "type": "analogy",      "title": "Light switches", "content": "..." },
    { "type": "explanation",  "content": "..." },
    { "type": "code_example", "language": "js", "code": "...", "label": "Runtime", "explanation": "..." },
    { "type": "code_concept", "language": "js", "code": "...", "label": "Concept" },
    { "type": "callout",      "variant": "tip", "content": "..." },
    { "type": "key_takeaways","items": ["...", "..."] }
  ],
  "visualizer": {
    "type": "embed" | "custom",
    "url": "https://visualgo.net/...",
    "component": "BinaryVisualizer",
    "caption": "..."
  },
  "quiz": [
    {
      "id": "q1",
      "question": "...",
      "type": "mcq",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "..."
    }
  ]
}
```

---

## 7. Technical Specifications

### 7.1 Stack
| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Interactive quiz/visualizers need state management |
| Styling | Tailwind CSS + CSS variables | Rapid dark theme, responsive, mobile-first |
| Animation | Framer Motion | Simple custom visualizers |
| Syntax highlight | Shiki | Zero runtime, accurate themes |
| State | Zustand | Lightweight, localStorage persist plugin |
| Router | React Router v6 | SPA routing, nested routes |
| Deploy | Vercel | Free, auto-deploy from GitHub, CDN |

### 7.2 Project Structure
```
cs-learning-hub/
├── public/
│   └── favicon.ico
├── src/
│   ├── content/                    # Pre-generated JSON (committed to git)
│   │   ├── curriculum.json         # Full menu tree + metadata for all 37 weeks
│   │   ├── phase1/
│   │   │   ├── week1-how-computers-work-binary-bits.json
│   │   │   ├── week1-how-computers-work-logic-gates.json
│   │   │   ├── week1-how-computers-work-cpu-memory.json
│   │   │   └── week2-data-representation.json
│   │   └── phase2/ ...
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Collapsible phase/topic tree
│   │   │   ├── MobileDrawer.tsx    # Hamburger nav for mobile
│   │   │   └── Layout.tsx          # App shell
│   │   ├── home/
│   │   │   ├── PhaseSection.tsx    # Collapsible phase with progress
│   │   │   └── TopicCard.tsx       # Card with icon, title, desc, status
│   │   ├── topic/
│   │   │   ├── TopicHeader.tsx     # Title, tagline, read time
│   │   │   ├── ControlsPanel.tsx   # Left column: interactive inputs
│   │   │   ├── VisualizerPanel.tsx # Center: animation or iframe
│   │   │   ├── CodePanel.tsx       # Right: syntax-highlighted code + tabs
│   │   │   ├── DeepDive.tsx        # Full-width content sections renderer
│   │   │   └── QuizSection.tsx     # 10-question quiz component
│   │   ├── visualizers/            # Custom React visualizers
│   │   │   ├── BinaryVisualizer.tsx
│   │   │   ├── StackVisualizer.tsx
│   │   │   └── QueueVisualizer.tsx
│   │   └── ui/
│   │       ├── ProgressBar.tsx
│   │       ├── Badge.tsx
│   │       └── CodeBlock.tsx       # Shiki-powered
│   ├── hooks/
│   │   ├── useProgress.ts          # localStorage read/write
│   │   └── useLocalStorage.ts
│   ├── store/
│   │   └── progress-store.ts       # Zustand store + persist
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── TopicPage.tsx           # Reads JSON by route params
│   ├── router.tsx
│   ├── main.tsx
│   └── index.css                   # CSS variables, global dark theme
├── docs/
│   └── prd-cs-learning-hub-full-product-requirements.md  ← this file
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                     # { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
└── package.json
```

### 7.3 Routing
```
/                           → HomePage (card grid dashboard)
/phase/:phaseId/:topicSlug  → TopicPage
```

### 7.4 curriculum.json Structure
```json
{
  "phases": [
    {
      "id": "phase1",
      "title": "Computer Fundamentals",
      "icon": "cpu",
      "weeks": [
        {
          "id": "week1",
          "title": "How Computers Work",
          "topics": [
            { "slug": "binary-bits", "title": "Binary & Bits", "file": "phase1/week1-how-computers-work-binary-bits.json" },
            { "slug": "logic-gates", "title": "Logic Gates", "file": "phase1/week1-how-computers-work-logic-gates.json" }
          ]
        }
      ]
    }
  ]
}
```

---

## 8. Content Generation Plan

**Tool:** Claude (in-session, no API key needed)  
**Format:** Deep dive JSON per topic (see section 6.5)  
**Pilot:** Phase 1 first (3 weeks, ~10 JSON files) → validate format → generate Phases 2-10

**Phase 1 topics to generate:**
- [ ] Binary & Bits
- [ ] Logic Gates & Boolean Algebra
- [ ] CPU Architecture & Fetch-Decode-Execute
- [ ] Memory Hierarchy (RAM, Cache, Storage)
- [ ] Number Encoding (Two's complement, IEEE 754)
- [ ] Character Encoding (ASCII, UTF-8)
- [ ] Program Execution (compilation, interpretation, runtime)

---

## 9. MVP Scope (Weekend 1)

**In scope:**
- [ ] Project scaffold (Vite + React + Tailwind + Zustand + Router)
- [ ] Dark theme + CSS variables
- [ ] HomePage with phase sections + topic cards
- [ ] Sidebar navigation (desktop) + mobile drawer
- [ ] TopicPage 3-column layout
- [ ] CodePanel with tabs + Shiki highlighting
- [ ] DeepDive content renderer (JSON → HTML sections)
- [ ] QuizSection (10 questions, MCQ, score tracking)
- [ ] useProgress hook + Zustand persist
- [ ] Phase 1 content JSON (all 7 topics)
- [ ] 2-3 custom visualizers (Binary, Stack, Queue)
- [ ] VisuAlgo embeds for complex topics
- [ ] Vercel deploy + .vercel.app domain

**Out of scope (post-MVP):**
- Search
- Dark/light mode toggle
- Social sharing of progress
- "Explain differently" AI button
- Phases 2-10 content (generate after validating Phase 1)

---

## 10. Success Criteria

- [ ] Phase 1 fully readable on iPhone (no horizontal scroll, readable font size)
- [ ] Quiz scores persist across browser sessions
- [ ] Menu shows accurate completion % per phase
- [ ] Last visited topic auto-restored on app open
- [ ] Lighthouse mobile score ≥ 85
- [ ] Page load < 2s on 4G mobile

---

## 11. Non-Goals

- No backend, no database, no auth
- No user accounts or cloud sync
- No AI at runtime (all content pre-generated)
- No paid hosting
