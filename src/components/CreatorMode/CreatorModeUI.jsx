import React from "react";
import CreatorControls from "./CreatorControls";
import CreatorPlayerList from "./CreatorPlayerList";

const CreatorModeUI = ({
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
  creatorPlayers,
  creatorActivePlayer,
  creatorCorrectPlayer,
  toggleActivePlayer,
  toggleCorrectPlayer,
  removeCreatorPlayer,
  testPuzzle,
  exportPuzzle,
  setCreatorMode,
  PitchComponent,
}) => {
  return (
    <div className="creator-mode">
      <div className="creator-header">
        <h2>🛠️ Puzzle Creator Mode</h2>
        <button
          className="btn btn-secondary"
          onClick={() => setCreatorMode(false)}
        >
          Exit Creator Mode
        </button>
      </div>

      <div className="creator-controls">
        <CreatorControls
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          availablePositions={availablePositions}
          createFormation={createFormation}
          clearAllPlayers={clearAllPlayers}
          nextPlayerNumber={nextPlayerNumber}
          puzzleMetadata={puzzleMetadata}
          setPuzzleMetadata={setPuzzleMetadata}
        />

        <div className="creator-section">{PitchComponent}</div>

        <CreatorPlayerList
          creatorPlayers={creatorPlayers}
          creatorActivePlayer={creatorActivePlayer}
          creatorCorrectPlayer={creatorCorrectPlayer}
          toggleActivePlayer={toggleActivePlayer}
          toggleCorrectPlayer={toggleCorrectPlayer}
          removeCreatorPlayer={removeCreatorPlayer}
        />

        <div className="creator-section">
          <h3>Actions</h3>
          <div className="creator-row">
            <button className="btn btn-primary" onClick={testPuzzle}>
              🎮 Test Puzzle
            </button>
            <button className="btn btn-success" onClick={exportPuzzle}>
              📤 Export Code
            </button>
          </div>

          <div className="creator-status">
            <p>
              Active Player:{" "}
              {creatorActivePlayer
                ? creatorPlayers.find((p) => p.id === creatorActivePlayer)
                    ?.name || "None"
                : "None"}
            </p>
            <p>
              Correct Player:{" "}
              {creatorCorrectPlayer
                ? creatorPlayers.find((p) => p.id === creatorCorrectPlayer)
                    ?.name || "None"
                : "None"}
            </p>
            <p>Players: {creatorPlayers.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorModeUI;
