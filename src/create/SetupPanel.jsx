import React from "react";
import { FORMATION_NAMES } from "./formations.js";

const SetupPanel = ({ state, dispatch, selectedId, setSelectedId, onContinue }) => {
  const selected = state.players.find((p) => p.i === selectedId);
  const homeCount = state.players.filter((p) => p.s === 0).length;
  const awayCount = state.players.length - homeCount;

  return (
    <div className="panel card">
      <h3 className="panel-title">Set the scene</h3>
      <p className="panel-hint">
        Tap the pitch to add a player, drag to move. Tap a player for options.
      </p>

      <div className="panel-section">
        <div className="panel-label">Adding players for</div>
        <div className="segmented">
          <button
            className={state.side === 0 ? "active seg-home" : ""}
            onClick={() => dispatch({ type: "setSide", side: 0 })}
          >
            Your team ({homeCount})
          </button>
          <button
            className={state.side === 1 ? "active seg-away" : ""}
            onClick={() => dispatch({ type: "setSide", side: 1 })}
          >
            Opposition ({awayCount})
          </button>
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-label">Formation templates</div>
        <div className="btn-row">
          {FORMATION_NAMES.map((name) => (
            <button
              key={name}
              className="btn btn-soft btn-sm"
              onClick={() =>
                dispatch({
                  type: "applyFormation",
                  formation: name,
                  side: state.side,
                })
              }
            >
              {name}
            </button>
          ))}
        </div>
        <div className="panel-footnote">
          Applies to the selected team above. You can still drag everyone
          afterwards — or skip templates for a small-sided drill.
        </div>
      </div>

      {selected && (
        <div className="panel-section selected-box">
          <div className="panel-label">
            {selected.s === 0 ? "Blue" : "Red"} #{selected.n}
          </div>
          <div className="btn-row">
            {selected.s === 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  dispatch({ type: "setCarrier", id: selected.i });
                  setSelectedId(null);
                }}
              >
                ⚽ Give ball
              </button>
            )}
            <button
              className="btn btn-danger-soft btn-sm"
              onClick={() => {
                dispatch({ type: "removePlayer", id: selected.i });
                setSelectedId(null);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="panel-section">
        <div className="panel-status">
          {state.carrier >= 0 ? (
            <>
              Ball:{" "}
              <strong>
                #{state.players.find((p) => p.i === state.carrier)?.n}
              </strong>{" "}
              starts with it
            </>
          ) : (
            <>Tap a blue player, then “Give ball”.</>
          )}
        </div>
      </div>

      <div className="panel-actions">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => dispatch({ type: "clearPlayers" })}
          disabled={state.players.length === 0}
        >
          Clear pitch
        </button>
        <button
          className="btn btn-primary"
          onClick={onContinue}
          disabled={state.carrier < 0 || homeCount < 2}
        >
          Record the play →
        </button>
      </div>
    </div>
  );
};

export default SetupPanel;
