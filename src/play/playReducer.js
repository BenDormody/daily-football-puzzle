// Play-mode state machine.
//
// intro -> playing <-> stepAnim -> ... -> solved
//            |
//            v (mistake budget exhausted)
//        revealing -> failed
//
// displayCount is how many steps are applied to the rendered positions;
// CSS transitions animate every change to it.

export const initialPlayState = (puzzle) => ({
  status: "intro",
  stepIndex: 0,
  displayCount: 0,
  mistakesLeft: puzzle.m,
  stepMistakes: puzzle.st.map(() => 0),
  flash: null, // { kind: 'chip'|'zone', id, type: 'correct'|'wrong' }
  note: null, // coaching note being shown
  arrowStep: null, // step index whose arrows are drawn
});

export const playReducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, status: "playing" };

    case "wrong": {
      const stepMistakes = [...state.stepMistakes];
      stepMistakes[state.stepIndex] += 1;
      const mistakesLeft = state.mistakesLeft - 1;
      return {
        ...state,
        mistakesLeft,
        stepMistakes,
        flash: { kind: action.kind, id: action.id, type: "wrong" },
        status: mistakesLeft <= 0 ? "revealing" : state.status,
      };
    }

    case "clearFlash":
      return state.flash ? { ...state, flash: null } : state;

    case "correct":
      // Applying the step now lets CSS transitions carry ball + runners.
      return {
        ...state,
        status: "stepAnim",
        flash: { kind: action.kind, id: action.id, type: "correct" },
        displayCount: state.displayCount + 1,
        arrowStep: state.stepIndex,
        note: action.note ?? null,
      };

    case "stepDone": {
      const nextIndex = state.stepIndex + 1;
      if (nextIndex >= action.totalSteps) {
        return { ...state, status: "solved", flash: null };
      }
      return {
        ...state,
        status: "playing",
        stepIndex: nextIndex,
        flash: null,
      };
    }

    case "revealNext":
      return {
        ...state,
        displayCount: state.displayCount + 1,
        arrowStep: state.displayCount,
        note: null,
        flash: null,
      };

    case "revealDone":
      return { ...state, status: "failed" };

    case "dismissNote":
      return { ...state, note: null };

    case "reset":
      return initialPlayState(action.puzzle);

    default:
      return state;
  }
};
