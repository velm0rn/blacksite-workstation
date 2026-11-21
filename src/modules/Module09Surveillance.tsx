import React, { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

const CAM_FEEDS = [
  { id: 'CAM-01', location: 'SUB-LEVEL 4 // SERVER VAULT', coords: '35.6971° N, 0.6308° W' },
  { id: 'CAM-02', location: 'PERIMETER GATE // NORTH', coords: '64.1466° N, 21.9426° W' },
  { id: 'CAM-03', location: 'SATCOM ROOFTOP ARRAY', coords: '47.3769° N, 8.5417° E' },
  { id: 'CAM-04', location: 'CRYO-CORE COOLING HALL', coords: '35.6762° N, 139.6503° E' },
];

const SyntheticFeedCanvas: React.FC<{ camId: string; location: string; seed: number }> = ({
  camId,
  location,
  seed,
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = seed * 40;
    let animId = 0;

    const draw = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#060a0d';
      ctx.fillRect(0, 0, w, h);

      // Architectural wireframe corridor / radar lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.16)';
      ctx.lineWidth = 1;
      ctx.strokeRect(35, 25, w - 70, h - 50);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(35, 25);
      ctx.moveTo(w, 0);
      ctx.lineTo(w - 35, 25);
      ctx.moveTo(0, h);
      ctx.lineTo(35, h - 25);
      ctx.moveTo(w, h);
      ctx.lineTo(w - 35, h - 25);
      ctx.stroke();

      // Moving simulated thermal silhouette box
      const bx = w * 0.5 + Math.sin(t * 0.02 + seed) * 90;
      const by = h * 0.52 + Math.cos(t * 0.015) * 18;
      ctx.strokeStyle = '#00d4ff';
      ctx.strokeRect(bx - 18, by - 32, 36, 64);
      ctx.fillStyle = '#00d4ff';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`OBJ-0${seed + 1} [98%]`, bx - 24, by - 38);

      // Static grain speckles
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let i = 0; i < 65; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
      }

      // HUD overlay
      ctx.fillStyle = '#00ff88';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`REC ● ${camId} // ${location}`, 12, 18);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC // SYNTH-FEED`, 12, h - 10);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [camId, location, seed]);

  return <canvas ref={ref} width={480} height={260} className="w-full h-full block" />;
};

export const Module09Surveillance: React.FC = () => {
  return (
    <div className="p-3 h-full flex flex-col gap-3 overflow-y-auto">
      <div className="panel-frame px-3 py-2 flex items-center justify-between text-xs">
        <span className="font-bold text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-[var(--accent-primary)]" />
          MODULE 09 // PROCEDURAL SURVEILLANCE GRID (SIMULATED TELEMETRY)
        </span>
        <span className="text-[10px] text-amber-400">4 SYNTHETIC FEEDS // NO EXTERNAL CAMERAS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {CAM_FEEDS.map((cam, idx) => (
          <div key={cam.id} className="panel-frame p-1.5 flex flex-col bg-black">
            <div className="flex-1 min-h-[210px]">
              <SyntheticFeedCanvas camId={cam.id} location={cam.location} seed={idx} />
            </div>
            <div className="px-2 py-1 bg-[#0a0e13] flex justify-between text-[10px] text-slate-400">
              <span>SECTOR: {cam.coords}</span>
              <span className="text-[var(--accent-primary)]">OPTICAL-IR SIM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};