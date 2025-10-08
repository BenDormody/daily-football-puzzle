import React from "react";
import { validateAnswer } from "../data/types.js";

// FIFA standard pitch dimensions (using 105m x 68m as middle of allowed range)
// Scale factor: 1m = 3.2 SVG units (105m * 3.2 = 336 SVG units width)
// Real dimensions -> SVG coordinates conversion:
// Length: 105m -> 336 units
// Width: 68m -> 217.6 units (rounded to 218)
// Scale: 3.2 units per meter

const PITCH_DIMENSIONS = {
  // Pitch dimensions
  length: 336, // 105m
  width: 218, // 68m
  scale: 3.2, // SVG units per meter

  // Goal dimensions
  goalWidth: 23.4, // 7.32m
  goalHeight: 7.8, // 2.44m

  // Penalty area (18-yard box)
  penaltyAreaWidth: 129.0, // 40.3m (44 yards: 18yd + 8yd goal + 18yd)
  penaltyAreaLength: 52.8, // 16.5m (18 yards)

  // Goal area (6-yard box)
  goalAreaWidth: 58.6, // 18.3m (20 yards: 6yd + 8yd goal + 6yd)
  goalAreaLength: 17.6, // 5.5m (6 yards)

  // Circles and arcs
  centerCircleRadius: 29.3, // 9.15m (10 yards)
  penaltyArcRadius: 29.3, // 9.15m (10 yards)
  cornerArcRadius: 3.2, // 1m (1 yard)

  // Distances
  penaltySpotDistance: 35.2, // 11m (12 yards)
  centerX: 168, // Half of 336
  centerY: 109, // Half of 218
};

const FootballPitch = ({
  players,
  selectedPlayer,
  onPlayerClick,
  gameState,
  passLine,
  arrowColor = "blue",
  animateBall = false,
  ballPath = null,
  ballAnimating = false,
  playerMovements = [], // New prop for player movements
  animatingPlayers = false, // New prop to track player animation state
  isCreatorMode = false,
  onPlayerMove = null,
}) => {
  const {
    length,
    width,
    goalWidth,
    goalHeight,
    penaltyAreaWidth,
    penaltyAreaLength,
    goalAreaWidth,
    goalAreaLength,
    centerCircleRadius,
    penaltyArcRadius,
    cornerArcRadius,
    penaltySpotDistance,
    centerX,
    centerY,
  } = PITCH_DIMENSIONS;

  // Calculate key positions
  const goalY = (width - goalWidth) / 2; // Goal vertical position
  const penaltyAreaY = (width - penaltyAreaWidth) / 2; // Penalty area Y position
  const goalAreaY = (width - goalAreaWidth) / 2; // Goal area Y position

  // Helper function to get player movement animation for a specific player
  const getPlayerMovement = (playerId) => {
    return playerMovements.find((movement) => movement.playerId === playerId);
  };

  // Map arrow color to design tokens for consistency
  const arrowStroke =
    arrowColor === "green"
      ? "var(--color-success)"
      : arrowColor === "red"
      ? "var(--color-error)"
      : "var(--color-teal)";

  return (
    <div className="football-pitch-container">
      <svg
        className="football-pitch-svg"
        width={length}
        height={width}
        viewBox={`0 0 ${length} ${width}`}
        style={{ background: "rgb(115, 133, 84)" }}
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
        <circle cx={centerX} cy={centerY} r="2" fill="white" />

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
        <circle cx={penaltySpotDistance} cy={centerY} r="1.5" fill="white" />

        {/* Left penalty arc (the "D") */}
        <path
          d={`M ${penaltyAreaLength} ${
            centerY -
            Math.sqrt(
              penaltyArcRadius * penaltyArcRadius -
                (penaltyAreaLength - penaltySpotDistance) *
                  (penaltyAreaLength - penaltySpotDistance)
            )
          } A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 1 ${penaltyAreaLength} ${
            centerY +
            Math.sqrt(
              penaltyArcRadius * penaltyArcRadius -
                (penaltyAreaLength - penaltySpotDistance) *
                  (penaltyAreaLength - penaltySpotDistance)
            )
          }`}
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
          d={`M ${length - penaltyAreaLength} ${
            centerY -
            Math.sqrt(
              penaltyArcRadius * penaltyArcRadius -
                (penaltyAreaLength - penaltySpotDistance) *
                  (penaltyAreaLength - penaltySpotDistance)
            )
          } A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 0 ${
            length - penaltyAreaLength
          } ${
            centerY +
            Math.sqrt(
              penaltyArcRadius * penaltyArcRadius -
                (penaltyAreaLength - penaltySpotDistance) *
                  (penaltyAreaLength - penaltySpotDistance)
            )
          }`}
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
          d={`M ${
            length - cornerArcRadius
          } 0 A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${length} ${cornerArcRadius}`}
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d={`M ${length} ${
            width - cornerArcRadius
          } A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 ${
            length - cornerArcRadius
          } ${width}`}
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d={`M ${cornerArcRadius} ${width} A ${cornerArcRadius} ${cornerArcRadius} 0 0 1 0 ${
            width - cornerArcRadius
          }`}
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
      {players &&
        players.map((player) => {
          const movement = getPlayerMovement(player.id);
          const isMoving = animatingPlayers && movement;

          return (
            <div
              key={player.id}
              className={`player ${player.team} ${
                selectedPlayer?.id === player.id ? "selected" : ""
              } ${player.isActivePlayer ? "active" : ""} ${
                player.isActivePlayer && ballAnimating ? "ball-animating" : ""
              } ${
                player.isActivePlayer && gameState === "completed"
                  ? "game-completed"
                  : ""
              } ${
                gameState === "completed" &&
                selectedPlayer &&
                player.id === selectedPlayer.id
                  ? "correct"
                  : ""
              } ${isMoving ? "player-moving" : ""}`}
              style={{
                position: "absolute",
                left: `${player.position.x}%`,
                top: `${player.position.y}%`,
                transform: "translate(-50%, -50%)",
                ...(isMoving && {
                  "--move-start-x": `${movement.from.x}%`,
                  "--move-start-y": `${movement.from.y}%`,
                  "--move-end-x": `${movement.to.x}%`,
                  "--move-end-y": `${movement.to.y}%`,
                  animation: "playerMove 2s ease-in-out forwards",
                }),
                cursor: isCreatorMode ? "move" : "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onPlayerClick(player);
              }}
              onMouseDown={(e) => {
                if (isCreatorMode) e.stopPropagation();
              }}
              draggable={isCreatorMode}
              onDragStart={(e) => {
                if (isCreatorMode) e.stopPropagation();
              }}
              onDragEnd={(e) => {
                if (!isCreatorMode || !onPlayerMove) return;
                e.stopPropagation();
                const container = e.currentTarget.parentNode; // the .football-pitch-container div
                const rect = container.getBoundingClientRect();
                const newX = ((e.clientX - rect.left) / rect.width) * 100;
                const newY = ((e.clientY - rect.top) / rect.height) * 100;
                const clampedX = Math.max(0, Math.min(100, newX));
                const clampedY = Math.max(0, Math.min(100, newY));
                onPlayerMove(player.id, { x: clampedX, y: clampedY });
              }}
              title={`${player.name} - ${player.position.name}`}
            >
              {player.number}
            </div>
          );
        })}

      {/* Ball animation */}
      {animateBall && ballPath && (
        <div
          className="ball-animation animate"
          style={{
            position: "absolute",
            left: `${ballPath.from.x}%`,
            top: `${ballPath.from.y}%`,
            "--start-x": `${ballPath.from.x}%`,
            "--start-y": `${ballPath.from.y}%`,
            "--end-x": `${ballPath.to.x}%`,
            "--end-y": `${ballPath.to.y}%`,
          }}
        ></div>
      )}

      {/* Tactical arrows or movement indicators */}
      {passLine && (
        <svg
          className="tactical-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={arrowStroke} />
            </marker>
          </defs>

          {/* Draw line only if a player is selected */}
          {selectedPlayer &&
            (() => {
              const active = players.find((p) => p.isActivePlayer);
              const selected = players.find((p) => p.id === selectedPlayer.id);
              if (!active || !selected) return null;

              return (
                <line
                  x1={`${active.position.x}%`}
                  y1={`${active.position.y}%`}
                  x2={`${selected.position.x}%`}
                  y2={`${selected.position.y}%`}
                  stroke={arrowStroke}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd="url(#arrowhead)"
                />
              );
            })()}
        </svg>
      )}
    </div>
  );
};

export default FootballPitch;
