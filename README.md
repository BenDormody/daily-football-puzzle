# ⚽ Pitch Puzzle

Turn your tactics into puzzles your players will actually do.

A coach sets up a formation, records the correct sequence of **passes,
dribbles and off-ball runs**, and shares a single link. Whoever opens the
link plays the sequence step by step with a limited mistake budget —
Wordle-style results included.

**No accounts. No database. No backend.** The entire puzzle is compressed
(lz-string) into the URL hash, so a link is all you ever need to share,
and old links keep working forever.

## How it works

1. **Setup** — drop players on the pitch (formation templates or tap to
   add), drag them around, give one of them the ball.
2. **Record** — tap a teammate to record a pass, drag the ball carrier to
   record a dribble, drag anyone else to adjust the rest of the board
   alongside the last step (runs, defensive shifts — these animate after
   that step is solved, so the guesser sees the reshaped board before the
   next question). A timeline lets you scrub back through the sequence.
3. **Share** — add a title, scenario and mistake budget, then copy the
   link. "Preview as player" shows exactly what your players will see.

Play mode asks one question per step: tap the right receiver for a pass,
or tap the right zone (one real destination + two decoys) for a dribble.
Runs animate automatically once the step is solved.

## Development

```bash
npm install
npm run dev       # dev server
npm test          # vitest (codec, engine, decoys)
npm run build     # static production build in dist/
npm run preview   # serve the production build
```

Deploys anywhere that serves static files (GitHub Pages, Netlify, …) —
`vite.config.js` uses relative asset paths, and routing is hash-based so
no server rewrites are needed.

## Architecture

- `src/schema/` — puzzle data model (versioned, `v: 2`), URL codec,
  deterministic decoy generation. Pure modules, unit-tested.
- `src/engine/` — sequence simulation: positions at any step are derived
  from initial placements + steps, never snapshotted.
- `src/pitch/` — the SVG pitch, player chips, ball, arrows, and the
  canonical-coordinate mapping (renders a vertical pitch on phones).
- `src/create/` — the three-phase editor (setup → record → share).
- `src/play/` — play mode state machine, HUD, results.
