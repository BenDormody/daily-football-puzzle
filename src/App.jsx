import React from "react";
import { useHashRoute } from "./router.js";
import HomeScreen from "./home/HomeScreen.jsx";
import CreateScreen from "./create/CreateScreen.jsx";
import PlayScreen from "./play/PlayScreen.jsx";

const App = () => {
  const route = useHashRoute();

  if (route.screen === "create") return <CreateScreen key="create" />;
  if (route.screen === "play")
    return <PlayScreen key={route.blob} blob={route.blob} />;
  return <HomeScreen />;
};

export default App;
