import React from "react";
import Timeline from "./Timeline.jsx";

const RecordPanel = ({
  state,
  dispatch,
  carrierId,
  playersById,
  editableDribble,
  onBack,
  onContinue,
}) => {
  const carrier = playersById.get(carrierId);
  const isLive = state.scrub === null;

  // The note field edits the previewed step, or the last step when live.
  const noteIndex = isLive ? state.steps.length - 1 : state.scrub - 1;
  const noteStep = state.steps[noteIndex];

  return (
    <div className="panel card">
      <h3 className="panel-title">Record the play</h3>

      <ul className="record-legend">
        <li>
          <span className="legend-icon solid" /> Tap a teammate — records a{" "}
          <strong>pass</strong>
        </li>
        <li>
          <span className="legend-icon wavy" /> Drag the ball carrier —
          records a <strong>dribble</strong>
        </li>
        <li>
          <span className="legend-icon dashed" /> Drag anyone else — adds a{" "}
          <strong>run</strong> to the next step
        </li>
      </ul>

      <div className="panel-section">
        <div className="panel-status">
          {isLive ? (
            <>
              Ball with <strong>#{carrier?.n ?? "?"}</strong>
              {state.pendingRuns.length > 0 && (
                <>
                  {" · "}
                  {state.pendingRuns.length} pending run
                  {state.pendingRuns.length > 1 ? "s" : ""}{" "}
                  <button
                    className="link-btn"
                    onClick={() => dispatch({ type: "undoPendingRun" })}
                  >
                    undo
                  </button>
                </>
              )}
            </>
          ) : (
            <>Previewing step {state.scrub} — tap “Live” to keep editing.</>
          )}
        </div>
        {editableDribble && (
          <div className="panel-footnote">
            Dribble recorded. The dashed circles are the answer zones your
            player will choose between — drag the amber decoys (or the solid
            correct zone) to reposition them.
          </div>
        )}
      </div>

      <div className="panel-section">
        <div className="panel-label">Sequence</div>
        <Timeline
          steps={state.steps}
          scrub={state.scrub}
          playersById={playersById}
          dispatch={dispatch}
        />
      </div>

      {noteStep && (
        <div className="panel-section">
          <div className="panel-label">
            Coaching note for step {noteIndex + 1}{" "}
            <span className="panel-label-soft">(shown after it's solved)</span>
          </div>
          <textarea
            className="input"
            rows={2}
            placeholder="e.g. The pivot splits their pressing forwards."
            value={noteStep.c ?? ""}
            onChange={(e) =>
              dispatch({
                type: "setStepNote",
                index: noteIndex,
                note: e.target.value,
              })
            }
          />
        </div>
      )}

      <div className="panel-actions">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Setup
        </button>
        <button
          className="btn btn-primary"
          onClick={onContinue}
          disabled={state.steps.length === 0}
        >
          Share it →
        </button>
      </div>
    </div>
  );
};

export default RecordPanel;
