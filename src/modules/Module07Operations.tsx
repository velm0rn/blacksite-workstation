import React, { useState } from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

export const Module07Operations: React.FC = () => {
  const { operations, addOperation, updateOperationProgress } = useBlacksiteStore();
  const [codename, setCodename] = useState('');
  const [sector, setSector] = useState('NORTHERN RELAY');
  const [summary, setSummary] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim()) return;
    addOperation({
      codename: codename.toUpperCase(),
      sector: sector.toUpperCase(),
      classification: 'TOP SECRET // SCI',
      status: 'ACTIVE',
      progress: 10,
      leadUnit: 'UNIT-09 SPECTRE',
      summary: summary || 'Simulated cyber-intelligence correlation and telemetry monitoring directive.',
    });
    setCodename('');
    setSummary('');
  };

  return (
    <div className="p-3 h-full grid grid-cols-1 xl:grid-cols-12 gap-3 overflow-y-auto text-xs">
      <div className="xl:col-span-4 panel-frame p-4 space-y-3 h-fit">
        <div className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Plus className="w-4 h-4 text-[var(--accent-primary)]" />
          INITIALIZE NEW DIRECTIVE
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">OPERATION CODENAME</label>
            <input
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="e.g. NIGHTFALL ECHO"
              className="w-full bg-[#050709] border border-white/15 px-3 py-2 text-white outline-none uppercase"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">TARGET SECTOR</label>
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-[#050709] border border-white/15 px-3 py-2 text-cyan-400 outline-none uppercase"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">MISSION BRIEF</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe simulated intelligence objectives..."
              className="w-full bg-[#050709] border border-white/15 p-2.5 text-slate-300 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/60 text-[var(--accent-primary)] font-bold tracking-widest"
          >
            DEPLOY DIRECTIVE
          </button>
        </form>
      </div>

      <div className="xl:col-span-8 space-y-3">
        {operations.map((op) => (
          <div key={op.id} className="panel-frame p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div>
                <span className="text-[10px] text-amber-400">{op.classification}</span>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-[var(--accent-primary)]" />
                  {op.id} // {op.codename}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 border border-cyan-500/40 text-cyan-400">
                  {op.status}
                </span>
                <button
                  onClick={() => updateOperationProgress(op.id, Math.min(100, op.progress + 15))}
                  className="px-2.5 py-1 bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/50 text-[var(--accent-primary)] text-[10px]"
                >
                  ADVANCE +15%
                </button>
              </div>
            </div>

            <p className="text-slate-300 text-[11px]">{op.summary}</p>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>COMPLETION TELEMETRY</span>
                <span>{op.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900">
                <div className="h-full bg-[var(--accent-primary)] transition-all" style={{ width: `${op.progress}%` }} />
              </div>
            </div>

            <div className="bg-black/40 p-2.5 border border-white/5 space-y-1 text-[10px]">
              <div className="text-slate-500">ACTIVITY LOGS</div>
              {op.logs.map((l, idx) => (
                <div key={idx} className="text-slate-300">
                  <span className="text-cyan-400">[{l.time}]</span> {l.entry}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};