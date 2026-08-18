import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { navigate } from "../router.js";
import {
  editorReducer,
  initialEditorState,
  buildPuzzle,
} from "./editorReducer.js";
import { usePitchDrag } from "./usePitchDrag.js";
import SetupPanel from "./SetupPanel.jsx";
import RecordPanel from "./RecordPanel.jsx";
import SharePanel from "./SharePanel.jsx";
import { stateAtStep } from "../engine/sequence.js";
import { decoysForStep } from "../schema/decoys.js";
import { toPct, fromClient } from "../pitch/coords.js";
import { usePortraitPitch } from "../pitch/useOrientation.js";
import PitchStage from "../pitch/PitchStage.jsx";
import PlayerChip from "../pitch/PlayerChip.jsx";
import Ball from "../pitch/Ball.jsx";
import ZoneMarker from "../pitch/ZoneMarker.jsx";

const DRAFT_KEY = "pitch-puzzle-draft-v2";

const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return initialEditorState;
    const draft = JSON.parse(raw);
    return { ...initialEditorState, ...draft, scrub: null };
  } catch {
    return initialEditorState;
  }
};

const PHASES = [
  { id: "setup", label: "1 · Setup" },
  { id: "record", label: "2 · Record" },
  { id: "share", label: "3 · Share" },
];

const CreateScreen = () => {
  const [state, dispatch] = useReducer(editorReducer, undefined, loadDraft);
  const portrait = usePortraitPitch();
  const stageRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hint, setHint] = useState(null);
  const hintTimer = useRef(null);

  // Draft persistence so "Preview as player" / refresh can't lose work.
  useEffect(() => {
    const { scrub, ...persisted } = state;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(persisted));
  }, [state]);

  const showHint = useCallback((text) => {
    setHint(text);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 2600);
  }, []);

  const puzzle = useMemo(() => buildPuzzle(state), [state]);
  const isLive = state.scrub === null;
  const displayCount = isLive ? state.steps.length : state.scrub;
  const derived = useMemo(
    () => stateAtStep(puzzle, displayCount),
    [puzzle, displayCount]
  );

  const playersById = useMemo(
    () => new Map(state.players.map((p) => [p.i, p])),
    [state.players]
  );

  const lastStep = state.steps[state.steps.length - 1];
  const editableDribble =
    state.phase === "record" && isLive && lastStep?.k === "d";
  const displayedDecoys = useMemo(
    () =>
      editableDribble ? decoysForStep(puzzle, state.steps.length - 1) : [],
    [editableDribble, puzzle, state.steps.length]
  );

  // ----- Tap & drag behaviour -----

  const onTap = useCallback(
    (id, kind) => {
      if (kind !== "chip") return;
      const player = playersById.get(id);
      if (!player) return;

      if (state.phase === "setup") {
        setSelectedId((cur) => (cur === id ? null : id));
        return;
      }

      if (state.phase === "record" && isLive) {
        if (id === derived.ballId) {
          showHint("Drag the ball carrier to record a dribble.");
        } else if (player.s !== 0) {
          showHint("Passes can only go to your own team.");
        } else {
          dispatch({ type: "recordPass", to: id });
        }
      }
    },
    [state.phase, isLive, derived.ballId, playersById, showHint]
  );

  const onDragEnd = useCallback(
    (id, kind, pt) => {
      if (kind === "chip") {
        if (state.phase === "setup") {
          dispatch({ type: "movePlayer", id, x: pt.x, y: pt.y });
        } else if (state.phase === "record" && isLive) {
          if (id === derived.ballId) {
            dispatch({ type: "recordDribble", x: pt.x, y: pt.y });
          } else {
            dispatch({ type: "adjustBoard", id, x: pt.x, y: pt.y });
          }
        }
      } else if (kind === "target") {
        dispatch({ type: "moveDribbleTarget", x: pt.x, y: pt.y });
      } else if (kind === "decoy") {
        dispatch({
          type: "moveDecoy",
          index: id,
          current: displayedDecoys,
          x: pt.x,
          y: pt.y,
        });
      }
    },
    [state.phase, isLive, derived.ballId, displayedDecoys]
  );

  const { drag, startDrag } = usePitchDrag(stageRef, portrait, {
    onTap,
    onDragEnd,
  });

  const onStagePointerDown = useCallback(
    (e) => {
      // Only bare-pitch presses land here; chips/markers stop propagation.
      if (state.phase === "setup") {
        const rect = stageRef.current.getBoundingClientRect();
        const pt = fromClient(e.clientX, e.clientY, rect, portrait);
        dispatch({ type: "addPlayer", x: pt.x, y: pt.y });
        setSelectedId(null);
      }
    },
    [state.phase, portrait]
  );

  // ----- Display positions (derived + pending runs + live drag) -----

  const displayPos = useCallback(
    (id) => {
      if (drag?.kind === "chip" && drag.id === id) return drag.pt;
      return derived.positions.get(id);
    },
    [drag, derived.positions]
  );

  // ----- Arrows -----

  const arrows = useMemo(() => {
    const list = [];
    const arrow = (kind, from, to, color, faded) => ({
      kind,
      from: toPct(from, portrait),
      to: toPct(to, portrait),
      color,
      faded,
    });

    // Context: the step that produced the currently displayed state.
    // Its board adjustments (runs) are highlighted while it is still the
    // live, editable step, since new drags keep landing on it.
    const contextIdx = displayCount - 1;
    const lastIsEditable =
      state.phase === "record" && isLive && contextIdx === state.steps.length - 1;
    if (contextIdx >= 0) {
      const before = stateAtStep(puzzle, contextIdx);
      const step = state.steps[contextIdx];
      const fromPos = before.positions.get(before.ballId);
      if (step.k === "p") {
        list.push(
          arrow("pass", fromPos, before.positions.get(step.to), "white", true)
        );
      } else {
        list.push(arrow("dribble", fromPos, step, "white", true));
      }
      for (const r of step.r ?? []) {
        if (drag?.kind === "chip" && drag.id === r.i) continue;
        list.push(
          arrow(
            "run",
            before.positions.get(r.i),
            r,
            lastIsEditable ? "warning" : "white",
            !lastIsEditable
          )
        );
      }
    }

    if (state.phase === "record" && isLive && drag?.kind === "chip") {
      const isCarrier = drag.id === derived.ballId;
      // A dragged runner's arrow starts where it stood before this step.
      const from = isCarrier
        ? derived.positions.get(drag.id)
        : stateAtStep(puzzle, Math.max(0, displayCount - 1)).positions.get(
            drag.id
          );
      list.push(
        arrow(
          isCarrier ? "dribble" : "run",
          from,
          drag.pt,
          isCarrier ? "accent" : "warning"
        )
      );
    }

    return list;
  }, [
    puzzle,
    state.steps,
    state.phase,
    isLive,
    displayCount,
    derived,
    drag,
    portrait,
  ]);

  // ----- Render -----

  const ballPt = derived.ballId >= 0 && displayPos(derived.ballId);

  return (
    <div className="screen create-screen">
      <div className="topbar">
        <a className="brand" href="#">
          <span className="brand-badge">⚽</span> Pitch Puzzle
        </a>
        <div className="phase-stepper">
          {PHASES.map((phase) => (
            <button
              key={phase.id}
              className={`phase-pill${
                state.phase === phase.id ? " active" : ""
              }`}
              onClick={() => {
                if (phase.id !== "setup" && state.carrier < 0) {
                  showHint("Give a player the ball first.");
                  return;
                }
                if (phase.id === "share" && state.steps.length === 0) {
                  showHint("Record at least one step first.");
                  return;
                }
                dispatch({ type: "setPhase", phase: phase.id });
                setSelectedId(null);
              }}
            >
              {phase.label}
            </button>
          ))}
        </div>
        <div className="topbar-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (
                state.players.length === 0 ||
                window.confirm("Start over? This clears the whole puzzle.")
              ) {
                sessionStorage.removeItem(DRAFT_KEY);
                dispatch({ type: "reset" });
                setSelectedId(null);
              }
            }}
          >
            Start over
          </button>
        </div>
      </div>

      <div className="create-layout container">
        <div className="create-pitch-col">
          <PitchStage
            portrait={portrait}
            arrows={arrows}
            stageRef={stageRef}
            onStagePointerDown={onStagePointerDown}
          >
            {state.players.map((player) => {
              const pos = displayPos(player.i);
              if (!pos) return null;
              const interactive =
                state.phase === "setup" || (state.phase === "record" && isLive);
              return (
                <PlayerChip
                  key={player.i}
                  player={player}
                  screen={toPct(pos, portrait)}
                  carrier={player.i === derived.ballId}
                  selected={player.i === selectedId}
                  clickable={interactive}
                  draggable={interactive}
                  dragging={drag?.kind === "chip" && drag.id === player.i}
                  onPointerDown={(e) =>
                    interactive && startDrag(player.i, "chip", e)
                  }
                />
              );
            })}

            {ballPt && <Ball screen={toPct(ballPt, portrait)} />}

            {editableDribble && (
              <>
                <ZoneMarker
                  screen={toPct(
                    drag?.kind === "target" ? drag.pt : lastStep,
                    portrait
                  )}
                  editable
                  correct
                  onPointerDown={(e) => startDrag(0, "target", e)}
                />
                {displayedDecoys.map((decoy, idx) => (
                  <ZoneMarker
                    key={idx}
                    screen={toPct(
                      drag?.kind === "decoy" && drag.id === idx
                        ? drag.pt
                        : decoy,
                      portrait
                    )}
                    editable
                    onPointerDown={(e) => startDrag(idx, "decoy", e)}
                  />
                ))}
              </>
            )}
          </PitchStage>
          {hint && <div className="pitch-hint">{hint}</div>}
        </div>

        <div className="create-panel-col">
          {state.phase === "setup" && (
            <SetupPanel
              state={state}
              dispatch={dispatch}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onContinue={() => {
                if (state.carrier < 0) {
                  showHint(
                    "Select a blue player and tap “Give ball” before recording."
                  );
                  return;
                }
                dispatch({ type: "setPhase", phase: "record" });
                setSelectedId(null);
              }}
            />
          )}
          {state.phase === "record" && (
            <RecordPanel
              state={state}
              dispatch={dispatch}
              carrierId={derived.ballId}
              playersById={playersById}
              editableDribble={editableDribble}
              onBack={() => dispatch({ type: "setPhase", phase: "setup" })}
              onContinue={() => {
                if (state.steps.length === 0) {
                  showHint("Record at least one pass or dribble first.");
                  return;
                }
                dispatch({ type: "setPhase", phase: "share" });
              }}
            />
          )}
          {state.phase === "share" && (
            <SharePanel
              state={state}
              dispatch={dispatch}
              puzzle={puzzle}
              onBack={() => dispatch({ type: "setPhase", phase: "record" })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateScreen;
