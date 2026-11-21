import React, { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';

export const Module05Sigint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [freqMhz, setFreqMhz] = useState(142.85);
  const [gainDb, setGainDb] = useState(24);
  const [modulation, setModulation] = useState<'FSK' | 'QAM-64' | 'BURST'>('FSK');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animId = 0;

    const render = () => {
      frame += 1;
      const w = canvas.width;
      const h = canvas.height;

      // Shift spectrogram waterfall down
      const imgData = ctx.getImageData(0, h * 0.45, w, h * 0.55 - 2);
      ctx.putImageData(imgData, 0, h * 0.45 + 2);

      // Clear top waveform + spectrum zone
      ctx.fillStyle = '#050709';
      ctx.fillRect(0, 0, w, h * 0.45);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h * 0.45);
        ctx.stroke();
      }

      // Draw Spectrum Line & Waterfall Row
      ctx.beginPath();
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1.6;

      const centerBin = ((freqMhz - 100) / 100) * w;

      for (let x = 0; x < w; x++) {
        const dist = Math.abs(x - centerBin);
        const carrier = Math.exp(-(dist * dist) / (modulation === 'QAM-64' ? 950 : 260)) * (gainDb * 3.2);
        const noise = (Math.sin(x * 0.14 + frame * 0.18) + Math.cos(x * 0.31 - frame * 0.25)) * 6 + Math.random() * 12;
        const mag = Math.min(h * 0.4, Math.max(4, carrier + noise));
        const y = h * 0.43 - mag;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Waterfall pixel
        const intensity = Math.min(255, Math.floor((mag / (h * 0.4)) * 255));
        ctx.fillStyle =
          intensity > 190
            ? `rgb(255, ${255 - intensity}, 80)`
            : `rgb(0, ${intensity}, ${Math.min(255, intensity + 60)})`;
        ctx.fillRect(x, h * 0.45, 2, 2);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [freqMhz, gainDb, modulation]);

  return (
    <div className="p-3 h-full flex flex-col gap-3 overflow-y-auto">
      <div className="panel-frame p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-white">
          <Radio className="w-4 h-4 text-[var(--accent-primary)]" />
          MODULE 05 // SYNTHETIC RF SPECTRUM & WATERFALL ANALYZER
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-slate-300">
            <span>FREQ: {freqMhz.toFixed(2)} MHz</span>
            <input
              type="range"
              min="105"
              max="195"
              step="0.25"
              value={freqMhz}
              onChange={(e) => setFreqMhz(parseFloat(e.target.value))}
              className="accent-[#00ff88]"
            />
          </label>

          <label className="flex items-center gap-2 text-slate-300">
            <span>GAIN: +{gainDb} dB</span>
            <input
              type="range"
              min="8"
              max="42"
              value={gainDb}
              onChange={(e) => setGainDb(parseInt(e.target.value, 10))}
              className="accent-[#00d4ff]"
            />
          </label>

          <div className="flex gap-1">
            {(['FSK', 'QAM-64', 'BURST'] as const).map((mod) => (
              <button
                key={mod}
                onClick={() => setModulation(mod)}
                className={`px-2 py-1 border text-[10px] ${
                  modulation === mod
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-frame flex-1 p-2 bg-[#050709] min-h-[380px] flex flex-col">
        <canvas ref={canvasRef} width={1100} height={460} className="w-full h-full" />
      </div>
    </div>
  );
};