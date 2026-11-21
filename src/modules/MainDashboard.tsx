import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, AlertTriangle, Cpu, Globe, Radio, ShieldAlert } from 'lucide-react';
import { Globe3D } from '../components/Globe3D';
import { TerminalEmulator } from '../components/TerminalEmulator';
import { useBlacksiteStore } from '../store/useBlacksiteStore';
import { GLOBAL_NODES } from '../utils/seededData';
import { Severity } from '../types/blacksite';

export const MainDashboard: React.FC = () => {
  const {
    events,
    pushEvent,
    operations,
    selectedRegion,
    setSelectedRegion,
    selectedNodeId,
    setActiveModule,
  } = useBlacksiteStore();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');
  const [metricsHistory, setMetricsHistory] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      t: `T-${15 - i}`,
      cpu: 34 + ((i * 7) % 38),
      ram: 52 + ((i * 5) % 24),
      inMbps: 420 + ((i * 53) % 390),
      outMbps: 280 + ((i * 41) % 310),
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      pushEvent();
      setMetricsHistory((prev) => [
        ...prev.slice(1),
        {
          t: new Date().toTimeString().slice(3, 8),
          cpu: Math.floor(32 + Math.random() * 44),
          ram: Math.floor(54 + Math.random() * 20),
          inMbps: Math.floor(400 + Math.random() * 480),
          outMbps: Math.floor(260 + Math.random() * 340),
        },
      ]);
    }, 3200);
    return () => clearInterval(timer);
  }, [pushEvent]);

  const activeNode = GLOBAL_NODES.find((n) => n.id === selectedNodeId) || GLOBAL_NODES[0];
  const filteredEvents =
    severityFilter === 'ALL' ? events : events.filter((e) => e.severity === severityFilter);

  const latestMetric = metricsHistory[metricsHistory.length - 1];

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {/* Top KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2.5 text-xs">
        {[
          { label: 'THREAT POSTURE', value: 'ELEVATED // L3', accent: 'text-amber-400' },
          { label: 'ACTIVE RELAYS', value: `${GLOBAL_NODES.length} / 10 ONLINE`, accent: 'text-[#00ff88]' },
          { label: 'INGRESS STREAM', value: `${latestMetric.inMbps} Mbps`, accent: 'text-cyan-400' },
          { label: 'EGRESS STREAM', value: `${latestMetric.outMbps} Mbps`, accent: 'text-cyan-400' },
          { label: 'CORE COMPUTE', value: `CPU ${latestMetric.cpu}% | RAM ${latestMetric.ram}%`, accent: 'text-white' },
          { label: 'PACKET INTEGRITY', value: '99.984% VERIFIED', accent: 'text-[#00ff88]' },
        ].map((stat) => (
          <div key={stat.label} className="panel-frame px-3 py-2">
            <div className="text-[9px] text-slate-500 tracking-widest">{stat.label}</div>
            <div className={`text-xs font-bold mt-0.5 ${stat.accent}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Primary 12-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        {/* A. GLOBAL NETWORK MAP */}
        <div className="xl:col-span-5 panel-frame flex flex-col">
          <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-semibold text-white">
              <Globe className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              A // GLOBAL NETWORK TOPOLOGY
            </span>
            <div className="flex items-center gap-1">
              {['ALL', 'NA', 'EU', 'APAC', 'MENA'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-1.5 py-0.5 text-[9px] border ${
                    selectedRegion === reg
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex-1 min-h-[270px] bg-[#040608]">
            <Globe3D />
            <div className="absolute bottom-2 left-2 right-2 bg-[#070b10]/90 border border-white/10 px-3 py-2 flex items-center justify-between text-[11px]">
              <div>
                <div className="text-[9px] text-slate-500">SELECTED NODE // CLICK GLOBE MARKER</div>
                <div className="font-bold text-[var(--accent-primary)]">
                  {activeNode.codename} ({activeNode.city}, {activeNode.country})
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-300">
                <div>IP: {activeNode.ip}</div>
                <div>
                  LOAD: {activeNode.load}% | {activeNode.latencyMs}ms
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* C. CYBER INTELLIGENCE FEED */}
        <div className="xl:col-span-4 panel-frame flex flex-col">
          <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-semibold text-white">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              C // CYBER INTELLIGENCE FEED
            </span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'ALL' | Severity)}
              className="bg-[#050709] border border-white/15 text-[10px] px-1.5 py-0.5 text-slate-300 outline-none"
            >
              <option value="ALL">ALL SEV</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="flex-1 max-h-[300px] overflow-y-auto divide-y divide-white/5 text-[11px]">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="px-3 py-2 hover:bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{ev.vector}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 border ${
                      ev.severity === 'CRITICAL'
                        ? 'border-rose-500/50 bg-rose-500/15 text-rose-400'
                        : ev.severity === 'HIGH'
                        ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                        : 'border-cyan-500/40 text-cyan-400'
                    }`}
                  >
                    {ev.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>
                    {ev.sourceIp} → <span className="text-slate-300">{ev.targetNode}</span>
                  </span>
                  <span>
                    {ev.protocol} // {ev.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B & D. SYSTEM MONITOR & LIVE TRAFFIC */}
        <div className="xl:col-span-3 space-y-3 flex flex-col">
          <div className="panel-frame p-3 flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                B // SYSTEM TELEMETRY
              </span>
              <span className="text-[10px] text-slate-400">GPU 41% | NVMe 62%</span>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsHistory}>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070b10', borderColor: '#1e293b', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#00ff88" fill="#00ff88" fillOpacity={0.15} strokeWidth={1.5} />
                  <Area type="monotone" dataKey="ram" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.1} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel-frame p-3 flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                D // BANDWIDTH STREAM
              </span>
              <span className="text-[10px] text-cyan-400">RTT 18ms</span>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsHistory.slice(-10)}>
                  <XAxis dataKey="t" hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070b10', borderColor: '#1e293b', fontSize: '10px' }}
                  />
                  <Bar dataKey="inMbps" fill="#00d4ff" />
                  <Bar dataKey="outMbps" fill="#00ff88" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Embedded Terminal + Active Operations + Threat Signatures */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        <div className="xl:col-span-6 h-[270px]">
          <TerminalEmulator compact />
        </div>

        {/* E. ACTIVE OPERATIONS */}
        <div className="xl:col-span-3 panel-frame flex flex-col">
          <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Activity className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              E // ACTIVE OPERATIONS
            </span>
            <button
              onClick={() => setActiveModule('operations')}
              className="text-[10px] text-[var(--accent-primary)] hover:underline"
            >
              EXPAND →
            </button>
          </div>
          <div className="p-3 space-y-2.5 text-xs overflow-y-auto max-h-[230px]">
            {operations.map((op) => (
              <div key={op.id} className="border border-white/10 bg-black/30 p-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-white">
                    {op.id} // {op.codename}
                  </span>
                  <span className="text-[var(--accent-primary)]">{op.progress}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{op.sector}</div>
                <div className="w-full h-1 bg-slate-900 mt-2">
                  <div className="h-full bg-[var(--accent-primary)]" style={{ width: `${op.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* F. THREAT MONITOR */}
        <div className="xl:col-span-3 panel-frame flex flex-col">
          <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              F // THREAT SIGNATURES
            </span>
            <span className="text-[10px] text-rose-400">RISK: 64/100</span>
          </div>
          <div className="p-3 space-y-2 text-[11px] overflow-y-auto max-h-[230px]">
            {[
              { sig: 'SIG-904 // BGP-LEAK-SIM', count: '142 pkts', risk: 'HIGH' },
              { sig: 'SIG-418 // TLS-JA4-DRIFT', count: '89 pkts', risk: 'MEDIUM' },
              { sig: 'SIG-772 // DNS-TUNNEL-HEUR', count: '31 pkts', risk: 'CRITICAL' },
              { sig: 'SIG-119 // SSH-KEX-PROBE', count: '510 pkts', risk: 'LOW' },
            ].map((item) => (
              <div key={item.sig} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <div>
                  <div className="text-slate-200 font-medium">{item.sig}</div>
                  <div className="text-[10px] text-slate-500">Matched: {item.count}</div>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 border ${
                    item.risk === 'CRITICAL'
                      ? 'border-rose-500/50 text-rose-400'
                      : item.risk === 'HIGH'
                      ? 'border-amber-500/50 text-amber-300'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {item.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};