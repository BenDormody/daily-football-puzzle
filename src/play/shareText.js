// Wordle-style result text for the clipboard.
// solved: every step green/yellow. failed: red at the step where the
// budget ran out, white for steps never reached.
export const buildShareText = ({ puzzle, stepMistakes, solved, failedAt, url }) => {
  const squares = puzzle.st
    .map((_, idx) => {
      if (solved || idx < failedAt)
        return stepMistakes[idx] === 0 ? "🟩" : "🟨";
      return idx === failedAt ? "🟥" : "⬜";
    })
    .join("");

  const mistakes = stepMistakes.reduce((a, b) => a + b, 0);
  const summary = solved
    ? mistakes === 0
      ? "solved it clean — no mistakes!"
      : `solved with ${mistakes} mistake${mistakes > 1 ? "s" : ""}`
    : "ran out of chances";

  return `⚽ ${puzzle.t}\n${squares} — ${summary}\n${url}`;
};
