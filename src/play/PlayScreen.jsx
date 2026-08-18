import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { navigate } from "../router.js";
import { decodePuzzle } from "../schema/codec.js";
import { shuffledMarkers } from "../schema/decoys.js";
import { stateAtStep } from "../engine/sequence.js";
import { initialPlayState, playReducer } from "./playReducer.js";
import HUD from "./HUD.jsx";
import ResultModal from "./ResultModal.jsx";
import { toPct } from "../pitch/coords.js";
import { usePortraitPitch } from "../pitch/useOrientation.js";
import PitchStage from "../pitch/PitchStage.jsx";
import PlayerChip from "../pitch/PlayerChip.jsx";
import Ball from "../pitch/Ball.jsx";
import ZoneMarker from "../pitch/ZoneMarker.jsx";

const MOVE_MS = 700; // matches --move-duration + a little settle time
const NOTE_MS = 2200;
const REVEAL_STEP_MS = 1500;

const BrokenLink = ({ error }) => (
  <div className="screen">
    <div className="topbar">
      <a className="brand" href="#">
        <span className="brand-badge">⚽</span> Pitch Puzzle
      </a>
    </div>
    <div className="container broken-link">
      <h2>Hmm, that link doesn't work</h2>
      <p>{error}</p>
      <p>
        Ask your coach to re-copy the link — every character matters, the
        whole puzzle lives inside it.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("")}>
        Go home
      </button>
    </div>
  </div>
);

const PlayScreen = ({ blob }) => {
  const decoded = useMemo(() => decodePuzzle(blob), [blob]);
  if (!decoded.ok) return <BrokenLink error={decoded.error} />;
  return <PlayGame puzzle={decoded.puzzle} />;
};

const PlayGame = ({ puzzle }) => {
  const portrait = usePortraitPitch();
  const [state, dispatch] = useReducer(playReducer, undefined, () =>
    initialPlayState(puzzle)
  );
  const timers = useRef([]);

  const after = useCallback((ms, fn) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const displayState = useMemo(
    () => stateAtStep(puzzle, state.displayCount),
    [puzzle, state.displayCount]
  );

  const step = puzzle.st[state.stepIndex];
  const playing = state.status === "playing";
  const isPassStep = playing && step?.k === "p";
  const isDribbleStep = playing && step?.k === "d";

  const markers = useMemo(
    () => (isDribbleStep ? shuffledMarkers(puzzle, state.stepIndex) : []),
    [isDribbleStep, puzzle, state.stepIndex]
  );

  // ----- Answer handlers -----

  const answerPass = (player) => {
    if (!isPassStep) return;
    if (player.i === displayState.ballId) return;
    if (player.i === step.to) {
      dispatch({ type: "correct", kind: "chip", id: player.i, note: step.c });
      after(MOVE_MS, () =>
        dispatch({ type: "stepDone", totalSteps: puzzle.st.length })
      );
      if (step.c) after(MOVE_MS + NOTE_MS, () => dispatch({ type: "dismissNote" }));
    } else {
      dispatch({ type: "wrong", kind: "chip", id: player.i });
      after(600, () => dispatch({ type: "clearFlash" }));
    }
  };

  const answerZone = (marker, idx) => {
    if (!isDribbleStep) return;
    if (marker.correct) {
      dispatch({ type: "correct", kind: "zone", id: idx, note: step.c });
      after(MOVE_MS, () =>
        dispatch({ type: "stepDone", totalSteps: puzzle.st.length })
      );
      if (step.c) after(MOVE_MS + NOTE_MS, () => dispatch({ type: "dismissNote" }));
    } else {
      dispatch({ type: "wrong", kind: "zone", id: idx });
      after(600, () => dispatch({ type: "clearFlash" }));
    }
  };

  // ----- Failure reveal: replay the remaining steps automatically -----

  useEffect(() => {
    if (state.status !== "revealing") return;
    if (state.displayCount >= puzzle.st.length) {
      const t = setTimeout(() => dispatch({ type: "revealDone" }), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => dispatch({ type: "revealNext" }),
      REVEAL_STEP_MS
    );
    return () => clearTimeout(t);
  }, [state.status, state.displayCount, puzzle.st.length]);

  // ----- Arrows for the animating / revealed step -----

  const arrows = useMemo(() => {
    if (state.arrowStep === null) return [];
    const idx = state.arrowStep;
    const stepArrows = [];
    const before = stateAtStep(puzzle, idx);
    const s = puzzle.st[idx];
    const from = before.positions.get(before.ballId);
    const make = (kind, a, b, color) => ({
      kind,
      from: toPct(a, portrait),
      to: toPct(b, portrait),
      color,
    });
    if (s.k === "p")
      stepArrows.push(make("pass", from, before.positions.get(s.to), "accent"));
    else stepArrows.push(make("dribble", from, s, "accent"));
    for (const r of s.r ?? [])
      stepArrows.push(make("run", before.positions.get(r.i), r, "white"));
    return stepArrows;
  }, [state.arrowStep, puzzle, portrait]);

  // ----- Render -----

  const carrierNumber = puzzle.pl.find(
    (p) => p.i === displayState.ballId
  )?.n;
  const ballPt = displayState.positions.get(displayState.ballId);
  const shareUrl =
    window.location.origin +
    window.location.pathname +
    window.location.search +
    window.location.hash;

  return (
    <div className="screen play-screen">
      <div className="topbar">
        <a className="brand" href="#">
          <span className="brand-badge">⚽</span> Pitch Puzzle
        </a>
        <div className="play-title-bar">
          <span className="play-title">{puzzle.t || "Tactics puzzle"}</span>
          {puzzle.a && <span className="play-author">by {puzzle.a}</span>}
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("#create")}>
            Create
          </button>
        </div>
      </div>

      <div className="play-layout container">
        <HUD puzzle={puzzle} state={state} carrierNumber={carrierNumber} />

        <PitchStage portrait={portrait} arrows={arrows}>
          {puzzle.pl.map((player) => {
            const pos = displayState.positions.get(player.i);
            const isFlashed =
              state.flash?.kind === "chip" && state.flash.id === player.i;
            return (
              <PlayerChip
                key={player.i}
                player={player}
                screen={toPct(pos, portrait)}
                carrier={player.i === displayState.ballId}
                clickable={isPassStep && player.i !== displayState.ballId}
                flash={isFlashed ? state.flash.type : null}
                onClick={() => answerPass(player)}
              />
            );
          })}

          {ballPt && (
            <Ball
              screen={toPct(ballPt, portrait)}
              hopping={state.status === "stepAnim"}
            />
          )}

          {markers.map((marker, idx) => {
            const isFlashed =
              state.flash?.kind === "zone" && state.flash.id === idx;
            return (
              <ZoneMarker
                key={`${state.stepIndex}-${idx}`}
                screen={toPct(marker, portrait)}
                onClick={() => answerZone(marker, idx)}
                label={isFlashed ? (state.flash.type === "wrong" ? "✕" : "✓") : null}
              />
            );
          })}
        </PitchStage>
      </div>

      {state.status === "intro" && (
        <div className="result-overlay">
          <div className="result-modal card">
            <div className="result-emoji">⚽</div>
            <h2 className="result-title">{puzzle.t || "Tactics puzzle"}</h2>
            {puzzle.a && <p className="result-author">from {puzzle.a}</p>}
            {puzzle.q && <p className="result-sub">{puzzle.q}</p>}
            <p className="result-sub">
              Read the play and make the right choice at every step. You can
              afford <strong>{puzzle.m} mistake{puzzle.m > 1 ? "s" : ""}</strong> —
              the blue team is yours.
            </p>
            <div className="result-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => dispatch({ type: "start" })}
              >
                Let's play
              </button>
            </div>
          </div>
        </div>
      )}

      {(state.status === "solved" || state.status === "failed") && (
        <ResultModal
          puzzle={puzzle}
          state={state}
          url={shareUrl}
          onRetry={() => dispatch({ type: "reset", puzzle })}
        />
      )}
    </div>
  );
};

export default PlayScreen;
