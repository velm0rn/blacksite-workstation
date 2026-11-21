import React, { useEffect, useRef, useState } from 'react';
import { Binary } from 'lucide-react';

export const Module10Matrix: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState(45);
  const [color, setColor] = useState('#00ff88');
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFBLACKSITE';
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(5, 7, 9, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, Math.max(15, 100 - speed));

    return () => clearInterval(interval);
  }, [speed, color, fontSize]);

  return (
    <div className="p-3 h-full flex flex-col gap-3">
      <div className="panel-frame px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-white flex items-center gap-2">
          <Binary className="w-4 h-4 text-[var(--accent-primary)]" />
          MODULE 10 // MATRIX CIPHER STREAM
        </span>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <label className="flex items-center gap-2">
            <span>VELOCITY</span>
            <input
              type="range"
              min="10"
              max="85"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-[#00ff88]"
            />
          </label>

          <label className="flex items-center gap-2">
            <span>DENSITY</span>
            <input
              type="range"
              min="10"
              max="22"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="accent-[#00d4ff]"
            />
          </label>

          <div className="flex items-center gap-1.5">
            {['#00ff88', '#00d4ff', '#ffb020', '#ff3355'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-4 h-4 border ${color === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="panel-frame flex-1 overflow-hidden bg-[#050709]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};