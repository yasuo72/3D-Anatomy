"use client";

import { useEffect, useRef } from "react";

type Props = {
  organId: string;
  organName: string;
  system: string;
  bpm?: number;
};

export function Ecghud({ organId, organName, system, bpm = 72 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let step = 0;
    const isHeart = organId === "heart";

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;

      // Grid baseline
      ctx.strokeStyle = isHeart ? "rgba(235, 124, 107, 0.18)" : "rgba(112, 169, 203, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      // ECG wave
      ctx.strokeStyle = isHeart ? "#eb7c6b" : "#70a9cb";
      ctx.lineWidth = 1.85;
      ctx.beginPath();

      // Speed scaled dynamically based on BPM parameter (baseline 72 BPM = multiplier 1)
      const speedMultiplier = bpm / 72;

      for (let x = 0; x < w; x++) {
        const offset = (x + step) % w;
        let y = mid;

        if (isHeart) {
          // Cardiac P-QRS-T complex
          const beatPos = offset % 120;
          if (beatPos > 40 && beatPos < 46) y -= 5; // P wave
          else if (beatPos >= 46 && beatPos < 50) y += 7; // Q wave
          else if (beatPos >= 50 && beatPos < 58) y -= 26; // R spike
          else if (beatPos >= 58 && beatPos < 64) y += 11; // S wave
          else if (beatPos >= 72 && beatPos < 84) y -= 8; // T wave
        } else if (organId === "lungs") {
          // Respiratory sinusoidal wave
          y = mid + Math.sin((offset / w) * Math.PI * 4) * 10;
        } else {
          // Generic physiological pulse wave
          y = mid + Math.sin((offset / w) * Math.PI * 6) * 7;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 1.8 * speedMultiplier;
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [organId, bpm]);

  const rateLabel = organId === "heart" ? `${bpm} BPM` : organId === "lungs" ? `${Math.round(bpm / 5)} RR` : "Active";

  return (
    <div className="ecg-hud" aria-label="Physiological monitor">
      <div className="hud-header">
        <span className="hud-pulse-dot" />
        <span className="hud-title">{organName} · {system}</span>
        <span className="hud-rate-badge">{rateLabel}</span>
      </div>
      <canvas ref={canvasRef} width={180} height={42} className="hud-canvas" />
    </div>
  );
}
