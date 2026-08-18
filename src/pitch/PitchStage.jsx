import React, { useEffect, useRef, useState } from "react";
import Pitch from "./Pitch.jsx";
import Arrows from "./Arrows.jsx";

// Composes the decorative pitch with absolutely-positioned interactive
// children (chips, ball, markers) and the arrow overlay. Measures its own
// pixel size so chip sizing and arrow geometry track the responsive pitch.
const PitchStage = ({
  portrait = false,
  arrows = [],
  onStagePointerDown,
  stageRef: externalRef,
  children,
}) => {
  const innerRef = useRef(null);
  const stageRef = externalRef ?? innerRef;
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [stageRef]);

  const chipSize = Math.max(22, Math.min(44, size.w / (portrait ? 13 : 24)));

  return (
    <div
      className="pitch-stage"
      ref={stageRef}
      style={{ "--chip-size": `${chipSize}px` }}
      onPointerDown={onStagePointerDown}
    >
      <Pitch portrait={portrait} />
      <Arrows arrows={arrows} size={size} />
      {children}
    </div>
  );
};

export default PitchStage;
