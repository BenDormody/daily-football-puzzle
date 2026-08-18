import { describe, it, expect } from "vitest";
import {
  initialState,
  applyStep,
  stateAtStep,
  ballCarrierAtStep,
  ballPosition,
} from "../src/engine/sequence.js";
import { bigPuzzle } from "./fixtures.js";

describe("sequence engine", () => {
  it("starts with initial placements and carrier", () => {
    const puzzle = bigPuzzle();
    const state = initialState(puzzle);
    expect(state.ballId).toBe(2);
    expect(state.positions.get(0)).toEqual({ x: 60, y: 500 });
    expect(state.positions.size).toBe(22);
  });

  it("a pass moves the ball, not the players", () => {
    const puzzle = bigPuzzle();
    const before = initialState(puzzle);
    const after = applyStep(before, { k: "p", to: 5 });
    expect(after.ballId).toBe(5);
    expect(after.positions.get(2)).toEqual(before.positions.get(2));
  });

  it("a dribble moves the carrier", () => {
    const puzzle = bigPuzzle();
    let state = initialState(puzzle);
    state = applyStep(state, puzzle.st[0]); // pass to 5
    state = applyStep(state, puzzle.st[1]); // 5 dribbles
    expect(state.ballId).toBe(5);
    expect(state.positions.get(5)).toEqual({ x: 500, y: 480 });
  });

  it("runs bundled in a step move the runners", () => {
    const puzzle = bigPuzzle();
    const state = stateAtStep(puzzle, 2); // includes the run of player 9
    expect(state.positions.get(9)).toEqual({ x: 700, y: 450 });
  });

  it("derives carrier at any step count", () => {
    const puzzle = bigPuzzle();
    expect(ballCarrierAtStep(puzzle, 0)).toBe(2);
    expect(ballCarrierAtStep(puzzle, 1)).toBe(5);
    expect(ballCarrierAtStep(puzzle, 3)).toBe(9);
    expect(ballCarrierAtStep(puzzle, 6)).toBe(8);
  });

  it("does not mutate prior states", () => {
    const puzzle = bigPuzzle();
    const s0 = initialState(puzzle);
    const frozen = JSON.stringify([...s0.positions]);
    applyStep(s0, puzzle.st[1]);
    expect(JSON.stringify([...s0.positions])).toBe(frozen);
  });

  it("ballPosition follows the carrier", () => {
    const puzzle = bigPuzzle();
    const state = stateAtStep(puzzle, 2);
    expect(ballPosition(state)).toEqual(state.positions.get(5));
  });
});
