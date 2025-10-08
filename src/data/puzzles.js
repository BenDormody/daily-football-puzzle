// Enhanced puzzles.js with chain puzzle support
import { createPlayer, createPuzzle, TEAMS, PUZZLE_TYPES } from "./types.js";
import { format } from "date-fns";

// Chain Puzzle: 3-Move Counter Attack Sequence (Realistic 11v11)
// Chain Puzzle: 3-Move Counter Attack Sequence (11v11 Realistic)
const createChainCounterAttackPuzzle = () => {
  // Move 1: Initial defensive clearance - defending team wins ball in own box
  const move1Players = [
    // HOME TEAM (Blue) - defending, just won the ball
    createPlayer({
      id: "ca_gk",
      name: "Goalkeeper",
      number: 1,
      team: TEAMS.HOME,
      position: "GK",
      fieldPosition: { x: 5, y: 50 },
    }),
    createPlayer({
      id: "ca_rb",
      name: "Right Back",
      number: 2,
      team: TEAMS.HOME,
      position: "RB",
      fieldPosition: { x: 20, y: 75 },
    }),
    createPlayer({
      id: "ca_cb1",
      name: "Center Back",
      number: 4,
      team: TEAMS.HOME,
      position: "CB",
      fieldPosition: { x: 15, y: 60 },
      isActivePlayer: true, // Just won the ball from a corner/cross
    }),
    createPlayer({
      id: "ca_cb2",
      name: "Center Back",
      number: 5,
      team: TEAMS.HOME,
      position: "CB",
      fieldPosition: { x: 15, y: 40 },
    }),
    createPlayer({
      id: "ca_lb",
      name: "Left Back",
      number: 3,
      team: TEAMS.HOME,
      position: "LB",
      fieldPosition: { x: 20, y: 25 },
    }),
    createPlayer({
      id: "ca_cdm",
      name: "Defensive Mid",
      number: 6,
      team: TEAMS.HOME,
      position: "CDM",
      fieldPosition: { x: 35, y: 50 },
      isCorrectChoice: true, // Best option - in space, can start counter
    }),
    createPlayer({
      id: "ca_cm1",
      name: "Center Mid",
      number: 8,
      team: TEAMS.HOME,
      position: "CM",
      fieldPosition: { x: 45, y: 35 },
    }),
    createPlayer({
      id: "ca_cm2",
      name: "Center Mid",
      number: 10,
      team: TEAMS.HOME,
      position: "CM",
      fieldPosition: { x: 45, y: 65 },
    }),
    createPlayer({
      id: "ca_rw",
      name: "Right Winger",
      number: 7,
      team: TEAMS.HOME,
      position: "RW",
      fieldPosition: { x: 55, y: 80 },
    }),
    createPlayer({
      id: "ca_lw",
      name: "Left Winger",
      number: 11,
      team: TEAMS.HOME,
      position: "LW",
      fieldPosition: { x: 55, y: 20 },
    }),
    createPlayer({
      id: "ca_st",
      name: "Striker",
      number: 9,
      team: TEAMS.HOME,
      position: "ST",
      fieldPosition: { x: 65, y: 50 },
    }),

    // AWAY TEAM (Red) - caught attacking, many players forward from set piece
    createPlayer({
      id: "ca_away_gk",
      name: "Goalkeeper",
      number: 1,
      team: TEAMS.AWAY,
      position: "GK",
      fieldPosition: { x: 95, y: 50 },
    }),
    createPlayer({
      id: "ca_away_rb",
      name: "Right Back",
      number: 2,
      team: TEAMS.AWAY,
      position: "RB",
      fieldPosition: { x: 80, y: 75 },
    }),
    createPlayer({
      id: "ca_away_cb1",
      name: "Center Back",
      number: 4,
      team: TEAMS.AWAY,
      position: "CB",
      fieldPosition: { x: 85, y: 60 },
    }),
    createPlayer({
      id: "ca_away_cb2",
      name: "Center Back",
      number: 5,
      team: TEAMS.AWAY,
      position: "CB",
      fieldPosition: { x: 85, y: 40 },
    }),
    createPlayer({
      id: "ca_away_lb",
      name: "Left Back",
      number: 3,
      team: TEAMS.AWAY,
      position: "LB",
      fieldPosition: { x: 30, y: 35 }, // Up for set piece
    }),
    createPlayer({
      id: "ca_away_cdm",
      name: "Defensive Mid",
      number: 6,
      team: TEAMS.AWAY,
      position: "CDM",
      fieldPosition: { x: 25, y: 55 }, // Up for set piece
    }),
    createPlayer({
      id: "ca_away_cm1",
      name: "Center Mid",
      number: 8,
      team: TEAMS.AWAY,
      position: "CM",
      fieldPosition: { x: 20, y: 65 }, // Up for set piece
    }),
    createPlayer({
      id: "ca_away_cm2",
      name: "Center Mid",
      number: 10,
      team: TEAMS.AWAY,
      position: "CM",
      fieldPosition: { x: 25, y: 45 }, // Up for set piece
    }),
    createPlayer({
      id: "ca_away_rw",
      name: "Right Winger",
      number: 7,
      team: TEAMS.AWAY,
      position: "RW",
      fieldPosition: { x: 18, y: 70 }, // Up for set piece
    }),
    createPlayer({
      id: "ca_away_lw",
      name: "Left Winger",
      number: 11,
      team: TEAMS.AWAY,
      position: "LW",
      fieldPosition: { x: 30, y: 25 }, // Up for set piece
    }),
    createPlayer({
      id: "ca_away_st",
      name: "Striker",
      number: 9,
      team: TEAMS.AWAY,
      position: "ST",
      fieldPosition: { x: 12, y: 50 }, // In box for set piece
    }),
  ];

  // Move 2: CDM drives forward, wingers start runs, striker drops
  const move2Players = [
    // HOME TEAM - Counter attack developing
    createPlayer({
      id: "ca_gk",
      name: "Goalkeeper",
      number: 1,
      team: TEAMS.HOME,
      position: "GK",
      fieldPosition: { x: 5, y: 50 },
    }),
    createPlayer({
      id: "ca_rb",
      name: "Right Back",
      number: 2,
      team: TEAMS.HOME,
      position: "RB",
      fieldPosition: { x: 25, y: 75 }, // Starting to support
    }),
    createPlayer({
      id: "ca_cb1",
      name: "Center Back",
      number: 4,
      team: TEAMS.HOME,
      position: "CB",
      fieldPosition: { x: 15, y: 60 },
    }),
    createPlayer({
      id: "ca_cb2",
      name: "Center Back",
      number: 5,
      team: TEAMS.HOME,
      position: "CB",
      fieldPosition: { x: 15, y: 40 },
    }),
    createPlayer({
      id: "ca_lb",
      name: "Left Back",
      number: 3,
      team: TEAMS.HOME,
      position: "LB",
      fieldPosition: { x: 25, y: 25 }, // Starting to support
    }),
    createPlayer({
      id: "ca_cdm",
      name: "Defensive Mid",
      number: 6,
      team: TEAMS.HOME,
      position: "CDM",
      fieldPosition: { x: 50, y: 50 }, // Advanced with ball
      isActivePlayer: true,
    }),
    createPlayer({
      id: "ca_cm1",
      name: "Center Mid",
      number: 8,
      team: TEAMS.HOME,
      position: "CM",
      fieldPosition: { x: 55, y: 35 }, // Supporting run
    }),
    createPlayer({
      id: "ca_cm2",
      name: "Center Mid",
      number: 10,
      team: TEAMS.HOME,
      position: "CM",
      fieldPosition: { x: 55, y: 65 }, // Supporting run
    }),
    createPlayer({
      id: "ca_rw",
      name: "Right Winger",
      number: 7,
      team: TEAMS.HOME,
      position: "RW",
      fieldPosition: { x: 70, y: 80 }, // Making run
    }),
    createPlayer({
      id: "ca_lw",
      name: "Left Winger",
      number: 11,
      team: TEAMS.HOME,
      position: "LW",
      fieldPosition: { x: 70, y: 20 }, // Making run
    }),
    createPlayer({
      id: "ca_st",
      name: "Striker",
      number: 9,
      team: TEAMS.HOME,
      position: "ST",
      fieldPosition: { x: 60, y: 50 }, // Dropped to receive
      isCorrectChoice: true, // Best link-up option
    }),

    // AWAY TEAM - Scrambling back
    createPlayer({
      id: "ca_away_gk",
      name: "Goalkeeper",
      number: 1,
      team: TEAMS.AWAY,
      position: "GK",
      fieldPosition: { x: 95, y: 50 },
    }),
    createPlayer({
      id: "ca_away_rb",
      name: "Right Back",
      number: 2,
      team: TEAMS.AWAY,
      position: "RB",
      fieldPosition: { x: 80, y: 75 },
    }),
    createPlayer({
      id: "ca_away_cb1",
      name: "Center Back",
      number: 4,
      team: TEAMS.AWAY,
      position: "CB",
      fieldPosition: { x: 85, y: 60 },
    }),
    createPlayer({
      id: "ca_away_cb2",
      name: "Center Back",
      number: 5,
      team: TEAMS.AWAY,
      position: "CB",
      fieldPosition: { x: 85, y: 40 },
    }),
    createPlayer({
      id: "ca_away_lb",
      name: "Left Back",
      number: 3,
      team: TEAMS.AWAY,
      position: "LB",
      fieldPosition: { x: 40, y: 35 }, // Running back
    }),
    createPlayer({
      id: "ca_away_cdm",
      name: "Defensive Mid",
      number: 6,
      team: TEAMS.AWAY,
      position: "CDM",
      fieldPosition: { x: 45, y: 55 }, // Running back
    }),
    createPlayer({
      id: "ca_away_cm1",
      name: "Center Mid",
      number: 8,
      team: TEAMS.AWAY,
      position: "CM",
      fieldPosition: { x: 40, y: 65 }, // Running back
    }),
    createPlayer({
      id: "ca_away_cm2",
      name: "Center Mid",
      number: 10,
      team: TEAMS.AWAY,
      position: "CM",
      fieldPosition: { x: 45, y: 45 }, // Running back
    }),
    createPlayer({
      id: "ca_away_rw",
      name: "Right Winger",
      number: 7,
      team: TEAMS.AWAY,
      position: "RW",
      fieldPosition: { x: 35, y: 70 }, // Running back
    }),
    createPlayer({
      id: "ca_away_lw",
      name: "Left Winger",
      number: 11,
      team: TEAMS.AWAY,
      position: "LW",
      fieldPosition: { x: 50, y: 25 }, // Running back
    }),
    createPlayer({
      id: "ca_away_st",
      name: "Striker",
      number: 9,
      team: TEAMS.AWAY,
      position: "ST",
      fieldPosition: { x: 35, y: 50 }, // Running back
    }),
  ];

  // Move 3: Striker plays through ball to winger making run
  const move3Players = [
    // HOME TEAM - Final phase of counter
    createPlayer({
      id: "ca_gk",
      name: "Goalkeeper",
      number: 1,
      team: TEAMS.HOME,
      position: "GK",
      fieldPosition: { x: 5, y: 50 },
    }),
    createPlayer({
      id: "ca_rb",
      name: "Right Back",
      number: 2,
      team: TEAMS.HOME,
      position: "RB",
      fieldPosition: { x: 30, y: 75 },
    }),
    createPlayer({
      id: "ca_cb1",
      name: "Center Back",
      number: 4,
      team: TEAMS.HOME,
      position: "CB",
      fieldPosition: { x: 20, y: 60 },
    }),
    createPlayer({
      id: "ca_cb2",
      name: "Center Back",
      number: 5,
      team: TEAMS.HOME,
      position: "CB",
      fieldPosition: { x: 20, y: 40 },
    }),
    createPlayer({
      id: "ca_lb",
      name: "Left Back",
      number: 3,
      team: TEAMS.HOME,
      position: "LB",
      fieldPosition: { x: 30, y: 25 },
    }),
    createPlayer({
      id: "ca_cdm",
      name: "Defensive Mid",
      number: 6,
      team: TEAMS.HOME,
      position: "CDM",
      fieldPosition: { x: 55, y: 50 }, // Advanced position
    }),
    createPlayer({
      id: "ca_cm1",
      name: "Center Mid",
      number: 8,
      team: TEAMS.HOME,
      position: "CM",
      fieldPosition: { x: 65, y: 35 },
    }),
    createPlayer({
      id: "ca_cm2",
      name: "Center Mid",
      number: 10,
      team: TEAMS.HOME,
      position: "CM",
      fieldPosition: { x: 65, y: 65 },
    }),
    createPlayer({
      id: "ca_rw",
      name: "Right Winger",
      number: 7,
      team: TEAMS.HOME,
      position: "RW",
      fieldPosition: { x: 80, y: 75 }, // Making run but not best option
    }),
    createPlayer({
      id: "ca_lw",
      name: "Left Winger",
      number: 11,
      team: TEAMS.HOME,
      position: "LW",
      fieldPosition: { x: 85, y: 25 }, // Behind defense, onside
      isCorrectChoice: true,
    }),
    createPlayer({
      id: "ca_st",
      name: "Striker",
      number: 9,
      team: TEAMS.HOME,
      position: "ST",
      fieldPosition: { x: 60, y: 50 }, // Has the ball
      isActivePlayer: true,
    }),

    // AWAY TEAM - Defense stretched
    createPlayer({
      id: "ca_away_gk",
      name: "Goalkeeper",
      number: 1,
      team: TEAMS.AWAY,
      position: "GK",
      fieldPosition: { x: 95, y: 50 },
    }),
    createPlayer({
      id: "ca_away_rb",
      name: "Right Back",
      number: 2,
      team: TEAMS.AWAY,
      position: "RB",
      fieldPosition: { x: 80, y: 75 }, // Covering right side
    }),
    createPlayer({
      id: "ca_away_cb1",
      name: "Center Back",
      number: 4,
      team: TEAMS.AWAY,
      position: "CB",
      fieldPosition: { x: 82, y: 55 }, // Slightly pulled wide
    }),
    createPlayer({
      id: "ca_away_cb2",
      name: "Center Back",
      number: 5,
      team: TEAMS.AWAY,
      position: "CB",
      fieldPosition: { x: 82, y: 45 }, // Central
    }),
    createPlayer({
      id: "ca_away_lb",
      name: "Left Back",
      number: 3,
      team: TEAMS.AWAY,
      position: "LB",
      fieldPosition: { x: 75, y: 30 }, // Caught out of position
    }),
    createPlayer({
      id: "ca_away_cdm",
      name: "Defensive Mid",
      number: 6,
      team: TEAMS.AWAY,
      position: "CDM",
      fieldPosition: { x: 70, y: 50 }, // Still recovering
    }),
    createPlayer({
      id: "ca_away_cm1",
      name: "Center Mid",
      number: 8,
      team: TEAMS.AWAY,
      position: "CM",
      fieldPosition: { x: 60, y: 60 },
    }),
    createPlayer({
      id: "ca_away_cm2",
      name: "Center Mid",
      number: 10,
      team: TEAMS.AWAY,
      position: "CM",
      fieldPosition: { x: 65, y: 40 },
    }),
    createPlayer({
      id: "ca_away_rw",
      name: "Right Winger",
      number: 7,
      team: TEAMS.AWAY,
      position: "RW",
      fieldPosition: { x: 55, y: 70 },
    }),
    createPlayer({
      id: "ca_away_lw",
      name: "Left Winger",
      number: 11,
      team: TEAMS.AWAY,
      position: "LW",
      fieldPosition: { x: 70, y: 30 },
    }),
    createPlayer({
      id: "ca_away_st",
      name: "Striker",
      number: 9,
      team: TEAMS.AWAY,
      position: "ST",
      fieldPosition: { x: 60, y: 50 },
    }),
  ];

  return createPuzzle({
    id: "counter_attack_chain",
    date: format(new Date(), "yyyy-MM-dd"),
    type: PUZZLE_TYPES.CHAIN,
    currentMoveIndex: 0,
    moves: [
      {
        question: "Win the Ball and Start the Counter",
        description:
          "Your center back has just won a header from the opponent's corner kick. Most of their team is caught upfield. Choose the best player to start a quick counter-attack.",
        players: move1Players,
        correctPlayerId: "ca_cdm",
        explanation:
          "The defensive midfielder is in the perfect position - in space, facing forward, and can drive the ball up the pitch quickly while the opposition is out of position.",
      },
      {
        question: "Drive the Counter Forward",
        description:
          "The defensive midfielder has advanced into the middle third with the ball. Your striker has dropped deep to offer support, while both wingers are making forward runs. Who should receive the ball to keep the counter flowing?",
        players: move2Players,
        correctPlayerId: "ca_st",
        explanation:
          "The striker dropping deep creates the perfect link-up opportunity. They can receive with their back to goal, hold up the ball, and either turn or play a quick pass to the advancing wingers.",
      },
      {
        question: "Execute the Final Pass",
        description:
          "The striker now has possession in a central position. The left winger has made a perfectly timed run behind the defense and is onside. The right winger is also making a run but is more heavily marked. Complete the counter-attack.",
        players: move3Players,
        correctPlayerId: "ca_lw",
        explanation:
          "The through ball to the left winger is the perfect choice. They've timed their run perfectly to stay onside, they're in behind the defense with space to run at goal, and the left back is still recovering from the set piece.",
      },
    ],
    difficulty: "medium",
  });
};

// Keep your existing single move puzzle
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

// Export all puzzles including the new chain puzzle
export const SAMPLE_PUZZLES = [buildUpPuzzle, createChainCounterAttackPuzzle()];

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
