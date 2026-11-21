export type ModuleId =
  | 'dashboard'
  | 'terminal'
  | 'net-intel'
  | 'geoint'
  | 'forensics'
  | 'crypto-lab'
  | 'sigint'
  | 'diagnostics'
  | 'operations'
  | 'database'
  | 'surveillance'
  | 'matrix';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ThemeAccent = 'neon' | 'cyan' | 'amber';
export type DensityMode = 'compact' | 'standard';

export interface IntelEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetNode: string;
  region: string;
  protocol: 'TCP/443' | 'UDP/51820' | 'SSH/22' | 'DNS/53' | 'TLS/8443';
  vector: string;
  severity: Severity;
  confidence: number;
}

export interface NetworkNode {
  id: string;
  codename: string;
  city: string;
  country: string;
  region: 'NA' | 'EU' | 'APAC' | 'MENA' | 'SA';
  lat: number;
  lng: number;
  ip: string;
  status: 'ONLINE' | 'DEGRADED' | 'ELEVATED';
  load: number;
  latencyMs: number;
  throughputGbps: number;
}

export interface OperationItem {
  id: string;
  codename: string;
  sector: string;
  classification: 'TOP SECRET // SCI' | 'SECRET // NOFORN';
  status: 'ACTIVE' | 'STANDBY' | 'CONTAINED' | 'COMPLETED';
  progress: number;
  leadUnit: string;
  startedAt: string;
  summary: string;
  logs: { time: string; entry: string }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  timestamp: string;
  read: boolean;
}

export interface TerminalTab {
  id: string;
  title: string;
  cwd: string;
}