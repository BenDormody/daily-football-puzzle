import LZString from "lz-string";
import { migrate, validatePuzzle } from "./puzzle.js";

const q = (n) => Math.max(0, Math.min(1000, Math.round(n)));

// Editor state may carry float coords; the wire format is ints 0–1000.
export const quantizePuzzle = (p) => ({
  ...p,
  pl: p.pl.map((pl) => ({ ...pl, x: q(pl.x), y: q(pl.y) })),
  st: p.st.map((st) => {
    const out = { ...st };
    if (st.k === "d") {
      out.x = q(st.x);
      out.y = q(st.y);
      if (st.alt) out.alt = st.alt.map((a) => ({ x: q(a.x), y: q(a.y) }));
    }
    if (st.r) out.r = st.r.map((r) => ({ i: r.i, x: q(r.x), y: q(r.y) }));
    return out;
  }),
});

// Drop empty optional fields so they cost nothing on the wire.
const compact = (p) => {
  const out = { ...p };
  if (!out.a) delete out.a;
  if (!out.q) delete out.q;
  out.st = out.st.map((st) => {
    const s = { ...st };
    if (!s.c) delete s.c;
    if (!s.r || s.r.length === 0) delete s.r;
    return s;
  });
  return out;
};

export const encodePuzzle = (puzzle) =>
  LZString.compressToEncodedURIComponent(
    JSON.stringify(compact(quantizePuzzle(puzzle)))
  );

export const decodePuzzle = (blob) => {
  const broken = { ok: false, error: "This link looks broken or incomplete." };
  if (!blob || typeof blob !== "string") return broken;

  let json;
  try {
    json = LZString.decompressFromEncodedURIComponent(blob);
  } catch {
    return broken;
  }
  if (!json) return broken;

  let raw;
  try {
    raw = JSON.parse(json);
  } catch {
    return broken;
  }

  const puzzle = migrate(raw);
  const check = validatePuzzle(puzzle);
  if (!check.ok) return { ok: false, error: check.error };
  return { ok: true, puzzle };
};

export const puzzleUrl = (puzzle, origin) => {
  const base =
    origin ??
    window.location.origin +
      window.location.pathname +
      window.location.search;
  return `${base}#p=${encodePuzzle(puzzle)}`;
};
