import React, { useState } from 'react';
import { Compass, Crosshair, Globe, MapPin } from 'lucide-react';
import { Globe3D } from '../components/Globe3D';
import { GLOBAL_NODES } from '../utils/seededData';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

const GEOINT_MARKERS = [
  { id: 'GEO-101', title: 'Subsea Fiber Telemetry Drift', coords: '64.1466° N, 21.9426° W', region: 'EU', sector: 'NORTH ATLANTIC', confidence: '96%' },
  { id: 'GEO-102', title: 'Anomalous Maritime AIS Silence', coords: '35.6971° N, 0.6308° W', region: 'MENA', sector: 'ALBORAN BASIN', confidence: '91%' },
  { id: 'GEO-103', title: 'High-Altitude RF Burst Source', coords: '35.6762° N, 139.6503° E', region: 'APAC', sector: 'KANTO SECTOR', confidence: '88%' },
  { id: 'GEO-104', title: 'Orbital Downlink Sync Drift', coords: '38.9072° N, 77.0369° W', region: 'NA', sector: 'EASTERN SEABOARD', confidence: '94%' },
  { id: 'GEO-105', title: 'Relay Tower Power Grid Spike', coords: '23.5505° S, 46.6333° W', region: 'SA', sector: 'SOUTH ATLANTIC', confidence: '85%' },
];

export const Module02Geoint: React.FC = () => {
  const { selectedRegion, setSelectedRegion, selectedNodeId, setSelectedNodeId } = useBlacksiteStore();
  const [selectedMarker, setSelectedMarker] = useState(GEOINT_MARKERS[0]);

  const filteredMarkers =
    selectedRegion === 'ALL'
      ? GEOINT_MARKERS
      : GEOINT_MARKERS.filter((m) => m.region === selectedRegion);

  return (
    <div className="p-3 h-full grid grid-cols-1 xl:grid-cols-12 gap-3 overflow-y-auto">
      <div className="xl:col-span-8 panel-frame flex flex-col">
        <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-semibold text-white">
            <Globe className="w-4 h-4 text-[var(--accent-primary)]" />
            MODULE 02 // GEOSPATIAL INTELLIGENCE (GEOINT)
          </span>
          <div className="flex items-center gap-1">
            {['ALL', 'NA', 'EU', 'APAC', 'MENA', 'SA'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-2 py-0.5 text-[10px] border ${
                  selectedRegion === r
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 min-h-[420px] bg-[#040608]">
          <Globe3D />
          <div className="absolute top-3 left-3 bg-[#070b10]/90 border border-white/10 px-3 py-2 text-[10px] space-y-1">
            <div className="text-slate-500 flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-[var(--accent-primary)]" /> ACTIVE RETICLE LOCK
            </div>
            <div className="text-white font-bold">{selectedMarker.title}</div>
            <div className="text-cyan-400">{selectedMarker.coords}</div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-3 flex flex-col">
        <div className="panel-frame p-3 text-xs space-y-2">
          <div className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            SYNTHETIC GEOINT ANOMALIES
          </div>
          {filteredMarkers.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMarker(m)}
              className={`p-2.5 border cursor-pointer transition-colors ${
                selectedMarker.id === m.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                  : 'border-white/10 bg-black/30 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{m.id} // {m.sector}</span>
                <span className="text-[var(--accent-primary)]">CONF {m.confidence}</span>
              </div>
              <div className="text-white font-semibold mt-0.5">{m.title}</div>
              <div className="text-[10px] text-cyan-400 mt-1">{m.coords}</div>
            </div>
          ))}
        </div>

        <div className="panel-frame p-3 text-xs flex-1 overflow-y-auto space-y-1.5">
          <div className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            GROUND STATION COORDINATES
          </div>
          {GLOBAL_NODES.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`flex justify-between items-center px-2 py-1.5 text-[11px] border cursor-pointer ${
                selectedNodeId === node.id ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-white/5'
              }`}
            >
              <span className="text-slate-200">{node.city}, {node.country}</span>
              <span className="text-[10px] text-slate-500">
                {node.lat.toFixed(2)}°, {node.lng.toFixed(2)}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};