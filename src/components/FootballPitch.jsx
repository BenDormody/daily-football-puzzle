import React from 'react';

// FIFA standard pitch dimensions (using 105m x 68m as middle of allowed range)
// Scale factor: 1m = 3.2 SVG units (105m * 3.2 = 336 SVG units width)
// Real dimensions -> SVG coordinates conversion:
// Length: 105m -> 336 units
// Width: 68m -> 217.6 units (rounded to 218)
// Scale: 3.2 units per meter

const PITCH_DIMENSIONS = {
  // Pitch dimensions
  length: 336,          // 105m
  width: 218,           // 68m
  scale: 3.2,           // SVG units per meter
  
  // Goal dimensions  
  goalWidth: 23.4,      // 7.32m
  goalHeight: 7.8,      // 2.44m
  
  // Penalty area (18-yard box)
  penaltyAreaWidth: 129.0,  // 40.3m (44 yards: 18yd + 8yd goal + 18yd)
  penaltyAreaLength: 52.8,  // 16.5m (18 yards)
  
  // Goal area (6-yard box)  
  goalAreaWidth: 58.6,     // 18.3m (20 yards: 6yd + 8yd goal + 6yd)
  goalAreaLength: 17.6,    // 5.5m (6 yards)
  
  // Circles and arcs
  centerCircleRadius: 29.3,  // 9.15m (10 yards)
  penaltyArcRadius: 29.3,    // 9.15m (10 yards)
  cornerArcRadius: 3.2,      // 1m (1 yard)
  
  // Distances
  penaltySpotDistance: 35.2, // 11m (12 yards)
  centerX: 168,              // Half of 336
  centerY: 109,              // Half of 218
};

const FootballPitch = ({ players, selectedPlayer, onPlayerClick, gameState }) => {
  const {
    length, width, goalWidth, goalHeight,
    penaltyAreaWidth, penaltyAreaLength,
    goalAreaWidth, goalAreaLength,
    centerCircleRadius, penaltyArcRadius, cornerArcRadius,
    penaltySpotDistance, centerX, centerY
  } = PITCH_DIMENSIONS;
  
  // Calculate key positions
  const goalY = (width - goalWidth) / 2;  // Goal vertical position
  const penaltyAreaY = (width - penaltyAreaWidth) / 2;  // Penalty area Y position
  const goalAreaY = (width - goalAreaWidth) / 2;  // Goal area Y position
  
  return (
    <div className="football-pitch-container">
      <svg
        className="football-pitch-svg"
        width={length}
        height={width}
        viewBox={`0 0 ${length} ${width}`}
        style={{ background: 'rgb(115, 133, 84)' }}
      >
        {/* Pitch boundary */}
        <rect 
          x="0" 
          y="0" 
          width={length} 
          height={width} 
          fill="rgb(115, 133, 84)" 
          stroke="white" 
          strokeWidth="2"
        />
        
        {/* Center line */}
        <line 
          x1={centerX} 
          y1="0" 
          x2={centerX} 
          y2={width} 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Center circle */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={centerCircleRadius} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Center spot */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="2" 
          fill="white" 
        />
        
        {/* Left penalty area (18-yard box) */}
        <rect 
          x="0" 
          y={penaltyAreaY} 
          width={penaltyAreaLength} 
          height={penaltyAreaWidth} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Left goal area (6-yard box) */}
        <rect 
          x="0" 
          y={goalAreaY} 
          width={goalAreaLength} 
          height={goalAreaWidth} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Left penalty spot */}
        <circle 
          cx={penaltySpotDistance} 
          cy={centerY} 
          r="1.5" 
          fill="white" 
        />
        
        {/* Left penalty arc (the "D") */}
        <path 
          d={`M ${penaltyAreaLength} ${centerY - Math.sqrt(penaltyArcRadius * penaltyArcRadius - (penaltyAreaLength - penaltySpotDistance) * (penaltyAreaLength - penaltySpotDistance))} A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 1 ${penaltyAreaLength} ${centerY + Math.sqrt(penaltyArcRadius * penaltyArcRadius - (penaltyAreaLength - penaltySpotDistance) * (penaltyAreaLength - penaltySpotDistance))}`}
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Right penalty area (18-yard box) */}
        <rect 
          x={length - penaltyAreaLength} 
          y={penaltyAreaY} 
          width={penaltyAreaLength} 
          height={penaltyAreaWidth} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Right goal area (6-yard box) */}
        <rect 
          x={length - goalAreaLength} 
          y={goalAreaY} 
          width={goalAreaLength} 
          height={goalAreaWidth} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Right penalty spot */}
        <circle 
          cx={length - penaltySpotDistance} 
          cy={centerY} 
          r="1.5" 
          fill="white" 
        />
        
        {/* Right penalty arc (the "D") */}
        <path 
          d={`M ${length - penaltyAreaLength} ${centerY - Math.sqrt(penaltyArcRadius * penaltyArcRadius - (penaltyAreaLength - penaltySpotDistance) * (penaltyAreaLength - penaltySpotDistance))} A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 0 ${length - penaltyAreaLength} ${centerY + Math.sqrt(penaltyArcRadius * penaltyArcRadius - (penaltyAreaLength - penaltySpotDistance) * (penaltyAreaLength - penaltySpotDistance))}`}
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Corner arcs */}
        <path 
          d={`M 0 ${cornerArcRadius} A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${cornerArcRadius} 0`} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        <path 
          d={`M ${length - cornerArcRadius} 0 A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${length} ${cornerArcRadius}`} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        <path 
          d={`M ${length} ${width - cornerArcRadius} A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${length - cornerArcRadius} ${width}`} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        <path 
          d={`M ${cornerArcRadius} ${width} A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 0 ${width - cornerArcRadius}`} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        
        {/* Goals */}
        <rect 
          x="-4" 
          y={goalY} 
          width="4" 
          height={goalWidth} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
        <rect 
          x={length} 
          y={goalY} 
          width="4" 
          height={goalWidth} 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
        />
      </svg>
      
      {/* Players positioned absolutely over the SVG */}
      {players && players.map(player => (
        <div
          key={player.id}
          className={`player ${player.team} ${selectedPlayer?.id === player.id ? 'selected' : ''} ${player.isActivePlayer ? 'active' : ''} ${gameState === 'answered' && player.isCorrectChoice ? 'correct' : ''}`}
          style={{
            position: 'absolute',
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
          {players && players.find(p => p.isCorrectChoice) && (
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
