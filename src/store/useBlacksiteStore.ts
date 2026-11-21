import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DensityMode,
  IntelEvent,
  ModuleId,
  OperationItem,
  SystemNotification,
  TerminalTab,
  ThemeAccent,
} from '../types/blacksite';
import { generateSyntheticEvent, INITIAL_OPERATIONS } from '../utils/seededData';
import { soundEngine } from '../utils/sound';

interface BlacksiteState {
  booted: boolean;
  authenticated: boolean;
  operatorId: string;
  activeModule: ModuleId;
  selectedRegion: string;
  selectedNodeId: string;
  theme: ThemeAccent;
  density: DensityMode;
  lowPerfMode: boolean;
  crtEnabled: boolean;
  muted: boolean;
  ambientAudio: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  events: IntelEvent[];
  operations: OperationItem[];
  notifications: SystemNotification[];
  terminalTabs: TerminalTab[];
  activeTerminalTabId: string;
  sessionHistory: { time: string; action: string }[];

  completeBoot: () => void;
  authenticate: (operator: string) => void;
  lockWorkstation: () => void;
  setActiveModule: (mod: ModuleId) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedNodeId: (nodeId: string) => void;
  setTheme: (theme: ThemeAccent) => void;
  setDensity: (density: DensityMode) => void;
  toggleLowPerfMode: () => void;
  toggleCrt: () => void;
  toggleMute: () => void;
  toggleAmbientAudio: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  pushEvent: () => void;
  addOperation: (op: Omit<OperationItem, 'id' | 'startedAt' | 'logs'>) => void;
  updateOperationProgress: (id: string, progress: number) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, detail: string, severity?: SystemNotification['severity']) => void;
  addTerminalTab: () => void;
  closeTerminalTab: (id: string) => void;
  setActiveTerminalTab: (id: string) => void;
  logSessionAction: (action: string) => void;
}

let eventCounter = 100;

export const useBlacksiteStore = create<BlacksiteState>()(
  persist(
    (set, get) => ({
      booted: false,
      authenticated: false,
      operatorId: 'VELMORN-01',
      activeModule: 'dashboard',
      selectedRegion: 'ALL',
      selectedNodeId: 'ND-01',
      theme: 'neon',
      density: 'compact',
      lowPerfMode: false,
      crtEnabled: true,
      muted: false,
      ambientAudio: false,
      commandPaletteOpen: false,
      notificationsOpen: false,
      events: Array.from({ length: 14 }, (_, i) => generateSyntheticEvent(i + 1)),
      operations: INITIAL_OPERATIONS,
      notifications: [
        {
          id: 'N-1',
          title: 'KERNEL INTEGRITY VERIFIED',
          detail: 'All 10 simulated intelligence modules passed offline checksum validation.',
          severity: 'LOW',
          timestamp: '20:41:02 UTC',
          read: false,
        },
        {
          id: 'N-2',
          title: 'ELEVATED LOAD: OBSIDIAN-7',
          detail: 'Simulated backbone throughput reached 94.7 Gbps on NA sector.',
          severity: 'HIGH',
          timestamp: '20:45:19 UTC',
          read: false,
        },
      ],
      terminalTabs: [{ id: 'tab-1', title: 'tty1 // root@blacksite', cwd: '/ops/blacksite' }],
      activeTerminalTabId: 'tab-1',
      sessionHistory: [{ time: new Date().toTimeString().slice(0, 8), action: 'Workstation initialized' }],

      completeBoot: () => set({ booted: true }),
      authenticate: (operator) => {
        soundEngine.playClick(get().muted);
        set((s) => ({
          authenticated: true,
          operatorId: operator.trim().toUpperCase() || 'OPERATOR-01',
          sessionHistory: [
            { time: new Date().toTimeString().slice(0, 8), action: `Authenticated as ${operator || 'OPERATOR-01'}` },
            ...s.sessionHistory.slice(0, 29),
          ],
        }));
      },
      lockWorkstation: () => {
        soundEngine.playAlert(get().muted);
        set({ authenticated: false, commandPaletteOpen: false });
      },
      setActiveModule: (mod) => {
        soundEngine.playClick(get().muted);
        set((s) => ({
          activeModule: mod,
          sessionHistory: [
            { time: new Date().toTimeString().slice(0, 8), action: `Switched module -> ${mod.toUpperCase()}` },
            ...s.sessionHistory.slice(0, 29),
          ],
        }));
      },
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      setDensity: (density) => set({ density }),
      toggleLowPerfMode: () => set((s) => ({ lowPerfMode: !s.lowPerfMode })),
      toggleCrt: () => set((s) => ({ crtEnabled: !s.crtEnabled })),
      toggleMute: () => {
        const nextMuted = !get().muted;
        soundEngine.toggleAmbient(get().ambientAudio, nextMuted);
        set({ muted: nextMuted });
      },
      toggleAmbientAudio: () => {
        const nextAmbient = !get().ambientAudio;
        soundEngine.toggleAmbient(nextAmbient, get().muted);
        set({ ambientAudio: nextAmbient });
      },
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      pushEvent: () => {
        eventCounter += 1;
        const next = generateSyntheticEvent(eventCounter);
        set((s) => ({
          events: [next, ...s.events.slice(0, 39)],
        }));
      },
      addOperation: (op) => {
        const newOp: OperationItem = {
          ...op,
          id: `OP-${Math.floor(820 + Math.random() * 170)}`,
          startedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
          logs: [{ time: new Date().toTimeString().slice(0, 8), entry: 'Directive created and queued in simulation core.' }],
        };
        set((s) => ({ operations: [newOp, ...s.operations] }));
      },
      updateOperationProgress: (id, progress) =>
        set((s) => ({
          operations: s.operations.map((op) =>
            op.id === id
              ? {
                  ...op,
                  progress,
                  status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
                  logs: [
                    ...op.logs,
                    { time: new Date().toTimeString().slice(0, 8), entry: `Simulation progress updated to ${progress}%.` },
                  ],
                }
              : op
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      addNotification: (title, detail, severity = 'MEDIUM') => {
        soundEngine.playAlert(get().muted);
        set((s) => ({
          notifications: [
            {
              id: `N-${Date.now()}`,
              title,
              detail,
              severity,
              timestamp: new Date().toTimeString().slice(0, 8) + ' UTC',
              read: false,
            },
            ...s.notifications.slice(0, 19),
          ],
        }));
      },
      addTerminalTab: () => {
        const idx = get().terminalTabs.length + 1;
        const id = `tab-${Date.now()}`;
        set((s) => ({
          terminalTabs: [...s.terminalTabs, { id, title: `tty${idx} // root@blacksite`, cwd: '/ops/blacksite' }],
          activeTerminalTabId: id,
        }));
      },
      closeTerminalTab: (id) => {
        const tabs = get().terminalTabs;
        if (tabs.length <= 1) return;
        const filtered = tabs.filter((t) => t.id !== id);
        set({
          terminalTabs: filtered,
          activeTerminalTabId: filtered[filtered.length - 1].id,
        });
      },
      setActiveTerminalTab: (id) => set({ activeTerminalTabId: id }),
      logSessionAction: (action) =>
        set((s) => ({
          sessionHistory: [{ time: new Date().toTimeString().slice(0, 8), action }, ...s.sessionHistory.slice(0, 29)],
        })),
    }),
    {
      name: 'blacksite-workstation-v4',
      partialize: (state) => ({
        theme: state.theme,
        density: state.density,
        lowPerfMode: state.lowPerfMode,
        crtEnabled: state.crtEnabled,
        muted: state.muted,
        operatorId: state.operatorId,
      }),
    }
  )
);