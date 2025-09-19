import React, { useState, useEffect } from "react";
import FootballPitch from "./components/FootballPitch.jsx";
import { getTodaysPuzzle } from "./data/puzzles.js";
import PuzzleSelector from "./components/PuzzleSelector.jsx";
import { validateAnswer, GAME_STATES } from "./data/types.js";
import { format } from "date-fns";
import "./styles/main.css";

const App = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showSelector, setShowSelector] = useState(false);

  const handlePuzzleChange = (puzzle) => {
    setCurrentPuzzle(puzzle);
    setShowSelector(false); // Optionally hide selector after selection
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
        setSelectedPlayer({ id: todaysPuzzle.correctPlayerId });
        setFeedback({
          type: "success",
          message:
            "Puzzle already completed today! Come back tomorrow for a new challenge.",
          explanation: todaysPuzzle.explanation,
        });
        setAttempts(progress.attempts || 0);
      }
    }
  }, []);

  const handlePlayerClick = (player) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    setSelectedPlayer(player);
  };

  const handleSubmitAnswer = () => {
    if (!selectedPlayer || !currentPuzzle) return;

    const isCorrect = validateAnswer(currentPuzzle, selectedPlayer.id);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      setGameState(GAME_STATES.COMPLETED);
      setFeedback({
        type: "success",
        message: `Excellent! You got it in ${newAttempts} attempt${
          newAttempts > 1 ? "s" : ""
        }!`,
        explanation: currentPuzzle.explanation,
      });

      // Save progress to localStorage
      const progress = {
        completed: true,
        attempts: newAttempts,
        date: currentPuzzle.date,
        correct: true,
      };
      localStorage.setItem(
        `puzzle_${currentPuzzle.date}`,
        JSON.stringify(progress)
      );
    } else {
      setFeedback({
        type: "error",
        message: `Not quite right. Try again! (Attempt ${newAttempts}/3)`,
        explanation: newAttempts >= 3 ? currentPuzzle.explanation : null,
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

  const handleTryAgain = () => {
    setSelectedPlayer(null);
    setFeedback(null);
  };

  const handleNewPuzzle = () => {
    // For demo purposes, cycle through puzzles
    const todaysPuzzle = getTodaysPuzzle();
    setCurrentPuzzle(todaysPuzzle);
    setSelectedPlayer(null);
    setGameState(GAME_STATES.PLAYING);
    setFeedback(null);
    setAttempts(0);
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

  return (
    <div className="app">
      <div className="header">
        <h1>⚽ Daily Football Puzzle</h1>
        <p>Test your tactical knowledge with daily football scenarios</p>
        <button onClick={() => setShowSelector((s) => !s)}>
          {showSelector ? "Close Puzzle Selector" : "Select Puzzle"}
        </button>
      </div>
      <PuzzleSelector
        currentPuzzle={currentPuzzle}
        onPuzzleChange={handlePuzzleChange}
        showSelector={showSelector}
      />
      <div className="daily-counter">
        <h3>Today's Challenge</h3>
        <div className="date">{format(new Date(), "EEEE, MMMM do, yyyy")}</div>
      </div>

      <div className="puzzle-container">
        <div className="puzzle-info">
          <h2 className="puzzle-question">{currentPuzzle.question}</h2>
          <p className="puzzle-description">{currentPuzzle.description}</p>
          {attempts > 0 && (
            <div className="attempts-info">Attempts: {attempts}/3</div>
          )}
        </div>

        <FootballPitch
          players={currentPuzzle.players}
          selectedPlayer={selectedPlayer}
          onPlayerClick={handlePlayerClick}
          gameState={gameState}
        />

        <div className="controls">
          {gameState === GAME_STATES.PLAYING && (
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
                <button className="btn btn-secondary" onClick={handleTryAgain}>
                  Try Again
                </button>
              )}
            </>
          )}

          {/* Development reset button - always available */}
          <button
            className="btn"
            style={{
              background: "#6b7280",
              color: "white",
              fontSize: "0.8rem",
              padding: "8px 16px",
            }}
            onClick={() => {
              localStorage.removeItem(`puzzle_${currentPuzzle.date}`);
              setSelectedPlayer(null);
              setGameState(GAME_STATES.PLAYING);
              setFeedback(null);
              setAttempts(0);
            }}
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
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Reset the puzzle for testing
                  localStorage.removeItem(`puzzle_${currentPuzzle.date}`);
                  setSelectedPlayer(null);
                  setGameState(GAME_STATES.PLAYING);
                  setFeedback(null);
                  setAttempts(0);
                }}
              >
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
          <li>Learn from the explanation regardless of your answer</li>
          <li>Come back tomorrow for a new challenge!</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
