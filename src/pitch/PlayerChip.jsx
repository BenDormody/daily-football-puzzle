import React from "react";

// Dumb positioned chip. `screen` is a percentage position from coords.toPct.
const PlayerChip = ({
  player,
  screen,
  carrier = false,
  selected = false,
  clickable = false,
  draggable = false,
  dragging = false,
  flash = null, // 'correct' | 'wrong' | null
  onClick,
  onPointerDown,
}) => {
  const classes = [
    "chip",
    player.s === 0 ? "home" : "away",
    carrier && "carrier",
    selected && "selected",
    clickable && "clickable",
    draggable && "draggable",
    dragging && "dragging",
    flash === "correct" && "flash-correct",
    flash === "wrong" && "flash-wrong",
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
      {player.n}
    </div>
  );
};

export default PlayerChip;
