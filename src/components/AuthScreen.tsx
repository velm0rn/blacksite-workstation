import React, { useState } from 'react';
import { Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

export const AuthScreen: React.FC = () => {
  const operatorId = useBlacksiteStore((s) => s.operatorId);
  const authenticate = useBlacksiteStore((s) => s.authenticate);
  const [callsign, setCallsign] = useState(operatorId);
  const [passkey, setPasskey] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate(callsign);
  };

  return (
    <div className="fixed inset-0 bg-[#050709] cyber-grid flex items-center justify-center p-4 z-40">
      <div className="w-full max-w-md panel-frame p-7 relative">
        <div className="flex items-center justify-between text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 mb-6">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            RESTRICTED ACCESS // SIMULATION WORKSTATION
          </span>
          <span>CLEARANCE LVL-5</span>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 border border-[#00ff88]/40 bg-[#00ff88]/5 flex items-center justify-center mb-3">
            <Fingerprint className="w-8 h-8 text-[#00ff88]" />
          </div>
          <h1 className="text-lg font-bold tracking-[0.25em] text-white">BLACKSITE</h1>
          <p className="text-[11px] text-slate-400 mt-1">
            ENTER OPERATOR CALLSIGN TO INITIALIZE WORKSPACE
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] text-slate-400 tracking-widest mb-1">
              OPERATOR CALLSIGN
            </label>
            <input
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              className="w-full bg-[#050709] border border-slate-700 focus:border-[#00ff88] px-3 py-2 text-[#00ff88] outline-none tracking-wider uppercase"
              placeholder="VELMORN-01"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 tracking-widest mb-1">
              LOCAL ENCLAVE TOKEN
            </label>
            <div className="relative">
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full bg-[#050709] border border-slate-700 focus:border-[#00ff88] px-3 py-2 text-slate-300 outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00ff88]/15 hover:bg-[#00ff88]/25 border border-[#00ff88]/60 text-[#00ff88] font-semibold tracking-[0.2em] transition-colors"
          >
            ESTABLISH SESSION
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between text-[10px] text-slate-500">
          <span>MODE: OFFLINE DEMO</span>
          <span>CRYPTO: WEBCRYPTO-LOCAL</span>
        </div>
      </div>
    </div>
  );
};