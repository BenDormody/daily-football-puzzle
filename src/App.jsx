import React, { useState, useEffect } from "react";
import FootballPitch from "./components/FootballPitch.jsx";
import { getTodaysPuzzle } from "./data/puzzles.js";
import PuzzleSelector from "./components/PuzzleSelector.jsx";
import {
  validateAnswer,
  GAME_STATES,
  PUZZLE_TYPES,
  getNextMove,
  isChainComplete,
  getCurrentMove,
  calculatePlayerMovements,
} from "./data/types.js";
import { format } from "date-fns";
import "./styles/main.css";
import { createPlayer, createPuzzle, TEAMS, POSITIONS } from "./data/types.js";
import CreatorModeUI from "./components/CreatorMode/CreatorModeUI";

const App = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const [arrowColor, setArrowColor] = useState("blue");
  const [animateBall, setAnimateBall] = useState(false);
  const [ballPath, setBallPath] = useState(null);
  const [ballAnimating, setBallAnimating] = useState(false);

  // New states for chain puzzles
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [playerMovements, setPlayerMovements] = useState([]);
  const [animatingPlayers, setAnimatingPlayers] = useState(false);

  const [creatorMode, setCreatorMode] = useState(false);
  const [creatorPlayers, setCreatorPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("HOME");
  const [selectedPosition, setSelectedPosition] = useState("CB");
  const [nextPlayerNumber, setNextPlayerNumber] = useState({
    home: 1,
    away: 1,
  });
  const [creatorActivePlayer, setCreatorActivePlayer] = useState(null);
  const [creatorCorrectPlayer, setCreatorCorrectPlayer] = useState(null);
  const [puzzleMetadata, setPuzzleMetadata] = useState({
    question: "",
    description: "",
    explanation: "",
    difficulty: "medium",
    type: "pass",
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedCode, setExportedCode] = useState("");

  const AVAILABLE_POSITIONS = Object.keys(POSITIONS).map((key) => ({
    value: key,
    label: POSITIONS[key].name,
  }));

  // Distinguish click vs drag on the pitch when in creator mode
  const dragStateRef = React.useRef({ isDragging: false, downX: 0, downY: 0 });

  const handleCreatorPitchMouseDown = (event) => {
    if (!creatorMode) return;
    dragStateRef.current.downX = event.clientX;
    dragStateRef.current.downY = event.clientY;
    dragStateRef.current.isDragging = false;
  };

  const handleCreatorPitchMouseMove = (event) => {
    if (!creatorMode) return;
    const dx = Math.abs(event.clientX - dragStateRef.current.downX);
    const dy = Math.abs(event.clientY - dragStateRef.current.downY);
    const threshold = 5; // px threshold to consider as drag
    if (dx > threshold || dy > threshold) {
      dragStateRef.current.isDragging = true;
    }
  };

  const handleCreatorPitchMouseUp = (event) => {
    if (!creatorMode) return;
    // If a drag occurred (e.g., moving a player), do not create a new player
    if (dragStateRef.current.isDragging) {
      dragStateRef.current.isDragging = false;
      return;
    }

    const container = event.currentTarget.querySelector(".football-pitch-svg");
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    const playerNumber = nextPlayerNumber[selectedTeam.toLowerCase()];

    const newPlayer = createPlayer({
      id: `creator_${selectedTeam.toLowerCase()}_${Date.now()}`,
      name: `${POSITIONS[selectedPosition].name}`,
      number: playerNumber,
      team: TEAMS[selectedTeam],
      position: selectedPosition,
      fieldPosition: { x: clampedX, y: clampedY },
      isActivePlayer: false,
      isCorrectChoice: false,
    });

    setCreatorPlayers((prev) => [...prev, newPlayer]);
    setNextPlayerNumber((prev) => ({
      ...prev,
      [selectedTeam.toLowerCase()]: prev[selectedTeam.toLowerCase()] + 1,
    }));
  };

  // Function to remove a player
  const removeCreatorPlayer = (playerId) => {
    setCreatorPlayers((prev) => prev.filter((p) => p.id !== playerId));

    // Clear active/correct player if they were deleted
    if (creatorActivePlayer === playerId) setCreatorActivePlayer(null);
    if (creatorCorrectPlayer === playerId) setCreatorCorrectPlayer(null);
  };

  // Function to move a player
  const moveCreatorPlayer = (playerId, newPosition) => {
    setCreatorPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              position: { ...p.position, x: newPosition.x, y: newPosition.y },
            }
          : p
      )
    );
  };

  // Function to toggle active player
  const toggleActivePlayer = (playerId) => {
    setCreatorActivePlayer((prev) => (prev === playerId ? null : playerId));
    setCreatorPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        isActivePlayer: p.id === playerId ? !p.isActivePlayer : false,
      }))
    );
  };

  // Function to toggle correct player
  const toggleCorrectPlayer = (playerId) => {
    setCreatorCorrectPlayer((prev) => (prev === playerId ? null : playerId));
    setCreatorPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        isCorrectChoice: p.id === playerId ? !p.isCorrectChoice : false,
      }))
    );
  };

  // Function to clear all players
  const clearAllPlayers = () => {
    setCreatorPlayers([]);
    setCreatorActivePlayer(null);
    setCreatorCorrectPlayer(null);
    setNextPlayerNumber({ home: 1, away: 1 });
  };

  // Function to create template formations
  const createFormation = (formation) => {
    clearAllPlayers();

    const formations = {
      "4-4-2": {
        home: [
          { pos: "GK", x: 10, y: 50, num: 1 },
          { pos: "LB", x: 25, y: 25, num: 3 },
          { pos: "CB", x: 25, y: 40, num: 4 },
          { pos: "CB", x: 25, y: 60, num: 5 },
          { pos: "RB", x: 25, y: 75, num: 2 },
          { pos: "LM", x: 45, y: 25, num: 11 },
          { pos: "CM", x: 45, y: 42, num: 8 },
          { pos: "CM", x: 45, y: 58, num: 6 },
          { pos: "RM", x: 45, y: 75, num: 7 },
          { pos: "ST", x: 65, y: 42, num: 10 },
          { pos: "ST", x: 65, y: 58, num: 9 },
        ],
        away: [
          { pos: "GK", x: 90, y: 50, num: 1 },
          { pos: "RB", x: 75, y: 25, num: 2 },
          { pos: "CB", x: 75, y: 40, num: 4 },
          { pos: "CB", x: 75, y: 60, num: 5 },
          { pos: "LB", x: 75, y: 75, num: 3 },
          { pos: "RM", x: 55, y: 25, num: 7 },
          { pos: "CM", x: 55, y: 42, num: 6 },
          { pos: "CM", x: 55, y: 58, num: 8 },
          { pos: "LM", x: 55, y: 75, num: 11 },
          { pos: "ST", x: 35, y: 42, num: 9 },
          { pos: "ST", x: 35, y: 58, num: 10 },
        ],
      },
    };

    const formationData = formations[formation];
    if (!formationData) return;

    const newPlayers = [];

    ["home", "away"].forEach((team) => {
      formationData[team].forEach((playerData) => {
        const player = createPlayer({
          id: `creator_${team}_${playerData.num}`,
          name: POSITIONS[playerData.pos].name,
          number: playerData.num,
          team: TEAMS[team.toUpperCase()],
          position: playerData.pos,
          fieldPosition: { x: playerData.x, y: playerData.y },
          isActivePlayer: false,
          isCorrectChoice: false,
        });
        newPlayers.push(player);
      });
    });

    setCreatorPlayers(newPlayers);
    setNextPlayerNumber({ home: 12, away: 12 });
  };

  // Function to export puzzle
  const exportPuzzle = () => {
    if (
      !creatorActivePlayer ||
      !creatorCorrectPlayer ||
      creatorPlayers.length === 0
    ) {
      alert(
        "Please set at least one active player, one correct player, and add some players to the pitch."
      );
      return;
    }

    if (!puzzleMetadata.question.trim() || !puzzleMetadata.description.trim()) {
      alert("Please fill in the question and description fields.");
      return;
    }

    const puzzle = createPuzzle({
      id: `custom_puzzle_${Date.now()}`,
      date: format(new Date(), "yyyy-MM-dd"),
      question: puzzleMetadata.question,
      description: puzzleMetadata.description,
      type: puzzleMetadata.type,
      players: creatorPlayers,
      correctPlayerId: creatorCorrectPlayer,
      explanation: puzzleMetadata.explanation,
      difficulty: puzzleMetadata.difficulty,
    });

    const puzzleCode = `// Generated Puzzle - ${new Date().toLocaleString()}
export const customPuzzle = ${JSON.stringify(puzzle, null, 2)};

// To use this puzzle, import it and add it to your puzzles array:
// import { customPuzzle } from './path/to/this/file';`;

    setExportedCode(puzzleCode);
    setShowExportModal(true);
  };

  // Function to test the current puzzle
  const testPuzzle = () => {
    if (
      !creatorActivePlayer ||
      !creatorCorrectPlayer ||
      creatorPlayers.length === 0
    ) {
      alert(
        "Please set at least one active player, one correct player, and add some players to the pitch."
      );
      return;
    }

    const testPuzzle = createPuzzle({
      id: "test_puzzle",
      date: format(new Date(), "yyyy-MM-dd"),
      question: puzzleMetadata.question || "Test Puzzle",
      description: puzzleMetadata.description || "Test the puzzle you created",
      type: puzzleMetadata.type,
      players: creatorPlayers,
      correctPlayerId: creatorCorrectPlayer,
      explanation: puzzleMetadata.explanation || "This is a test puzzle.",
      difficulty: puzzleMetadata.difficulty,
    });

    setCurrentPuzzle(testPuzzle);
    setCreatorMode(false);
    resetPuzzleState();
  };

  const handlePuzzleChange = (puzzle) => {
    setCurrentPuzzle(puzzle);
    setShowSelector(false);
    resetPuzzleState();
  };

  const resetPuzzleState = () => {
    setSelectedPlayer(null);
    setGameState(GAME_STATES.PLAYING);
    setFeedback(null);
    setAttempts(0);
    setArrowColor("blue");
    setAnimateBall(false);
    setBallAnimating(false);
    setIsTransitioning(false);
    setPlayerMovements([]);
    setAnimatingPlayers(false);
  };

  // Load today's puzzle on component mount
  useEffect(() => {
    const todaysPuzzle = getTodaysPuzzle();
    setCurrentPuzzle(todaysPuzzle);

    // Check if user has already completed today's puzzle
    const savedProgress = localStorage.getItem(`puzzle_${todaysPuzzle.date}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      if (progress.completed) {
        setGameState(GAME_STATES.COMPLETED);
        const currentMove = getCurrentMove(todaysPuzzle);
        setSelectedPlayer({ id: currentMove.correctPlayerId });
        setFeedback({
          type: "success",
          message:
            "Puzzle already completed today! Come back tomorrow for a new challenge.",
          explanation: currentMove.explanation,
        });
        setAttempts(progress.attempts || 0);
        setArrowColor("green");
      }
    }
  }, []);

  const handlePlayerClick = (player) => {
    if (gameState !== GAME_STATES.PLAYING || isTransitioning) return;
    setSelectedPlayer(player);
    setArrowColor("blue");
  };

  // Export Modal Component
  const ExportModal = () =>
    showExportModal && (
      <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Generated Puzzle Code</h3>
            <button onClick={() => setShowExportModal(false)}>✕</button>
          </div>
          <div className="modal-body">
            <textarea
              value={exportedCode}
              readOnly
              style={{
                width: "100%",
                height: "400px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            />
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(exportedCode);
                  alert("Code copied to clipboard!");
                }}
              >
                Copy to Clipboard
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // Modify your existing FootballPitch component call to handle creator mode
  const PitchComponent = () => (
    <div
      className="football-pitch-wrapper"
      onMouseDown={creatorMode ? handleCreatorPitchMouseDown : undefined}
      onMouseMove={creatorMode ? handleCreatorPitchMouseMove : undefined}
      onMouseUp={creatorMode ? handleCreatorPitchMouseUp : undefined}
      style={{ cursor: creatorMode ? "crosshair" : "default" }}
    >
      <FootballPitch
        players={creatorMode ? creatorPlayers : currentMove?.players || []}
        selectedPlayer={selectedPlayer}
        onPlayerClick={
          creatorMode
            ? (player) => setSelectedPlayer(player) // still select
            : handlePlayerClick
        }
        onPlayerMove={creatorMode ? moveCreatorPlayer : undefined} // <-- NEW
        gameState={gameState}
        passLine={
          !creatorMode && currentPuzzle?.type === "pass" && selectedPlayer
        }
        arrowColor={arrowColor}
        animateBall={animateBall}
        ballPath={ballPath}
        ballAnimating={ballAnimating}
        playerMovements={playerMovements}
        animatingPlayers={animatingPlayers}
        isCreatorMode={creatorMode}
      />
    </div>
  );

  // Add this button to your header section
  const CreatorModeToggle = () => (
    <button
      onClick={() => {
        setCreatorMode(!creatorMode);
        if (!creatorMode) {
          // Entering creator mode
          setCreatorPlayers([]);
          setCreatorActivePlayer(null);
          setCreatorCorrectPlayer(null);
          setPuzzleMetadata({
            question: "",
            description: "",
            explanation: "",
            difficulty: "medium",
            type: "pass",
          });
        }
      }}
      className={`btn ${creatorMode ? "btn-danger" : "btn-secondary"}`}
    >
      {creatorMode ? "🛠️ Exit Creator" : "🛠️ Creator Mode"}
    </button>
  );
  const handleSubmitAnswer = async () => {
    if (!selectedPlayer || !currentPuzzle || isTransitioning) return;

    const isCorrect = validateAnswer(currentPuzzle, selectedPlayer.id);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Set arrow color based on correctness
    setArrowColor(isCorrect ? "green" : "red");

    if (isCorrect) {
      // Set up ball animation path
      const currentMove = getCurrentMove(currentPuzzle);
      const activePlayer = currentMove.players.find((p) => p.isActivePlayer);
      const correctPlayer = currentMove.players.find(
        (p) => p.id === selectedPlayer.id
      );

      setBallPath({
        from: activePlayer.position,
        to: correctPlayer.position,
      });

      // Start the ball animation
      setAnimateBall(true);
      setBallAnimating(true);

      // After ball animation completes
      setTimeout(async () => {
        setAnimateBall(false);
        setBallAnimating(false);

        // Check if this is a chain puzzle and not the last move
        if (
          currentPuzzle.type === PUZZLE_TYPES.CHAIN &&
          !isChainComplete(currentPuzzle)
        ) {
          await handleChainTransition();
        } else {
          // Complete the puzzle
          completePuzzle(newAttempts);
        }
      }, 1500); // Match ball animation duration
    } else {
      setFeedback({
        type: "error",
        message: `Not quite right. Try again! (Attempt ${newAttempts}/3)`,
        explanation:
          newAttempts >= 3 ? getCurrentMove(currentPuzzle).explanation : null,
      });

      if (newAttempts >= 3) {
        setGameState(GAME_STATES.COMPLETED);
        // Save failed attempt
        const progress = {
          completed: true,
          attempts: newAttempts,
          date: currentPuzzle.date,
          correct: false,
        };
        localStorage.setItem(
          `puzzle_${currentPuzzle.date}`,
          JSON.stringify(progress)
        );
      }
    }
  };

  const handleChainTransition = async () => {
    setIsTransitioning(true);
    setGameState(GAME_STATES.CHAIN_TRANSITION);

    // Get the next move
    const nextMove = getNextMove(currentPuzzle);

    if (nextMove) {
      // Calculate player movements
      const movements = calculatePlayerMovements(
        getCurrentMove(currentPuzzle).players,
        getCurrentMove(nextMove).players
      );

      setPlayerMovements(movements);

      // Show transition feedback
      setFeedback({
        type: "success",
        message: `Great! Move ${
          currentPuzzle.currentMoveIndex + 1
        } complete. Setting up next position...`,
        explanation: null,
      });

      // Animate player movements if any
      if (movements.length > 0) {
        setAnimatingPlayers(true);
        setTimeout(() => {
          setAnimatingPlayers(false);
          advanceToNextMove(nextMove);
        }, 2000); // Player movement animation duration
      } else {
        setTimeout(() => {
          advanceToNextMove(nextMove);
        }, 1500); // Short delay if no movements
      }
    }
  };

  const advanceToNextMove = (nextMove) => {
    // Update the puzzle state for the next move
    setCurrentPuzzle(nextMove);
    setSelectedPlayer(null);
    setArrowColor("blue");
    setFeedback(null);
    setGameState(GAME_STATES.PLAYING);
    setIsTransitioning(false);
    setPlayerMovements([]);
  };

  const completePuzzle = (attempts) => {
    setGameState(GAME_STATES.COMPLETED);
    const moveNumber =
      currentPuzzle.type === PUZZLE_TYPES.CHAIN
        ? `${currentPuzzle.currentMoveIndex + 1}/${currentPuzzle.moves.length}`
        : "1/1";

    setFeedback({
      type: "success",
      message:
        currentPuzzle.type === PUZZLE_TYPES.CHAIN
          ? `Excellent! You completed the entire sequence in ${attempts} total attempts!`
          : `Excellent! You got it in ${attempts} attempt${
              attempts > 1 ? "s" : ""
            }!`,
      explanation: getCurrentMove(currentPuzzle).explanation,
    });

    // Save progress to localStorage
    const progress = {
      completed: true,
      attempts: attempts,
      date: currentPuzzle.date,
      correct: true,
      chainCompleted: currentPuzzle.type === PUZZLE_TYPES.CHAIN,
    };
    localStorage.setItem(
      `puzzle_${currentPuzzle.date}`,
      JSON.stringify(progress)
    );
  };

  const handleTryAgain = () => {
    setSelectedPlayer(null);
    setFeedback(null);
    setArrowColor("blue");
    setAnimateBall(false);
    setBallAnimating(false);
  };

  const handleNewPuzzle = () => {
    const todaysPuzzle = getTodaysPuzzle();
    setCurrentPuzzle(todaysPuzzle);
    resetPuzzleState();
  };

  const resetPuzzle = () => {
    localStorage.removeItem(`puzzle_${currentPuzzle.date}`);
    // Reset to the beginning of chain puzzle if it's a chain
    if (currentPuzzle.type === PUZZLE_TYPES.CHAIN) {
      setCurrentPuzzle({
        ...currentPuzzle,
        currentMoveIndex: 0,
        players: currentPuzzle.moves[0].players,
        question: currentPuzzle.moves[0].question,
        description: currentPuzzle.moves[0].description,
        correctPlayerId: currentPuzzle.moves[0].correctPlayerId,
        explanation: currentPuzzle.moves[0].explanation,
      });
    }
    resetPuzzleState();
  };

  if (!currentPuzzle) {
    return (
      <div className="app">
        <div className="header">
          <h1>Daily Football Puzzle</h1>
          <p>Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  const currentMove = getCurrentMove(currentPuzzle);
  const progressText =
    currentPuzzle.type === PUZZLE_TYPES.CHAIN
      ? `Move ${currentPuzzle.currentMoveIndex + 1} of ${
          currentPuzzle.moves.length
        }`
      : null;

  return (
    <div className="app">
      <div className="header">
        <h1>⚽ Daily Football Puzzle</h1>
        <p>Test your tactical knowledge with daily football scenarios</p>
        <button onClick={() => setShowSelector((s) => !s)}>
          {showSelector ? "Close Puzzle Selector" : "Select Puzzle"}
        </button>

        {/* Add Creator Mode Toggle Button to header */}
        <CreatorModeToggle />
      </div>

      <PuzzleSelector
        currentPuzzle={currentPuzzle}
        onPuzzleChange={handlePuzzleChange}
        showSelector={showSelector}
      />

      {/* Show Creator Mode UI when active */}
      {creatorMode && (
        <CreatorModeUI
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          availablePositions={AVAILABLE_POSITIONS}
          createFormation={createFormation}
          clearAllPlayers={clearAllPlayers}
          nextPlayerNumber={nextPlayerNumber}
          puzzleMetadata={puzzleMetadata}
          setPuzzleMetadata={setPuzzleMetadata}
          creatorPlayers={creatorPlayers}
          creatorActivePlayer={creatorActivePlayer}
          creatorCorrectPlayer={creatorCorrectPlayer}
          toggleActivePlayer={toggleActivePlayer}
          toggleCorrectPlayer={toggleCorrectPlayer}
          removeCreatorPlayer={removeCreatorPlayer}
          testPuzzle={testPuzzle}
          exportPuzzle={exportPuzzle}
          setCreatorMode={setCreatorMode}
          PitchComponent={<PitchComponent />}
        />
      )}

      {!creatorMode && (
        <>
          <div className="daily-counter">
            <h3>Today's Challenge</h3>
            <div className="date">
              {format(new Date(), "EEEE, MMMM do, yyyy")}
            </div>
            {progressText && (
              <div className="chain-progress">
                <span className="progress-text">{progressText}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        ((currentPuzzle.currentMoveIndex + 1) /
                          currentPuzzle.moves.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="puzzle-container">
            <div className="puzzle-info">
              <h2 className="puzzle-question">
                {currentMove.question}
                {currentPuzzle.type === PUZZLE_TYPES.CHAIN && (
                  <span className="move-indicator">
                    {" "}
                    - Move {currentPuzzle.currentMoveIndex + 1}
                  </span>
                )}
              </h2>
              <p className="puzzle-description">{currentMove.description}</p>
              {attempts > 0 && (
                <div className="attempts-info">Attempts: {attempts}/3</div>
              )}
            </div>

            {/* Swap FootballPitch with PitchComponent to handle both modes */}
            <PitchComponent />

            <div className="controls">
              {gameState === GAME_STATES.PLAYING && !isTransitioning && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedPlayer}
                  >
                    {selectedPlayer
                      ? `Pass to ${selectedPlayer.name}`
                      : "Select a Player"}
                  </button>

                  {feedback && feedback.type === "error" && attempts < 3 && (
                    <button
                      className="btn btn-secondary"
                      onClick={handleTryAgain}
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}

              {gameState === GAME_STATES.CHAIN_TRANSITION && (
                <div className="transition-info">
                  <p>Moving to next position...</p>
                </div>
              )}

              <button
                className="btn"
                style={{
                  background: "#6b7280",
                  color: "white",
                  fontSize: "0.8rem",
                  padding: "8px 16px",
                }}
                onClick={resetPuzzle}
                disabled={isTransitioning}
              >
                🔄 Reset
              </button>

              {gameState === GAME_STATES.COMPLETED && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.location.reload()}
                  >
                    Refresh for Demo
                  </button>
                  <button className="btn btn-primary" onClick={resetPuzzle}>
                    Reset Puzzle (Test Mode)
                  </button>
                </>
              )}
            </div>

            {feedback && (
              <div className={`feedback ${feedback.type}`}>
                <div>{feedback.message}</div>
                {feedback.explanation && (
                  <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                    <strong>Explanation:</strong> {feedback.explanation}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="puzzle-container">
            <h3>How to Play</h3>
            <ul style={{ textAlign: "left", lineHeight: "1.8" }}>
              <li>Study the tactical situation on the football pitch</li>
              <li>Read the scenario description carefully</li>
              <li>Click on the player you think should receive the ball</li>
              <li>Submit your answer to see if you're correct</li>
              {currentPuzzle.type === PUZZLE_TYPES.CHAIN && (
                <li>
                  <strong>Chain Puzzles:</strong> Complete multiple moves in
                  sequence - each correct answer sets up the next tactical
                  situation
                </li>
              )}
              <li>Learn from the explanation regardless of your answer</li>
              <li>Come back tomorrow for a new challenge!</li>
            </ul>
          </div>
        </>
      )}

      {/* Export Modal */}
      <ExportModal />
    </div>
  );
};

export default App;
