import React, { useState } from 'react';
import { KeyRound, Lock, RefreshCw, Unlock } from 'lucide-react';

async function deriveAesKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('BLACKSITE-LOCAL-SALT-V4'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export const Module04CryptoLab: React.FC = () => {
  const [plaintext, setPlaintext] = useState('OPERATION GLASS HORIZON // COORDINATES 35.6971N 0.6308W');
  const [passphrase, setPassphrase] = useState('VELMORN-ENCLAVE-KEY');
  const [ciphertextB64, setCiphertextB64] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [sha256Hex, setSha256Hex] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleEncrypt = async () => {
    try {
      setErrorMsg('');
      const key = await deriveAesKey(passphrase);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(plaintext);
      const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

      const combined = new Uint8Array(iv.length + cipherBuf.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(cipherBuf), iv.length);

      setCiphertextB64(btoa(String.fromCharCode(...combined)));

      const hashBuf = await crypto.subtle.digest('SHA-256', encoded);
      setSha256Hex(
        Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
      );
    } catch {
      setErrorMsg('Encryption failed in local WebCrypto enclave.');
    }
  };

  const handleDecrypt = async () => {
    try {
      setErrorMsg('');
      const raw = Uint8Array.from(atob(ciphertextB64.trim()), (c) => c.charCodeAt(0));
      const iv = raw.slice(0, 12);
      const data = raw.slice(12);
      const key = await deriveAesKey(passphrase);
      const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      setDecryptedText(new TextDecoder().decode(plainBuf));
    } catch {
      setErrorMsg('Decryption failed: Invalid passphrase or corrupted ciphertext block.');
    }
  };

  const base64Quick = btoa(unescape(encodeURIComponent(plaintext)));

  return (
    <div className="p-3 h-full grid grid-cols-1 xl:grid-cols-12 gap-3 overflow-y-auto">
      <div className="xl:col-span-7 panel-frame p-4 text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="flex items-center gap-2 font-bold text-white">
            <KeyRound className="w-4 h-4 text-[var(--accent-primary)]" />
            MODULE 04 // WEBCRYPTO AES-GCM-256 ENCLAVE
          </span>
          <span className="text-[10px] text-cyan-400">LOCAL BROWSER CRYPTO API</span>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] text-slate-400">SYMMETRIC PASSPHRASE (PBKDF2-SHA256)</label>
          <input
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full bg-[#050709] border border-white/15 px-3 py-2 text-[var(--accent-primary)] outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] text-slate-400">INPUT PAYLOAD (PLAINTEXT)</label>
          <textarea
            rows={3}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            className="w-full bg-[#050709] border border-white/15 p-3 text-slate-200 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEncrypt}
            className="px-4 py-2 bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/60 text-[var(--accent-primary)] flex items-center gap-2 hover:bg-[var(--accent-primary)]/25"
          >
            <Lock className="w-3.5 h-3.5" /> ENCRYPT AES-256-GCM
          </button>
          <button
            onClick={handleDecrypt}
            disabled={!ciphertextB64}
            className="px-4 py-2 bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 flex items-center gap-2 disabled:opacity-40"
          >
            <Unlock className="w-3.5 h-3.5" /> DECRYPT CIPHERTEXT
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 border border-rose-500/40 bg-rose-500/10 text-rose-300 text-[11px]">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-[10px] text-slate-400">IV + CIPHERTEXT (BASE64)</label>
          <textarea
            rows={3}
            value={ciphertextB64}
            onChange={(e) => setCiphertextB64(e.target.value)}
            placeholder="Click ENCRYPT to generate AES-GCM ciphertext..."
            className="w-full bg-[#050709] border border-white/15 p-3 text-cyan-300 outline-none break-all"
          />
        </div>

        {decryptedText && (
          <div className="p-3 bg-black/50 border border-[var(--accent-primary)]/40">
            <div className="text-[9px] text-slate-500">VERIFIED DECRYPTED OUTPUT</div>
            <div className="text-[var(--accent-primary)] mt-1">{decryptedText}</div>
          </div>
        )}
      </div>

      <div className="xl:col-span-5 panel-frame p-4 text-xs space-y-4">
        <div className="font-bold text-white border-b border-white/10 pb-2.5 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          DIGEST & ENCODING INSPECTOR
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-slate-400">SHA-256 DIGEST</div>
          <div className="p-2.5 bg-black/50 border border-white/10 text-[var(--accent-primary)] break-all text-[11px]">
            {sha256Hex || 'Click ENCRYPT AES-256-GCM to compute SHA-256 digest'}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-slate-400">LIVE BASE64 ENCODING</div>
          <div className="p-2.5 bg-black/50 border border-white/10 text-slate-300 break-all text-[11px]">
            {base64Quick}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-slate-400">HEXADECIMAL STREAM</div>
          <div className="p-2.5 bg-black/50 border border-white/10 text-amber-300 break-all text-[11px]">
            {Array.from(new TextEncoder().encode(plaintext))
              .map((b) => b.toString(16).padStart(2, '0'))
              .join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
};