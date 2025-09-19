import React from "react";
import { SAMPLE_PUZZLES } from "../data/puzzles.js";

const PuzzleSelector = ({ currentPuzzle, onPuzzleChange, showSelector }) => {
  if (!showSelector) return null;

  const getPuzzleTypeLabel = (type) => {
    const typeLabels = {
      pass: "🎯 Pass",
      move: "🏃 Move",
      shot: "⚽ Shot",
      defend: "🛡️ Defend",
      cross: "↗️ Cross",
      through_ball: "🔥 Through Ball",
    };
    return typeLabels[type] || type;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "#10b981",
      medium: "#f59e0b",
      hard: "#ef4444",
    };
    return colors[difficulty] || "#6b7280";
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
            onClick={() => onPuzzleChange(puzzle)}
          >
            <div className="puzzle-header">
              <span className="puzzle-type">
                {getPuzzleTypeLabel(puzzle.type)}
              </span>
              <span
                className="puzzle-difficulty"
                style={{ color: getDifficultyColor(puzzle.difficulty) }}
              >
                {puzzle.difficulty.toUpperCase()}
              </span>
            </div>
            <h4 className="puzzle-title">{puzzle.question}</h4>
            <p className="puzzle-preview">
              {puzzle.description.substring(0, 100)}...
            </p>
            <div className="puzzle-meta">
              <span>{puzzle.players.length} players</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PuzzleSelector;
