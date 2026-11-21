import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Plus, Terminal as TerminalIcon, X } from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';
import { GLOBAL_NODES } from '../utils/seededData';

const COMMAND_LIST = [
  'help',
  'clear',
  'whoami',
  'sysinfo',
  'netstat',
  'scan',
  'trace',
  'analyze',
  'decrypt',
  'firewall',
  'processes',
  'connections',
  'matrix',
  'globe',
  'monitor',
  'operations',
  'status',
  'history',
  'exit',
];

export const TerminalEmulator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    operatorId,
    terminalTabs,
    activeTerminalTabId,
    addTerminalTab,
    closeTerminalTab,
    setActiveTerminalTab,
    setActiveModule,
    operations,
    events,
    lockWorkstation,
  } = useBlacksiteStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<string[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: compact ? 11 : 13,
      theme: {
        background: '#050709',
        foreground: '#cbd5e1',
        cursor: '#00ff88',
        selectionBackground: 'rgba(0, 255, 136, 0.25)',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(el);
    fitAddon.fit();

    let currentLine = '';
    let histIdx = -1;

    const prompt = () => {
      term.write(`\r\n\x1b[1;32m${operatorId.toLowerCase()}@blacksite\x1b[0m:\x1b[1;36m~/ops\x1b[0m$ `);
    };

    const writeLine = (txt: string) => term.writeln(txt);

    writeLine('\x1b[1;32mBLACKSITE SECURE SHELL [OFFLINE SIMULATION SANDBOX]\x1b[0m');
    writeLine('Type \x1b[1;36mhelp\x1b[0m for available directives. Tab-completion enabled.');
    prompt();

    const executeCommand = (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      historyRef.current.push(trimmed);
      histIdx = historyRef.current.length;

      const [cmd, ...args] = trimmed.split(/\s+/);
      const argStr = args.join(' ');

      switch (cmd.toLowerCase()) {
        case 'help':
          writeLine('\x1b[1;36mAVAILABLE DIRECTIVES:\x1b[0m');
          writeLine('  help          Show this command manual');
          writeLine('  clear         Clear terminal viewport');
          writeLine('  whoami        Display active operator clearance profile');
          writeLine('  sysinfo       Inspect local simulated kernel & hardware');
          writeLine('  netstat       List simulated listening sockets & interfaces');
          writeLine('  scan <target> Run synthetic port/service simulation on demo node');
          writeLine('  trace <node>  Simulate multi-hop latency trace across relay nodes');
          writeLine('  analyze       Correlate top simulated cyber-intel threat vectors');
          writeLine('  decrypt <hex> Simulate local cipher block inspection');
          writeLine('  firewall      Inspect active packet-filter ruleset');
          writeLine('  processes     List simulated workstation daemons');
          writeLine('  connections   Display active encrypted node tunnels');
          writeLine('  matrix        Launch full-screen Matrix Character Rain module');
          writeLine('  globe         Switch focus to Global 3D Intelligence Map');
          writeLine('  monitor       Open System Diagnostics hardware telemetry');
          writeLine('  operations    List active classified operations');
          writeLine('  status        Overall BLACKSITE subsystem health check');
          writeLine('  history       Display session command history');
          writeLine('  exit          Lock workstation session');
          break;

        case 'clear':
          term.clear();
          break;

        case 'whoami':
          writeLine(`\x1b[1;32mOPERATOR:\x1b[0m ${operatorId} | \x1b[1;33mCLEARANCE:\x1b[0m LEVEL-5 // SCI-SIM`);
          break;

        case 'sysinfo':
          writeLine('OS:       BLACKSITE-LINUX 6.11.0-hardened-sim x86_64');
          writeLine('HOST:     LOCAL-WINDOWS-HOST // WEBGPU-ENCLAVE');
          writeLine('CRYPTO:   WebCrypto Subtle AES-GCM-256 / SHA-256');
          writeLine('MODE:     AIR-GAPPED DEMONSTRATION ENVIRONMENT');
          break;

        case 'netstat':
          writeLine('PROTO   LOCAL ADDRESS          STATE        SERVICE');
          writeLine('TCP     127.0.0.1:8443         LISTEN       blacksite-ui-core');
          writeLine('UDP     10.240.14.8:51820      ESTABLISHED  wireguard-sim-mesh');
          writeLine('TCP     10.240.22.19:443       ESTABLISHED  telemetry-bus');
          break;

        case 'scan': {
          const target = argStr || 'AEGIS-CORE (10.240.14.8)';
          writeLine(`\x1b[1;33m[SIMULATION]\x1b[0m Probing synthetic dataset for target: ${target}...`);
          writeLine('  22/tcp   OPEN   OpenSSH 9.8-hardened');
          writeLine('  443/tcp  OPEN   TLSv1.3 / Mutual-Auth');
          writeLine('  51820/udp OPEN  Encrypted Mesh Relay');
          writeLine('\x1b[1;32m[COMPLETE]\x1b[0m 0 critical exposures on synthetic host.');
          break;
        }

        case 'trace': {
          const dest = argStr || 'KITSUNE-RELAY';
          writeLine(`Tracing simulated route to \x1b[1;36m${dest}\x1b[0m:`);
          writeLine('  1   2.1 ms   10.240.0.1     [LOCAL-GATEWAY]');
          writeLine('  2  14.4 ms   10.240.14.8    [AEGIS-CORE]');
          writeLine('  3  28.9 ms   10.241.0.104   [OBSIDIAN-7]');
          writeLine(`  4  41.2 ms   10.244.88.12   [${dest.toUpperCase()}]`);
          break;
        }

        case 'analyze':
          writeLine(`\x1b[1;36mCORRELATING ${events.length} SYNTHETIC EVENTS:\x1b[0m`);
          events.slice(0, 4).forEach((ev) => {
            writeLine(`  [${ev.severity}] ${ev.id} :: ${ev.vector} (${ev.sourceIp} -> ${ev.targetNode})`);
          });
          break;

        case 'decrypt': {
          const sample = argStr || '424C41434B53495445';
          const decoded = sample
            .replace(/\s+/g, '')
            .match(/.{1,2}/g)
            ?.map((b) => String.fromCharCode(parseInt(b, 16) || 46))
            .join('');
          writeLine(`INPUT BLOCK : ${sample}`);
          writeLine(`ASCII OUTPUT: \x1b[1;32m${decoded || '[INVALID HEX]'}\x1b[0m`);
          break;
        }

        case 'firewall':
          writeLine('CHAIN INPUT (policy DROP) | CHAIN FORWARD (policy DROP) | CHAIN OUTPUT (policy ACCEPT)');
          writeLine('RULE 01: ALLOW loopback 127.0.0.0/8');
          writeLine('RULE 02: ALLOW simulated mesh 10.240.0.0/12');
          writeLine('RULE 03: BLOCK external WAN egress (AIRGAP_ENFORCED)');
          break;

        case 'processes':
          writeLine('PID    CPU%   MEM%   COMMAND');
          writeLine('101    1.4    2.1    /sbin/blacksite-kernel');
          writeLine('408    4.8    6.3    /usr/bin/webgl-globe-renderer');
          writeLine('712    2.2    3.9    /usr/bin/sigint-dsp-synth');
          writeLine('890    0.9    1.8    /usr/bin/crypto-enclave-worker');
          break;

        case 'connections':
          GLOBAL_NODES.slice(0, 5).forEach((n) => {
            writeLine(`  ${n.id}  ${n.codename.padEnd(15)} ${n.ip.padEnd(15)} ${n.throughputGbps} Gbps [${n.status}]`);
          });
          break;

        case 'matrix':
          writeLine('Launching MODULE 10 // MATRIX ENVIRONMENT...');
          setActiveModule('matrix');
          break;

        case 'globe':
          writeLine('Focusing GEOINT 3D Globe...');
          setActiveModule('geoint');
          break;

        case 'monitor':
          writeLine('Opening MODULE 06 // SYSTEM DIAGNOSTICS...');
          setActiveModule('diagnostics');
          break;

        case 'operations':
          operations.forEach((op) => {
            writeLine(`  ${op.id} // ${op.codename.padEnd(18)} [${op.status}] ${op.progress}%`);
          });
          break;

        case 'status':
          writeLine('\x1b[1;32mALL 10 INTELLIGENCE SUBSYSTEMS OPERATIONAL // ZERO REAL-WORLD NETWORK I/O\x1b[0m');
          break;

        case 'history':
          historyRef.current.forEach((h, i) => writeLine(`  ${i + 1}  ${h}`));
          break;

        case 'exit':
          lockWorkstation();
          break;

        default:
          writeLine(`\x1b[1;31mERR:\x1b[0m Unknown directive '${cmd}'. Run \x1b[1;36mhelp\x1b[0m.`);
      }
    };

    const disposable = term.onData((data) => {
      if (data === '\r') {
        term.writeln('');
        executeCommand(currentLine);
        currentLine = '';
        prompt();
      } else if (data === '\u007F') {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\t') {
        const match = COMMAND_LIST.find((c) => c.startsWith(currentLine.toLowerCase()));
        if (match && currentLine.length > 0) {
          const rest = match.slice(currentLine.length);
          currentLine += rest;
          term.write(rest);
        }
      } else if (data === '\u001b[A') {
        if (histIdx > 0) {
          histIdx -= 1;
          while (currentLine.length > 0) {
            term.write('\b \b');
            currentLine = currentLine.slice(0, -1);
          }
          currentLine = historyRef.current[histIdx] || '';
          term.write(currentLine);
        }
      } else if (data >= ' ') {
        currentLine += data;
        term.write(data);
      }
    });

    const onResize = () => fitAddon.fit();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      disposable.dispose();
      term.dispose();
    };
  }, [activeTerminalTabId, compact, operatorId]);

  return (
    <div className="panel-frame flex flex-col h-full overflow-hidden">
      <div className="panel-header px-2.5 py-1.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1 overflow-x-auto">
          {terminalTabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTerminalTab(tab.id)}
              className={`flex items-center gap-2 px-2.5 py-1 cursor-pointer border text-[10px] ${
                tab.id === activeTerminalTabId
                  ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/10 text-white'
                  : 'border-white/5 bg-black/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              <TerminalIcon className="w-3 h-3 text-[var(--accent-primary)]" />
              <span>{tab.title}</span>
              {terminalTabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTerminalTab(tab.id);
                  }}
                  className="hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTerminalTab}
            className="p-1 border border-white/10 text-slate-400 hover:text-[var(--accent-primary)]"
            title="New Terminal Tab"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">XTERM // PTY-SIM</span>
      </div>

      <div ref={containerRef} className="flex-1 p-2 bg-[#050709] min-h-[210px]" />
    </div>
  );
};