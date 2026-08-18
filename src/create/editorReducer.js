import { formationSpots } from "./formations.js";
import { DEFAULT_MISTAKE_BUDGET, SCHEMA_VERSION } from "../schema/puzzle.js";

// Editor phases: setup (place players, give ball) -> record (build the
// sequence) -> share (metadata + link).

export const initialEditorState = {
  phase: "setup",
  side: 0,
  players: [], // { i, s, n, x, y } canonical
  nextId: 0,
  carrier: -1,
  steps: [],
  scrub: null, // null = live; number = preview state after N steps
  meta: {
    t: "",
    a: "",
    q: "",
    m: DEFAULT_MISTAKE_BUDGET,
  },
};

const nextNumber = (players, side) => {
  const used = new Set(players.filter((p) => p.s === side).map((p) => p.n));
  for (let n = 1; n <= 99; n++) if (!used.has(n)) return n;
  return 99;
};

export const editorReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialEditorState;

    case "setPhase":
      // Leaving a phase clears any preview scrub.
      return { ...state, phase: action.phase, scrub: null };

    case "setSide":
      return { ...state, side: action.side };

    case "addPlayer": {
      if (state.players.length >= 40) return state;
      const player = {
        i: state.nextId,
        s: state.side,
        n: nextNumber(state.players, state.side),
        x: action.x,
        y: action.y,
      };
      return {
        ...state,
        players: [...state.players, player],
        nextId: state.nextId + 1,
      };
    }

    case "movePlayer":
      return {
        ...state,
        players: state.players.map((p) =>
          p.i === action.id ? { ...p, x: action.x, y: action.y } : p
        ),
      };

    case "removePlayer":
      return {
        ...state,
        players: state.players.filter((p) => p.i !== action.id),
        carrier: state.carrier === action.id ? -1 : state.carrier,
      };

    case "applyFormation": {
      // Replaces the given side's players; keeps the other side.
      const kept = state.players.filter((p) => p.s !== action.side);
      let id = state.nextId;
      const added = formationSpots(action.formation, action.side).map(
        (spot) => ({ i: id++, s: action.side, ...spot })
      );
      const carrierKept = kept.some((p) => p.i === state.carrier);
      return {
        ...state,
        players: [...kept, ...added],
        nextId: id,
        carrier: carrierKept ? state.carrier : -1,
      };
    }

    case "clearPlayers":
      return {
        ...state,
        players: [],
        carrier: -1,
        steps: [],
        scrub: null,
      };

    case "setCarrier":
      return { ...state, carrier: action.id };

    case "recordPass":
      return {
        ...state,
        steps: [...state.steps, { k: "p", to: action.to }],
        scrub: null,
      };

    case "recordDribble":
      return {
        ...state,
        steps: [...state.steps, { k: "d", x: action.x, y: action.y }],
        scrub: null,
      };

    case "adjustBoard": {
      // Dragging a non-carrier player in record mode repositions them
      // "alongside" the last recorded step: the movement is stored on
      // that step, animates with it in play mode, and is therefore
      // visible to the guesser before the next question. Before any
      // step exists it simply adjusts the initial placement.
      if (state.steps.length === 0) {
        return {
          ...state,
          players: state.players.map((p) =>
            p.i === action.id ? { ...p, x: action.x, y: action.y } : p
          ),
        };
      }
      const steps = [...state.steps];
      const last = { ...steps[steps.length - 1] };
      // One movement per player and step: dragging again replaces it.
      const runs = (last.r ?? []).filter((r) => r.i !== action.id);
      last.r = [...runs, { i: action.id, x: action.x, y: action.y }];
      steps[steps.length - 1] = last;
      return { ...state, steps };
    }

    case "undoLastMove": {
      const steps = [...state.steps];
      const last = { ...steps[steps.length - 1] };
      if (!last.r?.length) return state;
      const r = last.r.slice(0, -1);
      if (r.length) last.r = r;
      else delete last.r;
      steps[steps.length - 1] = last;
      return { ...state, steps };
    }

    case "deleteLastStep":
      return {
        ...state,
        steps: state.steps.slice(0, -1),
        scrub: null,
      };

    case "setScrub":
      return { ...state, scrub: action.value };

    case "moveDribbleTarget": {
      // Adjust the destination of the LAST step (must be a dribble).
      const steps = [...state.steps];
      const last = steps[steps.length - 1];
      if (!last || last.k !== "d") return state;
      steps[steps.length - 1] = { ...last, x: action.x, y: action.y };
      return { ...state, steps };
    }

    case "moveDecoy": {
      // Override an auto decoy of the LAST step. `current` is the decoy
      // list as displayed, so untouched decoys keep their auto position.
      const steps = [...state.steps];
      const last = steps[steps.length - 1];
      if (!last || last.k !== "d") return state;
      const alt = action.current.map((d, idx) =>
        idx === action.index ? { x: action.x, y: action.y } : { x: d.x, y: d.y }
      );
      steps[steps.length - 1] = { ...last, alt };
      return { ...state, steps };
    }

    case "setStepNote": {
      const steps = [...state.steps];
      if (!steps[action.index]) return state;
      const step = { ...steps[action.index] };
      if (action.note) step.c = action.note;
      else delete step.c;
      steps[action.index] = step;
      return { ...state, steps };
    }

    case "updateMeta":
      return { ...state, meta: { ...state.meta, ...action.patch } };

    default:
      return state;
  }
};

// Editor state -> wire-format puzzle (validated/encoded elsewhere).
export const buildPuzzle = (state) => ({
  v: SCHEMA_VERSION,
  t: state.meta.t,
  a: state.meta.a,
  q: state.meta.q,
  m: state.meta.m,
  b: state.carrier,
  pl: state.players,
  st: state.steps,
});
