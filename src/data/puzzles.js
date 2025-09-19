import { createPlayer, createPuzzle, TEAMS, PUZZLE_TYPES } from './types.js';
import { format } from 'date-fns';

// Sample puzzle 1: Counter-attack scenario - 11v11 realistic formations
const counterAttackPlayers = [
  // Home team (Blue) - 4-3-2-1 formation, attacking left to right
  createPlayer({
    id: 'home_gk',
    name: 'Martinez',
    number: 1,
    team: TEAMS.HOME,
    position: 'GK',
    fieldPosition: { x: 5, y: 50 }
  }),
  // Back 4
  createPlayer({
    id: 'home_lb',
    name: 'Shaw',
    number: 3,
    team: TEAMS.HOME,
    position: 'LB',
    fieldPosition: { x: 15, y: 20 }
  }),
  createPlayer({
    id: 'home_cb1',
    name: 'Silva',
    number: 4,
    team: TEAMS.HOME,
    position: 'CB',
    fieldPosition: { x: 12, y: 40 }
  }),
  createPlayer({
    id: 'home_cb2',
    name: 'Johnson',
    number: 5,
    team: TEAMS.HOME,
    position: 'CB',
    fieldPosition: { x: 12, y: 60 }
  }),
  createPlayer({
    id: 'home_rb',
    name: 'Walker',
    number: 2,
    team: TEAMS.HOME,
    position: 'RB',
    fieldPosition: { x: 15, y: 80 }
  }),
  // Midfield 3
  createPlayer({
    id: 'home_cdm',
    name: 'Casemiro',
    number: 6,
    team: TEAMS.HOME,
    position: 'CDM',
    fieldPosition: { x: 25, y: 50 }
  }),
  createPlayer({
    id: 'home_cm1',
    name: 'Rodriguez',
    number: 8,
    team: TEAMS.HOME,
    position: 'CM',
    fieldPosition: { x: 35, y: 35 },
    isActivePlayer: true // This player has the ball
  }),
  createPlayer({
    id: 'home_cm2',
    name: 'Fernandes',
    number: 18,
    team: TEAMS.HOME,
    position: 'CM',
    fieldPosition: { x: 35, y: 65 }
  }),
  // Front 3 (2 attacking midfielders + 1 striker)
  createPlayer({
    id: 'home_lam',
    name: 'Thompson',
    number: 11,
    team: TEAMS.HOME,
    position: 'LAM',
    fieldPosition: { x: 55, y: 25 },
    isCorrectChoice: true // This is the correct pass target
  }),
  createPlayer({
    id: 'home_ram',
    name: 'Sancho',
    number: 7,
    team: TEAMS.HOME,
    position: 'RAM',
    fieldPosition: { x: 55, y: 75 }
  }),
  createPlayer({
    id: 'home_st',
    name: 'Kane',
    number: 9,
    team: TEAMS.HOME,
    position: 'ST',
    fieldPosition: { x: 70, y: 50 }
  }),
  
  // Away team (Red) - 4-4-2 formation, defending right side
  createPlayer({
    id: 'away_gk',
    name: 'Alisson',
    number: 1,
    team: TEAMS.AWAY,
    position: 'GK',
    fieldPosition: { x: 95, y: 50 }
  }),
  // Back 4
  createPlayer({
    id: 'away_lb',
    name: 'Robertson',
    number: 26,
    team: TEAMS.AWAY,
    position: 'LB',
    fieldPosition: { x: 85, y: 25 }
  }),
  createPlayer({
    id: 'away_cb1',
    name: 'Van Dijk',
    number: 4,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 88, y: 40 }
  }),
  createPlayer({
    id: 'away_cb2',
    name: 'Matip',
    number: 32,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 88, y: 60 }
  }),
  createPlayer({
    id: 'away_rb',
    name: 'Alexander-Arnold',
    number: 66,
    team: TEAMS.AWAY,
    position: 'RB',
    fieldPosition: { x: 85, y: 75 }
  }),
  // Midfield 4 (caught high up the pitch)
  createPlayer({
    id: 'away_lm',
    name: 'Mane',
    number: 10,
    team: TEAMS.AWAY,
    position: 'LM',
    fieldPosition: { x: 65, y: 20 }
  }),
  createPlayer({
    id: 'away_cm1',
    name: 'Henderson',
    number: 14,
    team: TEAMS.AWAY,
    position: 'CM',
    fieldPosition: { x: 60, y: 40 }
  }),
  createPlayer({
    id: 'away_cm2',
    name: 'Fabinho',
    number: 3,
    team: TEAMS.AWAY,
    position: 'CM',
    fieldPosition: { x: 60, y: 60 }
  }),
  createPlayer({
    id: 'away_rm',
    name: 'Salah',
    number: 11,
    team: TEAMS.AWAY,
    position: 'RM',
    fieldPosition: { x: 65, y: 80 }
  }),
  // Front 2 (caught high up)
  createPlayer({
    id: 'away_st1',
    name: 'Firmino',
    number: 9,
    team: TEAMS.AWAY,
    position: 'ST',
    fieldPosition: { x: 45, y: 45 }
  }),
  createPlayer({
    id: 'away_st2',
    name: 'Jota',
    number: 20,
    team: TEAMS.AWAY,
    position: 'ST',
    fieldPosition: { x: 45, y: 55 }
  })
];

const counterAttackPuzzle = createPuzzle({
  id: 'counter_attack_1',
  date: format(new Date(), 'yyyy-MM-dd'),
  question: 'Perfect Counter-Attack Opportunity',
  description: 'Blue team (4-3-2-1) just won possession in midfield against Red team (4-4-2). The opposition forwards are caught high up the pitch. Rodriguez (8) has the ball - which teammate should receive the pass to launch the most effective counter-attack?',
  type: PUZZLE_TYPES.PASS,
  players: counterAttackPlayers,
  correctPlayerId: 'home_lam',
  correctAction: {
    type: 'pass',
    targetPlayerId: 'home_lam',
    coordinates: { x: 55, y: 25 }
  },
  explanation: 'Thompson (11) on the left attacking midfield position has space to run into behind the opposition midfield line. With Red\'s strikers caught high and their midfield not yet recovered, this pass creates a dangerous 3v4 counter-attack opportunity down the left flank.',
  difficulty: 'medium'
});

// Sample puzzle 2: Final third decision - 11v11 attacking scenario  
const penaltyBoxPlayers = [
  // Home team (Blue) - 4-2-3-1 formation attacking left to right
  createPlayer({
    id: 'home_gk2',
    name: 'De Gea',
    number: 1,
    team: TEAMS.HOME,
    position: 'GK',
    fieldPosition: { x: 5, y: 50 }
  }),
  // Back 4 (pushed higher due to attack)
  createPlayer({
    id: 'home_lb2',
    name: 'Zinchenko',
    number: 11,
    team: TEAMS.HOME,
    position: 'LB',
    fieldPosition: { x: 30, y: 15 }
  }),
  createPlayer({
    id: 'home_cb1_2',
    name: 'Stones',
    number: 5,
    team: TEAMS.HOME,
    position: 'CB',
    fieldPosition: { x: 25, y: 35 }
  }),
  createPlayer({
    id: 'home_cb2_2',
    name: 'Dias',
    number: 3,
    team: TEAMS.HOME,
    position: 'CB',
    fieldPosition: { x: 25, y: 65 }
  }),
  createPlayer({
    id: 'home_rb2',
    name: 'Cancelo',
    number: 27,
    team: TEAMS.HOME,
    position: 'RB',
    fieldPosition: { x: 30, y: 85 }
  }),
  // Double pivot
  createPlayer({
    id: 'home_cdm1',
    name: 'Rodri',
    number: 16,
    team: TEAMS.HOME,
    position: 'CDM',
    fieldPosition: { x: 40, y: 45 }
  }),
  createPlayer({
    id: 'home_cdm2',
    name: 'Gundogan',
    number: 8,
    team: TEAMS.HOME,
    position: 'CDM',
    fieldPosition: { x: 40, y: 55 }
  }),
  // Attacking midfield 3
  createPlayer({
    id: 'home_lw2',
    name: 'Grealish',
    number: 10,
    team: TEAMS.HOME,
    position: 'LW',
    fieldPosition: { x: 65, y: 25 }
  }),
  createPlayer({
    id: 'home_cam2',
    name: 'De Bruyne',
    number: 17,
    team: TEAMS.HOME,
    position: 'CAM',
    fieldPosition: { x: 75, y: 45 },
    isActivePlayer: true
  }),
  createPlayer({
    id: 'home_rw2',
    name: 'Mahrez',
    number: 26,
    team: TEAMS.HOME,
    position: 'RW',
    fieldPosition: { x: 65, y: 75 }
  }),
  // Striker
  createPlayer({
    id: 'home_st2',
    name: 'Haaland',
    number: 9,
    team: TEAMS.HOME,
    position: 'ST',
    fieldPosition: { x: 85, y: 55 },
    isCorrectChoice: true
  }),
  
  // Away team (Red) - 5-4-1 compact defensive formation
  createPlayer({
    id: 'away_gk2',
    name: 'Mendy',
    number: 16,
    team: TEAMS.AWAY,
    position: 'GK',
    fieldPosition: { x: 92, y: 50 }
  }),
  // Back 5
  createPlayer({
    id: 'away_lwb',
    name: 'Cucurella',
    number: 32,
    team: TEAMS.AWAY,
    position: 'LWB',
    fieldPosition: { x: 80, y: 20 }
  }),
  createPlayer({
    id: 'away_cb1_2',
    name: 'Chalobah',
    number: 14,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 85, y: 35 }
  }),
  createPlayer({
    id: 'away_cb2_2',
    name: 'Silva',
    number: 6,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 88, y: 50 }
  }),
  createPlayer({
    id: 'away_cb3',
    name: 'Koulibaly',
    number: 26,
    team: TEAMS.AWAY,
    position: 'CB',
    fieldPosition: { x: 85, y: 65 }
  }),
  createPlayer({
    id: 'away_rwb',
    name: 'James',
    number: 24,
    team: TEAMS.AWAY,
    position: 'RWB',
    fieldPosition: { x: 80, y: 80 }
  }),
  // Midfield 4
  createPlayer({
    id: 'away_lm2',
    name: 'Pulisic',
    number: 10,
    team: TEAMS.AWAY,
    position: 'LM',
    fieldPosition: { x: 60, y: 25 }
  }),
  createPlayer({
    id: 'away_cm1_2',
    name: 'Kovacic',
    number: 8,
    team: TEAMS.AWAY,
    position: 'CM',
    fieldPosition: { x: 70, y: 40 }
  }),
  createPlayer({
    id: 'away_cm2_2',
    name: 'Jorginho',
    number: 5,
    team: TEAMS.AWAY,
    position: 'CM',
    fieldPosition: { x: 70, y: 60 }
  }),
  createPlayer({
    id: 'away_rm2',
    name: 'Ziyech',
    number: 22,
    team: TEAMS.AWAY,
    position: 'RM',
    fieldPosition: { x: 60, y: 75 }
  }),
  // Striker
  createPlayer({
    id: 'away_st_2',
    name: 'Lukaku',
    number: 9,
    team: TEAMS.AWAY,
    position: 'ST',
    fieldPosition: { x: 45, y: 50 }
  })
];

const penaltyBoxPuzzle = createPuzzle({
  id: 'penalty_box_1',
  date: format(new Date(), 'yyyy-MM-dd'),
  question: 'Breaking Down the Defense',
  description: 'Blue team (4-2-3-1) is attacking against Red team\'s compact 5-4-1 defensive setup. De Bruyne (17) has the ball in the final third with several options. Red\'s defense is well-organized but there\'s one key weakness. Which pass creates the best goal-scoring opportunity?',
  type: PUZZLE_TYPES.PASS,
  players: penaltyBoxPlayers,
  correctPlayerId: 'home_st2',
  correctAction: {
    type: 'pass',
    targetPlayerId: 'home_st2',
    coordinates: { x: 85, y: 55 }
  },
  explanation: 'Haaland (9) is making a perfectly timed run between the center-backs, exploiting the half-yard of space between Silva and Chalobah. Despite the compact defense, this through-ball creates a 1v1 with the goalkeeper - the highest probability scoring chance.',
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