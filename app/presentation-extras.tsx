"use client";

import { useEffect, useRef } from "react";

const contourPaths = Array.from({ length: 20 }, (_, index) => {
  const points = Array.from({ length: 96 }, (_, pointIndex) => {
    const theta = pointIndex / 96 * Math.PI * 2;
    const baseRadius = 60 + index * 11;
    const perturbation = (12 * Math.sin(3 * theta + .4) + 8 * Math.cos(5 * theta)) * (baseRadius / 120);
    const radius = baseRadius + perturbation;
    const x = 460 + 1.4 * radius * Math.cos(theta) + index * 2;
    const y = 315 + .83 * radius * Math.sin(theta);
    return (pointIndex === 0 ? "M" : "L") + " " + x.toFixed(1) + " " + y.toFixed(1);
  });
  return points.join(" ") + " Z";
});

function ContourSvg() {
  return <svg viewBox="0 0 900 620" fill="none" aria-hidden="true" focusable="false"><g>{contourPaths.map((path, index) => <path key={path} d={path} className={index % 4 === 0 ? "contour-major" : undefined} />)}</g></svg>;
}

export function MarginContours() {
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      frameRef.current = 0;
      const { x, y } = pointerRef.current;
      const root = document.documentElement;
      root.style.setProperty("--contour-x", `${x / window.innerWidth * 100}%`);
      root.style.setProperty("--contour-y", `${y / window.innerHeight * 100}%`);
      root.style.setProperty("--contour-parallax-x", `${(x / window.innerWidth - .5) * 16}px`);
      root.style.setProperty("--contour-parallax-y", `${(y / window.innerHeight - .5) * 10}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current)
        return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    let listening = false;
    const addPointerListener = () => {
      if (listening || pointerQuery.matches || motionQuery.matches)
        return;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      listening = true;
    };
    const removePointerListener = () => {
      if (!listening)
        return;
      window.removeEventListener("pointermove", onPointerMove);
      listening = false;
    };
    const onPreferenceChange = () => {
      if (pointerQuery.matches || motionQuery.matches) {
        removePointerListener();
        return;
      }
      addPointerListener();
    };

    addPointerListener();
    pointerQuery.addEventListener?.("change", onPreferenceChange);
    motionQuery.addEventListener?.("change", onPreferenceChange);
    return () => {
      removePointerListener();
      pointerQuery.removeEventListener?.("change", onPreferenceChange);
      motionQuery.removeEventListener?.("change", onPreferenceChange);
      if (frameRef.current)
        window.cancelAnimationFrame(frameRef.current);
      document.documentElement.style.removeProperty("--contour-x");
      document.documentElement.style.removeProperty("--contour-y");
      document.documentElement.style.removeProperty("--contour-parallax-x");
      document.documentElement.style.removeProperty("--contour-parallax-y");
    };
  }, []);

  return <div className="margin-contours" aria-hidden="true"><div className="margin-contours-static"><div className="margin-contours-edge margin-contours-edge-left"><ContourSvg /></div><div className="margin-contours-edge margin-contours-edge-right"><ContourSvg /></div></div><div className="margin-contours-dynamic"><div className="margin-contours-edge margin-contours-edge-left"><ContourSvg /></div><div className="margin-contours-edge margin-contours-edge-right"><ContourSvg /></div></div></div>;
}

export function MarginContoursWell({ variant }: { variant: "hero" | "archive" }) {
  return <div className={`margin-contours-well margin-contours-well-${variant}`} aria-hidden="true"><ContourSvg /></div>;
}
