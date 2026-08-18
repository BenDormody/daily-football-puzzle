// Formation templates in canonical coords for the attacking side (left
// half, attacking right). The opposition gets the mirrored layout.

const F = {
  "4-4-2": [
    { n: 1, x: 45, y: 500 },
    { n: 2, x: 185, y: 175 },
    { n: 4, x: 165, y: 390 },
    { n: 5, x: 165, y: 610 },
    { n: 3, x: 185, y: 825 },
    { n: 7, x: 400, y: 175 },
    { n: 8, x: 385, y: 390 },
    { n: 6, x: 385, y: 610 },
    { n: 11, x: 400, y: 825 },
    { n: 9, x: 590, y: 415 },
    { n: 10, x: 590, y: 585 },
  ],
  "4-3-3": [
    { n: 1, x: 45, y: 500 },
    { n: 2, x: 185, y: 170 },
    { n: 4, x: 165, y: 385 },
    { n: 5, x: 165, y: 615 },
    { n: 3, x: 185, y: 830 },
    { n: 8, x: 390, y: 310 },
    { n: 6, x: 340, y: 500 },
    { n: 10, x: 390, y: 690 },
    { n: 7, x: 600, y: 180 },
    { n: 9, x: 620, y: 500 },
    { n: 11, x: 600, y: 820 },
  ],
  "3-5-2": [
    { n: 1, x: 45, y: 500 },
    { n: 4, x: 165, y: 300 },
    { n: 5, x: 150, y: 500 },
    { n: 6, x: 165, y: 700 },
    { n: 2, x: 360, y: 130 },
    { n: 8, x: 380, y: 360 },
    { n: 10, x: 420, y: 500 },
    { n: 7, x: 380, y: 640 },
    { n: 3, x: 360, y: 870 },
    { n: 9, x: 600, y: 420 },
    { n: 11, x: 600, y: 580 },
  ],
};

export const FORMATION_NAMES = Object.keys(F);

// side: 0 = attacking (left half), 1 = opposition (mirrored right half)
export const formationSpots = (name, side) => {
  const spots = F[name];
  if (!spots) return [];
  return spots.map(({ n, x, y }) => ({
    n,
    x: side === 0 ? x : 1000 - x,
    y,
  }));
};
