import React, { useState } from 'react';
import { Database, Search } from 'lucide-react';

const SYNTHETIC_RECORDS = [
  { id: 'ENT-901', alias: 'AS-64512 // VORTEX-TRANSIT', category: 'ASN_CLUSTER', country: 'Iceland', risk: 82, linkedTo: 'ENT-904' },
  { id: 'ENT-902', alias: '198.51.100.44 // BEACON-7', category: 'C2_SIM_NODE', country: 'Switzerland', risk: 94, linkedTo: 'ENT-905' },
  { id: 'ENT-903', alias: 'CERT-88A1 // WILDCARD-CA', category: 'TLS_ARTIFACT', country: 'Germany', risk: 61, linkedTo: 'ENT-901' },
  { id: 'ENT-904', alias: 'DOMAIN // relay-sync-09.sim', category: 'DNS_INFRA', country: 'Sweden', risk: 77, linkedTo: 'ENT-902' },
  { id: 'ENT-905', alias: 'HASH // e3b0c44298fc1c14', category: 'PAYLOAD_SIG', country: 'Japan', risk: 89, linkedTo: 'ENT-903' },
  { id: 'ENT-906', alias: 'SAT-ID // ORBITAL-RELAY-4', category: 'RF_TRANSPONDER', country: 'Algeria', risk: 45, linkedTo: 'ENT-901' },
];

export const Module08Database: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState('ENT-902');

  const records = SYNTHETIC_RECORDS.filter((r) => {
    const matchCat = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchText =
      r.alias.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  const activeRecord = SYNTHETIC_RECORDS.find((r) => r.id === selectedId) || SYNTHETIC_RECORDS[0];

  return (
    <div className="p-3 h-full grid grid-cols-1 xl:grid-cols-12 gap-3 overflow-y-auto text-xs">
      <div className="xl:col-span-8 panel-frame p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <span className="font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--accent-primary)]" />
            MODULE 08 // SYNTHETIC INTELLIGENCE REPOSITORY
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#050709] border border-white/15 px-2.5 py-1">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter entities..."
                className="bg-transparent outline-none text-white text-[11px]"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#050709] border border-white/15 px-2 py-1 text-[11px] text-slate-300 outline-none"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="ASN_CLUSTER">ASN_CLUSTER</option>
              <option value="C2_SIM_NODE">C2_SIM_NODE</option>
              <option value="TLS_ARTIFACT">TLS_ARTIFACT</option>
              <option value="DNS_INFRA">DNS_INFRA</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-slate-500">
              <th className="py-2">ENTITY ID</th>
              <th>IDENTIFIER / ALIAS</th>
              <th>CLASS</th>
              <th>JURISDICTION</th>
              <th>RISK SCORE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px]">
            {records.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => setSelectedId(rec.id)}
                className={`cursor-pointer ${
                  rec.id === activeRecord.id ? 'bg-[var(--accent-primary)]/10' : 'hover:bg-white/[0.02]'
                }`}
              >
                <td className="py-2.5 text-cyan-400 font-semibold">{rec.id}</td>
                <td className="text-white">{rec.alias}</td>
                <td className="text-slate-400">{rec.category}</td>
                <td>{rec.country}</td>
                <td className={rec.risk > 85 ? 'text-rose-400 font-bold' : 'text-[var(--accent-primary)]'}>
                  {rec.risk}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:col-span-4 panel-frame p-4 space-y-4">
        <div className="font-bold text-white border-b border-white/10 pb-2">ENTITY RELATIONSHIP GRAPH</div>
        <svg viewBox="0 0 300 220" className="w-full bg-[#040608] border border-white/10">
          <line x1="80" y1="110" x2="220" y2="110" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="80" cy="110" r="24" fill="#0a0e13" stroke="#00ff88" strokeWidth="2" />
          <text x="80" y="114" textAnchor="middle" fill="#fff" fontSize="10">{activeRecord.id}</text>

          <circle cx="220" cy="110" r="24" fill="#0a0e13" stroke="#00d4ff" strokeWidth="2" />
          <text x="220" y="114" textAnchor="middle" fill="#00d4ff" fontSize="10">{activeRecord.linkedTo}</text>
        </svg>

        <div className="p-3 bg-black/40 border border-white/5 space-y-1.5 text-[11px]">
          <div className="text-slate-500 text-[9px]">SELECTED RECORD DOSSIER</div>
          <div className="text-white font-bold">{activeRecord.alias}</div>
          <div className="text-slate-400">Primary Correlation: {activeRecord.linkedTo}</div>
          <div className="text-amber-400">Synthetic Threat Index: {activeRecord.risk}%</div>
        </div>
      </div>
    </div>
  );
};