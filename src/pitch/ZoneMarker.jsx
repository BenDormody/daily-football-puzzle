import React from "react";

// Tap target for dribble answers (play mode) and draggable decoy/destination
// editor handles (create mode).
const ZoneMarker = ({
  screen,
  onClick,
  onPointerDown,
  editable = false,
  correct = false,
  label = null,
}) => {
  const classes = [
    "zone-marker",
    editable && "draggable",
    editable && (correct ? "correct-editable" : "decoy-editable"),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{ left: `${screen.x}%`, top: `${screen.y}%` }}
      onClick={onClick}
      onPointerDown={onPointerDown}
    >
      {label}
    </div>
  );
};

export default ZoneMarker;
