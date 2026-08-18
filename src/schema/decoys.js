// Deterministic decoy generation for dribble steps.
//
// A dribble answer is a tap on one of three zone markers: the recorded
// destination plus two decoys. Decoys are derived from a seed computed
// from the puzzle content and step index, so nothing extra is stored in
// the URL and every recipient of a link sees identical markers.

import { COORD_MAX } from "./puzzle.js";

export const DECOY_COUNT = 2;
const MIN_SEPARATION = 150; // canonical units (15% of pitch length)
const MARGIN = 40; // keep markers inside the pitch

const hashString = (str) => {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp = (n) => Math.max(MARGIN, Math.min(COORD_MAX - MARGIN, n));

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Seed only from content that is fixed once recording starts (initial
// placements + carrier). Including mutable fields like the title or the
// step count would silently move decoys the coach already previewed.
export const puzzleSeed = (puzzle, stepIndex) => {
  const coordSum = puzzle.pl.reduce((acc, p) => acc + p.x * 31 + p.y, 0);
  return hashString(`${puzzle.b}|${puzzle.pl.length}|${coordSum}|${stepIndex}`);
};

// Returns the two decoy points for a dribble step. Creator overrides
// (step.alt) win; otherwise decoys are generated deterministically.
export const decoysForStep = (puzzle, stepIndex) => {
  const step = puzzle.st[stepIndex];
  if (!step || step.k !== "d") return [];
  if (step.alt) return step.alt;

  const rand = mulberry32(puzzleSeed(puzzle, stepIndex));
  const correct = { x: step.x, y: step.y };
  const from = dribbleOrigin(puzzle, stepIndex);
  const decoys = [];

  // Bias decoys toward plausible-but-worse options: similar distance from
  // the origin as the real dribble, rotated to a different direction.
  const baseAngle = Math.atan2(correct.y - from.y, correct.x - from.x);
  const baseDist = Math.max(dist(correct, from), MIN_SEPARATION);

  let guard = 0;
  while (decoys.length < DECOY_COUNT && guard++ < 200) {
    const sign = decoys.length === 0 ? 1 : -1;
    const angle =
      baseAngle + sign * (Math.PI / 3 + rand() * (Math.PI / 2)) +
      (rand() - 0.5) * 0.4;
    const d = baseDist * (0.75 + rand() * 0.6);
    const candidate = {
      x: clamp(Math.round(from.x + Math.cos(angle) * d)),
      y: clamp(Math.round(from.y + Math.sin(angle) * d)),
    };
    const farEnough =
      dist(candidate, correct) >= MIN_SEPARATION &&
      decoys.every((existing) => dist(candidate, existing) >= MIN_SEPARATION);
    if (farEnough) decoys.push(candidate);
  }

  // Degenerate layouts (tiny pitch corner) fall back to fixed offsets.
  while (decoys.length < DECOY_COUNT) {
    decoys.push({
      x: clamp(correct.x - MIN_SEPARATION * (decoys.length + 1)),
      y: clamp(correct.y + MIN_SEPARATION * (decoys.length % 2 ? 1 : -1)),
    });
  }

  return decoys;
};

// Where the ball carrier stands when this dribble begins.
const dribbleOrigin = (puzzle, stepIndex) => {
  const pos = new Map(puzzle.pl.map((p) => [p.i, { x: p.x, y: p.y }]));
  let ball = puzzle.b;
  for (let i = 0; i < stepIndex; i++) {
    const st = puzzle.st[i];
    if (st.r) for (const r of st.r) pos.set(r.i, { x: r.x, y: r.y });
    if (st.k === "p") ball = st.to;
    else pos.set(ball, { x: st.x, y: st.y });
  }
  return pos.get(ball);
};

// Stable shuffle of the marker list (correct + decoys) so the correct
// marker isn't always rendered in the same order.
export const shuffledMarkers = (puzzle, stepIndex) => {
  const step = puzzle.st[stepIndex];
  const markers = [
    { x: step.x, y: step.y, correct: true },
    ...decoysForStep(puzzle, stepIndex).map((d) => ({ ...d, correct: false })),
  ];
  const rand = mulberry32(puzzleSeed(puzzle, stepIndex) ^ 0x9e3779b9);
  for (let i = markers.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [markers[i], markers[j]] = [markers[j], markers[i]];
  }
  return markers;
};
