# Graph Report - sorteadorPrimax  (2026-11-18)

## Corpus Check
- 51 files · ~72,834 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .woff2 4, (none) 2, .css 1)

## Summary
- 620 nodes · 639 edges · 43 communities (41 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Expo Animation Recipes
- App.tsx
- Choreographing Motion
- Animation Recipes
- Worst-Case Catalog
- Animation Standards Reference
- Animation Audit Playbook
- Write Swift
- Apple Design
- The Fixes
- Prototyping Variants
- Glossary
- compilerOptions
- Animation Performance
- package.json
- Finding Animation Opportunities
- Workflow
- Removing Animations
- Gesture-Driven UI
- Working With Sonner
- The list
- figma-make-app
- Design Engineering
- Ponytail Help
- Component Building Principles
- Ask Emil
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- ponytail-audit/SKILL.md
- Ponytail Gain
- ponytail-review/SKILL.md
- Ponytail
- Ponytail, lazy senior dev mode
- Core Philosophy
- Debugging Animations
- ponytail-debt/SKILL.md

## God Nodes (most connected - your core abstractions)
1. `Apple Design` - 21 edges
2. `Write Swift` - 19 edges
3. `compilerOptions` - 17 edges
4. `Choreographing Motion` - 16 edges
5. `Design Engineering` - 16 edges
6. `Animation Standards Reference` - 16 edges
7. `Animation Recipes` - 15 edges
8. `Animation Performance` - 14 edges
9. `Expo Animation Recipes` - 13 edges
10. `Glossary` - 13 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `BoomerangTransition()`  [EXTRACTED]
  src/App.tsx → src/components/BoomerangTransition.tsx
- `App()` --calls--> `JackpotSlotCard()`  [EXTRACTED]
  src/App.tsx → src/components/JackpotSlotCard.tsx
- `App()` --calls--> `calculateInterval()`  [EXTRACTED]
  src/App.tsx → src/types/jackpot.ts
- `App()` --calls--> `fireGrandFinaleConfetti()`  [EXTRACTED]
  src/App.tsx → src/utils/confetti.ts
- `App()` --calls--> `fireWinnerConfetti()`  [EXTRACTED]
  src/App.tsx → src/utils/confetti.ts

## Import Cycles
- None detected.

## Communities (43 total, 2 thin omitted)

### Community 0 - "Expo Animation Recipes"
Cohesion: 0.06
Nodes (33): Bottom sheet you can drag to dismiss, Collapsing header on scroll, Expo Animation Recipes, Firing something once at a threshold, Keyboard-synced UI, List entrances, Press feedback, Screen transitions (Expo Router) (+25 more)

### Community 1 - "App.tsx"
Cohesion: 0.10
Nodes (30): dependencies, canvas-confetti@^1.9.4, framer-motion@^14.14.0, react@^19.0.0, react-dom@^19.0.0, canvas-confetti, framer-motion, react (+22 more)

### Community 2 - "Choreographing Motion"
Cohesion: 0.06
Nodes (32): Carry: steer a shared layout animation through its parent, Choreography Recipes, Direction-aware steps, Imperative orchestration (`useAnimate`), Overlap: CSS stagger with a delay variable, Overlap: Motion variants with a non-uniform stagger, Sequence: morph between two rich states with a crossfade, Sequence: one draw after another (+24 more)

### Community 3 - "Animation Recipes"
Cohesion: 0.06
Nodes (31): Accordion / collapse, Animation Recipes, Button press, Drag to dismiss, Drawer / sheet, Dropdown, popover, menu, select, Hold to confirm, Masking a crossfade that won't settle (+23 more)

### Community 4 - "Worst-Case Catalog"
Cohesion: 0.06
Nodes (29): Collections, Emails, URLs, identifiers, Environment, Images and media, Labels, titles, and copy from data, Numbers and money, People and names, States (+21 more)

### Community 5 - "Animation Standards Reference"
Cohesion: 0.07
Nodes (25): Aggressive Escalation Triggers, Initial Response, Operating Posture, Part 1 — Findings table (REQUIRED), Part 2 — Verdict (REQUIRED), Remedial Preference Hierarchy, Required Output Format, Reviewing Animations (+17 more)

### Community 6 - "Animation Audit Playbook"
Cohesion: 0.08
Nodes (22): 1. Purpose & frequency, 2. Easing & duration, 3. Physicality & origin, 4. Interruptibility, 5. Performance, 6. Accessibility, 7. Cohesion & tokens, 8. Missed opportunities (+14 more)

### Community 7 - "Write Swift"
Cohesion: 0.09
Nodes (22): 10. ARC and object lifetime, 11. Testing — Swift Testing by default, 12. Macros, 13. Logging and debugging, 14. Unsafe code and interop, 15. Modern syntax you should be using, 16. Migrating an existing codebase to Swift 6, 1. Model data with value types (+14 more)

### Community 8 - "Apple Design"
Cohesion: 0.09
Nodes (21): 10. Gesture design details (the "feel" checklist), 11. Frame-level smoothness, 12. Materials & depth — translucency conveys hierarchy, 13. Multimodal feedback — motion + sound + haptics, 14. Reduced motion & accessibility, 15. Typography — optical sizing, tracking, leading, 16. Design foundations — the eight principles, 17. Process (+13 more)

### Community 9 - "The Fixes"
Cohesion: 0.09
Nodes (21): 10. Status bar color doesn't match, 11. Right in Chrome, wrong on phone, 1. Hover state stuck after tap, 2. Gray/blue flash on tap, 3. Layout has the wrong height, 4. Page zooms into the input, 5. Tap feels laggy, 6. Pull-to-refresh hijacks scroll (+13 more)

### Community 10 - "Prototyping Variants"
Cohesion: 0.10
Nodes (19): Behavior contract, Markup, Reference wiring, Rules, Styles, The Picker, Hard Rules, Initial Response (+11 more)

### Community 11 - "Glossary"
Cohesion: 0.11
Nodes (18): Animation Vocabulary, Easing — how speed changes over an animation, Entrances & Exits — how elements appear and disappear, Examples, Feedback & Interaction — responding to the user's actions, Glossary, Initial Response, Instructions (+10 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+10 more)

### Community 13 - "Animation Performance"
Cohesion: 0.11
Nodes (17): Animation Performance, Hard Rules, Initial Response, Operating Posture, Phase 1: Find what animates, Phase 2: Diagnose, Phase 3: Report, React: Don't Animate Through State (+9 more)

### Community 14 - "package.json"
Cohesion: 0.06
Nodes (33): @types/canvas-confetti@^1.9.0, devDependencies, oxfmt@^0.76.0, tailwindcss@^4.0.0, @tailwindcss/vite@^4.0.0, @types/node@^22.0.0, @types/react@^19.0.0, @types/react-dom@^19.0.0 (+25 more)

### Community 15 - "Finding Animation Opportunities"
Cohesion: 0.12
Nodes (16): 1. Frequency — how often will a user see this?, 2. Purpose — why does this animate?, 3. Speed — can it stay inside budget?, 4. Function — does motion help or hinder here?, Finding Animation Opportunities, Hard Rules, Initial Response, Operating Posture (+8 more)

### Community 16 - "Workflow"
Cohesion: 0.12
Nodes (16): Conflicts, Hard Rules, Invocation Variants, Learning Taste, Make it a check, Needs your answer, Phase 1: Collect corrections, Phase 2: Filter (+8 more)

### Community 17 - "Removing Animations"
Cohesion: 0.12
Nodes (15): Cleanup, Hard Rules, Initial Response, Operating Posture, Part 1 — Removed and reduced, Part 2 — Kept (REQUIRED), Part 3 — Cleanup and verdict, Reducing (+7 more)

### Community 18 - "Gesture-Driven UI"
Cohesion: 0.13
Nodes (14): First decision: build it, or use a solution that exists?, Gesture-Driven UI, Hold gestures are asymmetric, Interruptibility is non-negotiable, Linked values, Motion drag props, Reduced motion, Release phase rules (+6 more)

### Community 19 - "Working With Sonner"
Cohesion: 0.15
Nodes (11): Functions, Sonner API Reference, `toast()` options, `<Toaster />`, Initial Response, Picking the right call, Recipes, Setup (+3 more)

### Community 21 - "The list"
Cohesion: 0.18
Nodes (10): Charts, Common mismatches to catch, How to use this, Initial Response, Interaction & performance, Motion & visuals, Picking The Right Library, State & styling (+2 more)

### Community 22 - "figma-make-app"
Cohesion: 0.22
Nodes (8): Before you write, Dependencies, Development Server, figma-make-app, Ponytail, lazy senior dev mode, Project Structure, Styling, The smallest complete change

### Community 23 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 24 - "Ponytail Help"
Cohesion: 0.22
Nodes (8): Band (Claude Code), Configure Default Mode, Deactivate, Levels, More, Ponytail Help, Skills, Update

### Community 26 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 27 - "Ask Emil"
Cohesion: 0.29
Nodes (6): Ask Emil, Common situations, References underneath, Standalone, The main flow: idea → ship, Upkeep: a codebase that already exists

### Community 28 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 29 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 30 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 31 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 32 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 33 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 34 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 35 - "ponytail-audit/SKILL.md"
Cohesion: 0.40
Nodes (4): 1. Map first, 2. Look for, 3. Check before you report, 4. Output

### Community 36 - "Ponytail Gain"
Cohesion: 0.40
Nodes (4): Boundaries, Honesty boundary, Ponytail Gain, Scoreboard

### Community 37 - "ponytail-review/SKILL.md"
Cohesion: 0.40
Nodes (4): 1. Understand first, 2. Look for, 3. Check before you report, 4. Output

### Community 38 - "Ponytail"
Cohesion: 0.40
Nodes (4): Before you write, Levels, Ponytail, The smallest complete change

### Community 40 - "Ponytail, lazy senior dev mode"
Cohesion: 0.50
Nodes (3): Before you write, Ponytail, lazy senior dev mode, The smallest complete change

### Community 41 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 42 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

### Community 43 - "ponytail-debt/SKILL.md"
Cohesion: 0.50
Nodes (3): Boundaries, Output, Scan

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Design Engineering` connect `Design Engineering` to `CSS Transform Mastery`, `The Sonner Principles (Building Loved Components)`, `Spring Animations`, `Core Philosophy`, `Debugging Animations`, `Component Building Principles`, `The Animation Decision Framework`, `clip-path for Animation`, `Performance Rules`, `Gesture and Drag Interactions`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Should `Expo Animation Recipes` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App.tsx` to `package.json`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10099573257467995 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `App.tsx` to `package.json`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Should `Choreographing Motion` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Animation Recipes` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._