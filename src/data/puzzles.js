import { createPlayer, createPuzzle, TEAMS, PUZZLE_TYPES } from "./types.js";
import { format } from "date-fns";

// Puzzle 1: Simple Build-Up from Defense
const buildUpPlayers = [
  // Home team (Blue) - 4-4-2 formation
  createPlayer({
    id: "bu_gk",
    name: "Goalkeeper",
    number: 1,
    team: TEAMS.HOME,
    position: "GK",
    fieldPosition: { x: 10, y: 50 },
  }),
  createPlayer({
    id: "bu_lb",
    name: "Left Back",
    number: 3,
    team: TEAMS.HOME,
    position: "LB",
    fieldPosition: { x: 20, y: 20 },
  }),
  createPlayer({
    id: "bu_cb1",
    name: "Center Back",
    number: 4,
    team: TEAMS.HOME,
    position: "CB",
    fieldPosition: { x: 20, y: 40 },
  }),
  createPlayer({
    id: "bu_cb2",
    name: "Center Back",
    number: 5,
    team: TEAMS.HOME,
    position: "CB",
    fieldPosition: { x: 20, y: 60 },
    isActivePlayer: true,
  }),
  createPlayer({
    id: "bu_rb",
    name: "Right Back",
    number: 2,
    team: TEAMS.HOME,
    position: "RB",
    fieldPosition: { x: 20, y: 80 },
  }),
  createPlayer({
    id: "bu_lm",
    name: "Left Mid",
    number: 7,
    team: TEAMS.HOME,
    position: "LM",
    fieldPosition: { x: 40, y: 30 },
  }),
  createPlayer({
    id: "bu_cm1",
    name: "Center Mid",
    number: 6,
    team: TEAMS.HOME,
    position: "CM",
    fieldPosition: { x: 40, y: 50 },
  }),
  createPlayer({
    id: "bu_cm2",
    name: "Center Mid",
    number: 8,
    team: TEAMS.HOME,
    position: "CM",
    fieldPosition: { x: 40, y: 70 },
  }),
  createPlayer({
    id: "bu_rm",
    name: "Right Mid",
    number: 11,
    team: TEAMS.HOME,
    position: "RM",
    fieldPosition: { x: 40, y: 85 },
    isCorrectChoice: true,
  }),
  createPlayer({
    id: "bu_st1",
    name: "Striker",
    number: 9,
    team: TEAMS.HOME,
    position: "ST",
    fieldPosition: { x: 60, y: 40 },
  }),
  createPlayer({
    id: "bu_st2",
    name: "Striker",
    number: 10,
    team: TEAMS.HOME,
    position: "ST",
    fieldPosition: { x: 60, y: 60 },
  }),

  // Away team (Red) - 4-4-2 formation
  createPlayer({
    id: "bu_away_gk",
    name: "Goalkeeper",
    number: 1,
    team: TEAMS.AWAY,
    position: "GK",
    fieldPosition: { x: 90, y: 50 },
  }),
  createPlayer({
    id: "bu_away_lb",
    name: "Left Back",
    number: 3,
    team: TEAMS.AWAY,
    position: "LB",
    fieldPosition: { x: 70, y: 20 },
  }),
  createPlayer({
    id: "bu_away_cb1",
    name: "Center Back",
    number: 4,
    team: TEAMS.AWAY,
    position: "CB",
    fieldPosition: { x: 70, y: 40 },
  }),
  createPlayer({
    id: "bu_away_cb2",
    name: "Center Back",
    number: 5,
    team: TEAMS.AWAY,
    position: "CB",
    fieldPosition: { x: 70, y: 60 },
  }),
  createPlayer({
    id: "bu_away_rb",
    name: "Right Back",
    number: 2,
    team: TEAMS.AWAY,
    position: "RB",
    fieldPosition: { x: 70, y: 80 },
  }),
  createPlayer({
    id: "bu_away_lm",
    name: "Left Mid",
    number: 7,
    team: TEAMS.AWAY,
    position: "LM",
    fieldPosition: { x: 55, y: 25 },
  }),
  createPlayer({
    id: "bu_away_cm1",
    name: "Center Mid",
    number: 6,
    team: TEAMS.AWAY,
    position: "CM",
    fieldPosition: { x: 55, y: 45 },
  }),
  createPlayer({
    id: "bu_away_cm2",
    name: "Center Mid",
    number: 8,
    team: TEAMS.AWAY,
    position: "CM",
    fieldPosition: { x: 55, y: 55 },
  }),
  createPlayer({
    id: "bu_away_rm",
    name: "Right Mid",
    number: 11,
    team: TEAMS.AWAY,
    position: "RM",
    fieldPosition: { x: 55, y: 75 },
  }),
  createPlayer({
    id: "bu_away_st1",
    name: "Striker",
    number: 9,
    team: TEAMS.AWAY,
    position: "ST",
    fieldPosition: { x: 35, y: 40 },
  }),
  createPlayer({
    id: "bu_away_st2",
    name: "Striker",
    number: 10,
    team: TEAMS.AWAY,
    position: "ST",
    fieldPosition: { x: 35, y: 60 },
  }),
];

const buildUpPuzzle = createPuzzle({
  id: "build_up_1",
  date: format(new Date(), "yyyy-MM-dd"),
  question: "Build from the Back",
  description:
    "Blue team is building from defense. The center back has the ball. Find the best passing option to start the attack.",
  type: PUZZLE_TYPES.PASS,
  players: buildUpPlayers,
  correctPlayerId: "bu_rm",
  correctAction: {
    type: "pass",
    targetPlayerId: "bu_rm",
    coordinates: { x: 40, y: 85 },
  },
  explanation:
    "The right midfielder is in space and can turn forward to start the attack.",
  difficulty: "easy",
});

// Export all puzzles
export const SAMPLE_PUZZLES = [buildUpPuzzle];

// Utility functions remain the same
export const getTodaysPuzzle = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const puzzleIndex = dayOfYear % SAMPLE_PUZZLES.length;

  return {
    ...SAMPLE_PUZZLES[puzzleIndex],
    date: today,
  };
};

export const getPuzzleById = (id) => {
  return SAMPLE_PUZZLES.find((puzzle) => puzzle.id === id);
};
