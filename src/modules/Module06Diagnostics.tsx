import React, { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Cpu, HardDrive, RotateCcw } from 'lucide-react';

const PERF_DATA = Array.from({ length: 20 }, (_, i) => ({
  sample: `S${i + 1}`,
  cpu: 28 + ((i * 11) % 45),
  gpu: 35 + ((i * 7) % 40),
  mem: 58 + ((i * 3) % 18),
}));

export const Module06Diagnostics: React.FC = () => {
  const [daemons, setDaemons] = useState([
    { pid: 101, name: 'blacksite-kernel-sim', cpu: '1.8%', mem: '142 MB', state: 'RUNNING' },
    { pid: 244, name: 'webgl-globe-worker', cpu: '6.4%', mem: '418 MB', state: 'RUNNING' },
    { pid: 389, name: 'sigint-fft-synthesizer', cpu: '3.1%', mem: '210 MB', state: 'RUNNING' },
    { pid: 512, name: 'telemetry-ring-buffer', cpu: '1.2%', mem: '96 MB', state: 'RUNNING' },
  ]);

  const restartDaemon = (pid: number) => {
    setDaemons((prev) =>
      prev.map((d) => (d.pid === pid ? { ...d, state: 'RESTARTING' } : d))
    );
    setTimeout(() => {
      setDaemons((prev) =>
        prev.map((d) => (d.pid === pid ? { ...d, state: 'RUNNING' } : d))
      );
    }, 900);
  };

  return (
    <div className="p-3 h-full space-y-3 overflow-y-auto text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 panel-frame p-4">
          <div className="font-bold text-white flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[var(--accent-primary)]" />
            MODULE 06 // COMPUTE & TELEMETRY PROFILER
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERF_DATA}>
                <XAxis dataKey="sample" stroke="#475569" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#070b10', borderColor: '#1e293b' }} />
                <Line type="monotone" dataKey="cpu" stroke="#00ff88" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gpu" stroke="#00d4ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mem" stroke="#ffb020" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-frame p-4 space-y-3">
          <div className="font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            STORAGE PARTITIONS (SIMULATED)
          </div>
          {[
            { mount: '/dev/nvme0n1p1 (/root)', used: 42, cap: '512 GB' },
            { mount: '/dev/nvme0n1p2 (/vault)', used: 76, cap: '2.0 TB' },
            { mount: '/dev/shm (tmpfs-enclave)', used: 19, cap: '32 GB' },
          ].map((vol) => (
            <div key={vol.mount} className="bg-black/40 p-2.5 border border-white/5">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-200">{vol.mount}</span>
                <span className="text-[var(--accent-primary)]">{vol.used}% of {vol.cap}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900">
                <div className="h-full bg-cyan-400" style={{ width: `${vol.used}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-frame p-4">
        <div className="font-bold text-white mb-3">SIMULATED WORKSTATION DAEMONS</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-slate-500">
              <th className="py-2">PID</th>
              <th>PROCESS</th>
              <th>CPU</th>
              <th>MEMORY</th>
              <th>STATE</th>
              <th className="text-right">CONTROL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px]">
            {daemons.map((d) => (
              <tr key={d.pid}>
                <td className="py-2 text-cyan-400">{d.pid}</td>
                <td className="text-white">{d.name}</td>
                <td>{d.cpu}</td>
                <td>{d.mem}</td>
                <td className={d.state === 'RUNNING' ? 'text-[#00ff88]' : 'text-amber-400'}>{d.state}</td>
                <td className="text-right">
                  <button
                    onClick={() => restartDaemon(d.pid)}
                    className="px-2 py-0.5 border border-white/15 hover:border-[var(--accent-primary)] text-[10px] inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> RESTART
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};