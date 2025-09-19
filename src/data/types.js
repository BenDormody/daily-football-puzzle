// Player positions and their typical field locations
export const POSITIONS = {
  GK: { name: 'Goalkeeper', abbreviation: 'GK' },
  CB: { name: 'Centre Back', abbreviation: 'CB' },
  LB: { name: 'Left Back', abbreviation: 'LB' },
  RB: { name: 'Right Back', abbreviation: 'RB' },
  CDM: { name: 'Defensive Midfielder', abbreviation: 'CDM' },
  CM: { name: 'Central Midfielder', abbreviation: 'CM' },
  CAM: { name: 'Attacking Midfielder', abbreviation: 'CAM' },
  LM: { name: 'Left Midfielder', abbreviation: 'LM' },
  RM: { name: 'Right Midfielder', abbreviation: 'RM' },
  LW: { name: 'Left Winger', abbreviation: 'LW' },
  RW: { name: 'Right Winger', abbreviation: 'RW' },
  CF: { name: 'Centre Forward', abbreviation: 'CF' },
  ST: { name: 'Striker', abbreviation: 'ST' }
};

// Team types
export const TEAMS = {
  HOME: 'home',
  AWAY: 'away'
};

// Puzzle types
export const PUZZLE_TYPES = {
  PASS: 'pass',
  MOVE: 'move',
  SHOT: 'shot',
  DEFEND: 'defend',
  CROSS: 'cross',
  THROUGH_BALL: 'through_ball'
};

// Game states
export const GAME_STATES = {
  PLAYING: 'playing',
  ANSWERED: 'answered',
  COMPLETED: 'completed'
};

// Factory functions for creating game objects
export const createPlayer = ({
  id,
  name,
  number,
  team,
  position,
  fieldPosition,
  isCorrectChoice = false,
  isActivePlayer = false
}) => ({
  id,
  name,
  number,
  team, // 'home' or 'away'
  position: {
    ...POSITIONS[position],
    x: fieldPosition.x, // percentage from left
    y: fieldPosition.y  // percentage from top
  },
  isCorrectChoice,
  isActivePlayer
});

export const createPuzzle = ({
  id,
  date,
  question,
  description,
  type,
  players,
  correctPlayerId,
  correctAction,
  explanation,
  difficulty = 'medium'
}) => ({
  id,
  date,
  question,
  description,
  type,
  players,
  correctPlayerId,
  correctAction, // { type: 'pass', targetPlayerId: 'player_2', coordinates: { x: 70, y: 30 } }
  explanation,
  difficulty, // 'easy', 'medium', 'hard'
  completed: false,
  userAnswer: null,
  attempts: 0
});

// Utility functions
export const getPlayerById = (players, id) => {
  return players.find(player => player.id === id);
};

export const getCorrectPlayer = (puzzle) => {
  return puzzle.players.find(player => player.id === puzzle.correctPlayerId);
};

export const validateAnswer = (puzzle, selectedPlayerId, selectedAction) => {
  if (!selectedPlayerId) return false;
  
  const isCorrectPlayer = selectedPlayerId === puzzle.correctPlayerId;
  
  // For now, we'll just check the player selection
  // Later we can add action validation
  return isCorrectPlayer;
};