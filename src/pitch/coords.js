// Canonical space: x 0–1000 along pitch length (attack left → right),
// y 0–1000 across pitch width. All puzzle data lives in this space.
// Screen mapping handles landscape vs portrait (vertical pitch, attack up).

import { COORD_MAX } from "../schema/puzzle.js";

// Pitch drawn at 10 SVG units per meter (105m x 68m) plus a grass apron.
export const PITCH_L = 1050;
export const PITCH_W = 680;
export const APRON = 44;

export const svgSize = (portrait) =>
  portrait
    ? { w: PITCH_W + 2 * APRON, h: PITCH_L + 2 * APRON }
    : { w: PITCH_L + 2 * APRON, h: PITCH_W + 2 * APRON };

// Canonical point -> percentage position within the stage.
export const toPct = (pt, portrait) => {
  const { w, h } = svgSize(portrait);
  if (portrait) {
    const sx = APRON + (pt.y / COORD_MAX) * PITCH_W;
    const sy = APRON + ((COORD_MAX - pt.x) / COORD_MAX) * PITCH_L;
    return { x: (sx / w) * 100, y: (sy / h) * 100 };
  }
  const sx = APRON + (pt.x / COORD_MAX) * PITCH_L;
  const sy = APRON + (pt.y / COORD_MAX) * PITCH_W;
  return { x: (sx / w) * 100, y: (sy / h) * 100 };
};

const clampCoord = (n) => Math.max(0, Math.min(COORD_MAX, n));

// Client (mouse/touch) position -> canonical point, given the stage's
// bounding rect. Clamped to the playing area.
export const fromClient = (clientX, clientY, rect, portrait) => {
  const { w, h } = svgSize(portrait);
  const sx = ((clientX - rect.left) / rect.width) * w;
  const sy = ((clientY - rect.top) / rect.height) * h;
  if (portrait) {
    return {
      x: clampCoord(Math.round(COORD_MAX - ((sy - APRON) / PITCH_L) * COORD_MAX)),
      y: clampCoord(Math.round(((sx - APRON) / PITCH_W) * COORD_MAX)),
    };
  }
  return {
    x: clampCoord(Math.round(((sx - APRON) / PITCH_L) * COORD_MAX)),
    y: clampCoord(Math.round(((sy - APRON) / PITCH_W) * COORD_MAX)),
  };
};

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
