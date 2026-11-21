import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Terminal } from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

const BOOT_LINES = [
  { text: 'INITIALIZING BLACKSITE KERNEL...', delay: 220, tag: 'OK' },
  { text: 'ESTABLISHING SECURE SESSION...', delay: 620, tag: 'ENCRYPTED' },
  { text: 'LOADING INTELLIGENCE MODULES...', delay: 1050, tag: '10/10 READY' },
  { text: 'INITIALIZING NETWORK VISUALIZATION...', delay: 1480, tag: 'WEBGL-2' },
  { text: 'ENCRYPTION ENGINE: ACTIVE', delay: 1900, tag: 'AES-GCM-256' },
  { text: 'SYSTEM STATUS: OPERATIONAL', delay: 2350, tag: 'NOMINAL' },
];

export const BootSequence: React.FC = () => {
  const completeBoot = useBlacksiteStore((s) => s.completeBoot);
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, idx) =>
      setTimeout(() => {
        setVisibleCount(idx + 1);
        setProgress(Math.round(((idx + 1) / BOOT_LINES.length) * 100));
      }, line.delay)
    );

    const finishTimer = setTimeout(() => {
      completeBoot();
    }, 3050);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [completeBoot]);

  return (
    <div className="fixed inset-0 bg-[#050709] cyber-grid flex flex-col items-center justify-center p-6 boot-flicker z-50">
      <div className="w-full max-w-2xl panel-frame p-6 relative">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#00ff88]/50 bg-[#00ff88]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <div className="text-xs tracking-[0.28em] text-[#00ff88] font-bold">BLACKSITE OS v4.2.0</div>
              <div className="text-[11px] text-slate-500">OFFLINE CYBER INTELLIGENCE SIMULATION ENVIRONMENT</div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 border border-cyan-500/30 text-cyan-400">
            BIOS // UEFI-SEC
          </span>
        </div>

        <div className="space-y-2.5 min-h-[190px] text-xs">
          {BOOT_LINES.slice(0, visibleCount).map((line, idx) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-between border-b border-white/[0.03] pb-1.5"
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-3.5 h-3.5 text-[#00ff88]" />
                <span className="text-slate-200 tracking-wider">{line.text}</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 border ${
                  idx === BOOT_LINES.length - 1
                    ? 'border-[#00ff88]/50 text-[#00ff88] bg-[#00ff88]/10'
                    : 'border-slate-700 text-cyan-400'
                }`}
              >
                [{line.tag}]
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
            <span>KERNEL BOOTLOADER SEQUENCE</span>
            <span className="text-[#00ff88]">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-[#00ff88] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500">
          <span>SANDBOXED LOCAL INSTANCE // NO EXTERNAL UPLINK</span>
          <button
            onClick={completeBoot}
            className="text-slate-400 hover:text-[#00ff88] underline underline-offset-4"
          >
            BYPASS POST [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};