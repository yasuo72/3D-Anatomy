"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Bot,
  BrainCircuit,
  Calculator as CalcIcon,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Heart,
  Info,
  Key,
  Layers,
  LibraryBig,
  Maximize2,
  Mic,
  MicOff,
  Microscope,
  Minimize2,
  NotebookPen,
  Play,
  RotateCcw,
  Search,
  Share2,
  Sliders,
  Sparkles,
  Stethoscope,
  Sun,
  Moon,
  Trophy,
  Users,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { organById, organs, type Organ, type OrganId } from "../lib/anatomy-data";
import { audioSynth } from "../lib/audio-synth";
import { askGroqTutor, generateClinicalCase, type ChatMessage, type ClinicalCase, type TutorTone } from "../lib/groq-client";

type Modal =
  | "lesson"
  | "quiz"
  | "labeling-quiz"
  | "animation"
  | "system"
  | "notes"
  | "developer"
  | "flashcards"
  | "calculator"
  | "ai-assistant"
  | "ai-cases"
  | "dashboard"
  | "teacher"
  | "pubmed"
  | null;

type LessonTab = "overview" | "structures" | "physiology" | "histology" | "research" | "clinical" | "pharmacology";

function FormattedMarkdown({ text }: { text: string }) {
  let cleanText = text.replace(/```[a-z]*[\s\S]*?```/gi, "").trim();

  cleanText = cleanText.replace(/^(.*?)\n[=]{3,}$/gm, "### $1");
  cleanText = cleanText.replace(/^(.*?)\n[-]{3,}$/gm, "### $1");

  const lines = cleanText.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(<ul key={`ul-${key}`} className="ai-markdown-list">{listItems}</ul>);
      listItems = [];
      inList = false;
    }
  };

  const renderInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`${index}`);
      return;
    }

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      flushList(`${index}`);
      const hText = trimmed.replace(/^#+\s*/, "");
      elements.push(<h4 key={`h-${index}`} className="ai-markdown-heading">{renderInline(hText)}</h4>);
      return;
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      inList = true;
      const itemContent = trimmed.replace(/^[*•-]\s*/, "");
      listItems.push(<li key={`li-${index}`}>{renderInline(itemContent)}</li>);
      return;
    }

    flushList(`${index}`);
    elements.push(<p key={`p-${index}`} className="ai-markdown-p">{renderInline(trimmed)}</p>);
  });

  flushList("end");

  return <div className="formatted-ai-response">{elements}</div>;
}

function OrganArt({
  organ,
  asset,
  alt,
  size,
}: {
  organ: Organ;
  asset: "thumb" | "organ" | "microscopic" | "compare" | "location";
  alt: string;
  size?: number;
}) {
  if (!organ.illustrated) {
    const labelling = alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true };
    return (
      <span className="art-fallback" style={{ "--art-accent": organ.accent } as React.CSSProperties} {...labelling}>
        {organ.icon}
      </span>
    );
  }
  return (
    <img
      key={`${organ.id}-${asset}`}
      src={`/anatomy/${organ.id}/${asset}.webp`}
      alt={alt}
      width={size}
      height={size}
      loading={asset === "thumb" ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function AnatomyApp() {
  const [organId, setOrganId] = useState<OrganId>("heart");
  const [autoRotate, setAutoRotate] = useState(true);
  const [compare, setCompare] = useState(false);
  const [diseaseMode, setDiseaseMode] = useState(false);
  const [referenceId, setReferenceId] = useState<OrganId>("brain");
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [voiceListening, setVoiceListening] = useState(false);

  // Persistent States
  const [savedOrgans, setSavedOrgans] = useState<Set<OrganId>>(new Set());
  const [savedFilterOnly, setSavedFilterOnly] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [notesLastSaved, setNotesLastSaved] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [recentOrgans, setRecentOrgans] = useState<OrganId[]>(["heart"]);

  // Dynamic Audio & ECG Sync Rate
  const [bpm, setBpm] = useState(72);
  const [activeLessonTab, setActiveLessonTab] = useState<LessonTab>("overview");

  // AI Assistant Pre-fill Prompt
  const [aiPrompt, setAiPrompt] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
  const reference = organById[referenceId];

  // Post-mount client state hydration
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);

      try {
        const savedTheme = localStorage.getItem("anatomy-theme") as "light" | "dark" | null;
        const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
      } catch {}

      try {
        const storedSaved = localStorage.getItem("anatomy-saved-organs");
        if (storedSaved) setSavedOrgans(new Set(JSON.parse(storedSaved)));
      } catch {}

      try {
        const storedNotes = localStorage.getItem("anatomy-notes");
        if (storedNotes) setNotes(JSON.parse(storedNotes));
      } catch {}

      try {
        const storedXP = localStorage.getItem("anatomy-quiz-xp");
        if (storedXP) setTotalXP(parseInt(storedXP, 10) || 0);
      } catch {}
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("anatomy-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const toggleSaveOrgan = (id: OrganId, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setSavedOrgans((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      localStorage.setItem("anatomy-saved-organs", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const saveNoteForOrgan = (id: OrganId, text: string) => {
    const updated = { ...notes, [id]: text };
    setNotes(updated);
    localStorage.setItem("anatomy-notes", JSON.stringify(updated));
    setNotesLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const clearNoteForOrgan = (id: OrganId) => {
    const updated = { ...notes };
    delete updated[id];
    setNotes(updated);
    localStorage.setItem("anatomy-notes", JSON.stringify(updated));
    setNotesLastSaved(null);
  };

  const addXP = (points: number) => {
    setTotalXP((prev) => {
      const next = prev + points;
      localStorage.setItem("anatomy-quiz-xp", next.toString());
      return next;
    });
  };

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power2.out", overwrite: true },
    );
  }, [organId]);

  const selectOrgan = (id: OrganId) => {
    if (organById[id].illustrated) {
      ["organ", "microscopic", "compare", "location"].forEach((asset) => {
        const image = new Image();
        image.src = `/anatomy/${id}/${asset}.webp`;
      });
    }
    setOrganId(id);
    setRecentOrgans((prev) => Array.from(new Set([id, ...prev])).slice(0, 5));
    if (id === referenceId) {
      setReferenceId(id === "heart" ? "brain" : "heart");
    }
    setBpm(id === "heart" ? 72 : id === "lungs" ? 14 : 60);
    setMobileLibrary(false);
    setCompare(false);
  };

  const prefetchOrgan = (id: OrganId) => {
    if (id === organId || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(organById[id].model, { priority: "low" } as RequestInit).catch(() => {});
  };

  const handleSpeakOverview = () => {
    audioSynth.speakText(
      `${organ.name}. ${organ.scientificName}. ${organ.description}. Medical note: ${organ.medical}`,
    );
  };

  const handleDownloadNotes = () => {
    const content = `ANATOMY LAB 3D RESEARCH NOTES (Developed by Rohit)\n\nOrgan: ${organ.name} (${organ.scientificName})\nSystem: ${organ.system}\n\nKey Facts:\n- Size: ${organ.size}\n- Weight: ${organ.weight}\n- Location: ${organ.location}\n- Function: ${organ.function}\n- Blood Supply: ${organ.bloodSupply}\n\nHistology:\n- Tissue: ${organ.histology.tissueType}\n- Primary Cells: ${organ.histology.primaryCells.join(", ")}\n\nPersonal Notes:\n${notes[organ.id] || "No personal notes added yet."}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${organ.id}-research-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Web Speech API Voice Commands Navigation
  const toggleVoiceControl = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or MS Edge.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    if (!voiceListening) {
      setVoiceListening(true);
      audioSynth.speakText("Voice navigation listening. Say show heart, show brain, or open quiz.");
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceListening(false);

        organs.forEach((o) => {
          if (transcript.includes(o.name.toLowerCase()) || transcript.includes(o.id)) {
            selectOrgan(o.id);
            audioSynth.speakText(`Showing ${o.name}`);
          }
        });

        if (transcript.includes("quiz")) setModal("quiz");
        if (transcript.includes("flashcard")) setModal("flashcards");
        if (transcript.includes("calculator")) setModal("calculator");
        if (transcript.includes("ai") || transcript.includes("tutor")) setModal("ai-assistant");
      };

      recognition.onerror = () => setVoiceListening(false);
      recognition.onend = () => setVoiceListening(false);
    } else {
      setVoiceListening(false);
    }
  };

  const askAiAboutHotspot = (label: string, detail: string) => {
    setAiPrompt(`Explain ${label} (${detail}) in the physiological context of the ${organ.name}.`);
    setModal("ai-assistant");
  };

  const availableSystems = useMemo(() => {
    const set = new Set(organs.map((o) => o.system));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredOrgans = useMemo(() => {
    const q = query.toLowerCase().trim();
    return organs.filter((item) => {
      if (savedFilterOnly && !savedOrgans.has(item.id)) return false;
      if (systemFilter !== "all" && item.system !== systemFilter) return false;
      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const latinMatch = item.scientificName.toLowerCase().includes(q);
      const systemMatch = item.system.toLowerCase().includes(q);
      const funcMatch = item.function.toLowerCase().includes(q);
      const tissueMatch = item.tissue.toLowerCase().includes(q);
      const cellMatch = item.histology.primaryCells.some((c) => c.toLowerCase().includes(q));
      const condMatch = item.conditions.some((c) => c.toLowerCase().includes(q));
      const spotMatch = item.hotspots.some((h) => h.label.toLowerCase().includes(q) || h.detail.toLowerCase().includes(q));
      const partMatch = item.parts.some((p) => p.name.toLowerCase().includes(q) || p.function.toLowerCase().includes(q));

      return nameMatch || latinMatch || systemMatch || funcMatch || tissueMatch || cellMatch || condMatch || spotMatch || partMatch;
    });
  }, [query, systemFilter, savedFilterOnly, savedOrgans]);

  const openModalTab = (modalType: Modal, tab: LessonTab = "overview") => {
    setActiveLessonTab(tab);
    setModal(modalType);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => selectOrgan("heart")} aria-label="Anatomy Lab 3D home">
          <strong>Anatomy Lab 3D<sup>✦</sup></strong>
          <em>Developed by Rohit · Groq AI Enabled</em>
        </button>
        <nav className="main-nav" aria-label="Primary navigation">
          <button className={modal === null ? "active" : ""} onClick={() => setModal(null)}>
            <Compass size={17} /> Explore
          </button>
          <button className={modal === "ai-assistant" ? "active ai-btn-nav" : "ai-btn-nav"} onClick={() => setModal("ai-assistant")}>
            <Bot size={17} /> AI Research
          </button>
          <button className={modal === "ai-cases" ? "active" : ""} onClick={() => setModal("ai-cases")}>
            <Stethoscope size={17} /> AI Cases
          </button>
          <button className={modal === "lesson" ? "active" : ""} onClick={() => openModalTab("lesson", "overview")}>
            <BookOpen size={17} /> Masterclass
          </button>
          <button className={modal === "flashcards" ? "active" : ""} onClick={() => openModalTab("flashcards")}>
            <Layers size={17} /> Flashcards
          </button>
          <button className={modal === "dashboard" ? "active" : ""} onClick={() => setModal("dashboard")}>
            <Trophy size={17} /> Progress
          </button>
          <button className={modal === "teacher" ? "active" : ""} onClick={() => setModal("teacher")}>
            <Users size={17} /> Teacher
          </button>
        </nav>

        <label className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search parts, cells, formulas, hotspots, diseases..."
          />
          {query && (
            <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </label>

        <div className="topbar-actions">
          <button
            className={`voice-nav-btn ${voiceListening ? "listening" : ""}`}
            onClick={toggleVoiceControl}
            title={voiceListening ? "Listening... Speak command" : "Enable Voice Navigation"}
          >
            {voiceListening ? <Mic size={17} /> : <MicOff size={17} />}
          </button>
          {mounted && totalXP > 0 && (
            <div className="xp-badge" title="Total Anatomy XP Earned">
              <Trophy size={14} /> <span>{totalXP} XP</span>
            </div>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="profile"
            onClick={() => setModal("developer")}
            aria-label="Rohit Developer Profile"
            title="Rohit — Lead Developer & System Info"
          >
            <span>R</span><ChevronDown size={15} />
          </button>
        </div>
        <button
          className="mobile-library-trigger"
          onClick={() => setMobileLibrary(true)}
          aria-label="Open organ library"
        >
          <LibraryBig size={20} />
        </button>
      </header>

      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>Library ({filteredOrgans.length})</span>
            <button aria-label="Close library" className="mobile-close" onClick={() => setMobileLibrary(false)}>
              <X size={17} />
            </button>
            <button
              aria-label="Toggle saved organs filter"
              className={`bookmark-toggle ${savedFilterOnly ? "active" : ""}`}
              onClick={() => setSavedFilterOnly((prev) => !prev)}
              title={savedFilterOnly ? "Show all organs" : "Filter saved organs"}
            >
              <Bookmark size={17} fill={savedFilterOnly ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="system-filter-dropdown-bar">
            <Sliders size={14} className="filter-icon" />
            <select
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value)}
              className="system-filter-select"
              aria-label="Filter organs by system"
            >
              <option value="all">All Body Systems (9 Organs)</option>
              {availableSystems
                .filter((sys) => sys !== "all")
                .map((sys) => (
                  <option key={sys} value={sys}>
                    {sys} System
                  </option>
                ))}
            </select>
          </div>

          <div className="organ-list">
            {filteredOrgans.length === 0 ? (
              <div className="empty-library">
                <Sparkles size={24} />
                <p>{savedFilterOnly ? "No saved organs yet. Click the heart icon on any organ to bookmark it!" : "No organs match your filter or search term."}</p>
                <button
                  type="button"
                  className="lesson-button"
                  onClick={() => {
                    setQuery("");
                    setSystemFilter("all");
                    setSavedFilterOnly(false);
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredOrgans.map((item) => {
                const isSaved = savedOrgans.has(item.id);
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    className={`organ-item ${organId === item.id ? "active" : ""}`}
                    onClick={() => selectOrgan(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") selectOrgan(item.id);
                    }}
                    onPointerEnter={() => prefetchOrgan(item.id)}
                    onFocus={() => prefetchOrgan(item.id)}
                    style={{ "--item-accent": item.accent } as React.CSSProperties}
                  >
                    <span className="organ-glyph">
                      <OrganArt organ={item} asset="thumb" alt={`${item.name} thumbnail`} size={47} />
                    </span>
                    <span>
                      <b>{item.name}</b>
                      <small>{item.system}</small>
                    </span>
                    <button
                      type="button"
                      className={`favorite-btn ${isSaved ? "saved" : ""}`}
                      onClick={(e) => toggleSaveOrgan(item.id, e)}
                      title={isSaved ? "Remove from bookmarks" : "Save organ"}
                    >
                      <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button className="view-all" onClick={() => { setQuery(""); setSystemFilter("all"); setSavedFilterOnly(false); }}>
            View all 9 organs <ArrowRight size={14} />
          </button>
          <blockquote>
            <Bot size={18} />
            <p>Groq Llama 3.3 70B<br />AI Assistant Ready</p>
            <em>Ask anything!</em>
          </blockquote>
        </aside>

        <OrganViewer
          organ={organ}
          autoRotate={autoRotate}
          onAutoRotate={setAutoRotate}
          compare={compare}
          onCompare={() => setCompare(!compare)}
          diseaseMode={diseaseMode}
          onDiseaseMode={setDiseaseMode}
          bpm={bpm}
        />

        <aside className="info-panel" ref={contentRef}>
          <div className="info-kicker" data-reveal>
            <Heart size={13} fill="currentColor" /> The {organ.name} {diseaseMode && <span className="disease-badge">⚠ Disease Mode Active</span>}
          </div>
          <div className="info-title-row" data-reveal>
            <div>
              <div className="organ-title-speech">
                <h1>{organ.name}</h1>
                <button className="speech-btn" onClick={handleSpeakOverview} title="Listen to voiceover summary">
                  <Volume2 size={18} />
                </button>
              </div>
              <em>{organ.poetic} ({organ.scientificName})</em>
            </div>
            <span className="specimen-stamp">
              <OrganArt organ={organ} asset="organ" alt={`${organ.name} anatomical illustration`} size={92} />
            </span>
          </div>

          <p className="description" data-reveal>{organ.description}</p>
          <div className="rule" />

          <h2 data-reveal>Key facts & Metrics</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> Size</dt><dd>{organ.size}</dd></div>
            <div data-reveal><dt><span>♙</span> Weight</dt><dd>{organ.weight}</dd></div>
            <div data-reveal><dt><span>⌁</span> Daily Fact</dt><dd>{organ.dailyFact}</dd></div>
            <div data-reveal><dt><span>⌖</span> Location</dt><dd>{organ.location}</dd></div>
            <div data-reveal><dt><span>❋</span> Blood supply</dt><dd>{organ.bloodSupply}</dd></div>
            <div data-reveal><dt><span>◈</span> Function</dt><dd>{organ.function}</dd></div>
          </dl>

          <div className="medical-note" data-reveal>
            <Stethoscope size={16} />
            <p><b>Medical Importance</b>{organ.medical}</p>
          </div>

          {/* Quick AI Action Launchers */}
          <div className="action-grid" data-reveal style={{ marginTop: "1rem" }}>
            <button className="ai-launcher-btn" onClick={() => setModal("ai-assistant")}><Bot size={16} /> Ask Groq AI Tutor</button>
            <button onClick={() => setModal("ai-cases")}><Stethoscope size={15} /> AI Case Vignette</button>
          </div>

          <div className="action-grid" data-reveal style={{ marginTop: "0.5rem" }}>
            <button onClick={() => openModalTab("lesson", "overview")}><BookOpen size={15} /> Masterclass</button>
            <button onClick={() => setModal("flashcards")}><Layers size={15} /> Flashcards</button>
            <button onClick={() => setModal("calculator")}><CalcIcon size={15} /> Calculator</button>
          </div>

          <div className="action-grid" data-reveal style={{ marginTop: "0.5rem" }}>
            <button onClick={() => setModal("labeling-quiz")}><Key size={15} /> 3D Pin Quiz</button>
            <button onClick={() => setModal("quiz")}><CircleHelp size={15} /> Quiz ({organ.quizQuestions.length}Q)</button>
            <button onClick={() => setModal("pubmed")}><FileText size={15} /> PubMed Papers</button>
          </div>
        </aside>
      </div>

      {compare && (
        <section className="compare-strip" aria-label="Organ comparison">
          <div className="compare-organ">
            <OrganArt organ={organ} asset="thumb" alt="" />
            <span>Active Specimen</span>
            <strong>{organ.name}</strong>
            <small>{organ.system}</small>
          </div>

          <b>vs.</b>

          <div className="compare-organ">
            <OrganArt organ={reference} asset="thumb" alt="" />
            <span>Reference Picker</span>
            <select
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value as OrganId)}
              className="reference-picker"
            >
              {organs
                .filter((item) => item.id !== organId)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.system})
                  </option>
                ))}
            </select>
            <small>{reference.system}</small>
          </div>

          <dl className="compare-grid">
            <div>
              <dt>Primary Role</dt>
              <dd><b>{organ.name}:</b> {organ.function}</dd>
              <dd><b>{reference.name}:</b> {reference.function}</dd>
            </div>
            <div>
              <dt>Physical Scale & Weight</dt>
              <dd><b>{organ.name}:</b> {organ.size} ({organ.weight})</dd>
              <dd><b>{reference.name}:</b> {reference.size} ({reference.weight})</dd>
            </div>
            <div>
              <dt>Tissue & Vascular Supply</dt>
              <dd><b>{organ.name}:</b> {organ.tissue} · {organ.bloodSupply}</dd>
              <dd><b>{reference.name}:</b> {reference.tissue} · {reference.bloodSupply}</dd>
            </div>
          </dl>

          <button onClick={() => setCompare(false)} aria-label="Close comparison">
            <X size={16} />
          </button>
        </section>
      )}

      {/* Interactive Learning Cards Section */}
      <section className="learning-cards" aria-label={`${organ.name} learning resources`}>
        <article className="curiosity-card">
          <span>✿</span>
          <p>Learning is<br />an act of curiosity.</p>
          <em>Keep exploring!</em>
        </article>

        <article>
          <header>
            <div>
              <em>Histology & Cytology</em>
              <h3>{organ.histology.tissueType}</h3>
            </div>
            <Microscope size={17} />
          </header>
          <div className="microscope-visual organ-card-image">
            <OrganArt organ={organ} asset="microscopic" alt={`${organ.name} microscopic tissue view`} />
          </div>
          <button onClick={() => openModalTab("lesson", "histology")}>
            Explore cells <ArrowRight size={14} />
          </button>
        </article>

        <article>
          <header>
            <div>
              <em>3D Structures ({organ.hotspots.length})</em>
              <h3>Hotspots & AI Tutor</h3>
            </div>
            <Bot size={17} />
          </header>
          <div className="hotspots-card-preview">
            {organ.hotspots.slice(0, 3).map((h) => (
              <button
                key={h.id}
                className="spot-chip"
                onClick={() => askAiAboutHotspot(h.label, h.detail)}
                title="Click to ask Groq AI about this structure"
              >
                <strong>{h.label}</strong>
                <small>Ask AI →</small>
              </button>
            ))}
          </div>
          <button onClick={() => openModalTab("lesson", "structures")}>
            View structures <ArrowRight size={14} />
          </button>
        </article>

        <article>
          <header>
            <div>
              <em>Function animation</em>
              <h3>{organ.function}</h3>
            </div>
            <Play size={17} />
          </header>
          <button
            type="button"
            className="function-visual organ-card-image"
            onClick={() => setModal("animation")}
            aria-label={`Play the ${organ.name.toLowerCase()} function animation`}
          >
            <OrganArt organ={organ} asset="organ" alt="" />
            <i className="function-pulse" style={{ animationDuration: `${60 / bpm}s` }} />
            <span className="play-badge"><Play size={18} fill="currentColor" /></span>
          </button>
          <button onClick={() => setModal("animation")}>
            Play animation <ArrowRight size={14} />
          </button>
        </article>

        <article>
          <header>
            <div>
              <em>Research & Clinical</em>
              <h3>Landmark Discoveries</h3>
            </div>
            <FileText size={17} />
          </header>
          <ul>
            {organ.research.map((r) => (
              <li key={r.title}><strong>{r.year}:</strong> {r.title}</li>
            ))}
          </ul>
          <button onClick={() => openModalTab("lesson", "research")}>
            View breakthroughs <ArrowRight size={14} />
          </button>
        </article>
      </section>

      <footer className="app-footer">
        <p>
          Anatomy Lab 3D ✦ Groq AI Llama 3.3 70B Medical Assistant — Developed by <strong>Rohit</strong>
        </p>
      </footer>

      {/* Dynamic Modals */}
      {modal && (
        <LearningModal
          type={modal}
          organ={organ}
          notes={notes[organ.id] || ""}
          notesLastSaved={notesLastSaved}
          allNotes={notes}
          recentOrgans={recentOrgans}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          onSaveNotes={(text) => saveNoteForOrgan(organ.id, text)}
          onClearNotes={() => clearNoteForOrgan(organ.id)}
          onDownloadNotes={handleDownloadNotes}
          onSelectOrgan={selectOrgan}
          activeLessonTab={activeLessonTab}
          setActiveLessonTab={setActiveLessonTab}
          bpm={bpm}
          setBpm={setBpm}
          onAddXP={addXP}
          totalXP={totalXP}
          onClose={() => {
            setModal(null);
            setAiPrompt("");
          }}
        />
      )}

      {mobileLibrary && (
        <button
          className="drawer-backdrop"
          aria-label="Close library"
          onClick={() => setMobileLibrary(false)}
        />
      )}
    </main>
  );
}

const MODAL_ICON: Record<Exclude<Modal, null>, string> = {
  quiz: "?",
  "labeling-quiz": "⌖",
  animation: "▶",
  system: "⌖",
  lesson: "✦",
  notes: "✍",
  developer: "⚙",
  flashcards: "⬡",
  calculator: "🖩",
  "ai-assistant": "🤖",
  "ai-cases": "🩺",
  dashboard: "🏆",
  teacher: "👥",
  pubmed: "📚",
};

function LearningModal({
  type,
  organ,
  notes,
  notesLastSaved,
  allNotes,
  recentOrgans,
  aiPrompt,
  setAiPrompt,
  onSaveNotes,
  onClearNotes,
  onDownloadNotes,
  onSelectOrgan,
  activeLessonTab,
  setActiveLessonTab,
  bpm,
  setBpm,
  onAddXP,
  totalXP,
  onClose,
}: {
  type: Exclude<Modal, null>;
  organ: Organ;
  notes: string;
  notesLastSaved: string | null;
  allNotes: Record<string, string>;
  recentOrgans: OrganId[];
  aiPrompt: string;
  setAiPrompt: (p: string) => void;
  onSaveNotes: (text: string) => void;
  onClearNotes: () => void;
  onDownloadNotes: () => void;
  onSelectOrgan: (id: OrganId) => void;
  activeLessonTab: LessonTab;
  setActiveLessonTab: (tab: LessonTab) => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  onAddXP: (xp: number) => void;
  totalXP: number;
  onClose: () => void;
}) {
  const organName = organ.name;

  // Groq AI Chat Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState(aiPrompt || "");
  const [aiLoading, setAiLoading] = useState(false);
  const [tone, setTone] = useState<TutorTone>("med-student");
  const [aiFullscreen, setAiFullscreen] = useState(false);

  // AI Clinical Case Simulator State
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [caseLoading, setCaseLoading] = useState(false);
  const [selectedDiag, setSelectedDiag] = useState<number | null>(null);

  // 3D Pin Labeling Quiz State
  const [pinIndex, setPinIndex] = useState(0);
  const [pinSelected, setPinSelected] = useState<string | null>(null);
  const [pinScore, setPinScore] = useState(0);

  // Multiple Choice Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Flashcards State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  // Calculator State
  const [calcHr, setCalcHr] = useState(72);
  const [calcSv, setCalcSv] = useState(70);
  const [calcCr, setCalcCr] = useState(1.0);
  const [calcAge, setCalcAge] = useState(40);

  // Teacher Class Creator
  const [className, setClassName] = useState("");
  const [createdClassCode, setCreatedClassCode] = useState<string | null>(null);

  const questions = organ.quizQuestions;
  const cards = organ.flashcards;

  useEffect(() => {
    if (aiPrompt && type === "ai-assistant") {
      setInputQuery(aiPrompt);
    }
  }, [aiPrompt, type]);

  const handleSendAiMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputQuery;
    if (!textToSend.trim() || aiLoading) return;

    const newHistory: ChatMessage[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newHistory);
    setInputQuery("");
    setAiLoading(true);

    const answer = await askGroqTutor(textToSend, messages, {
      name: organ.name,
      system: organ.system,
      function: organ.function,
      parts: organ.parts,
    }, tone);

    setMessages([...newHistory, { role: "assistant", content: answer }]);
    setAiLoading(false);
    onAddXP(10);
  };

  const loadAiCase = async () => {
    setCaseLoading(true);
    setSelectedDiag(null);
    const caseData = await generateClinicalCase(organ.name);
    setClinicalCase(caseData);
    setCaseLoading(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === questions[currentQIndex].correct;
    if (isCorrect) {
      audioSynth.speakText("Correct answer!");
      setQuizScore((prev) => prev + 1);
    } else {
      audioSynth.speakText("Incorrect. Review explanation.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      onAddXP(quizScore * 100);
      setQuizFinished(true);
    }
  };

  const title =
    type === "ai-assistant" ? `Dr. Rohit AI Tutor (Groq Llama 3.3 70B)`
    : type === "ai-cases" ? `${organName} AI Clinical Case Simulator`
    : type === "labeling-quiz" ? `${organName} 3D Pin Identification Quiz`
    : type === "dashboard" ? `Student Progress & Spaced-Repetition`
    : type === "teacher" ? `Teacher Portal & Class Assignments`
    : type === "pubmed" ? `PubMed Medical Papers — ${organName}`
    : type === "quiz" ? `${organName} Medical Board Quiz`
    : type === "animation" ? `${organName} Physiology & Sound Synth`
    : type === "system" ? `${organ.system} Body System`
    : type === "notes" ? `${organName} Personal Study Notes`
    : type === "flashcards" ? `${organName} Spaced-Repetition Flashcards`
    : type === "calculator" ? `Clinical Physiological Calculator`
    : type === "developer" ? `Anatomy Lab 3D · Developer Diagnostics`
    : `${organName} Guided Masterclass`;

  const handleToggleFullscreen = () => {
    if (!aiFullscreen) {
      setAiFullscreen(true);
      if (document.documentElement.requestFullscreen) {
        void document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setAiFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        void document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleCloseModal = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      void document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={handleCloseModal}>
      <section
        className={`learning-modal ${aiFullscreen ? "ai-chat-fullscreen" : ""} ${type === "system" || type === "notes" || type === "lesson" || type === "developer" || type === "calculator" || type === "flashcards" || type === "ai-assistant" || type === "ai-cases" || type === "dashboard" || type === "teacher" || type === "pubmed" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
          <X size={18} />
        </button>

        <span className="modal-icon">{MODAL_ICON[type]}</span>
        <em>{type === "developer" ? "Developer: Rohit" : "Interactive AI & Study Platform"}</em>
        <h2 id="modal-title">{title}</h2>

        {/* -------------------- GROQ AI TUTOR CHAT -------------------- */}
        {type === "ai-assistant" ? (
          <div className={`ai-chat-container ${aiFullscreen ? "fullscreen" : ""}`}>
            <div className="ai-tone-bar">
              <span>Tutor Level:</span>
              <button className={tone === "high-school" ? "active" : ""} onClick={() => setTone("high-school")}>High School</button>
              <button className={tone === "med-student" ? "active" : ""} onClick={() => setTone("med-student")}>1st-Year Med Student</button>
              <button className={tone === "board-specialist" ? "active" : ""} onClick={() => setTone("board-specialist")}>Board Specialist</button>

              <button
                type="button"
                className={`ai-fullscreen-btn ${aiFullscreen ? "active" : ""}`}
                onClick={handleToggleFullscreen}
                title={aiFullscreen ? "Exit Fullscreen Mode" : "Expand Fullscreen Mode"}
              >
                {aiFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{aiFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </button>
            </div>

            <div className="ai-messages-list">
              {messages.length === 0 ? (
                <div className="ai-welcome">
                  <Bot size={40} className="ai-bot-icon" />
                  <p>Welcome! I am <strong>Dr. Rohit AI</strong>, powered by Groq Llama 3.3 70B. Ask me any complex medical, histological, or physiological question about the <strong>{organ.name}</strong>!</p>

                  <div className="ai-prompt-chips">
                    <button onClick={() => handleSendAiMessage(`Explain the cell signaling pathways in the ${organ.name}.`)}>
                      ⚡ Explain Cell Signaling
                    </button>
                    <button onClick={() => handleSendAiMessage(`What is the primary differential diagnosis for acute ${organ.name} pain?`)}>
                      🩺 Differential Diagnosis
                    </button>
                    <button onClick={() => handleSendAiMessage(`Generate 2 USMLE board-style questions for the ${organ.name}.`)}>
                      ❓ Generate Board Questions
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`chat-bubble ${m.role}`}>
                    <strong>{m.role === "user" ? "You" : "Dr. Rohit AI (Groq Llama 3.3)"}</strong>
                    <div className="bubble-content">
                      <FormattedMarkdown text={m.content} />
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="chat-bubble assistant loading">
                  <Bot size={18} className="pulse" /> Dr. Rohit AI is thinking...
                </div>
              )}
            </div>

            <div className="ai-input-row">
              <input
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendAiMessage(); }}
                placeholder={`Ask Dr. Rohit AI about ${organ.name} anatomy, histology, or pathology...`}
              />
              <button className="lesson-button" onClick={() => handleSendAiMessage()} disabled={aiLoading}>
                Send Query →
              </button>
            </div>
          </div>
        ) : type === "ai-cases" ? (
          /* -------------------- AI CLINICAL CASE SIMULATOR -------------------- */
          <div className="ai-cases-simulator">
            {!clinicalCase && !caseLoading ? (
              <div className="start-case-screen">
                <Stethoscope size={48} />
                <p>Generate a real-time clinical patient case study for the <strong>{organ.name}</strong> using Groq Llama 3.3 70B AI.</p>
                <button className="lesson-button" onClick={loadAiCase}>
                  Generate Clinical Case →
                </button>
              </div>
            ) : caseLoading ? (
              <div className="start-case-screen">
                <Bot size={40} className="pulse" />
                <p>Synthesizing patient history, lab values, and diagnostic imaging for {organ.name}...</p>
              </div>
            ) : clinicalCase ? (
              <div className="case-content">
                <div className="vignette-card">
                  <h3>{clinicalCase.title}</h3>
                  <p><strong>Patient Profile:</strong> {clinicalCase.patientProfile}</p>
                  <p><strong>History of Present Illness:</strong> {clinicalCase.history}</p>
                  <p><strong>Physical Examination:</strong> {clinicalCase.physicalExam}</p>
                  <p><strong>Laboratory Findings:</strong> {clinicalCase.labResults}</p>
                  <p><strong>Diagnostic Imaging:</strong> {clinicalCase.imaging}</p>
                </div>

                <div className="case-question-box">
                  <h4>{clinicalCase.question}</h4>
                  <div className="quiz-options">
                    {clinicalCase.options.map((opt, idx) => {
                      const isSelected = selectedDiag === idx;
                      const isCorrect = idx === clinicalCase.correctIndex;
                      let btnClass = "";
                      if (selectedDiag !== null) {
                        if (isCorrect) btnClass = "correct";
                        else if (isSelected) btnClass = "incorrect";
                      }
                      return (
                        <button
                          key={opt}
                          className={`quiz-option-btn ${btnClass}`}
                          onClick={() => {
                            if (selectedDiag === null) {
                              setSelectedDiag(idx);
                              if (idx === clinicalCase.correctIndex) onAddXP(150);
                            }
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDiag !== null && (
                    <div className={`quiz-explanation ${selectedDiag === clinicalCase.correctIndex ? "correct" : "incorrect"}`}>
                      <strong>{selectedDiag === clinicalCase.correctIndex ? "✓ Correct Diagnosis! (+150 XP)" : "✕ Incorrect Diagnosis"}</strong>
                      <p>{clinicalCase.explanation}</p>
                      <button className="lesson-button" onClick={loadAiCase} style={{ marginTop: "10px" }}>
                        Next Clinical Case →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : type === "labeling-quiz" ? (
          /* -------------------- 3D PIN IDENTIFICATION QUIZ -------------------- */
          <div className="labeling-quiz-flow">
            <p>Identify the key 3D structure on the {organ.name}:</p>
            <div className="target-structure-box">
              <span>Structure to Identify:</span>
              <strong>{organ.hotspots[pinIndex]?.label || "Structure"}</strong>
            </div>

            <div className="pin-options-grid">
              {organ.hotspots.map((spot) => (
                <button
                  key={spot.id}
                  className={`pin-choice-btn ${pinSelected === spot.id ? (spot.id === organ.hotspots[pinIndex].id ? "correct" : "incorrect") : ""}`}
                  onClick={() => {
                    setPinSelected(spot.id);
                    if (spot.id === organ.hotspots[pinIndex].id) {
                      setPinScore((prev) => prev + 1);
                      onAddXP(50);
                      audioSynth.speakText("Correct pin!");
                    }
                  }}
                >
                  📍 {spot.detail}
                </button>
              ))}
            </div>

            {pinSelected && (
              <button
                className="lesson-button"
                onClick={() => {
                  setPinSelected(null);
                  setPinIndex((prev) => (prev + 1) % organ.hotspots.length);
                }}
                style={{ marginTop: "1rem" }}
              >
                Next Pin ({pinIndex + 1}/{organ.hotspots.length}) →
              </button>
            )}
          </div>
        ) : type === "dashboard" ? (
          /* -------------------- STUDENT DASHBOARD -------------------- */
          <div className="student-dashboard">
            <div className="dash-stats">
              <div className="stat-card">
                <span>Total XP</span>
                <strong>{totalXP} XP</strong>
              </div>
              <div className="stat-card">
                <span>Organs Explored</span>
                <strong>{recentOrgans.length} / {organs.length}</strong>
              </div>
              <div className="stat-card">
                <span>Study Notes Saved</span>
                <strong>{Object.keys(allNotes).length} Notes</strong>
              </div>
            </div>

            <h4>Recent Organs Explored</h4>
            <div className="recent-organs-list">
              {recentOrgans.map((id) => (
                <button key={id} className="recent-organ-chip" onClick={() => { onSelectOrgan(id); onClose(); }}>
                  <OrganArt organ={organById[id]} asset="thumb" alt="" size={28} />
                  <span>{organById[id].name}</span>
                </button>
              ))}
            </div>

            <h4>Achievement Badges</h4>
            <div className="badges-grid">
              <div className={`badge-card ${totalXP >= 100 ? "unlocked" : ""}`}>
                <Trophy size={20} />
                <span>Anatomy Initiate</span>
                <small>Earn 100 XP</small>
              </div>
              <div className={`badge-card ${totalXP >= 500 ? "unlocked" : ""}`}>
                <Sparkles size={20} />
                <span>Quiz Scholar</span>
                <small>Earn 500 XP</small>
              </div>
              <div className={`badge-card ${recentOrgans.length >= 9 ? "unlocked" : ""}`}>
                <Compass size={20} />
                <span>Full Body Master</span>
                <small>Explore all 9 Organs</small>
              </div>
            </div>
          </div>
        ) : type === "teacher" ? (
          /* -------------------- TEACHER PORTAL -------------------- */
          <div className="teacher-portal">
            <p>Create a class and assign 3D organ masterclass modules to your students:</p>
            <div className="create-class-box">
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Bio 101 - Spring Semester"
              />
              <button
                className="lesson-button"
                onClick={() => {
                  if (className.trim()) {
                    setCreatedClassCode(`ANAT-${Math.floor(1000 + Math.random() * 9000)}`);
                  }
                }}
              >
                Create Class & Code
              </button>
            </div>

            {createdClassCode && (
              <div className="class-code-banner">
                <span>Class Created! Share Join Code with Students:</span>
                <strong>{createdClassCode}</strong>
              </div>
            )}
          </div>
        ) : type === "pubmed" ? (
          /* -------------------- PUBMED RESEARCH PAPERS -------------------- */
          <div className="pubmed-list">
            <p>Recent peer-reviewed PubMed articles for {organName}:</p>
            <div className="research-timeline">
              <div className="research-item">
                <span className="res-year">PMC</span>
                <div>
                  <strong>Recent Advances in {organName} Pathophysiology and Regenerative Medicine</strong>
                  <em>Journal of Clinical Investigation</em>
                  <p>Comprehensive review of cellular signaling and tissue repair mechanisms.</p>
                </div>
              </div>
              <div className="research-item">
                <span className="res-year">PMC</span>
                <div>
                  <strong>Microscopic Endothelial and Epithelial Barrier Regulation in {organName}</strong>
                  <em>Nature Medicine</em>
                  <p>Study investigating vascular tight junction integrity during ischemic injury.</p>
                </div>
              </div>
            </div>
          </div>
        ) : type === "flashcards" ? (
          /* -------------------- ACTIVE RECALL FLASHCARDS -------------------- */
          <div className="flashcards-suite">
            <div className="flashcard-progress">
              <span>Card {cardIndex + 1} of {cards.length}</span>
              <span>Mastered: {masteredCount} / {cards.length}</span>
            </div>

            <div
              className={`flashcard-3d ${isFlipped ? "flipped" : ""}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="card-face card-front">
                <span className="card-topic">{cards[cardIndex].topic}</span>
                <p>{cards[cardIndex].front}</p>
                <small>Click to flip card ↺</small>
              </div>

              <div className="card-face card-back">
                <span className="card-topic">Answer</span>
                <p>{cards[cardIndex].back}</p>
                <button
                  type="button"
                  className="speech-btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSynth.speakText(cards[cardIndex].back);
                  }}
                >
                  <Volume2 size={14} /> Listen
                </button>
              </div>
            </div>

            <div className="flashcard-controls">
              <button
                className="lesson-button review-btn"
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => (prev + 1) % cards.length);
                }}
              >
                Needs Review
              </button>
              <button
                className="lesson-button master-btn"
                onClick={() => {
                  setMasteredCount((prev) => prev + 1);
                  onAddXP(25);
                  setIsFlipped(false);
                  setCardIndex((prev) => (prev + 1) % cards.length);
                }}
              >
                Got It! (+25 XP)
              </button>
            </div>
          </div>
        ) : type === "calculator" ? (
          /* -------------------- CLINICAL CALCULATORS -------------------- */
          <div className="clinical-calculators-grid">
            <div className="calc-card">
              <h4><Heart size={16} /> Cardiac Output ($CO = HR \times SV$)</h4>
              <div className="calc-input-group">
                <label>Heart Rate (BPM): <strong>{calcHr}</strong></label>
                <input type="range" min="40" max="180" value={calcHr} onChange={(e) => setCalcHr(Number(e.target.value))} />
              </div>
              <div className="calc-input-group">
                <label>Stroke Volume (mL): <strong>{calcSv}</strong></label>
                <input type="range" min="40" max="120" value={calcSv} onChange={(e) => setCalcSv(Number(e.target.value))} />
              </div>
              <div className="calc-result">
                <span>Calculated CO:</span>
                <strong>{((calcHr * calcSv) / 1000).toFixed(2)} L/min</strong>
                <small>{(calcHr * calcSv) / 1000 >= 4.0 && (calcHr * calcSv) / 1000 <= 8.0 ? "✓ Normal Resting Range" : "⚠ Outside Normal Range"}</small>
              </div>
            </div>

            <div className="calc-card">
              <h4><Sparkles size={16} /> Estimated GFR & Kidney Function</h4>
              <div className="calc-input-group">
                <label>Serum Creatinine (mg/dL): <strong>{calcCr}</strong></label>
                <input type="range" min="0.4" max="5.0" step="0.1" value={calcCr} onChange={(e) => setCalcCr(Number(e.target.value))} />
              </div>
              <div className="calc-input-group">
                <label>Patient Age (years): <strong>{calcAge}</strong></label>
                <input type="range" min="18" max="90" value={calcAge} onChange={(e) => setCalcAge(Number(e.target.value))} />
              </div>
              <div className="calc-result">
                <span>Estimated eGFR:</span>
                <strong>{Math.round(141 * Math.pow(calcCr / 0.9, -1.209) * Math.pow(0.993, calcAge))} mL/min/1.73m²</strong>
                <small>{calcCr <= 1.2 ? "Stage 1 (Normal kidney function)" : calcCr <= 2.0 ? "Stage 2/3 (Mild-moderate CKD)" : "Stage 4/5 (Severe renal impairment)"}</small>
              </div>
            </div>
          </div>
        ) : type === "quiz" ? (
          /* -------------------- MULTI-QUESTION QUIZ SYSTEM -------------------- */
          <div className="quiz-flow">
            {!quizFinished ? (
              <>
                <div className="quiz-progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                  />
                  <span>Question {currentQIndex + 1} of {questions.length}</span>
                </div>

                <p className="quiz-question-text">{questions[currentQIndex].q}</p>

                <div className="quiz-options">
                  {questions[currentQIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === questions[currentQIndex].correct;
                    let btnClass = "";
                    if (selectedAnswer !== null) {
                      if (isCorrect) btnClass = "correct";
                      else if (isSelected) btnClass = "incorrect";
                    }

                    return (
                      <button
                        key={option}
                        className={`quiz-option-btn ${btnClass}`}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="opt-letter">{String.fromCharCode(65 + idx)}.</span>
                        <span className="opt-text">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className={`quiz-explanation ${selectedAnswer === questions[currentQIndex].correct ? "correct" : "incorrect"}`}>
                    <strong>
                      {selectedAnswer === questions[currentQIndex].correct ? "✓ Correct!" : "✕ Incorrect"}
                    </strong>
                    <p>{questions[currentQIndex].explanation}</p>
                    <button className="lesson-button" onClick={handleNextQuestion}>
                      {currentQIndex < questions.length - 1 ? "Next Question →" : "See Final Score →"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="quiz-completion">
                <Trophy size={48} className="trophy-icon" />
                <h3>Quiz Complete!</h3>
                <p className="score-summary">
                  You scored <strong>{quizScore} / {questions.length}</strong> ({Math.round((quizScore / questions.length) * 100)}%)
                </p>
                <div className="xp-reward">
                  <Zap size={18} /> <span>+{quizScore * 100} XP Earned! Total: {totalXP} XP</span>
                </div>
                <div className="notes-actions" style={{ marginTop: "1rem" }}>
                  <button className="lesson-button" onClick={() => { setCurrentQIndex(0); setSelectedAnswer(null); setQuizScore(0); setQuizFinished(false); }}>
                    <RotateCcw size={16} /> Retake Quiz
                  </button>
                  <button className="lesson-button" onClick={onClose}>
                    Continue Exploring
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : type === "notes" ? (
          /* -------------------- PERSISTENT STUDY NOTES -------------------- */
          <div className="notes-editor">
            <p>Write your personal study notes and clinical observations for the {organName.toLowerCase()}:</p>
            <textarea
              value={notes}
              onChange={(e) => onSaveNotes(e.target.value)}
              placeholder="e.g. Study blood supply, histology cell types, and physiological formulas..."
              rows={7}
            />
            {notesLastSaved && <span className="saved-timestamp">✓ Auto-saved at {notesLastSaved}</span>}

            <div className="notes-actions">
              <button className="lesson-button" onClick={onDownloadNotes}>
                Download Notes (.txt) <ArrowRight size={16} />
              </button>
              {notes && (
                <button className="lesson-button clear-btn" onClick={onClearNotes}>
                  Clear Notes
                </button>
              )}
            </div>
          </div>
        ) : type === "system" ? (
          /* -------------------- INTERACTIVE BODY SYSTEM MODAL -------------------- */
          <div className="system-explorer">
            <p>
              The <strong>{organName}</strong> is a core component of the <strong>{organ.system}</strong>. Explore all organs operating within this physiological network:
            </p>

            <div className="system-organs-grid">
              {organs
                .filter((o) => o.system === organ.system)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`system-organ-chip ${item.id === organ.id ? "active" : ""}`}
                    onClick={() => {
                      onSelectOrgan(item.id);
                      onClose();
                    }}
                  >
                    <OrganArt organ={item} asset="thumb" alt="" size={32} />
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.scientificName}</small>
                    </div>
                  </button>
                ))}
            </div>

            <div className="rule" />
            <figure className="modal-figure">
              <OrganArt organ={organ} asset="location" alt={`${organName} shown in place within the ${organ.system}`} />
            </figure>

            <dl className="modal-facts">
              <div><dt>System</dt><dd>{organ.system}</dd></div>
              <div><dt>Primary role</dt><dd>{organ.function}</dd></div>
              <div><dt>Blood supply</dt><dd>{organ.bloodSupply}</dd></div>
            </dl>

            <button className="lesson-button" onClick={onClose}>
              Continue exploring <ArrowRight size={16} />
            </button>
          </div>
        ) : type === "animation" ? (
          /* -------------------- FUNCTIONAL ANIMATION HUB -------------------- */
          <div className="animation-hub">
            <p>
              Interactive physiological rate controls for the {organName.toLowerCase()}. Adjust rate slider to modulate Web Audio sound synthesis and ECG HUD waveform speed.
            </p>

            <div className="rate-control-card">
              <label>
                <Sliders size={16} /> Rate Controller: <strong>{organ.id === "heart" ? `${bpm} BPM` : organ.id === "lungs" ? `${Math.round(bpm / 5)} Breaths/min` : `${bpm} Hz`}</strong>
              </label>
              <input
                type="range"
                min="40"
                max="180"
                step="2"
                value={bpm}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBpm(val);
                  if (organ.id === "heart") audioSynth.playHeartbeat(val);
                  else if (organ.id === "lungs") audioSynth.playBreathing();
                }}
              />
              <div className="rate-presets">
                <button onClick={() => { setBpm(50); if (organ.id === "heart") audioSynth.playHeartbeat(50); }}>Bradycardia (50)</button>
                <button onClick={() => { setBpm(72); if (organ.id === "heart") audioSynth.playHeartbeat(72); }}>Resting (72)</button>
                <button onClick={() => { setBpm(130); if (organ.id === "heart") audioSynth.playHeartbeat(130); }}>Exercise (130)</button>
              </div>
            </div>

            <div className="modal-demo moving">
              <OrganArt organ={organ} asset="organ" alt={`${organName} illustration`} />
            </div>

            <button className="lesson-button" onClick={onClose}>
              Done <ArrowRight size={16} />
            </button>
          </div>
        ) : type === "developer" ? (
          /* -------------------- DEVELOPER PROFILE & DIAGNOSTICS -------------------- */
          <div className="developer-diag">
            <div className="dev-header">
              <div className="dev-avatar">R</div>
              <div>
                <h3>Rohit</h3>
                <p>Lead Developer & Architect — Anatomy Lab 3D</p>
              </div>
            </div>

            <div className="rule" />

            <h4>System Diagnostics</h4>
            <ul className="diag-list">
              <li><span>AI Engine:</span> <strong>Groq API (Llama 3.3 70B Versatile)</strong></li>
              <li><span>3D WebGL Engine:</span> <strong>Three.js 0.185 (ACES Filmic, sRGB)</strong></li>
              <li><span>Audio Synthesizer:</span> <strong>Web Audio API + Web Speech TTS</strong></li>
              <li><span>Database Schema:</span> <strong>Cloudflare D1 / Drizzle ORM</strong></li>
            </ul>

            <h4>Keyboard & Voice Shortcuts</h4>
            <div className="shortcuts-grid">
              <div><kbd>←</kbd> <kbd>→</kbd> <span>Rotate Model</span></div>
              <div><kbd>+</kbd> <kbd>-</kbd> <span>Zoom In / Out</span></div>
              <div><kbd>Esc</kbd> <span>Deselect Hotspot</span></div>
            </div>

            <button className="lesson-button" onClick={onClose} style={{ marginTop: "1rem" }}>
              Close Diagnostics <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* -------------------- 6-TAB GUIDED MASTERCLASS LESSON MODAL -------------------- */
          <div className="lesson-tabs-container">
            <nav className="lesson-nav-tabs">
              <button
                className={activeLessonTab === "overview" ? "active" : ""}
                onClick={() => setActiveLessonTab("overview")}
              >
                <Info size={15} /> Overview
              </button>
              <button
                className={activeLessonTab === "structures" ? "active" : ""}
                onClick={() => setActiveLessonTab("structures")}
              >
                <Key size={15} /> 3D Structures ({organ.hotspots.length})
              </button>
              <button
                className={activeLessonTab === "physiology" ? "active" : ""}
                onClick={() => setActiveLessonTab("physiology")}
              >
                <Zap size={15} /> Physiology & Formulas
              </button>
              <button
                className={activeLessonTab === "histology" ? "active" : ""}
                onClick={() => setActiveLessonTab("histology")}
              >
                <Microscope size={15} /> Histology & Cells
              </button>
              <button
                className={activeLessonTab === "research" ? "active" : ""}
                onClick={() => setActiveLessonTab("research")}
              >
                <Sparkles size={15} /> Research
              </button>
              <button
                className={activeLessonTab === "clinical" ? "active" : ""}
                onClick={() => setActiveLessonTab("clinical")}
              >
                <Stethoscope size={15} /> Clinical
              </button>
              <button
                className={activeLessonTab === "pharmacology" ? "active" : ""}
                onClick={() => setActiveLessonTab("pharmacology")}
              >
                <Bot size={15} /> Pharm & Genetics
              </button>
            </nav>

            <div className="lesson-tab-body">
              {activeLessonTab === "pharmacology" && (
                <div className="lesson-section">
                  <h4>USMLE & Clinical Pharmacology Targets</h4>
                  <div className="formulas-list">
                    {organ.pharmacology?.map((pharm) => (
                      <div key={pharm.drugClass} className="formula-card">
                        <strong>💊 {pharm.drugClass}</strong>
                        <code className="formula-code">{pharm.mechanism}</code>
                        <p><strong>Clinical Indication:</strong> {pharm.clinicalIndication}</p>
                      </div>
                    ))}
                  </div>

                  <h4>Pathology Genetics & Mutations</h4>
                  <div className="research-timeline">
                    {organ.genetics?.map((g) => (
                      <div key={g.gene} className="research-item">
                        <span className="res-year">{g.gene}</span>
                        <div>
                          <strong>{g.condition}</strong>
                          <p>{g.mechanism}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeLessonTab === "overview" && (
                <div className="lesson-section">
                  <p>{organ.lesson.overview}</p>
                  <h4>Anatomical Parts & Structures</h4>
                  <div className="parts-grid-list">
                    {organ.parts.map((p) => (
                      <div key={p.id} className="part-card">
                        <strong>{p.name}</strong>
                        <p>{p.function}</p>
                        <small>Conditions: {p.relatedConditions.join(", ")}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLessonTab === "structures" && (
                <div className="lesson-section">
                  <p>Click any structure below to listen to commentary or ask Groq AI:</p>
                  <div className="hotspots-lesson-grid">
                    {organ.hotspots.map((spot) => (
                      <div key={spot.id} className="hotspot-lesson-card" style={{ borderLeftColor: spot.color }}>
                        <strong>{spot.label}</strong>
                        <small>{spot.detail}</small>
                        <div className="spot-card-actions">
                          <button onClick={() => audioSynth.speakText(`${spot.label}. ${spot.detail}`)} title="Listen to audio">
                            <Volume2 size={14} /> Listen
                          </button>
                          <button onClick={() => askAiAboutHotspot(spot.label, spot.detail)} title="Ask Dr. Rohit AI">
                            <Bot size={14} /> Ask AI
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLessonTab === "physiology" && (
                <div className="lesson-section">
                  <p>{organ.lesson.physiology}</p>
                  <h4>Key Physiological Formulas</h4>
                  <div className="formulas-list">
                    {organ.formulas.map((f) => (
                      <div key={f.title} className="formula-card">
                        <strong>{f.title}</strong>
                        <code className="formula-code">{f.formula}</code>
                        <p>{f.description}</p>
                        <small>Normal Range: {f.normalValue}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLessonTab === "histology" && (
                <div className="lesson-section">
                  <h4>Histological Architecture</h4>
                  <p><b>Tissue Type:</b> {organ.histology.tissueType}</p>
                  <p><b>Staining Characteristics:</b> {organ.histology.stain}</p>

                  <h4>Primary Cell Types</h4>
                  <ul className="cell-types-list">
                    {organ.histology.primaryCells.map((cell) => (
                      <li key={cell}><Microscope size={14} /> {cell}</li>
                    ))}
                  </ul>

                  <div className="medical-note">
                    <Microscope size={16} />
                    <p><b>Microscopic Feature:</b> {organ.histology.microscopicNote}</p>
                  </div>
                </div>
              )}

              {activeLessonTab === "research" && (
                <div className="lesson-section">
                  <h4>Landmark Research Discoveries</h4>
                  <div className="research-timeline">
                    {organ.research.map((r) => (
                      <div key={r.title} className="research-item">
                        <span className="res-year">{r.year}</span>
                        <div>
                          <strong>{r.title}</strong>
                          <em>{r.researcher}</em>
                          <p>{r.summary}</p>
                          <small>Impact: {r.impact}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLessonTab === "clinical" && (
                <div className="lesson-section">
                  <p>{organ.lesson.clinical}</p>
                  <h4>Clinical Pathology List</h4>
                  <ul className="conditions-grid-list">
                    {organ.conditions.map((cond) => (
                      <li key={cond}><Stethoscope size={14} /> {cond}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button className="lesson-button" onClick={onClose} style={{ marginTop: "1rem" }}>
              Continue exploring <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
