import React from "react";

const CreatorPlayerList = ({
  creatorPlayers,
  creatorActivePlayer,
  creatorCorrectPlayer,
  toggleActivePlayer,
  toggleCorrectPlayer,
  removeCreatorPlayer,
}) => {
  return (
    <div className="creator-section">
      <h3>Player Management</h3>
      <div className="creator-players-list">
        {creatorPlayers.map((player) => (
          <div key={player.id} className="creator-player-item">
            <span className={`player-badge ${player.team}`}>
              {player.number} - {player.name}
            </span>

            <div className="creator-player-controls">
              <button
                className={`btn btn-sm ${
                  creatorActivePlayer === player.id
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
                onClick={() => toggleActivePlayer(player.id)}
                title="Set as active player (has the ball)"
              >
                ⚽
              </button>

              <button
                className={`btn btn-sm ${
                  creatorCorrectPlayer === player.id
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
                onClick={() => toggleCorrectPlayer(player.id)}
                title="Set as correct answer"
              >
                ✓
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeCreatorPlayer(player.id)}
                title="Remove player"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {creatorPlayers.length === 0 && (
        <p className="creator-hint">
          No players added yet. Click on the pitch to add players.
        </p>
      )}
    </div>
  );
};

export default CreatorPlayerList;
