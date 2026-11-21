import React, { useEffect, useState } from 'react';
import {
  Bell,
  Command,
  Cpu,
  Lock,
  Maximize2,
  Radio,
  Shield,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

export const TopBar: React.FC = () => {
  const {
    operatorId,
    theme,
    setTheme,
    muted,
    toggleMute,
    ambientAudio,
    toggleAmbientAudio,
    lowPerfMode,
    toggleLowPerfMode,
    setCommandPaletteOpen,
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    lockWorkstation,
  } = useBlacksiteStore();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-11 bg-[#080b0f] border-b border-white/10 px-3 flex items-center justify-between text-xs shrink-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="font-bold tracking-[0.22em] text-white">BLACKSITE</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]">
            SIM-ENV
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 border-l border-white/10 pl-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            KERNEL: NOMINAL
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            ENCLAVE: LOCAL-ONLY
          </span>
          <span className="text-slate-600">|</span>
          <span>OPR: <strong className="text-slate-200">{operatorId}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#0e141b] border border-white/10 hover:border-[var(--accent-primary)]/50 text-slate-300 text-[11px]"
          title="Command Palette (Ctrl+K)"
        >
          <Command className="w-3 h-3 text-[var(--accent-primary)]" />
          <span>CMD PALETTE</span>
          <kbd className="text-[10px] px-1 bg-black/50 border border-white/10 text-slate-400">CTRL+K</kbd>
        </button>

        {/* Accent Theme Selector */}
        <div className="hidden md:flex items-center gap-1 border border-white/10 px-1.5 py-1 bg-[#0e141b]">
          {(['neon', 'cyan', 'amber'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              title={`Theme: ${t.toUpperCase()}`}
              className={`w-3 h-3 border ${theme === t ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
              style={{
                backgroundColor: t === 'neon' ? '#00ff88' : t === 'cyan' ? '#00d4ff' : '#ffb020',
              }}
            />
          ))}
        </div>

        <button
          onClick={toggleLowPerfMode}
          className={`px-2 py-1 border text-[10px] flex items-center gap-1 ${
            lowPerfMode
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-white/10 bg-[#0e141b] text-slate-400 hover:text-white'
          }`}
          title="Toggle Low-Performance Mode"
        >
          <Zap className="w-3 h-3" />
          <span className="hidden xl:inline">{lowPerfMode ? 'LOW-PERF' : 'GPU-MAX'}</span>
        </button>

        <button
          onClick={toggleAmbientAudio}
          className={`p-1.5 border ${
            ambientAudio
              ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
              : 'border-white/10 bg-[#0e141b] text-slate-400 hover:text-white'
          }`}
          title="Toggle Ambient Drone"
        >
          <Radio className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleMute}
          className="p-1.5 border border-white/10 bg-[#0e141b] text-slate-400 hover:text-white"
          title={muted ? 'Unmute UI Audio' : 'Mute UI Audio'}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative p-1.5 border border-white/10 bg-[#0e141b] text-slate-300 hover:border-[var(--accent-primary)]/50"
          title="Alert Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-[9px] text-white flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 border border-white/10 bg-[#0e141b] text-slate-400 hover:text-white"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={lockWorkstation}
          className="p-1.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          title="Lock Session"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>

        <div className="hidden sm:block text-right pl-2 border-l border-white/10 leading-tight">
          <div className="text-[11px] font-semibold text-[var(--accent-primary)]">
            {now.toISOString().slice(11, 19)} UTC
          </div>
          <div className="text-[9px] text-slate-500">{now.toISOString().slice(0, 10)}</div>
        </div>
      </div>
    </header>
  );
};