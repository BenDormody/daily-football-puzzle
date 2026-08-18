import React, { useState } from "react";
import { navigate } from "../router.js";
import { buildShareText } from "./shareText.js";

const ResultModal = ({ puzzle, state, url, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const solved = state.status === "solved";
  const mistakes = state.stepMistakes.reduce((a, b) => a + b, 0);
  const failedAt = state.stepMistakes.findLastIndex((m) => m > 0);

  const copyResult = async () => {
    const text = buildShareText({
      puzzle,
      stepMistakes: state.stepMistakes,
      solved,
      failedAt,
      url,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your result:", text);
    }
  };

  return (
    <div className="result-overlay">
      <div className="result-modal card">
        <div className="result-emoji">{solved ? "🎉" : "🧠"}</div>
        <h2 className="result-title">
          {solved
            ? mistakes === 0
              ? "Perfect read!"
              : "Solved!"
            : "Out of chances"}
        </h2>
        <p className="result-sub">
          {solved ? (
            mistakes === 0 ? (
              <>You read the whole play without a single mistake.</>
            ) : (
              <>
                You completed the play with {mistakes} mistake
                {mistakes > 1 ? "s" : ""}.
              </>
            )
          ) : (
            <>
              The full play was just shown on the pitch — study it and run
              it back.
            </>
          )}
        </p>

        <div className="result-squares">
          {puzzle.st.map((_, idx) => {
            let cls = "sq-unreached";
            if (solved || idx < failedAt)
              cls = state.stepMistakes[idx] === 0 ? "sq-clean" : "sq-messy";
            else if (idx === failedAt && !solved) cls = "sq-failed";
            return <span key={idx} className={`result-sq ${cls}`} />;
          })}
        </div>

        <div className="result-actions">
          <button className="btn btn-primary" onClick={copyResult}>
            {copied ? "Copied ✓" : "Copy result"}
          </button>
          <button className="btn btn-soft" onClick={onRetry}>
            ↺ Run it back
          </button>
        </div>
        <button
          className="link-btn result-create-link"
          onClick={() => navigate("#create")}
        >
          Create your own puzzle →
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
