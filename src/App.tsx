import React, { Suspense, lazy, useEffect } from 'react';
import { useBlacksiteStore } from './store/useBlacksiteStore';
import { BootSequence } from './components/BootSequence';
import { AuthScreen } from './components/AuthScreen';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { NotificationDrawer } from './components/NotificationDrawer';
import { MainDashboard } from './modules/MainDashboard';
import { TerminalEmulator } from './components/TerminalEmulator';

const Module01NetworkIntel = lazy(() =>
  import('./modules/Module01NetworkIntel').then((m) => ({ default: m.Module01NetworkIntel }))
);
const Module02Geoint = lazy(() =>
  import('./modules/Module02Geoint').then((m) => ({ default: m.Module02Geoint }))
);
const Module03Forensics = lazy(() =>
  import('./modules/Module03Forensics').then((m) => ({ default: m.Module03Forensics }))
);
const Module04CryptoLab = lazy(() =>
  import('./modules/Module04CryptoLab').then((m) => ({ default: m.Module04CryptoLab }))
);
const Module05Sigint = lazy(() =>
  import('./modules/Module05Sigint').then((m) => ({ default: m.Module05Sigint }))
);
const Module06Diagnostics = lazy(() =>
  import('./modules/Module06Diagnostics').then((m) => ({ default: m.Module06Diagnostics }))
);
const Module07Operations = lazy(() =>
  import('./modules/Module07Operations').then((m) => ({ default: m.Module07Operations }))
);
const Module08Database = lazy(() =>
  import('./modules/Module08Database').then((m) => ({ default: m.Module08Database }))
);
const Module09Surveillance = lazy(() =>
  import('./modules/Module09Surveillance').then((m) => ({ default: m.Module09Surveillance }))
);
const Module10Matrix = lazy(() =>
  import('./modules/Module10Matrix').then((m) => ({ default: m.Module10Matrix }))
);

export const App: React.FC = () => {
  const { booted, authenticated, activeModule, theme, crtEnabled } = useBlacksiteStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <MainDashboard />;
      case 'terminal':
        return (
          <div className="p-3 h-full">
            <TerminalEmulator />
          </div>
        );
      case 'net-intel':
        return <Module01NetworkIntel />;
      case 'geoint':
        return <Module02Geoint />;
      case 'forensics':
        return <Module03Forensics />;
      case 'crypto-lab':
        return <Module04CryptoLab />;
      case 'sigint':
        return <Module05Sigint />;
      case 'diagnostics':
        return <Module06Diagnostics />;
      case 'operations':
        return <Module07Operations />;
      case 'database':
        return <Module08Database />;
      case 'surveillance':
        return <Module09Surveillance />;
      case 'matrix':
        return <Module10Matrix />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col bg-[#050709] text-slate-200 overflow-hidden ${crtEnabled ? 'crt-scanlines' : ''}`}>
      {!booted && <BootSequence />}
      {booted && !authenticated && <AuthScreen />}

      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 cyber-grid overflow-hidden relative">
          <Suspense
            fallback={
              <div className="h-full w-full flex items-center justify-center text-xs text-[var(--accent-primary)] tracking-widest">
                LOADING SUBSYSTEM MODULE...
              </div>
            }
          >
            {renderModule()}
          </Suspense>
        </main>
      </div>

      <CommandPalette />
      <NotificationDrawer />
    </div>
  );
};

export default App;