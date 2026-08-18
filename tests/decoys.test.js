import { describe, it, expect } from "vitest";
import { decoysForStep, shuffledMarkers, DECOY_COUNT } from "../src/schema/decoys.js";
import { COORD_MAX } from "../src/schema/puzzle.js";
import { bigPuzzle } from "./fixtures.js";

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

describe("decoys", () => {
  it("is deterministic for the same puzzle + step", () => {
    const a = decoysForStep(bigPuzzle(), 1);
    const b = decoysForStep(bigPuzzle(), 1);
    expect(a).toEqual(b);
  });

  it("generates the right count, in bounds, well separated", () => {
    const puzzle = bigPuzzle();
    const step = puzzle.st[1];
    const decoys = decoysForStep(puzzle, 1);
    expect(decoys).toHaveLength(DECOY_COUNT);
    for (const d of decoys) {
      expect(d.x).toBeGreaterThanOrEqual(0);
      expect(d.x).toBeLessThanOrEqual(COORD_MAX);
      expect(d.y).toBeGreaterThanOrEqual(0);
      expect(d.y).toBeLessThanOrEqual(COORD_MAX);
      expect(dist(d, step)).toBeGreaterThanOrEqual(150);
    }
    expect(dist(decoys[0], decoys[1])).toBeGreaterThanOrEqual(150);
  });

  it("respects creator-overridden decoys (alt)", () => {
    const puzzle = bigPuzzle();
    expect(decoysForStep(puzzle, 3)).toEqual(puzzle.st[3].alt);
  });

  it("differs between different steps", () => {
    const puzzle = bigPuzzle();
    expect(decoysForStep(puzzle, 1)).not.toEqual(decoysForStep(puzzle, 3));
  });

  it("shuffles markers deterministically and includes exactly one correct", () => {
    const a = shuffledMarkers(bigPuzzle(), 1);
    const b = shuffledMarkers(bigPuzzle(), 1);
    expect(a).toEqual(b);
    expect(a).toHaveLength(DECOY_COUNT + 1);
    expect(a.filter((m) => m.correct)).toHaveLength(1);
  });

  it("returns nothing for pass steps", () => {
    expect(decoysForStep(bigPuzzle(), 0)).toEqual([]);
  });
});
