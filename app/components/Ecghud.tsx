"use client";

import { useEffect, useRef } from "react";

type Props = {
  organId: string;
  organName: string;
  system: string;
};

export function Ecghud({ organId, organName, system }: Props) {
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

      // Draw grid line
      ctx.strokeStyle = "rgba(235, 124, 107, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      // Draw ECG wave
      ctx.strokeStyle = isHeart ? "#eb7c6b" : "#70a9cb";
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const offset = (x + step) % w;
        let y = mid;

        if (isHeart) {
          // Heartbeat ECG wave shape
          const phase = (offset / w) * Math.PI * 4;
          const beatPos = offset % 120;
          if (beatPos > 40 && beatPos < 46) y -= 4; // P wave
          else if (beatPos >= 46 && beatPos < 50) y += 6; // Q wave
          else if (beatPos >= 50 && beatPos < 58) y -= 24; // R spike
          else if (beatPos >= 58 && beatPos < 64) y += 10; // S wave
          else if (beatPos >= 72 && beatPos < 84) y -= 7; // T wave
        } else {
          // Smooth sine pulse for other organs
          y = mid + Math.sin((offset / w) * Math.PI * 6) * 8;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 2;
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [organId]);

  return (
    <div className="ecg-hud" aria-label="Physiological monitor">
      <div className="hud-header">
        <span className="hud-pulse-dot" />
        <span className="hud-title">{organName} · {system}</span>
      </div>
      <canvas ref={canvasRef} width={180} height={42} className="hud-canvas" />
    </div>
  );
}
