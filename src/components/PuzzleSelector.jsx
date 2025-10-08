import React from "react";
import { SAMPLE_PUZZLES } from "../data/puzzles.js";
import { PUZZLE_TYPES, getCurrentMove } from "../data/types.js";

const PuzzleSelector = ({ currentPuzzle, onPuzzleChange, showSelector }) => {
  if (!showSelector) return null;

  const getPuzzleTypeLabel = (puzzle) => {
    const typeLabels = {
      pass: "🎯 Pass",
      move: "🏃 Move",
      shot: "⚽ Shot",
      defend: "🛡️ Defend",
      cross: "↗️ Cross",
      through_ball: "🔥 Through Ball",
    };

    if (puzzle.type === PUZZLE_TYPES.CHAIN) {
      return `🔗 Chain (${puzzle.moves?.length || 0} moves)`;
    }

    return typeLabels[puzzle.type] || puzzle.type;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "#10b981",
      medium: "#f59e0b",
      hard: "#ef4444",
    };
    return colors[difficulty] || "#6b7280";
  };

  const getPuzzleDescription = (puzzle) => {
    if (puzzle.type === PUZZLE_TYPES.CHAIN) {
      return (
        puzzle.moves?.[0]?.description ||
        `A ${puzzle.moves?.length || 0}-move tactical sequence`
      );
    }
    return puzzle.description || "No description available";
  };

  const handlePuzzleSelect = (puzzle) => {
    // Reset chain puzzles to the beginning
    if (puzzle.type === PUZZLE_TYPES.CHAIN) {
      const resetPuzzle = {
        ...puzzle,
        currentMoveIndex: 0,
        players: puzzle.moves[0].players,
        question: puzzle.moves[0].question,
        description: puzzle.moves[0].description,
        correctPlayerId: puzzle.moves[0].correctPlayerId,
        explanation: puzzle.moves[0].explanation,
      };
      onPuzzleChange(resetPuzzle);
    } else {
      onPuzzleChange(puzzle);
    }
  };

  const getPlayerCount = (puzzle) => {
    if (puzzle.type === PUZZLE_TYPES.CHAIN) {
      return puzzle.moves?.[0]?.players?.length || 0;
    }
    return puzzle.players?.length || 0;
  };

  return (
    <div className="puzzle-selector">
      <h3>🧪 Test Mode - Select Puzzle</h3>
      <div className="puzzle-grid">
        {SAMPLE_PUZZLES.map((puzzle, index) => (
          <button
            key={puzzle.id}
            className={`puzzle-card ${
              currentPuzzle?.id === puzzle.id ? "active" : ""
            }`}
            onClick={() => handlePuzzleSelect(puzzle)}
          >
            <div className="puzzle-header">
              <span className="puzzle-type">{getPuzzleTypeLabel(puzzle)}</span>
              <span
                className="puzzle-difficulty"
                style={{ color: getDifficultyColor(puzzle.difficulty) }}
              >
                {puzzle.difficulty?.toUpperCase() || "MEDIUM"}
              </span>
            </div>
            <h4 className="puzzle-title">{puzzle.question}</h4>
            <p className="puzzle-preview">
              {getPuzzleDescription(puzzle).substring(0, 100)}...
            </p>
            <div className="puzzle-meta">
              <span>{getPlayerCount(puzzle)} players</span>
              {puzzle.type === PUZZLE_TYPES.CHAIN && (
                <span>{puzzle.moves?.length || 0} moves</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PuzzleSelector;
