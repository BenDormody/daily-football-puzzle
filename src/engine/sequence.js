// Pure sequence simulation. Positions at any point in a puzzle are always
// derived from the initial placements plus the steps — never snapshotted.

// positions: Map<playerId, {x, y}>, ballId: playerId
export const initialState = (puzzle) => ({
  positions: new Map(puzzle.pl.map((p) => [p.i, { x: p.x, y: p.y }])),
  ballId: puzzle.b,
});

// Returns a NEW state with one step applied. Runs move players; a pass
// moves the ball to the receiver; a dribble moves the carrier.
export const applyStep = (state, step) => {
  const positions = new Map(state.positions);
  let ballId = state.ballId;

  if (step.r) {
    for (const run of step.r) positions.set(run.i, { x: run.x, y: run.y });
  }

  if (step.k === "p") {
    ballId = step.to;
  } else if (step.k === "d") {
    positions.set(ballId, { x: step.x, y: step.y });
  }

  return { positions, ballId };
};

// State after the first `count` steps (count = 0 -> initial setup).
export const stateAtStep = (puzzle, count) => {
  let state = initialState(puzzle);
  for (let i = 0; i < count && i < puzzle.st.length; i++) {
    state = applyStep(state, puzzle.st[i]);
  }
  return state;
};

export const ballCarrierAtStep = (puzzle, count) =>
  stateAtStep(puzzle, count).ballId;

// The ball's pitch position in a given state.
export const ballPosition = (state) => state.positions.get(state.ballId);
