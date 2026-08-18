// Built-in demo puzzle: shown on the landing page and playable via the
// "Try the demo" button. Also doubles as a template for first-time creators.
export const demoPuzzle = () => ({
  v: 2,
  t: "Break the press",
  a: "Pitch Puzzle",
  q: "Their strikers are pressing our back line. Play through the press and finish the move on the right wing.",
  m: 3,
  b: 3,
  pl: [
    // Attacking side (blue)
    { i: 0, s: 0, n: 1, x: 50, y: 500 },
    { i: 1, s: 0, n: 2, x: 210, y: 810 },
    { i: 2, s: 0, n: 4, x: 185, y: 615 },
    { i: 3, s: 0, n: 5, x: 185, y: 385 },
    { i: 4, s: 0, n: 3, x: 210, y: 190 },
    { i: 5, s: 0, n: 6, x: 400, y: 500 },
    { i: 6, s: 0, n: 8, x: 480, y: 300 },
    { i: 7, s: 0, n: 10, x: 480, y: 700 },
    { i: 8, s: 0, n: 7, x: 660, y: 850 },
    { i: 9, s: 0, n: 9, x: 680, y: 500 },
    { i: 10, s: 0, n: 11, x: 660, y: 150 },
    // Opposition (red)
    { i: 11, s: 1, n: 1, x: 955, y: 500 },
    { i: 12, s: 1, n: 2, x: 800, y: 180 },
    { i: 13, s: 1, n: 4, x: 830, y: 400 },
    { i: 14, s: 1, n: 5, x: 830, y: 600 },
    { i: 15, s: 1, n: 3, x: 800, y: 820 },
    { i: 16, s: 1, n: 8, x: 600, y: 350 },
    { i: 17, s: 1, n: 6, x: 570, y: 550 },
    { i: 18, s: 1, n: 7, x: 350, y: 700 },
    { i: 19, s: 1, n: 9, x: 280, y: 480 },
    { i: 20, s: 1, n: 10, x: 300, y: 300 },
    { i: 21, s: 1, n: 11, x: 480, y: 145 },
  ],
  st: [
    {
      k: "p",
      to: 5,
      c: "The pivot splits their two pressing forwards.",
    },
    {
      k: "d",
      x: 520,
      y: 460,
      r: [{ i: 9, x: 740, y: 420 }],
      c: "Carry it forward — their midfield has to step out.",
    },
    {
      k: "p",
      to: 9,
      c: "The striker drops between the lines to receive.",
    },
    {
      k: "p",
      to: 8,
      r: [{ i: 8, x: 800, y: 780 }],
      c: "Release the winger in behind before the back line resets.",
    },
  ],
});
