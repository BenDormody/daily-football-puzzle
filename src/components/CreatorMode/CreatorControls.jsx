import React from "react";

const CreatorControls = ({
  selectedTeam,
  setSelectedTeam,
  selectedPosition,
  setSelectedPosition,
  availablePositions,
  createFormation,
  clearAllPlayers,
  nextPlayerNumber,
  puzzleMetadata,
  setPuzzleMetadata,
}) => {
  return (
    <>
      <div className="creator-section">
        <h3>Add Players</h3>
        <div className="creator-row">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="HOME">Home Team (Blue)</option>
            <option value="AWAY">Away Team (Red)</option>
          </select>

          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            {availablePositions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <div className="creator-row">
          <button
            className="btn btn-secondary"
            onClick={() => createFormation("4-4-2")}
          >
            Load 4-4-2 Formation
          </button>
          <button className="btn btn-secondary" onClick={clearAllPlayers}>
            Clear All Players
          </button>
        </div>

        <p className="creator-hint">
          Click on the pitch to add players. Next numbers: Home #
          {nextPlayerNumber.home}, Away #{nextPlayerNumber.away}
        </p>
      </div>

      <div className="creator-section">
        <h3>Puzzle Settings</h3>
        <div className="creator-row">
          <input
            type="text"
            placeholder="Puzzle Question"
            value={puzzleMetadata.question}
            onChange={(e) =>
              setPuzzleMetadata((prev) => ({
                ...prev,
                question: e.target.value,
              }))
            }
            style={{ flex: 1 }}
          />
        </div>

        <div className="creator-row">
          <textarea
            placeholder="Puzzle Description"
            value={puzzleMetadata.description}
            onChange={(e) =>
              setPuzzleMetadata((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            style={{ flex: 1, minHeight: "60px" }}
          />
        </div>

        <div className="creator-row">
          <textarea
            placeholder="Explanation (shown after answer)"
            value={puzzleMetadata.explanation}
            onChange={(e) =>
              setPuzzleMetadata((prev) => ({
                ...prev,
                explanation: e.target.value,
              }))
            }
            style={{ flex: 1, minHeight: "60px" }}
          />
        </div>

        <div className="creator-row">
          <select
            value={puzzleMetadata.type}
            onChange={(e) =>
              setPuzzleMetadata((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="pass">Pass</option>
            <option value="move">Movement</option>
            <option value="shot">Shot</option>
            <option value="defend">Defend</option>
            <option value="cross">Cross</option>
            <option value="through_ball">Through Ball</option>
          </select>

          <select
            value={puzzleMetadata.difficulty}
            onChange={(e) =>
              setPuzzleMetadata((prev) => ({
                ...prev,
                difficulty: e.target.value,
              }))
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default CreatorControls;
