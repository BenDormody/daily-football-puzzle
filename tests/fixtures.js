// A realistic 22-player, multi-step puzzle used across the test suite.
export const bigPuzzle = () => {
  const pl = [];
  // Attacking side (s: 0), ids 0-10
  const homeSpots = [
    [60, 500], [200, 200], [180, 400], [180, 600], [200, 800],
    [380, 500], [420, 300], [420, 700], [600, 200], [620, 500], [600, 800],
  ];
  homeSpots.forEach(([x, y], idx) =>
    pl.push({ i: idx, s: 0, n: idx + 1, x, y })
  );
  // Opposition (s: 1), ids 11-21
  const awaySpots = [
    [950, 500], [800, 200], [820, 400], [820, 600], [800, 800],
    [650, 350], [650, 650], [500, 250], [520, 500], [500, 750], [380, 450],
  ];
  awaySpots.forEach(([x, y], idx) =>
    pl.push({ i: 11 + idx, s: 1, n: idx + 1, x, y })
  );

  return {
    v: 2,
    t: "Counter attack drill",
    a: "Coach Ben",
    q: "We just won the ball at the back. Break fast.",
    m: 3,
    b: 2, // CB starts with the ball
    pl,
    st: [
      { k: "p", to: 5, c: "The pivot is free between the lines." },
      { k: "d", x: 500, y: 480, r: [{ i: 9, x: 700, y: 450 }] },
      { k: "p", to: 9 },
      { k: "d", x: 760, y: 430, alt: [{ x: 700, y: 700 }, { x: 600, y: 200 }] },
      { k: "p", to: 10, r: [{ i: 8, x: 780, y: 220 }], c: "Switch it wide." },
      { k: "p", to: 8 },
    ],
  };
};
