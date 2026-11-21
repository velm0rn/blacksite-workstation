import React from 'react';
import { CheckCheck, X } from 'lucide-react';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

export const NotificationDrawer: React.FC = () => {
  const open = useBlacksiteStore((s) => s.notificationsOpen);
  const setOpen = useBlacksiteStore((s) => s.setNotificationsOpen);
  const notifications = useBlacksiteStore((s) => s.notifications);
  const markAllRead = useBlacksiteStore((s) => s.markAllNotificationsRead);

  if (!open) return null;

  return (
    <div className="fixed right-3 top-12 w-80 panel-frame z-40 shadow-2xl">
      <div className="panel-header px-3 py-2 flex items-center justify-between text-xs">
        <span className="font-semibold tracking-wider text-white">ALERT DISPATCH</span>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-[10px] text-[var(--accent-primary)] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" /> ACK ALL
          </button>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
        {notifications.map((n) => (
          <div key={n.id} className={`p-3 text-xs ${n.read ? 'opacity-60' : 'bg-white/[0.02]'}`}>
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[10px] font-bold ${
                  n.severity === 'CRITICAL' || n.severity === 'HIGH'
                    ? 'text-rose-400'
                    : 'text-[var(--accent-primary)]'
                }`}
              >
                {n.title}
              </span>
              <span className="text-[9px] text-slate-500">{n.timestamp}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{n.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};