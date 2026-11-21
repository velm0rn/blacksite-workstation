import React, { useState } from 'react';
import { Activity, ArrowRight, Network, ShieldCheck } from 'lucide-react';
import { GLOBAL_NODES } from '../utils/seededData';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

const NODE_COORDS: Record<string, { x: number; y: number }> = {
  'ND-01': { x: 340, y: 85 },
  'ND-02': { x: 470, y: 145 },
  'ND-03': { x: 190, y: 175 },
  'ND-04': { x: 770, y: 185 },
  'ND-05': { x: 445, y: 215 },
  'ND-06': { x: 545, y: 235 },
  'ND-07': { x: 700, y: 310 },
  'ND-08': { x: 265, y: 365 },
  'ND-09': { x: 505, y: 95 },
  'ND-10': { x: 485, y: 125 },
};

const LINKS: [string, string][] = [
  ['ND-01', 'ND-03'],
  ['ND-01', 'ND-09'],
  ['ND-09', 'ND-10'],
  ['ND-10', 'ND-02'],
  ['ND-02', 'ND-05'],
  ['ND-05', 'ND-06'],
  ['ND-06', 'ND-07'],
  ['ND-07', 'ND-04'],
  ['ND-03', 'ND-08'],
  ['ND-08', 'ND-05'],
];

export const Module01NetworkIntel: React.FC = () => {
  const { selectedNodeId, setSelectedNodeId, addNotification } = useBlacksiteStore();
  const [routeTarget, setRouteTarget] = useState('ND-04');
  const [simulatingRoute, setSimulatingRoute] = useState(false);

  const selectedNode = GLOBAL_NODES.find((n) => n.id === selectedNodeId) || GLOBAL_NODES[0];

  const triggerReroute = () => {
    setSimulatingRoute(true);
    addNotification(
      'BGP MESH RE-CONVERGED',
      `Simulated traffic shifted from ${selectedNode.codename} toward ${routeTarget}.`,
      'LOW'
    );
    setTimeout(() => setSimulatingRoute(false), 1800);
  };

  return (
    <div className="p-3 h-full grid grid-cols-1 xl:grid-cols-12 gap-3 overflow-y-auto">
      <div className="xl:col-span-8 panel-frame flex flex-col">
        <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-semibold text-white">
            <Network className="w-4 h-4 text-[var(--accent-primary)]" />
            MODULE 01 // INTERACTIVE MESH TOPOLOGY
          </span>
          <span className="text-[10px] text-cyan-400">
            {simulatingRoute ? 'RE-COMPUTING SHORTEST PATH...' : '10 NODES // 10 ENCRYPTED TRUNKS'}
          </span>
        </div>

        <div className="flex-1 bg-[#040608] relative min-h-[420px] flex items-center justify-center p-2">
          <svg viewBox="0 0 900 440" className="w-full h-full">
            <defs>
              <pattern id="netGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="900" height="440" fill="url(#netGrid)" />

            {LINKS.map(([a, b], idx) => {
              const p1 = NODE_COORDS[a];
              const p2 = NODE_COORDS[b];
              const highlighted = a === selectedNode.id || b === selectedNode.id;
              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={highlighted ? '#00ff88' : 'rgba(0, 212, 255, 0.25)'}
                    strokeWidth={highlighted ? 2 : 1.2}
                    strokeDasharray={simulatingRoute ? '6 4' : undefined}
                  />
                  <circle r="3" fill="#00ff88">
                    <animateMotion
                      dur={`${2.4 + (idx % 3) * 0.7}s`}
                      repeatCount="indefinite"
                      path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                    />
                  </circle>
                </g>
              );
            })}

            {GLOBAL_NODES.map((node) => {
              const pos = NODE_COORDS[node.id];
              const isSelected = node.id === selectedNode.id;
              const color =
                node.status === 'DEGRADED' ? '#ff3355' : node.status === 'ELEVATED' ? '#ffb020' : '#00ff88';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="18"
                      fill="none"
                      stroke="#00ff88"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                  <circle cx={pos.x} cy={pos.y} r="7" fill="#050709" stroke={color} strokeWidth="2.5" />
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.codename}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 19}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.throughputGbps} Gbps
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-3 flex flex-col">
        <div className="panel-frame p-4 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white">NODE INSPECTOR</span>
            <span className="text-[10px] px-2 py-0.5 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]">
              {selectedNode.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-black/40 p-2 border border-white/5">
              <div className="text-slate-500 text-[9px]">CODENAME</div>
              <div className="text-white font-semibold">{selectedNode.codename}</div>
            </div>
            <div className="bg-black/40 p-2 border border-white/5">
              <div className="text-slate-500 text-[9px]">INTERNAL IP</div>
              <div className="text-cyan-400 font-semibold">{selectedNode.ip}</div>
            </div>
            <div className="bg-black/40 p-2 border border-white/5">
              <div className="text-slate-500 text-[9px]">LOCATION</div>
              <div className="text-slate-200">{selectedNode.city}, {selectedNode.country}</div>
            </div>
            <div className="bg-black/40 p-2 border border-white/5">
              <div className="text-slate-500 text-[9px]">RTT LATENCY</div>
              <div className="text-[var(--accent-primary)]">{selectedNode.latencyMs} ms</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>CPU / PACKET PIPELINE LOAD</span>
              <span>{selectedNode.load}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900">
              <div className="h-full bg-[var(--accent-primary)]" style={{ width: `${selectedNode.load}%` }} />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[10px] text-slate-400">SIMULATED ROUTE FAILOVER</div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">{selectedNode.id}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={routeTarget}
                onChange={(e) => setRouteTarget(e.target.value)}
                className="flex-1 bg-[#050709] border border-white/15 px-2 py-1 text-slate-200 outline-none"
              >
                {GLOBAL_NODES.filter((n) => n.id !== selectedNode.id).map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.id} ({n.codename})
                  </option>
                ))}
              </select>
              <button
                onClick={triggerReroute}
                className="px-3 py-1 bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/50 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/25"
              >
                REROUTE
              </button>
            </div>
          </div>
        </div>

        <div className="panel-frame p-4 flex-1 text-xs space-y-2 overflow-y-auto">
          <div className="font-bold text-white flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            BACKBONE TRUNK TELEMETRY
          </div>
          {GLOBAL_NODES.map((n) => (
            <div
              key={n.id}
              onClick={() => setSelectedNodeId(n.id)}
              className={`flex items-center justify-between px-2.5 py-1.5 border cursor-pointer ${
                n.id === selectedNode.id
                  ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/10'
                  : 'border-white/5 hover:bg-white/[0.03]'
              }`}
            >
              <span className="text-slate-200">{n.codename}</span>
              <span className="text-[10px] text-slate-400">{n.throughputGbps} Gbps</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};