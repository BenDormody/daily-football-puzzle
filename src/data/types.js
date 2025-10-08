// Enhanced types.js with support for chained puzzles - compatible with existing structure

// Player positions and their typical field locations
export const POSITIONS = {
  GK: { name: "Goalkeeper", abbreviation: "GK" },
  CB: { name: "Centre Back", abbreviation: "CB" },
  LB: { name: "Left Back", abbreviation: "LB" },
  RB: { name: "Right Back", abbreviation: "RB" },
  CDM: { name: "Defensive Midfielder", abbreviation: "CDM" },
  CM: { name: "Central Midfielder", abbreviation: "CM" },
  CAM: { name: "Attacking Midfielder", abbreviation: "CAM" },
  LM: { name: "Left Midfielder", abbreviation: "LM" },
  RM: { name: "Right Midfielder", abbreviation: "RM" },
  LW: { name: "Left Winger", abbreviation: "LW" },
  RW: { name: "Right Winger", abbreviation: "RW" },
  CF: { name: "Centre Forward", abbreviation: "CF" },
  ST: { name: "Striker", abbreviation: "ST" },
};

// Team types
export const TEAMS = {
  HOME: "home",
  AWAY: "away",
};

// Enhanced puzzle types with chain support
export const PUZZLE_TYPES = {
  PASS: "pass",
  MOVE: "move",
  SHOT: "shot",
  DEFEND: "defend",
  CROSS: "cross",
  THROUGH_BALL: "through_ball",
  // New chain puzzle type
  CHAIN: "chain",
};

// Enhanced game states with chain transition
export const GAME_STATES = {
  PLAYING: "playing",
  ANSWERED: "answered",
  COMPLETED: "completed",
  CHAIN_TRANSITION: "chain_transition",
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
  isActivePlayer = false,
}) => ({
  id,
  name,
  number,
  team, // 'home' or 'away'
  position: {
    ...POSITIONS[position],
    x: fieldPosition.x, // percentage from left
    y: fieldPosition.y, // percentage from top
  },
  isCorrectChoice,
  isActivePlayer,
});

// Enhanced createPuzzle with chain support
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
  difficulty = "medium",
  // New properties for chain puzzles
  moves = null,
  currentMoveIndex = 0,
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
  attempts: 0,
  // Chain puzzle properties
  moves,
  currentMoveIndex,
});

// Utility functions
export const getPlayerById = (players, id) => {
  return players.find((player) => player.id === id);
};

export const getCorrectPlayer = (puzzle) => {
  const currentMove = getCurrentMove(puzzle);
  return currentMove.players.find(
    (player) => player.id === currentMove.correctPlayerId
  );
};

export const validateAnswer = (puzzle, selectedPlayerId, selectedAction) => {
  if (!selectedPlayerId) return false;
  const currentMove = getCurrentMove(puzzle);
  const isCorrectPlayer = selectedPlayerId === currentMove.correctPlayerId;
  // For now, we'll just check the player selection
  // Later we can add action validation
  return isCorrectPlayer;
};

// New chain puzzle utility functions
export const getNextMove = (puzzle) => {
  if (puzzle.type !== PUZZLE_TYPES.CHAIN) return null;

  const nextIndex = puzzle.currentMoveIndex + 1;
  if (nextIndex >= puzzle.moves.length) return null;

  return {
    ...puzzle,
    currentMoveIndex: nextIndex,
    players: puzzle.moves[nextIndex].players,
    question: puzzle.moves[nextIndex].question,
    description: puzzle.moves[nextIndex].description,
    correctPlayerId: puzzle.moves[nextIndex].correctPlayerId,
    explanation: puzzle.moves[nextIndex].explanation,
    correctAction:
      puzzle.moves[nextIndex].correctAction || puzzle.correctAction,
  };
};

export const isChainComplete = (puzzle) => {
  if (puzzle.type !== PUZZLE_TYPES.CHAIN) return true;
  return puzzle.currentMoveIndex >= puzzle.moves.length - 1;
};

export const getCurrentMove = (puzzle) => {
  if (puzzle.type !== PUZZLE_TYPES.CHAIN) return puzzle;
  return {
    ...puzzle,
    ...puzzle.moves[puzzle.currentMoveIndex],
    players: puzzle.moves[puzzle.currentMoveIndex].players,
  };
};

// Helper function to create player movement animations
export const calculatePlayerMovements = (fromPlayers, toPlayers) => {
  const movements = [];

  fromPlayers.forEach((fromPlayer) => {
    const toPlayer = toPlayers.find((p) => p.id === fromPlayer.id);
    if (
      toPlayer &&
      (fromPlayer.position.x !== toPlayer.position.x ||
        fromPlayer.position.y !== toPlayer.position.y)
    ) {
      movements.push({
        playerId: fromPlayer.id,
        from: fromPlayer.position,
        to: toPlayer.position,
      });
    }
  });

  return movements;
};

// Helper function to create a chain move
export const createChainMove = ({
  question,
  description,
  players,
  correctPlayerId,
  correctAction,
  explanation,
}) => ({
  question,
  description,
  players,
  correctPlayerId,
  correctAction,
  explanation,
});
