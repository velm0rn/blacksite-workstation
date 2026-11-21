import { IntelEvent, NetworkNode, OperationItem, Severity } from '../types/blacksite';

export const GLOBAL_NODES: NetworkNode[] = [
  { id: 'ND-01', codename: 'AEGIS-CORE', city: 'Reykjavik', country: 'Iceland', region: 'EU', lat: 64.1466, lng: -21.9426, ip: '10.240.14.8', status: 'ONLINE', load: 42, latencyMs: 14, throughputGbps: 38.4 },
  { id: 'ND-02', codename: 'VALKYRIE-GW', city: 'Zurich', country: 'Switzerland', region: 'EU', lat: 47.3769, lng: 8.5417, ip: '10.240.22.19', status: 'ONLINE', load: 67, latencyMs: 19, throughputGbps: 61.2 },
  { id: 'ND-03', codename: 'OBSIDIAN-7', city: 'Virginia', country: 'United States', region: 'NA', lat: 38.9072, lng: -77.0369, ip: '10.241.0.104', status: 'ELEVATED', load: 81, latencyMs: 28, throughputGbps: 94.7 },
  { id: 'ND-04', codename: 'KITSUNE-RELAY', city: 'Tokyo', country: 'Japan', region: 'APAC', lat: 35.6762, lng: 139.6503, ip: '10.244.88.12', status: 'ONLINE', load: 55, latencyMs: 41, throughputGbps: 52.0 },
  { id: 'ND-05', codename: 'ATLAS-SOUTH', city: 'Oran', country: 'Algeria', region: 'MENA', lat: 35.6971, lng: -0.6308, ip: '10.245.19.44', status: 'ONLINE', load: 39, latencyMs: 22, throughputGbps: 29.8 },
  { id: 'ND-06', codename: 'SPHINX-NODE', city: 'Cairo', country: 'Egypt', region: 'MENA', lat: 30.0444, lng: 31.2357, ip: '10.245.31.77', status: 'DEGRADED', load: 89, latencyMs: 64, throughputGbps: 44.1 },
  { id: 'ND-07', codename: 'SOUTHERN-CROSS', city: 'Singapore', country: 'Singapore', region: 'APAC', lat: 1.3521, lng: 103.8198, ip: '10.244.12.90', status: 'ONLINE', load: 61, latencyMs: 37, throughputGbps: 73.5 },
  { id: 'ND-08', codename: 'CONDOR-04', city: 'São Paulo', country: 'Brazil', region: 'SA', lat: -23.5505, lng: -46.6333, ip: '10.246.5.201', status: 'ONLINE', load: 48, latencyMs: 53, throughputGbps: 33.9 },
  { id: 'ND-09', codename: 'BOREAL-ARRAY', city: 'Stockholm', country: 'Sweden', region: 'EU', lat: 59.3293, lng: 18.0686, ip: '10.240.91.3', status: 'ONLINE', load: 34, latencyMs: 17, throughputGbps: 41.0 },
  { id: 'ND-10', codename: 'IRON-DOME-IX', city: 'Frankfurt', country: 'Germany', region: 'EU', lat: 50.1109, lng: 8.6821, ip: '10.240.44.250', status: 'ELEVATED', load: 76, latencyMs: 16, throughputGbps: 88.6 },
];

const VECTORS = [
  'BGP Route Hijack Anomaly',
  'Encrypted C2 Beacon Burst',
  'Zero-Day TLS Handshake Probe',
  'Subsea Cable Telemetry Drift',
  'Credential Stuffing Swarm',
  'Satellite Uplink Spoof Signature',
  'Kernel Module Integrity Check',
  'Lateral Movement Simulation',
];

const PROTOCOLS: IntelEvent['protocol'][] = ['TCP/443', 'UDP/51820', 'SSH/22', 'DNS/53', 'TLS/8443'];
const SEVERITIES: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function generateSyntheticEvent(seedIndex: number): IntelEvent {
  const node = GLOBAL_NODES[seedIndex % GLOBAL_NODES.length];
  const vector = VECTORS[(seedIndex * 3 + 1) % VECTORS.length];
  const protocol = PROTOCOLS[(seedIndex * 7) % PROTOCOLS.length];
  const severity = SEVERITIES[(seedIndex * 5 + (seedIndex % 3)) % SEVERITIES.length];
  const o1 = 172 + (seedIndex % 55);
  const o2 = (seedIndex * 19) % 255;
  const o3 = (seedIndex * 43) % 255;
  const o4 = ((seedIndex * 11) % 253) + 1;

  return {
    id: `EVT-${(90000 + seedIndex).toString(16).toUpperCase()}`,
    timestamp: new Date().toISOString().split('T')[1].slice(0, 8) + ' UTC',
    sourceIp: `${o1}.${o2}.${o3}.${o4}`,
    targetNode: node.codename,
    region: node.region,
    protocol,
    vector,
    severity,
    confidence: 74 + (seedIndex % 25),
  };
}

export const INITIAL_OPERATIONS: OperationItem[] = [
  {
    id: 'OP-771',
    codename: 'GLASS HORIZON',
    sector: 'NORTH ATLANTIC BACKBONE',
    classification: 'TOP SECRET // SCI',
    status: 'ACTIVE',
    progress: 78,
    leadUnit: 'UNIT-09 SPECTRE',
    startedAt: '2026-11-18 04:12 UTC',
    summary: 'Passive packet correlation across simulated trans-oceanic relay nodes for anomalous BGP announcements.',
    logs: [
      { time: '04:12:09', entry: 'Telemetry tap initialized on AEGIS-CORE.' },
      { time: '09:44:51', entry: '412,000 synthetic flow records indexed.' },
      { time: '18:20:03', entry: 'Anomalous ASN path isolated; containment simulation armed.' },
    ],
  },
  {
    id: 'OP-804',
    codename: 'SILENT MERIDIAN',
    sector: 'MEDITERRANEAN RELAY',
    classification: 'SECRET // NOFORN',
    status: 'ACTIVE',
    progress: 54,
    leadUnit: 'SIGINT-ALPHA',
    startedAt: '2026-11-19 13:05 UTC',
    summary: 'RF spectrum sweep and encrypted burst demodulation across simulated coastal listening posts.',
    logs: [
      { time: '13:05:11', entry: 'ATLAS-SOUTH and SPHINX-NODE synchronized.' },
      { time: '16:18:40', entry: 'Detected repeating 14.28 GHz narrowband burst.' },
    ],
  },
  {
    id: 'OP-819',
    codename: 'PALE CIPHER',
    sector: 'CRYPTOGRAPHIC VAULT',
    classification: 'TOP SECRET // SCI',
    status: 'STANDBY',
    progress: 31,
    leadUnit: 'CRYPTO-DIV-4',
    startedAt: '2026-11-20 01:30 UTC',
    summary: 'Quantum-resistant lattice key rotation benchmark and SHA-256 artifact integrity verification.',
    logs: [
      { time: '01:30:00', entry: 'Staging local WebCrypto enclave.' },
    ],
  },
  {
    id: 'OP-692',
    codename: 'IRON LOTUS',
    sector: 'APAC TRANSIT',
    classification: 'SECRET // NOFORN',
    status: 'CONTAINED',
    progress: 100,
    leadUnit: 'CYBER-DEF-2',
    startedAt: '2026-11-15 21:10 UTC',
    summary: 'Simulated honeypot sinkhole deployed against automated credential spraying cluster.',
    logs: [
      { time: '21:10:44', entry: 'Sinkhole routing active on KITSUNE-RELAY.' },
      { time: '23:59:12', entry: 'All synthetic threat vectors neutralized.' },
    ],
  },
];