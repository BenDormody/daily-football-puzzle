import { useEffect, useState } from "react";

// Routes:
//   ""            -> home
//   "#create"     -> editor
//   "#p=<blob>"   -> play a shared puzzle
export const parseHash = (hash) => {
  const h = (hash || "").replace(/^#/, "");
  if (h === "create") return { screen: "create" };
  if (h.startsWith("p=")) return { screen: "play", blob: h.slice(2) };
  return { screen: "home" };
};

export const useHashRoute = () => {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
};

export const navigate = (hash) => {
  if (window.location.hash === hash) return;
  window.location.hash = hash;
};
