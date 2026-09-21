"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./contour-controls.css";
import { assetPath } from "./portfolio-links";

const POINTER_RADIUS = 315;

export function MarginContours() {
  const pointerWindowRef = useRef<HTMLDivElement>(null);
  const pointerTextureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointerWindow = pointerWindowRef.current;
    const pointerTexture = pointerTextureRef.current;
    if (!pointerWindow || !pointerTexture)
      return;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const rootElement = document.documentElement;
    let pointerEnabled = false;
    let pointerMoveAttached = false;
    let frame: number | null = null;
    let nextPointer = { x: 0, y: 0 };

    const hidePointer = () => {
      pointerWindow.dataset.pointerVisible = "false";
      if (frame !== null)
        window.cancelAnimationFrame(frame);
      frame = null;
    };

    const updatePreference = () => {
      const enabled = pointerQuery.matches && motionQuery.matches;
      if (enabled === pointerEnabled)
        return;
      pointerEnabled = enabled;
      if (pointerEnabled)
        attachPointerMove();
      else
        detachPointerMove();
    };

    const updatePointer = () => {
      frame = null;
      pointerWindow.style.transform = `translate3d(${nextPointer.x - POINTER_RADIUS}px, ${nextPointer.y - POINTER_RADIUS}px, 0)`;
      pointerTexture.style.transform = `translate3d(${POINTER_RADIUS - nextPointer.x}px, ${POINTER_RADIUS - nextPointer.y}px, 0)`;
      pointerWindow.dataset.pointerVisible = "true";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerEnabled || event.pointerType !== "mouse")
        return;
      nextPointer = { x: event.clientX, y: event.clientY };
      if (frame !== null)
        return;
      frame = window.requestAnimationFrame(updatePointer);
    };

    const attachPointerMove = () => {
      if (pointerMoveAttached)
        return;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      pointerMoveAttached = true;
    };

    const detachPointerMove = () => {
      if (!pointerMoveAttached)
        return;
      window.removeEventListener("pointermove", onPointerMove);
      pointerMoveAttached = false;
      hidePointer();
    };

    const onPointerLeave = () => hidePointer();
    updatePreference();
    rootElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("blur", onPointerLeave, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });
    pointerQuery.addEventListener?.("change", updatePreference);
    motionQuery.addEventListener?.("change", updatePreference);

    return () => {
      detachPointerMove();
      rootElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("mouseleave", onPointerLeave);
      pointerQuery.removeEventListener?.("change", updatePreference);
      motionQuery.removeEventListener?.("change", updatePreference);
      if (frame !== null)
        window.cancelAnimationFrame(frame);
      frame = null;
    };
  }, []);

  const fieldStyle = {
    "--contour-texture-desktop": `url(${assetPath("/images/contours-desktop.webp")})`,
    "--contour-texture-wide": `url(${assetPath("/images/contours-wide.webp")})`,
    "--contour-texture-mobile": `url(${assetPath("/images/contours-mobile.webp")})`,
  } as CSSProperties;

  return <div className="contour-field" style={fieldStyle} aria-hidden="true">
    <div className="contour-field-texture" />
    <div ref={pointerWindowRef} className="contour-field-pointer-window" data-pointer-visible="false">
      <div ref={pointerTextureRef} className="contour-field-pointer-texture" />
    </div>
  </div>;
}

export function MarginContoursWell({ variant }: { variant: "hero" | "archive" }) {
  void variant;
  return null;
}
