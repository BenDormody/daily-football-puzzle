import React, { useMemo } from "react";
import { navigate } from "../router.js";
import { demoPuzzle } from "./demoPuzzle.js";
import { encodePuzzle } from "../schema/codec.js";
import { stateAtStep, ballPosition } from "../engine/sequence.js";
import { toPct } from "../pitch/coords.js";
import { usePortraitPitch } from "../pitch/useOrientation.js";
import PitchStage from "../pitch/PitchStage.jsx";
import PlayerChip from "../pitch/PlayerChip.jsx";
import Ball from "../pitch/Ball.jsx";

const HomeScreen = () => {
  const portrait = usePortraitPitch();
  const puzzle = useMemo(demoPuzzle, []);
  const demoState = useMemo(() => stateAtStep(puzzle, 1), [puzzle]);

  const arrows = useMemo(() => {
    const from = demoState.positions.get(demoState.ballId);
    const step = puzzle.st[1];
    return [
      {
        kind: "dribble",
        from: toPct(from, portrait),
        to: toPct({ x: step.x, y: step.y }, portrait),
        color: "white",
      },
      {
        kind: "run",
        from: toPct(demoState.positions.get(9), portrait),
        to: toPct(step.r[0], portrait),
        color: "white",
        faded: true,
      },
    ];
  }, [demoState, puzzle, portrait]);

  return (
    <div className="screen">
      <div className="topbar">
        <a className="brand" href="#">
          <span className="brand-badge">⚽</span> Pitch Puzzle
        </a>
        <div className="topbar-actions">
          <button
            className="btn btn-ghost"
            onClick={() => navigate(`#p=${encodePuzzle(puzzle)}`)}
          >
            Try the demo
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("#create")}
          >
            Create a puzzle
          </button>
        </div>
      </div>

      <main className="home-main container">
        <section className="hero">
          <h1 className="hero-title">
            Turn your tactics into puzzles your players will actually do.
          </h1>
          <p className="hero-sub">
            Set up the pitch, record the right sequence of passes, dribbles
            and runs, then share a single link. No accounts, no apps — the
            whole puzzle lives inside the link.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("#create")}
            >
              Create a puzzle
            </button>
            <button
              className="btn btn-soft btn-lg"
              onClick={() => navigate(`#p=${encodePuzzle(puzzle)}`)}
            >
              ▶ Try the demo
            </button>
          </div>
        </section>

        <section className="hero-pitch">
          <PitchStage portrait={portrait} arrows={arrows}>
            {puzzle.pl.map((player) => (
              <PlayerChip
                key={player.i}
                player={player}
                screen={toPct(demoState.positions.get(player.i), portrait)}
                carrier={player.i === demoState.ballId}
              />
            ))}
            <Ball screen={toPct(ballPosition(demoState), portrait)} />
          </PitchStage>
        </section>

        <section className="how-it-works">
          <div className="how-card card">
            <div className="how-num">1</div>
            <h3>Set the scene</h3>
            <p>
              Drop players onto the pitch with formation templates or one tap
              at a time, then give one of them the ball.
            </p>
          </div>
          <div className="how-card card">
            <div className="how-num">2</div>
            <h3>Record the right play</h3>
            <p>
              Click receivers to record passes, drag the ball carrier to
              dribble, drag teammates to add off-ball runs.
            </p>
          </div>
          <div className="how-card card">
            <div className="how-num">3</div>
            <h3>Share one link</h3>
            <p>
              The entire puzzle is compressed into the link itself — no
              database, no sign-up. Your players just tap and solve.
            </p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        Built for coaches. Works on any phone. Free forever.
      </footer>
    </div>
  );
};

export default HomeScreen;
