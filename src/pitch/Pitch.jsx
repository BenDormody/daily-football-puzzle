import React from "react";
import { PITCH_L, PITCH_W, APRON, svgSize } from "./coords.js";

// Decorative pitch SVG. Drawn once in landscape geometry; portrait mode
// rotates the whole drawing 90° so attack points up. Interactive elements
// (chips, ball, markers) are HTML siblings positioned via coords.js.

const LINE = "rgba(255,255,255,0.92)";
const LINE_W = 3;

const PenaltyEnd = ({ mirror }) => {
  // Geometry in meters * 10. All positions relative to the left goal line;
  // mirror=true flips to the right end.
  const boxDepth = 165;
  const boxW = 403;
  const goalBoxDepth = 55;
  const goalBoxW = 183;
  const spotX = 110;
  const arcR = 91.5;
  const goalW = 73.2;
  const goalDepth = 22;

  const gx = APRON; // goal line x
  const cy = APRON + PITCH_W / 2;
  const boxY = cy - boxW / 2;
  const goalBoxY = cy - goalBoxW / 2;
  const goalY = cy - goalW / 2;

  // Penalty arc: part of circle around the spot outside the box
  const dx = boxDepth - spotX;
  const half = Math.sqrt(arcR * arcR - dx * dx);
  const arc = `M ${gx + boxDepth} ${cy - half} A ${arcR} ${arcR} 0 0 1 ${
    gx + boxDepth
  } ${cy + half}`;

  const transform = mirror
    ? `translate(${2 * APRON + PITCH_L}, 0) scale(-1, 1)`
    : undefined;

  return (
    <g
      transform={transform}
      stroke={LINE}
      strokeWidth={LINE_W}
      fill="none"
      strokeLinecap="round"
    >
      <rect x={gx} y={boxY} width={boxDepth} height={boxW} />
      <rect x={gx} y={goalBoxY} width={goalBoxDepth} height={goalBoxW} />
      <circle cx={gx + spotX} cy={cy} r={2.6} fill={LINE} stroke="none" />
      <path d={arc} />
      {/* Goal: shallow box behind the line with a darker "net" */}
      <rect
        x={gx - goalDepth}
        y={goalY}
        width={goalDepth}
        height={goalW}
        rx={4}
        fill="rgba(0,0,0,0.28)"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth={2.5}
      />
      {/* Corner arcs */}
      <path d={`M ${gx} ${APRON + 10} A 10 10 0 0 1 ${gx + 10} ${APRON}`} />
      <path
        d={`M ${gx + 10} ${APRON + PITCH_W} A 10 10 0 0 1 ${gx} ${
          APRON + PITCH_W - 10
        }`}
      />
    </g>
  );
};

const Pitch = ({ portrait = false }) => {
  const { w, h } = svgSize(portrait);
  const lw = PITCH_L + 2 * APRON; // landscape drawing size
  const lh = PITCH_W + 2 * APRON;
  const cx = APRON + PITCH_L / 2;
  const cy = APRON + PITCH_W / 2;

  const stripeCount = 12;
  const stripeW = lw / stripeCount;

  return (
    <svg
      className="pitch-svg"
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="pitch-clip">
          <rect x="0" y="0" width={lw} height={lh} rx="30" />
        </clipPath>
        <radialGradient id="pitch-vignette" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(15,40,20,0.30)" />
        </radialGradient>
      </defs>

      <g
        transform={
          portrait ? `translate(0, ${lw}) rotate(-90)` : undefined
        }
      >
        {/* Grass base + mowing stripes */}
        <rect x="0" y="0" width={lw} height={lh} rx="30" fill="var(--grass-2)" />
        <g clipPath="url(#pitch-clip)">
          {Array.from({ length: stripeCount }, (_, i) =>
            i % 2 === 0 ? (
              <rect
                key={i}
                x={i * stripeW}
                y="0"
                width={stripeW}
                height={lh}
                fill="var(--grass-1)"
              />
            ) : null
          )}
          <rect
            x="0"
            y="0"
            width={lw}
            height={lh}
            fill="url(#pitch-vignette)"
          />
        </g>

        {/* Pitch lines */}
        <g stroke={LINE} strokeWidth={LINE_W} fill="none">
          <rect x={APRON} y={APRON} width={PITCH_L} height={PITCH_W} />
          <line x1={cx} y1={APRON} x2={cx} y2={APRON + PITCH_W} />
          <circle cx={cx} cy={cy} r={91.5} />
          <circle cx={cx} cy={cy} r={2.6} fill={LINE} stroke="none" />
        </g>
        <PenaltyEnd mirror={false} />
        <PenaltyEnd mirror={true} />
      </g>
    </svg>
  );
};

export default Pitch;
