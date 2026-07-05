import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
}

export function notifyUser(title: string, message: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('multiflix:notify', { detail: { title, message } }));
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Welcome back',
      message: 'Your streaming workspace is ready for today.',
    },
  ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ title: string; message: string }>).detail;
      const item = {
        id: Date.now(),
        title: detail.title,
        message: detail.message,
      };
      setNotifications((current) => [item, ...current].slice(0, 4));
      window.setTimeout(() => {
        setNotifications((current) => current.filter((entry) => entry.id !== item.id));
      }, 5000);
    };

    window.addEventListener('multiflix:notify', handler as EventListener);
    return () => window.removeEventListener('multiflix:notify', handler as EventListener);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-md p-2 text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <span className="text-xs text-zinc-400">Auto-dismiss • 5s</span>
            </div>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{notification.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
