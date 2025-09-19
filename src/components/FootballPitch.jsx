import React from 'react';

const FootballPitch = ({ players, selectedPlayer, onPlayerClick, gameState }) => {
  return (
    <div className="football-pitch">
      {/* Pitch lines and markings */}
      <div className="pitch-lines">
        <div className="center-line"></div>
        <div className="center-circle"></div>
        <div className="penalty-area home"></div>
        <div className="penalty-area away"></div>
        <div className="goal-area home"></div>
        <div className="goal-area away"></div>
      </div>
      
      {/* Players */}
      {players.map(player => (
        <div
          key={player.id}
          className={`player ${player.team} ${selectedPlayer?.id === player.id ? 'selected' : ''} ${player.isActivePlayer ? 'active' : ''} ${gameState === 'answered' && player.isCorrectChoice ? 'correct' : ''}`}
          style={{
            left: `${player.position.x}%`,
            top: `${player.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => onPlayerClick(player)}
          title={`${player.name} - ${player.position.name}`}
        >
          {player.number}
        </div>
      ))}
      
      {/* Tactical arrows or movement indicators */}
      {gameState === 'answered' && (
        <svg className="tactical-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {/* This will show the correct move/pass after answer is revealed */}
          {players.find(p => p.isCorrectChoice) && (
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
               refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
              </marker>
            </defs>
          )}
        </svg>
      )}
    </div>
  );
};

export default FootballPitch;