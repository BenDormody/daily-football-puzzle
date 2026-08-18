import { useEffect, useState } from "react";

// Vertical pitch on narrow portrait viewports (phones) so the pitch fills
// the screen instead of shrinking to a letterboxed strip.
const QUERY = "(max-width: 767px) and (orientation: portrait)";

export const usePortraitPitch = () => {
  const [portrait, setPortrait] = useState(
    () => window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setPortrait(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return portrait;
};
