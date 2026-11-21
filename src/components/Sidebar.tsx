import React from 'react';
import {
  Activity,
  Binary,
  Camera,
  Cpu,
  Database,
  FileSearch,
  FolderKanban,
  Globe,
  KeyRound,
  LayoutDashboard,
  Network,
  Radio,
  Terminal,
} from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';
import { ModuleId } from '../types/blacksite';

export const NAV_ITEMS: { id: ModuleId; code: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', code: 'CMD', label: 'COMMAND CENTER', icon: LayoutDashboard },
  { id: 'terminal', code: 'TTY', label: 'ROOT TERMINAL', icon: Terminal },
  { id: 'net-intel', code: 'M01', label: 'NETWORK INTEL', icon: Network },
  { id: 'geoint', code: 'M02', label: 'GEOINT MAP', icon: Globe },
  { id: 'forensics', code: 'M03', label: 'DIGITAL FORENSICS', icon: FileSearch },
  { id: 'crypto-lab', code: 'M04', label: 'ENCRYPTION LAB', icon: KeyRound },
  { id: 'sigint', code: 'M05', label: 'SIGNAL INTEL', icon: Radio },
  { id: 'diagnostics', code: 'M06', label: 'SYS DIAGNOSTICS', icon: Cpu },
  { id: 'operations', code: 'M07', label: 'OPERATIONS CTR', icon: FolderKanban },
  { id: 'database', code: 'M08', label: 'DATABASE INTEL', icon: Database },
  { id: 'surveillance', code: 'M09', label: 'SURVEILLANCE SIM', icon: Camera },
  { id: 'matrix', code: 'M10', label: 'MATRIX RAIN', icon: Binary },
];

export const Sidebar: React.FC = () => {
  const activeModule = useBlacksiteStore((s) => s.activeModule);
  const setActiveModule = useBlacksiteStore((s) => s.setActiveModule);
  const crtEnabled = useBlacksiteStore((s) => s.crtEnabled);
  const toggleCrt = useBlacksiteStore((s) => s.toggleCrt);

  return (
    <aside className="w-14 lg:w-56 bg-[#070a0e] border-r border-white/10 flex flex-col justify-between shrink-0 z-20">
      <div className="py-2 overflow-y-auto space-y-0.5">
        <div className="hidden lg:flex items-center justify-between px-3 py-1.5 text-[10px] text-slate-500 tracking-widest">
          <span>SUBSYSTEMS</span>
          <Activity className="w-3 h-3 text-[var(--accent-primary)]" />
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors border-l-2 ${
                active
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-white'
                  : 'border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
              }`}
              title={item.label}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  active ? 'text-[var(--accent-primary)]' : 'text-slate-500'
                }`}
              />
              <div className="hidden lg:flex items-center justify-between w-full overflow-hidden">
                <span className="truncate tracking-wider text-[11px]">{item.label}</span>
                <span className="text-[9px] text-slate-600 font-semibold">{item.code}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-white/10 hidden lg:block space-y-2 text-[10px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>CRT SCANLINES</span>
          <button
            onClick={toggleCrt}
            className={`px-1.5 py-0.5 border ${
              crtEnabled
                ? 'border-[var(--accent-primary)]/50 text-[var(--accent-primary)]'
                : 'border-slate-700 text-slate-500'
            }`}
          >
            {crtEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="text-[9px] text-slate-600 leading-relaxed">
          FICTIONAL SIMULATION // ALL TELEMETRY SYNTHETIC
        </div>
      </div>
    </aside>
  );
};