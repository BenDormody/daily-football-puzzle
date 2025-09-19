import { createPlayer, createPuzzle, TEAMS, PUZZLE_TYPES } from './types.js';
import { format } from 'date-fns';

// Sample puzzle 1: Counter-attack scenario
const counterAttackPlayers = [
  // Home team (Blue) - defending, starting counter-attack
  createPlayer({
    id: 'home_gk',
    name: 'Martinez',
    number: 1,
    team: TEAMS.HOME,
    position: 'GK',
    fieldPosition: { x: 50, y: 95 }
  }),
  createPlayer({
    id: 'home_cb1',
    name: 'Silva',
    number: 4,
    team: TEAMS.HOME,
    position: 'CB',
    fieldPosition: { x: 35, y: 85 }
  }),
  createPlayer({
    id: 'home_cb2',
    name: 'Johnson',
    number: 5,
    team: TEAMS.HOME,
    position: 'CB',
    fieldPosition: { x: 65, y: 85 }
  }),
  createPlayer({
    id: 'home_cm',
    name: 'Rodriguez',
    number: 8,
    team: TEAMS.HOME,
    position: 'CM',
    fieldPosition: { x: 50, y: 65 },
    isActivePlayer: true // This player has the ball
  }),
  createPlayer({
    id: 'home_lw',
    name: 'Thompson',
    number: 11,
    team: TEAMS.HOME,
    position: 'LW',
    fieldPosition: { x: 20, y: 40 },
    isCorrectChoice: true // This is the correct pass target
  }),
  createPlayer({
    id: 'home_st',
    name: 'Wilson',
    number: 9,
    team: TEAMS.HOME,
    position: 'ST',
    fieldPosition: { x: 50, y: 25 }
  }),
  
  // Away team (Red) - caught out of position after losing possession
  createPlayer({
    id: 'away_cb1',
    name: 'Anderson',
    number: 3,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 40, y: 45 }
  }),
  createPlayer({
    id: 'away_cb2',
    name: 'Garcia',
    number: 6,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 60, y: 45 }
  }),
  createPlayer({
    id: 'away_cm1',
    name: 'Brown',
    number: 7,
    team: TEAMS.AWAY,
    position: 'CM',
    fieldPosition: { x: 65, y: 55 }
  }),
  createPlayer({
    id: 'away_cm2',
    name: 'Davis',
    number: 10,
    team: TEAMS.AWAY,
    position: 'CAM',
    fieldPosition: { x: 45, y: 50 }
  })
];

const counterAttackPuzzle = createPuzzle({
  id: 'counter_attack_1',
  date: format(new Date(), 'yyyy-MM-dd'),
  question: 'Perfect Counter-Attack Opportunity',
  description: 'Your team just won possession in midfield. The opposition is caught out of position after pushing forward. Which player should Rodriguez (8) pass to for the most effective counter-attack?',
  type: PUZZLE_TYPES.PASS,
  players: counterAttackPlayers,
  correctPlayerId: 'home_lw',
  correctAction: {
    type: 'pass',
    targetPlayerId: 'home_lw',
    coordinates: { x: 20, y: 40 }
  },
  explanation: 'Thompson (11) on the left wing is in acres of space with the opposition defenders pulled central. A pass to him allows for a dangerous counter-attack down the flank with numerical advantage.',
  difficulty: 'medium'
});

// Sample puzzle 2: Penalty box decision
const penaltyBoxPlayers = [
  // Home team attacking
  createPlayer({
    id: 'home_cam',
    name: 'Martinez',
    number: 10,
    team: TEAMS.HOME,
    position: 'CAM',
    fieldPosition: { x: 45, y: 25 },
    isActivePlayer: true
  }),
  createPlayer({
    id: 'home_st',
    name: 'Kane',
    number: 9,
    team: TEAMS.HOME,
    position: 'ST',
    fieldPosition: { x: 55, y: 15 },
    isCorrectChoice: true
  }),
  createPlayer({
    id: 'home_rw',
    name: 'Sterling',
    number: 7,
    team: TEAMS.HOME,
    position: 'RW',
    fieldPosition: { x: 80, y: 20 }
  }),
  createPlayer({
    id: 'home_lw',
    name: 'Rashford',
    number: 11,
    team: TEAMS.HOME,
    position: 'LW',
    fieldPosition: { x: 25, y: 20 }
  }),
  
  // Away team defending
  createPlayer({
    id: 'away_gk',
    name: 'Alisson',
    number: 1,
    team: TEAMS.AWAY,
    position: 'GK',
    fieldPosition: { x: 50, y: 8 }
  }),
  createPlayer({
    id: 'away_cb1',
    name: 'Van Dijk',
    number: 4,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 40, y: 18 }
  }),
  createPlayer({
    id: 'away_cb2',
    name: 'Matip',
    number: 5,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 65, y: 22 }
  }),
  createPlayer({
    id: 'away_lb',
    name: 'Robertson',
    number: 26,
    team: TEAMS.AWAY,
    position: 'LB',
    fieldPosition: { x: 20, y: 25 }
  })
];

const penaltyBoxPuzzle = createPuzzle({
  id: 'penalty_box_1',
  date: format(new Date(), 'yyyy-MM-dd'),
  question: 'Final Third Decision',
  description: 'Martinez (10) has the ball just outside the penalty area with multiple options. The defense is scrambling to reorganize. Who should receive the pass for the best scoring opportunity?',
  type: PUZZLE_TYPES.PASS,
  players: penaltyBoxPlayers,
  correctPlayerId: 'home_st',
  correctAction: {
    type: 'pass',
    targetPlayerId: 'home_st',
    coordinates: { x: 55, y: 15 }
  },
  explanation: 'Kane (9) is making a clever run between the center-backs, creating separation from Van Dijk. A well-timed pass would put him through on goal with only the keeper to beat.',
  difficulty: 'hard'
});

// Export all puzzles
export const SAMPLE_PUZZLES = [
  counterAttackPuzzle,
  penaltyBoxPuzzle
];

// Utility function to get today's puzzle
export const getTodaysPuzzle = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const puzzleIndex = dayOfYear % SAMPLE_PUZZLES.length;
  
  return {
    ...SAMPLE_PUZZLES[puzzleIndex],
    date: today
  };
};

export const getPuzzleById = (id) => {
  return SAMPLE_PUZZLES.find(puzzle => puzzle.id === id);
};