import { useRef, useState, useCallback, useEffect } from "react";
import { fromClient } from "../pitch/coords.js";

const TAP_THRESHOLD_PX = 6;

// Unified tap-vs-drag handling for chips and markers on the pitch stage.
// startDrag() is called from a pointerdown handler; the hook tracks the
// pointer globally and reports either a tap or a drag end in canonical
// coords. While dragging, `drag` exposes { id, kind, pt } for live UI.
export const usePitchDrag = (stageRef, portrait, { onTap, onDragEnd }) => {
  const [drag, setDrag] = useState(null);
  const session = useRef(null);

  const startDrag = useCallback(
    (id, kind, event) => {
      event.preventDefault();
      event.stopPropagation();
      const start = { x: event.clientX, y: event.clientY };
      session.current = { id, kind, start, moved: false };

      const onMove = (e) => {
        const s = session.current;
        if (!s) return;
        if (
          !s.moved &&
          Math.hypot(e.clientX - s.start.x, e.clientY - s.start.y) <
            TAP_THRESHOLD_PX
        )
          return;
        s.moved = true;
        const rect = stageRef.current.getBoundingClientRect();
        const pt = fromClient(e.clientX, e.clientY, rect, portrait);
        s.pt = pt;
        setDrag({ id: s.id, kind: s.kind, pt });
      };

      const onUp = (e) => {
        const s = session.current;
        session.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        setDrag(null);
        if (!s) return;
        if (s.moved && s.pt) onDragEnd?.(s.id, s.kind, s.pt);
        else if (!s.moved) onTap?.(s.id, s.kind, e);
      };

      const onCancel = () => {
        session.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        setDrag(null);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [stageRef, portrait, onTap, onDragEnd]
  );

  // Safety net: drop listeners if the component unmounts mid-drag.
  useEffect(
    () => () => {
      session.current = null;
    },
    []
  );

  return { drag, startDrag };
};
