import React, { useMemo, useState } from "react";
import { navigate } from "../router.js";
import { encodePuzzle } from "../schema/codec.js";
import { validatePuzzle } from "../schema/puzzle.js";
import { quantizePuzzle } from "../schema/codec.js";

const SharePanel = ({ state, dispatch, puzzle, onBack }) => {
  const [copied, setCopied] = useState(false);

  const { url, blob, error } = useMemo(() => {
    const finalPuzzle = {
      ...puzzle,
      t: puzzle.t.trim() || "Tactics puzzle",
    };
    const check = validatePuzzle(quantizePuzzle(finalPuzzle));
    if (!check.ok) return { error: check.error };
    const encoded = encodePuzzle(finalPuzzle);
    const base =
      window.location.origin +
      window.location.pathname +
      window.location.search;
    return { url: `${base}#p=${encoded}`, blob: encoded };
  }, [puzzle]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy the link:", url);
    }
  };

  return (
    <div className="panel card">
      <h3 className="panel-title">Share it</h3>

      <div className="panel-section">
        <div className="panel-label">Title</div>
        <input
          className="input"
          type="text"
          placeholder="e.g. Break the press"
          maxLength={60}
          value={state.meta.t}
          onChange={(e) =>
            dispatch({ type: "updateMeta", patch: { t: e.target.value } })
          }
        />
      </div>

      <div className="panel-section">
        <div className="panel-label">
          Your name <span className="panel-label-soft">(optional)</span>
        </div>
        <input
          className="input"
          type="text"
          placeholder="Coach Ben"
          maxLength={40}
          value={state.meta.a}
          onChange={(e) =>
            dispatch({ type: "updateMeta", patch: { a: e.target.value } })
          }
        />
      </div>

      <div className="panel-section">
        <div className="panel-label">
          Scenario <span className="panel-label-soft">(optional intro)</span>
        </div>
        <textarea
          className="input"
          rows={2}
          placeholder="We've just won the ball at the back…"
          maxLength={240}
          value={state.meta.q}
          onChange={(e) =>
            dispatch({ type: "updateMeta", patch: { q: e.target.value } })
          }
        />
      </div>

      <div className="panel-section">
        <div className="panel-label">Allowed mistakes</div>
        <div className="segmented">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={state.meta.m === n ? "active" : ""}
              onClick={() => dispatch({ type: "updateMeta", patch: { m: n } })}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="panel-footnote">
          Wrong answers anywhere in the sequence use these up. Run out and
          the solution is revealed.
        </div>
      </div>

      {error ? (
        <div className="panel-section share-error">
          Something's off with the puzzle: {error}
        </div>
      ) : (
        <div className="panel-section">
          <div className="panel-label">
            Share link{" "}
            <span className="panel-label-soft">
              ({url.length.toLocaleString()} characters — the whole puzzle
              lives in it)
            </span>
          </div>
          <div className="share-link-row">
            <input className="input share-link" readOnly value={url} />
            <button className="btn btn-primary btn-sm" onClick={copyLink}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <button
            className="btn btn-soft btn-sm"
            style={{ marginTop: 10 }}
            onClick={() => navigate(`#p=${blob}`)}
          >
            ▶ Preview as player
          </button>
        </div>
      )}

      <div className="panel-actions">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Record
        </button>
      </div>
    </div>
  );
};

export default SharePanel;
