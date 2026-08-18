import React from "react";

// Hearts + progress + the current instruction, shown above the pitch.
const HUD = ({ puzzle, state, carrierNumber }) => {
  const step = puzzle.st[state.stepIndex];
  const total = puzzle.st.length;

  let prompt = "";
  if (state.status === "playing") {
    prompt =
      step.k === "p"
        ? `Step ${state.stepIndex + 1} of ${total} — who should get the ball?`
        : `Step ${state.stepIndex + 1} of ${total} — where should #${carrierNumber} take the ball? Tap a zone.`;
  } else if (state.status === "stepAnim") {
    prompt = "Nice one ✓";
  } else if (state.status === "revealing") {
    prompt = "Out of chances — here's the full play…";
  }

  return (
    <div className="play-hud">
      <div className="hud-row">
        <div className="hud-hearts" aria-label={`${state.mistakesLeft} chances left`}>
          {Array.from({ length: puzzle.m }, (_, i) => (
            <span
              key={i}
              className={`heart${i < state.mistakesLeft ? "" : " spent"}`}
            >
              ●
            </span>
          ))}
        </div>
        <div className="hud-progress">
          {puzzle.st.map((_, idx) => (
            <span
              key={idx}
              className={`progress-dot${
                idx < state.stepIndex ||
                state.status === "solved"
                  ? " done"
                  : idx === state.stepIndex
                  ? " current"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>
      {prompt && <div className="hud-prompt">{prompt}</div>}
      {state.note && <div className="hud-note">💡 {state.note}</div>}
    </div>
  );
};

export default HUD;
