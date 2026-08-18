// Puzzle schema v2 — the exact shape that gets serialized into share links.
// Links live forever in chat threads, so every breaking change bumps `v`
// and gets a case in migrate().
//
// PuzzleV2 = {
//   v: 2,
//   t: string,          // title
//   a?: string,         // coach/author name
//   q?: string,         // intro/scenario text
//   m: number,          // mistake budget
//   b: number,          // initial ball carrier player id
//   pl: [{ i, s, n, x, y }],   // s: 0 = attacking side, 1 = opposition
//   st: [Step],
// }
// Step (pass):    { k: 'p', to: number, r?: [Run], c?: string }
// Step (dribble): { k: 'd', x, y, r?: [Run], c?: string, alt?: [{x,y}] }
// Run = { i: number, x: number, y: number }
// All coords are ints in canonical space: x 0–1000 along pitch length
// (attacking left → right), y 0–1000 across pitch width.

export const SCHEMA_VERSION = 2;
export const COORD_MAX = 1000;

export const SIDES = { HOME: 0, AWAY: 1 };

export const DEFAULT_MISTAKE_BUDGET = 3;

export const createEmptyPuzzle = () => ({
  v: SCHEMA_VERSION,
  t: "",
  a: "",
  q: "",
  m: DEFAULT_MISTAKE_BUDGET,
  b: -1,
  pl: [],
  st: [],
});

const isInt = (n) => Number.isInteger(n);
const inRange = (n) => isInt(n) && n >= 0 && n <= COORD_MAX;

const validateRun = (r, ids) =>
  r &&
  ids.has(r.i) &&
  inRange(r.x) &&
  inRange(r.y);

export const validatePuzzle = (p) => {
  const fail = (error) => ({ ok: false, error });

  if (!p || typeof p !== "object") return fail("Not a puzzle object.");
  if (p.v !== SCHEMA_VERSION) return fail(`Unsupported version ${p.v}.`);
  if (typeof p.t !== "string") return fail("Missing title.");
  if (!isInt(p.m) || p.m < 1 || p.m > 10) return fail("Bad mistake budget.");
  if (!Array.isArray(p.pl) || p.pl.length < 2) return fail("Too few players.");
  if (p.pl.length > 40) return fail("Too many players.");

  const ids = new Set();
  for (const pl of p.pl) {
    if (!pl || !isInt(pl.i) || ids.has(pl.i)) return fail("Bad player id.");
    if (pl.s !== 0 && pl.s !== 1) return fail("Bad player side.");
    if (!isInt(pl.n) || pl.n < 1 || pl.n > 99) return fail("Bad shirt number.");
    if (!inRange(pl.x) || !inRange(pl.y)) return fail("Player out of bounds.");
    ids.add(pl.i);
  }

  const carrier = p.pl.find((pl) => pl.i === p.b);
  if (!carrier || carrier.s !== SIDES.HOME) return fail("Bad ball carrier.");

  if (!Array.isArray(p.st) || p.st.length < 1) return fail("No steps.");
  if (p.st.length > 30) return fail("Too many steps.");

  const sideOf = new Map(p.pl.map((pl) => [pl.i, pl.s]));
  for (const st of p.st) {
    if (!st || (st.k !== "p" && st.k !== "d")) return fail("Bad step kind.");
    if (st.k === "p") {
      if (!ids.has(st.to) || sideOf.get(st.to) !== SIDES.HOME)
        return fail("Pass target invalid.");
    } else {
      if (!inRange(st.x) || !inRange(st.y)) return fail("Dribble out of bounds.");
      if (st.alt !== undefined) {
        if (!Array.isArray(st.alt) || st.alt.length !== 2)
          return fail("Bad decoy list.");
        if (!st.alt.every((a) => a && inRange(a.x) && inRange(a.y)))
          return fail("Decoy out of bounds.");
      }
    }
    if (st.r !== undefined) {
      if (!Array.isArray(st.r) || !st.r.every((r) => validateRun(r, ids)))
        return fail("Bad run.");
    }
    if (st.c !== undefined && typeof st.c !== "string") return fail("Bad note.");
  }

  return { ok: true };
};

// Future-proofing: older/newer raw objects get migrated to the current
// shape here before validation. v2 is the first link-encoded version.
export const migrate = (raw) => {
  if (!raw || typeof raw !== "object") return raw;
  switch (raw.v) {
    case SCHEMA_VERSION:
      return raw;
    default:
      return raw; // unknown version: let validatePuzzle reject it
  }
};
