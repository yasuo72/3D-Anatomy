import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  CircleDashed,
  Eye,
  EyeOff,
  Layers3,
  Maximize2,
  Minimize2,
  RotateCcw,
  ScanLine,
  Search,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from "lucide-react";
import type { Hotspot, Organ } from "../lib/anatomy-data";
import type { AnatomyViewer } from "../lib/three/viewer";
import { Ecghud } from "./Ecghud";
import { audioSynth } from "../lib/audio-synth";

type Props = {
  organ: Organ;
  autoRotate: boolean;
  onAutoRotate: (enabled: boolean) => void;
  compare: boolean;
  onCompare: () => void;
};

export function OrganViewer({ organ, autoRotate, onAutoRotate, compare, onCompare }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<AnatomyViewer | null>(null);
  const organRef = useRef(organ);
  const autoRotateRef = useRef(autoRotate);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slowLoad, setSlowLoad] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // New Interactive States
  const [opacity, setOpacity] = useState(1);
  const [dissection, setDissection] = useState(0);
  const [preset, setPreset] = useState<"clinical" | "dark-neon" | "xray" | "warm">("clinical");
  const [cinemaMode, setCinemaMode] = useState(false);
  const [audioMuted, setAudioMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setSlowLoad(true), 900);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    organRef.current = organ;
    // Ambient sound FX per organ
    if (!audioMuted) {
      if (organ.id === "heart") audioSynth.playHeartbeat(72);
      else if (organ.id === "lungs") audioSynth.playBreathing();
      else audioSynth.stopAmbient();
    }
  }, [organ, audioMuted]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    let cancelled = false;
    let viewer: AnatomyViewer | null = null;

    void import("../lib/three/viewer").then(({ AnatomyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        onSelect: (hotspot) => {
          setSelected(hotspot);
          if (hotspot) {
            audioSynth.playClick();
            audioSynth.speakText(`${hotspot.label}. ${hotspot.detail}`);
          }
        },
        onLoading: (isLoading, value) => {
          setLoading(isLoading);
          setProgress(value);
          if (isLoading) setSlowLoad(false);
        },
      });
      viewerRef.current = viewer;
      viewer.setAutoRotate(autoRotateRef.current);
      const current = organRef.current;
      viewer.setOrgan(current.model, current.hotspots, current.accent).catch(() => {
        setLoading(false);
        setProgress(0);
      });
    });

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
  }, []);

  useEffect(() => {
    viewerRef.current?.setOrgan(organ.model, organ.hotspots, organ.accent).catch(() => {
      setLoading(false);
      setProgress(0);
    });
  }, [organ]);

  useEffect(() => viewerRef.current?.setAutoRotate(autoRotate), [autoRotate]);

  const calloutRef = useCallback((node: HTMLDivElement | null) => {
    viewerRef.current?.attachCallout(node);
  }, []);

  const handleTool = (tool: string) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    audioSynth.playClick();
    if (tool === "rotate") onAutoRotate(!autoRotate);
    if (tool === "zoom") viewer.zoom(-1);
    if (tool === "isolate") setActiveTool(viewer.toggleIsolate() ? tool : null);
    if (tool === "section") setActiveTool(viewer.toggleCrossSection() ? tool : null);
    if (tool === "layers") setActiveTool(viewer.toggleLayers() ? tool : null);
    if (tool === "xray") {
      setShowControls((prev) => !prev);
    }
    if (tool === "cinema") {
      setCinemaMode((prev) => !prev);
    }
    if (tool === "audio") {
      const muted = audioSynth.toggleMute();
      setAudioMuted(muted);
      if (!muted) {
        if (organ.id === "heart") audioSynth.playHeartbeat(72);
        else if (organ.id === "lungs") audioSynth.playBreathing();
      }
    }
    if (tool === "compare") onCompare();
    if (tool === "reset") {
      viewer.reset();
      setOpacity(1);
      setDissection(0);
      setPreset("clinical");
      viewer.setOpacity(1);
      viewer.setExplosion(0);
      viewer.setEnvironmentPreset("clinical");
      setActiveTool(null);
      setShowControls(false);
    }
  };

  const handleOpacityChange = (val: number) => {
    setOpacity(val);
    viewerRef.current?.setOpacity(val);
  };

  const handleDissectionChange = (val: number) => {
    setDissection(val);
    viewerRef.current?.setExplosion(val);
  };

  const handlePresetChange = (nextPreset: "clinical" | "dark-neon" | "xray" | "warm") => {
    setPreset(nextPreset);
    viewerRef.current?.setEnvironmentPreset(nextPreset);
  };

  const tools = [
    { id: "rotate", label: "Rotate", icon: RotateCcw },
    { id: "zoom", label: "Zoom", icon: Search },
    { id: "xray", label: "X-Ray / 3D Controls", icon: Eye },
    { id: "isolate", label: "Isolate", icon: CircleDashed },
    { id: "section", label: "Cross-section", icon: ScanLine },
    { id: "layers", label: "Layers", icon: Layers3 },
    { id: "audio", label: audioMuted ? "Sound Off" : "Sound On", icon: audioMuted ? VolumeX : Volume2 },
    { id: "cinema", label: cinemaMode ? "Exit Cinema" : "Cinema Mode", icon: cinemaMode ? Minimize2 : Maximize2 },
    { id: "compare", label: "Compare", icon: Box },
    { id: "reset", label: "Reset", icon: RotateCcw },
  ];

  return (
    <section className={`viewer-shell ${cinemaMode ? "cinema-mode" : ""}`} aria-label={`${organ.name} interactive viewer`}>
      <div className="viewer-glow" style={{ "--organ-accent": organ.accent } as React.CSSProperties} />
      <div ref={mountRef} className="three-mount" />

      {/* Live ECG Pulse Waveform HUD */}
      <Ecghud organId={organ.id} organName={organ.name} system={organ.system} />

      <div className="viewer-tools" aria-label="3D viewer tools">
        {tools.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`tool-button ${(activeTool === id || showControls && id === "xray" || (!audioMuted && id === "audio") || (cinemaMode && id === "cinema") || (id === "compare" && compare)) ? "active" : ""}`}
            onClick={() => handleTool(id)}
            aria-pressed={activeTool === id || (id === "compare" && compare)}
            title={label}
          >
            <Icon size={19} strokeWidth={1.65} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Advanced 3D Controls Panel */}
      {showControls && (
        <div className="advanced-controls-panel">
          <div className="panel-row">
            <label><Eye size={14} /> X-Ray Opacity: <strong>{Math.round(opacity * 100)}%</strong></label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            />
          </div>
          <div className="panel-row">
            <label><Wand2 size={14} /> Dissection Explode: <strong>{Math.round(dissection * 100)}%</strong></label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={dissection}
              onChange={(e) => handleDissectionChange(parseFloat(e.target.value))}
            />
          </div>
          <div className="panel-row">
            <label><Sun size={14} /> Studio Lighting</label>
            <div className="preset-buttons">
              <button className={preset === "clinical" ? "active" : ""} onClick={() => handlePresetChange("clinical")}>Clinical</button>
              <button className={preset === "dark-neon" ? "active" : ""} onClick={() => handlePresetChange("dark-neon")}>Dark Neon</button>
              <button className={preset === "xray" ? "active" : ""} onClick={() => handlePresetChange("xray")}>X-Ray Blue</button>
              <button className={preset === "warm" ? "active" : ""} onClick={() => handlePresetChange("warm")}>Warm</button>
            </div>
          </div>
        </div>
      )}

      <aside className="tip-note" aria-label="Viewer instructions">
        <span><Sparkles size={15} /> Tip</span>
        <p>Drag to rotate<br />Scroll to zoom<br />Click a dot to learn & listen</p>
      </aside>

      {selected && (
        <div className="hotspot-callout" ref={calloutRef} data-side="right">
          <div className="callout-body" style={{ "--hotspot-color": selected.color } as React.CSSProperties}>
            <button className="callout-close" type="button" onClick={() => viewerRef.current?.clearSelection()} aria-label="Close">
              <X size={13} />
            </button>
            <b>{selected.label}</b>
            <small>{selected.detail}</small>
          </div>
        </div>
      )}

      <ul className="hotspot-index">
        {organ.hotspots.map((hotspot) => (
          <li key={hotspot.id}>{hotspot.label}: {hotspot.detail}</li>
        ))}
      </ul>

      {loading && slowLoad && (
        <div className="model-loader" role="status" aria-live="polite">
          <div className="loader-orbit"><Maximize2 size={20} /></div>
          <strong>Preparing the {organ.name.toLowerCase()}</strong>
          <span>{Math.max(8, Math.round(progress * 100))}%</span>
        </div>
      )}

      <button className="auto-rotate" type="button" onClick={() => onAutoRotate(!autoRotate)} aria-pressed={autoRotate}>
        <RotateCcw size={14} /> Auto rotate
        <span className={`switch ${autoRotate ? "on" : ""}`}><i /></span>
      </button>

      <div className="view-caption">
        <span>3D specimen · click a dot to explore</span>
        <strong>{organ.scientificName}</strong>
      </div>
    </section>
  );
}

