"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Heart,
  LibraryBig,
  Microscope,
  NotebookPen,
  Play,
  Search,
  Share2,
  Sparkles,
  Stethoscope,
  Sun,
  Moon,
  X,
  Volume2,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { organById, organs, type Organ, type OrganId } from "../lib/anatomy-data";
import { audioSynth } from "../lib/audio-synth";

type Modal = "lesson" | "quiz" | "animation" | "system" | "notes" | null;

/**
 * Renders an organ illustration, or its accent glyph for organs that ship as a
 * 3D model without the painted asset set. Keeps every image slot filled instead
 * of leaving a broken `<img>` behind.
 */
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
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
  const reference = organById[organId === "heart" ? "brain" : "heart"];
  const filteredOrgans = useMemo(
    () => organs.filter((item) => `${item.name} ${item.system}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    const saved = localStorage.getItem("anatomy-theme") as "light" | "dark" | null;
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("anatomy-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
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
    setMobileLibrary(false);
    setCompare(false);
  };

  const prefetchOrgan = (id: OrganId) => {
    if (id === organId || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(organById[id].model, { priority: "low" } as RequestInit).catch(() => {});
  };

  const handleSpeakOverview = () => {
    audioSynth.speakText(`${organ.name}. ${organ.scientificName}. ${organ.description}. Medical note: ${organ.medical}`);
  };

  const handleDownloadNotes = () => {
    const content = `ANATOMY LAB 3D STUDY NOTES (Developed by Rohit)\n\nOrgan: ${organ.name} (${organ.scientificName})\nSystem: ${organ.system}\n\nKey Facts:\n- Size: ${organ.size}\n- Weight: ${organ.weight}\n- Location: ${organ.location}\n- Function: ${organ.function}\n\nMy Personal Notes:\n${notes[organ.id] || "No personal notes added yet."}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${organ.id}-study-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => selectOrgan("heart")} aria-label="Anatomy Lab 3D home">
          <strong>Anatomy Lab 3D<sup>✦</sup></strong>
          <em>Developed by Rohit</em>
        </button>
        <nav className="main-nav" aria-label="Primary navigation">
          <button className="active"><Compass size={17} /> Explore</button>
          <button onClick={() => setModal("system")}><BrainCircuit size={17} /> Systems</button>
          <button onClick={() => setModal("lesson")}><BookOpen size={17} /> Lessons</button>
          <button onClick={() => setMobileLibrary(true)}><LibraryBig size={17} /> Library</button>
          <button onClick={() => setModal("notes")}><NotebookPen size={17} /> Notes</button>
        </nav>
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search organs, topics…" />
        </label>
        <div className="topbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="profile" aria-label="Rohit Developer Profile" title="Rohit — Lead Developer">
            <span>R</span><ChevronDown size={15} />
          </button>
        </div>
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label="Open organ library"><LibraryBig size={20} /></button>
      </header>

      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>Organ library</span>
            <button aria-label="Close library" className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
            <button aria-label="Saved organs"><Bookmark size={17} /></button>
          </div>
          <div className="organ-list">
            {filteredOrgans.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`organ-item ${organId === item.id ? "active" : ""}`}
                onClick={() => selectOrgan(item.id)}
                onPointerEnter={() => prefetchOrgan(item.id)}
                onFocus={() => prefetchOrgan(item.id)}
                style={{ "--item-accent": item.accent } as React.CSSProperties}
              >
                <span className="organ-glyph">
                  <OrganArt organ={item} asset="thumb" alt={`${item.name} thumbnail`} size={47} />
                </span>
                <span><b>{item.name}</b><small>{item.system}</small></span>
                {organId === item.id && <Heart className="favorite" size={14} fill="currentColor" />}
              </button>
            ))}
          </div>
          <button className="view-all" onClick={() => setQuery("")}>View all organs <ArrowRight size={14} /></button>
          <blockquote>
            <Sparkles size={18} />
            <p>Learning is<br />an act of curiosity.</p>
            <em>Keep exploring!</em>
          </blockquote>
        </aside>

        <OrganViewer
          organ={organ}
          autoRotate={autoRotate}
          onAutoRotate={setAutoRotate}
          compare={compare}
          onCompare={() => setCompare(!compare)}
        />

        <aside className="info-panel" ref={contentRef}>
          <div className="info-kicker" data-reveal><Heart size={13} fill="currentColor" /> The {organ.name}</div>
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
          <h2 data-reveal>Key facts</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> Size</dt><dd>{organ.size}</dd></div>
            <div data-reveal><dt><span>♙</span> Weight</dt><dd>{organ.weight}</dd></div>
            <div data-reveal><dt><span>⌁</span> Daily</dt><dd>{organ.dailyFact}</dd></div>
            <div data-reveal><dt><span>⌖</span> Location</dt><dd>{organ.location}</dd></div>
            <div data-reveal><dt><span>❋</span> Blood supply</dt><dd>{organ.bloodSupply}</dd></div>
            <div data-reveal><dt><span>◈</span> Function</dt><dd>{organ.function}</dd></div>
          </dl>
          <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>Medical importance</b>{organ.medical}</p></div>
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>Did you know</b>{organ.funFact}</p></div>
          <button className="lesson-button" data-reveal onClick={() => setModal("lesson")}>View lesson <ArrowRight size={16} /></button>
          <div className="action-grid" data-reveal>
            <button onClick={() => setModal("animation")}><Play size={15} /> Animate</button>
            <button onClick={() => setModal("quiz")}><CircleHelp size={15} /> Quiz</button>
            <button onClick={() => setCompare(!compare)} className={compare ? "active" : ""}><Share2 size={15} /> Compare</button>
          </div>
        </aside>
      </div>

      {compare && (
        <section className="compare-strip" aria-label="Organ comparison">
          <div className="compare-organ"><OrganArt organ={organ} asset="thumb" alt="" /><span>Comparing</span><strong>{organ.name}</strong><small>{organ.system}</small></div>
          <b>vs.</b>
          <div className="compare-organ"><OrganArt organ={reference} asset="thumb" alt="" /><span>Reference</span><strong>{reference.name}</strong><small>{reference.system}</small></div>
          <dl><div><dt>Primary role</dt><dd>{organ.function}</dd></div><div><dt>Scale</dt><dd>{organ.size}</dd></div></dl>
          <button onClick={() => setCompare(false)} aria-label="Close comparison"><X size={16} /></button>
        </section>
      )}

      <section className="learning-cards" aria-label={`${organ.name} learning resources`}>
        <article className="curiosity-card">
          <span>✿</span><p>Learning is<br />an act of curiosity.</p><em>Keep exploring!</em>
        </article>
        <article>
          <header><div><em>Microscopic view</em><h3>{organ.tissue}</h3></div><Microscope size={17} /></header>
          <div className="microscope-visual organ-card-image"><OrganArt organ={organ} asset="microscopic" alt={`${organ.name} microscopic tissue view`} /></div>
          <button onClick={() => setModal("lesson")}>Explore tissue <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>Compare organs</em><h3>{organ.comparison}</h3></div><Share2 size={17} /></header>
          <div className="comparison-visual organ-card-image"><OrganArt organ={organ} asset="compare" alt={`${organ.comparison} anatomical comparison`} /></div>
          <button onClick={() => setCompare(true)}>Open comparison <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>Function animation</em><h3>{organ.function}</h3></div><Play size={17} /></header>
          <button
            type="button"
            className="function-visual organ-card-image"
            onClick={() => setModal("animation")}
            aria-label={`Play the ${organ.name.toLowerCase()} function animation`}
          >
            <OrganArt organ={organ} asset="organ" alt="" />
            <i className="function-pulse" />
            <span className="play-badge"><Play size={18} fill="currentColor" /></span>
          </button>
          <button onClick={() => setModal("animation")}>Play animation <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>Clinical notes</em><h3>Common conditions</h3></div><FileText size={17} /></header>
          <ul>{organ.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
          <button onClick={() => setModal("lesson")}>See all <ArrowRight size={14} /></button>
        </article>
        <article className="system-card">
          <header><div><em>Where it works</em><h3>{organ.system}</h3></div><BrainCircuit size={17} /></header>
          <button
            type="button"
            className="system-visual organ-card-image"
            onClick={() => setModal("system")}
            aria-label={`See where the ${organ.name.toLowerCase()} sits in the body`}
          >
            <OrganArt organ={organ} asset="location" alt="" />
          </button>
          <button onClick={() => setModal("system")}>See the system <ArrowRight size={14} /></button>
        </article>
      </section>

      <footer className="app-footer">
        <p>Anatomy Lab 3D ✦ 3D Medical Anatomy Explorer — Designed & Developed by <strong>Rohit</strong></p>
      </footer>

      {modal && (
        <LearningModal
          type={modal}
          organ={organ}
          notes={notes[organ.id] || ""}
          onSaveNotes={(text) => setNotes({ ...notes, [organ.id]: text })}
          onDownloadNotes={handleDownloadNotes}
          onClose={() => setModal(null)}
        />
      )}
      {mobileLibrary && <button className="drawer-backdrop" aria-label="Close library" onClick={() => setMobileLibrary(false)} />}
    </main>
  );
}

const MODAL_ICON: Record<Exclude<Modal, null>, string> = {
  quiz: "?",
  animation: "▶",
  system: "⌖",
  lesson: "✦",
  notes: "✍",
};

function LearningModal({
  type,
  organ,
  notes,
  onSaveNotes,
  onDownloadNotes,
  onClose,
}: {
  type: Exclude<Modal, null>;
  organ: Organ;
  notes: string;
  onSaveNotes: (text: string) => void;
  onDownloadNotes: () => void;
  onClose: () => void;
}) {
  const organName = organ.name;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const title =
    type === "quiz" ? `${organName} Interactive Quiz`
    : type === "animation" ? `${organName} in Motion`
    : type === "system" ? `${organName} in the Body System`
    : type === "notes" ? `${organName} Study Notes`
    : `Inside the ${organName.toLowerCase()}`;

  const quizQuestions = [
    {
      q: `What is the primary physiological function of the ${organName.toLowerCase()}?`,
      options: [
        organ.function,
        "Filters metabolic wastes exclusively",
        "Regulates sleep-wake circadian rhythm",
      ],
      correct: 0,
    },
    {
      q: `Which system does the ${organName.toLowerCase()} belong to?`,
      options: [
        "Integumentary System",
        organ.system,
        "Endocrine System",
      ],
      correct: 1,
    },
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[0].correct) {
      audioSynth.speakText("Correct answer! Great job.");
      setScore(100);
    } else {
      audioSynth.speakText("Not quite right. Try reviewing key facts.");
      setScore(0);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`learning-modal ${type === "system" || type === "notes" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <span className="modal-icon">{MODAL_ICON[type]}</span>
        <em>Guided discovery</em>
        <h2 id="modal-title">{title}</h2>

        {type === "quiz" ? (
          <div className="quiz-options">
            <p>{quizQuestions[0].q}</p>
            {quizQuestions[0].options.map((option, idx) => (
              <button
                key={option}
                className={selectedAnswer === idx ? (idx === quizQuestions[0].correct ? "correct" : "incorrect") : ""}
                onClick={() => handleAnswerSelect(idx)}
              >
                {option}
              </button>
            ))}
            {score !== null && (
              <div className="quiz-result">
                <strong>{score === 100 ? "🎉 Correct! +100 XP" : "❌ Try again!"}</strong>
              </div>
            )}
          </div>
        ) : type === "notes" ? (
          <div className="notes-editor">
            <p>Write your personal study notes and clinical observations for the {organName.toLowerCase()}:</p>
            <textarea
              value={notes}
              onChange={(e) => onSaveNotes(e.target.value)}
              placeholder="e.g. Remember to study blood supply and anatomical position for upcoming medical exam..."
              rows={6}
            />
            <div className="notes-actions">
              <button className="lesson-button" onClick={onDownloadNotes}>Download Study Notes (.txt) <ArrowRight size={16} /></button>
            </div>
          </div>
        ) : type === "system" ? (
          <>
            <p>{organ.location}. Trace how the {organName.toLowerCase()} connects to the rest of the body.</p>
            <figure className="modal-figure">
              <OrganArt organ={organ} asset="location" alt={`${organName} shown in place within the ${organ.system.toLowerCase()}`} />
            </figure>
            <dl className="modal-facts">
              <div><dt>System</dt><dd>{organ.system}</dd></div>
              <div><dt>Primary role</dt><dd>{organ.function}</dd></div>
              <div><dt>Blood supply</dt><dd>{organ.bloodSupply}</dd></div>
            </dl>
            <button className="lesson-button" onClick={onClose}>Continue exploring <ArrowRight size={16} /></button>
          </>
        ) : (
          <>
            <p>Follow the highlighted structures, rotate the specimen, and connect form with function. This short study moment is designed to build a durable mental model.</p>
            <div className={`modal-demo ${type === "animation" ? "moving" : ""}`}><OrganArt organ={organ} asset="organ" alt={`${organName} illustration`} /></div>
            <button className="lesson-button" onClick={onClose}>Continue exploring <ArrowRight size={16} /></button>
          </>
        )}
      </section>
    </div>
  );
}
