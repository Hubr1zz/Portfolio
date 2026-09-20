"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import "./contour-controls.css";
import { DEFAULT_CONTOUR_SETTINGS, generateContourField, normalizeContourSettings, type ContourFieldGeometry, type ContourSettings } from "./contour-field";

const contourStorageKey = "portfolio-contour-settings-v1";

const settingControls: ReadonlyArray<{ key: keyof ContourSettings; label: string; min: number; max: number; step: number }> = [
  { key: "seed", label: "Seed", min: 1, max: 999, step: 1 },
  { key: "noiseScale", label: "Scale", min: 80, max: 420, step: 1 },
  { key: "octaves", label: "Octaves", min: 1, max: 5, step: 1 },
  { key: "persistence", label: "Roughness", min: .2, max: .8, step: .01 },
  { key: "contourGap", label: "Spacing", min: .03, max: .13, step: .001 },
  { key: "lineWidth", label: "Line width", min: .5, max: 1.5, step: .1 },
  { key: "baseOpacity", label: "Base opacity", min: .015, max: .14, step: .005 },
  { key: "pointerIntensity", label: "Pointer intensity", min: .05, max: .4, step: .01 },
  { key: "pointerRadius", label: "Pointer radius", min: 100, max: 500, step: 1 },
];

function readStoredSettings() {
  try {
    const raw = window.localStorage.getItem(contourStorageKey);
    if (!raw)
      return normalizeContourSettings(DEFAULT_CONTOUR_SETTINGS);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return normalizeContourSettings(DEFAULT_CONTOUR_SETTINGS);
    return normalizeContourSettings(parsed as Partial<ContourSettings>);
  } catch {
    return normalizeContourSettings(DEFAULT_CONTOUR_SETTINGS);
  }
}

function saveSettings(settings: ContourSettings) {
  try {
    window.localStorage.setItem(contourStorageKey, JSON.stringify(settings));
  } catch {
    return;
  }
}

function formatSettingValue(key: keyof ContourSettings, value: number) {
  if (key === "seed" || key === "octaves" || key === "pointerRadius")
    return String(Math.round(value));
  if (key === "noiseScale")
    return `${Math.round(value)} px`;
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function ContourPaths({ geometry }: { geometry: ContourFieldGeometry | null }) {
  if (!geometry)
    return null;
  return geometry.paths.map((path, index) => <path key={`${path.level}-${index}`} d={path.d} className={path.major ? "contour-field-path contour-field-path-major" : "contour-field-path"} />);
}

function isTextInput(target: EventTarget | null) {
  if (!(target instanceof HTMLElement))
    return false;
  if (target.isContentEditable)
    return true;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

function ContourControls({ settings, onChange, onReset, onCopy, status, closeButtonRef, onClose }: { settings: ContourSettings; onChange: (key: keyof ContourSettings, value: string) => void; onReset: () => void; onCopy: () => void; status: string; closeButtonRef: RefObject<HTMLButtonElement | null>; onClose: () => void }) {
  return <aside className="contour-controls" aria-label="Contour settings">
    <div className="contour-controls-heading"><strong>CONTOUR SETTINGS</strong><button ref={closeButtonRef} type="button" className="contour-controls-close" onClick={onClose} aria-label="Close contour settings">×</button></div>
    <div className="contour-controls-fields">
      {settingControls.map((control) => <div key={control.key} className="contour-control"><label className="contour-control-label" htmlFor={`contour-${control.key}`}><span>{control.label}</span><output>{formatSettingValue(control.key, settings[control.key])}</output></label><input id={`contour-${control.key}`} aria-label={control.label} type="range" min={control.min} max={control.max} step={control.step} value={settings[control.key]} onChange={(event) => onChange(control.key, event.currentTarget.value)} /></div>)}
    </div>
    <div className="contour-controls-actions"><button type="button" onClick={onReset}>Reset</button><button type="button" onClick={onCopy}>Copy settings JSON</button></div>
    <p className="contour-controls-status" role="status" aria-live="polite">{status}</p>
    <p className="contour-controls-hint">Alt + Shift + C to toggle</p>
  </aside>;
}

export function MarginContours() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const geometryFrameRef = useRef<number | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const settingsRef = useRef<ContourSettings>(normalizeContourSettings(DEFAULT_CONTOUR_SETTINGS));
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const skipStorageWriteRef = useRef(false);
  const [settings, setSettings] = useState<ContourSettings>(() => normalizeContourSettings(DEFAULT_CONTOUR_SETTINGS));
  const [geometry, setGeometry] = useState<ContourFieldGeometry | null>(null);
  const [pointerEnabled, setPointerEnabled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [status, setStatus] = useState("");

  const scheduleGeometry = useCallback(() => {
    if (geometryFrameRef.current !== null)
      return;
    geometryFrameRef.current = window.requestAnimationFrame(() => {
      geometryFrameRef.current = null;
      setGeometry(generateContourField(window.innerWidth, window.innerHeight, settingsRef.current));
    });
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    scheduleGeometry();
  }, [scheduleGeometry, settings.seed, settings.noiseScale, settings.octaves, settings.persistence, settings.contourGap]);

  useEffect(() => {
    const onResize = () => scheduleGeometry();
    window.addEventListener("resize", onResize, { passive: true });
    scheduleGeometry();
    return () => {
      window.removeEventListener("resize", onResize);
      if (geometryFrameRef.current !== null)
        window.cancelAnimationFrame(geometryFrameRef.current);
      geometryFrameRef.current = null;
    };
  }, [scheduleGeometry]);

  useEffect(() => {
    const loadFrame = window.requestAnimationFrame(() => {
      setSettings(readStoredSettings());
      setStorageReady(true);
      if (new URLSearchParams(window.location.search).get("contours") === "1") {
        const active = document.activeElement;
        lastFocusRef.current = active instanceof HTMLElement ? active : null;
        setPanelOpen(true);
      }
    });
    return () => window.cancelAnimationFrame(loadFrame);
  }, []);

  useEffect(() => {
    if (!storageReady)
      return;
    if (skipStorageWriteRef.current) {
      skipStorageWriteRef.current = false;
      return;
    }
    saveSettings(settings);
  }, [settings, storageReady]);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPointerEnabled(!pointerQuery.matches && !motionQuery.matches);
    updatePreference();
    pointerQuery.addEventListener?.("change", updatePreference);
    motionQuery.addEventListener?.("change", updatePreference);
    return () => {
      pointerQuery.removeEventListener?.("change", updatePreference);
      motionQuery.removeEventListener?.("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!pointerEnabled || !field)
      return;
    const updatePointerStyle = () => {
      pointerFrameRef.current = null;
      field.style.setProperty("--contour-x", `${pointerRef.current.x}px`);
      field.style.setProperty("--contour-y", `${pointerRef.current.y}px`);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (pointerFrameRef.current !== null)
        return;
      pointerFrameRef.current = window.requestAnimationFrame(updatePointerStyle);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (pointerFrameRef.current !== null)
        window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    };
  }, [pointerEnabled]);

  const openPanel = useCallback(() => {
    const active = document.activeElement;
    lastFocusRef.current = active instanceof HTMLElement ? active : null;
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    const previous = lastFocusRef.current;
    if (previous)
      window.requestAnimationFrame(() => previous.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && panelOpen) {
        event.preventDefault();
        closePanel();
        return;
      }
      if (isTextInput(event.target))
        return;
      if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        if (panelOpen)
          closePanel();
        else
          openPanel();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closePanel, openPanel, panelOpen]);

  useEffect(() => {
    if (!panelOpen)
      return;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(focusFrame);
  }, [panelOpen]);

  useEffect(() => () => {
    if (pointerFrameRef.current !== null)
      window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = null;
  }, []);

  function updateSetting(key: keyof ContourSettings, value: string) {
    setSettings((previous) => normalizeContourSettings({ ...previous, [key]: Number(value) }));
    setStatus("");
  }

  function resetSettings() {
    skipStorageWriteRef.current = true;
    setSettings(normalizeContourSettings(DEFAULT_CONTOUR_SETTINGS));
    try {
      window.localStorage.removeItem(contourStorageKey);
    } catch {
      setStatus("Reset in memory");
      return;
    }
    setStatus("Reset to defaults");
  }

  async function copySettings() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      setStatus("Settings copied");
    } catch {
      setStatus("Copy failed");
    }
  }

  const viewBox = geometry ? `0 0 ${geometry.width} ${geometry.height}` : "0 0 1 1";
  const fieldStyle = {
    "--contour-line-width": `${settings.lineWidth}px`,
    "--contour-base-opacity": String(settings.baseOpacity),
    "--contour-pointer-opacity": String(settings.pointerIntensity),
    "--contour-pointer-radius": `${settings.pointerRadius}px`,
  } as CSSProperties;

  return <>
    <div ref={fieldRef} className="contour-field" data-pointer-enabled={pointerEnabled ? "true" : "false"} style={fieldStyle} aria-hidden="true">
      <svg className="contour-field-svg" viewBox={viewBox} preserveAspectRatio="none" fill="none" focusable="false"><g className="contour-field-base"><ContourPaths geometry={geometry} /></g></svg>
      <div className="contour-field-pointer" aria-hidden="true"><svg className="contour-field-svg" viewBox={viewBox} preserveAspectRatio="none" fill="none" focusable="false"><g><ContourPaths geometry={geometry} /></g></svg></div>
    </div>
    {panelOpen ? <ContourControls settings={settings} onChange={updateSetting} onReset={resetSettings} onCopy={copySettings} status={status} closeButtonRef={closeButtonRef} onClose={closePanel} /> : null}
  </>;
}

export function MarginContoursWell({ variant }: { variant: "hero" | "archive" }) {
  void variant;
  return null;
}
