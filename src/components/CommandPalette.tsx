import React, { useEffect, useState } from 'react';
import { Search, Terminal } from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';
import { NAV_ITEMS } from './Sidebar';

export const CommandPalette: React.FC = () => {
  const open = useBlacksiteStore((s) => s.commandPaletteOpen);
  const setOpen = useBlacksiteStore((s) => s.setCommandPaletteOpen);
  const setActiveModule = useBlacksiteStore((s) => s.setActiveModule);
  const toggleLowPerfMode = useBlacksiteStore((s) => s.toggleLowPerfMode);
  const toggleCrt = useBlacksiteStore((s) => s.toggleCrt);
  const pushEvent = useBlacksiteStore((s) => s.pushEvent);

  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  if (!open) return null;

  const actions = [
    ...NAV_ITEMS.map((item) => ({
      id: item.id,
      label: `OPEN MODULE // ${item.label} (${item.code})`,
      run: () => setActiveModule(item.id),
    })),
    {
      id: 'inject-event',
      label: 'SIMULATION // INJECT SYNTHETIC INTEL EVENT',
      run: () => pushEvent(),
    },
    {
      id: 'toggle-crt',
      label: 'DISPLAY // TOGGLE CRT SCANLINE OVERLAY',
      run: () => toggleCrt(),
    },
    {
      id: 'toggle-perf',
      label: 'SYSTEM // TOGGLE LOW-PERFORMANCE RENDER MODE',
      run: () => toggleLowPerfMode(),
    },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-24 p-4 z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl panel-frame overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0c1117]">
          <Search className="w-4 h-4 text-[var(--accent-primary)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type module name or system directive..."
            className="w-full bg-transparent text-xs text-white outline-none"
          />
          <span className="text-[10px] text-slate-500">ESC</span>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.run();
                setOpen(false);
                setQuery('');
              }}
              className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-[var(--accent-primary)]/15 hover:text-white flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                {item.label}
              </span>
              <span className="text-[10px] text-slate-500">EXEC</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500">NO MATCHING DIRECTIVES</div>
          )}
        </div>
      </div>
    </div>
  );
};