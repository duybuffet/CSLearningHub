# Phase 07 — Visualizers

**Priority:** P2 · **Status:** pending · **Depends:** 05

## Overview
Custom interactive visualizers (Framer Motion) for simple Phase-1 concepts + VisuAlgo embed helper for complex topics. KISS — only build what's genuinely clearer as animation.

## Related Files (create)
- `src/components/visualizers/binary-number-visualizer.tsx` — toggle 8 bits → live decimal
- `src/components/visualizers/logic-gate-visualizer.tsx` — AND/OR/NOT/XOR inputs → output
- `src/components/visualizers/visualizer-registry.tsx` — name→component map for panel dispatch
- `src/components/visualizers/visualgo-embed-frame.tsx` — responsive iframe wrapper

## Implementation Steps
1. `binary-number-visualizer.tsx`: 8 clickable bit toggles; show place values + running decimal; animate flips.
2. `logic-gate-visualizer.tsx`: gate selector + input switches → truth output; highlight active path.
3. `visualizer-registry.tsx`: export `{ 'binary': BinaryNumberVisualizer, 'logic-gate': LogicGateVisualizer, ... }`; VisualizerPanel looks up `visualizer.component`.
4. `visualgo-embed-frame.tsx`: aspect-ratio box + iframe + external-link fallback.

## Todo
- [ ] binary number visualizer
- [ ] logic gate visualizer
- [ ] visualizer registry (dispatch by name)
- [ ] VisuAlgo embed wrapper (responsive)

## Success Criteria
Custom visualizers interactive + mobile-usable; registry resolves component from JSON; embeds responsive. Build 2-3 max for MVP; embed the rest.

## Note
Scope discipline: don't build a visualizer per topic. Binary + logic-gate cover Phase 1 custom needs; VisuAlgo covers DS&A later.
