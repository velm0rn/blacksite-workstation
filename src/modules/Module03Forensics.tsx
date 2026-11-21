import React, { useState } from 'react';
import { CheckCircle2, FileSearch, Hash, Upload } from 'lucide-react';

interface EvidenceArtifact {
  id: string;
  filename: string;
  type: string;
  size: string;
  sha256: string;
  entropy: string;
  acquiredAt: string;
  integrity: 'VERIFIED' | 'TAMPERED_SIM';
  timeline: { offset: string; event: string }[];
}

const DEMO_ARTIFACTS: EvidenceArtifact[] = [
  {
    id: 'EVD-001',
    filename: 'kernel_dump_0x44f.bin',
    type: 'Memory Snapshot (Synthetic)',
    size: '64.0 MB',
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    entropy: '7.91 / 8.00 (Packed)',
    acquiredAt: '2026-11-20 02:14:11 UTC',
    integrity: 'VERIFIED',
    timeline: [
      { offset: '+00:00.012', event: 'Heap allocation spike in ring-0 buffer' },
      { offset: '+00:01.440', event: 'Outbound socket descriptor cloned' },
      { offset: '+00:03.902', event: 'Snapshot sealed with SHA-256 digest' },
    ],
  },
  {
    id: 'EVD-002',
    filename: 'pcap_relay_capture.pcapng',
    type: 'Packet Trace (Synthetic)',
    size: '18.4 MB',
    sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    entropy: '6.42 / 8.00',
    acquiredAt: '2026-11-20 05:49:00 UTC',
    integrity: 'VERIFIED',
    timeline: [
      { offset: '+00:00.000', event: 'TLS 1.3 ClientHello captured on port 8443' },
      { offset: '+00:00.218', event: 'Anomalous TXT DNS query burst (48 packets)' },
    ],
  },
  {
    id: 'EVD-003',
    filename: 'bootloader_stage2.img',
    type: 'Firmware Image (Synthetic)',
    size: '4.2 MB',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    entropy: '7.15 / 8.00',
    acquiredAt: '2026-11-19 22:08:33 UTC',
    integrity: 'TAMPERED_SIM',
    timeline: [
      { offset: '+00:00.004', event: 'Signature mismatch detected in sector 0x08' },
      { offset: '+00:00.119', event: 'Quarantined in local forensic sandbox' },
    ],
  },
];

export const Module03Forensics: React.FC = () => {
  const [selected, setSelected] = useState<EvidenceArtifact>(DEMO_ARTIFACTS[0]);
  const [localFileHash, setLocalFileHash] = useState<{ name: string; size: number; sha256: string } | null>(null);

  const handleLocalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setLocalFileHash({ name: file.name, size: file.size, sha256: hex });
  };

  return (
    <div className="p-3 h-full grid grid-cols-1 xl:grid-cols-12 gap-3 overflow-y-auto">
      <div className="xl:col-span-4 panel-frame flex flex-col">
        <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-semibold text-white">
            <FileSearch className="w-4 h-4 text-[var(--accent-primary)]" />
            MODULE 03 // EVIDENCE VAULT
          </span>
          <span className="text-[10px] text-slate-500">READ-ONLY</span>
        </div>

        <div className="p-3 space-y-2 flex-1">
          {DEMO_ARTIFACTS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={`p-3 border cursor-pointer text-xs ${
                selected.id === item.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                  : 'border-white/10 bg-black/30 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{item.id}</span>
                <span className={item.integrity === 'VERIFIED' ? 'text-[#00ff88]' : 'text-rose-400'}>
                  {item.integrity}
                </span>
              </div>
              <div className="text-white font-bold mt-1">{item.filename}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{item.type} // {item.size}</div>
            </div>
          ))}

          {/* Real Local File SHA-256 Calculator */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-[10px] text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> LOCAL FILE SHA-256 CALCULATOR (OFFLINE)
            </div>
            <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-white/20 hover:border-[var(--accent-primary)] cursor-pointer text-xs text-slate-300">
              <Upload className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Select Local Demonstration File</span>
              <input type="file" onChange={handleLocalFile} className="hidden" />
            </label>
            {localFileHash && (
              <div className="mt-2 p-2.5 bg-black/50 border border-white/10 text-[10px] space-y-1 break-all">
                <div className="text-white font-semibold">{localFileHash.name} ({localFileHash.size} bytes)</div>
                <div className="text-[var(--accent-primary)]">SHA-256: {localFileHash.sha256}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-8 panel-frame p-4 text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] text-slate-500">ARTIFACT METADATA & CHAIN OF CUSTODY</div>
            <h2 className="text-sm font-bold text-white mt-0.5">{selected.filename}</h2>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
            <CheckCircle2 className="w-3.5 h-3.5" /> {selected.integrity}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="bg-black/40 p-3 border border-white/5">
            <div className="text-slate-500 text-[9px]">ARTIFACT TYPE</div>
            <div className="text-slate-200 mt-0.5">{selected.type}</div>
          </div>
          <div className="bg-black/40 p-3 border border-white/5">
            <div className="text-slate-500 text-[9px]">SHANNON ENTROPY</div>
            <div className="text-amber-400 mt-0.5">{selected.entropy}</div>
          </div>
          <div className="bg-black/40 p-3 border border-white/5 md:col-span-2 break-all">
            <div className="text-slate-500 text-[9px]">SHA-256 CRYPTOGRAPHIC DIGEST</div>
            <div className="text-[var(--accent-primary)] mt-0.5">{selected.sha256}</div>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 tracking-widest mb-2">FORENSIC TIMELINE RECONSTRUCTION</div>
          <div className="space-y-2">
            {selected.timeline.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-black/30 border border-white/5">
                <span className="text-cyan-400 font-semibold">{step.offset}</span>
                <span className="text-slate-300">{step.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};