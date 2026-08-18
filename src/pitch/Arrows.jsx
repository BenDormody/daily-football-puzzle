import React from "react";

// Arrow overlay. Arrows arrive as { from, to, kind, color? } where from/to
// are percentage positions ({x, y} in 0–100 of the stage) and kind is
// 'pass' (solid), 'run' (dashed) or 'dribble' (wavy). Geometry is computed
// in pixels from the measured stage size so arrowheads never distort.

const pxPoint = (pct, size) => ({
  x: (pct.x / 100) * size.w,
  y: (pct.y / 100) * size.h,
});

const wavyPath = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len; // unit normal
  const ny = dx / len;
  const waves = Math.max(2, Math.round(len / 26));
  const amp = 5;
  let d = `M ${a.x} ${a.y}`;
  for (let i = 0; i < waves; i++) {
    const t0 = i / waves;
    const t1 = (i + 1) / waves;
    const mx = a.x + dx * (t0 + t1) * 0.5 + nx * amp * (i % 2 === 0 ? 1 : -1);
    const my = a.y + dy * (t0 + t1) * 0.5 + ny * amp * (i % 2 === 0 ? 1 : -1);
    d += ` Q ${mx} ${my} ${a.x + dx * t1} ${a.y + dy * t1}`;
  }
  return d;
};

// Shorten the arrow so the head doesn't sit under the target chip.
const shorten = (a, b, byPx) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.max(0, (len - byPx) / len);
  return { x: a.x + dx * t, y: a.y + dy * t };
};

const COLORS = {
  white: "rgba(255,255,255,0.95)",
  accent: "var(--accent)",
  error: "var(--error)",
  warning: "var(--warning)",
};

const Arrows = ({ arrows, size }) => {
  if (!size.w || arrows.length === 0) return null;

  return (
    <svg className="pitch-overlay" width={size.w} height={size.h}>
      <defs>
        {Object.entries(COLORS).map(([name, color]) => (
          <marker
            key={name}
            id={`arrowhead-${name}`}
            markerWidth="8"
            markerHeight="7"
            refX="6.5"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0.4, 8 3.5, 0 6.6" fill={color} />
          </marker>
        ))}
      </defs>
      {arrows.map((arrow, idx) => {
        const colorName = arrow.color ?? "white";
        const a = pxPoint(arrow.from, size);
        const rawB = pxPoint(arrow.to, size);
        const b = shorten(a, rawB, arrow.kind === "run" ? 14 : 18);
        const common = {
          stroke: COLORS[colorName],
          strokeWidth: 3.2,
          fill: "none",
          strokeLinecap: "round",
          markerEnd: `url(#arrowhead-${colorName})`,
          opacity: arrow.faded ? 0.55 : 1,
        };
        if (arrow.kind === "dribble") {
          return <path key={idx} d={wavyPath(a, b)} {...common} />;
        }
        return (
          <line
            key={idx}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            strokeDasharray={arrow.kind === "run" ? "7 8" : undefined}
            {...common}
          />
        );
      })}
    </svg>
  );
};

export default Arrows;
