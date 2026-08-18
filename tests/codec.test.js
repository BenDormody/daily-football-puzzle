import { describe, it, expect } from "vitest";
import { encodePuzzle, decodePuzzle, quantizePuzzle } from "../src/schema/codec.js";
import { validatePuzzle, createEmptyPuzzle } from "../src/schema/puzzle.js";
import { bigPuzzle } from "./fixtures.js";

describe("codec", () => {
  it("round-trips a full 22-player puzzle exactly", () => {
    const puzzle = bigPuzzle();
    const blob = encodePuzzle(puzzle);
    const result = decodePuzzle(blob);
    expect(result.ok).toBe(true);
    expect(result.puzzle).toEqual(puzzle);
  });

  it("keeps a large puzzle's link comfortably under 1000 chars", () => {
    const blob = encodePuzzle(bigPuzzle());
    // eslint-disable-next-line no-console
    console.log(`encoded length for 22 players / 6 steps: ${blob.length}`);
    expect(blob.length).toBeLessThan(1000);
  });

  it("quantizes float coordinates to ints", () => {
    const puzzle = bigPuzzle();
    puzzle.pl[0].x = 123.7;
    puzzle.st[1].x = 499.4;
    const q = quantizePuzzle(puzzle);
    expect(q.pl[0].x).toBe(124);
    expect(q.st[1].x).toBe(499);
  });

  it("drops empty optional fields from the wire format", () => {
    const puzzle = bigPuzzle();
    puzzle.a = "";
    puzzle.q = "";
    const decoded = decodePuzzle(encodePuzzle(puzzle));
    expect(decoded.ok).toBe(true);
    expect(decoded.puzzle.a).toBeUndefined();
    expect(decoded.puzzle.q).toBeUndefined();
  });

  it("rejects garbage blobs gracefully", () => {
    expect(decodePuzzle("definitely-not-a-puzzle").ok).toBe(false);
    expect(decodePuzzle("").ok).toBe(false);
    expect(decodePuzzle(null).ok).toBe(false);
  });

  it("rejects structurally invalid puzzles", () => {
    expect(validatePuzzle(createEmptyPuzzle()).ok).toBe(false); // no players/steps

    const badCarrier = bigPuzzle();
    badCarrier.b = 15; // opposition player can't start with the ball
    expect(validatePuzzle(badCarrier).ok).toBe(false);

    const badPass = bigPuzzle();
    badPass.st[0] = { k: "p", to: 14 }; // pass to opposition
    expect(validatePuzzle(badPass).ok).toBe(false);

    const badVersion = bigPuzzle();
    badVersion.v = 99;
    expect(validatePuzzle(badVersion).ok).toBe(false);
  });
});
