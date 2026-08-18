import React from "react";

// The ball sits slightly offset from its carrier so both stay visible.
const Ball = ({ screen, hopping = false }) => (
  <div
    className={`ball${hopping ? " hop" : ""}`}
    style={{ left: `calc(${screen.x}% + 12px)`, top: `calc(${screen.y}% + 12px)` }}
  />
);

export default Ball;
