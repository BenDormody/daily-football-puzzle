import React from "react";

const stepLabel = (step, playersById) => {
  if (step.k === "p") {
    const target = playersById.get(step.to);
    return `Pass → #${target?.n ?? "?"}`;
  }
  return "Carry";
};

// Horizontal strip of recorded steps. Tapping a chip scrubs the pitch to a
// read-only preview of the state after that step; "Live" returns to the
// editable end of the sequence. Only the last step can be deleted.
const Timeline = ({ steps, scrub, playersById, dispatch }) => {
  if (steps.length === 0) {
    return (
      <div className="timeline empty">
        No steps yet — tap a teammate to record the first pass.
      </div>
    );
  }

  return (
    <div className="timeline">
      {steps.map((step, idx) => {
        const isPreviewed = scrub === idx + 1;
        const runCount = step.r?.length ?? 0;
        return (
          <button
            key={idx}
            className={`timeline-chip${isPreviewed ? " previewed" : ""}`}
            onClick={() =>
              dispatch({
                type: "setScrub",
                value: isPreviewed ? null : idx + 1,
              })
            }
            title="Preview this moment"
          >
            <span className="timeline-num">{idx + 1}</span>
            {stepLabel(step, playersById)}
            {runCount > 0 && (
              <span className="timeline-runs">
                +{runCount} run{runCount > 1 ? "s" : ""}
              </span>
            )}
            {step.c && <span className="timeline-note-dot" title="Has note">✎</span>}
          </button>
        );
      })}
      <button
        className={`timeline-chip live${scrub === null ? " previewed" : ""}`}
        onClick={() => dispatch({ type: "setScrub", value: null })}
      >
        Live
      </button>
      <button
        className="timeline-delete"
        title="Delete last step"
        onClick={() => dispatch({ type: "deleteLastStep" })}
      >
        🗑
      </button>
    </div>
  );
};

export default Timeline;
