import { useEffect, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, LayoutDashboard, Search, Settings, Sparkles, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const items = [
  {
    id: 'dashboard',
    label: 'Open Dashboard',
    description: 'Jump into your owner workspace',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'settings',
    label: 'Open Account Settings',
    description: 'Manage your profile and account settings',
    icon: Settings,
    href: '/settings',
  },
  {
    id: 'billing',
    label: 'Manage Billing',
    description: 'Review your plan and members',
    icon: CreditCard,
    href: '/dashboard',
  },
  {
    id: 'profile',
    label: 'Create Profile',
    description: 'Add a new profile for a family member',
    icon: Sparkles,
    href: '/profiles',
  },
  {
    id: 'invite',
    label: 'Invite Member',
    description: 'Share your plan with another member',
    icon: UserPlus,
    href: '/dashboard',
  },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const effectiveOpen = open ?? isOpen;
  const setEffectiveOpen = (next: boolean) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setEffectiveOpen(!effectiveOpen);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [effectiveOpen]);

  const filteredItems = useMemo(() => {
    const normalized = query.toLowerCase();
    return items.filter((item) => {
      const matches =
        item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized);
      if (!matches) return false;
      if (item.id === 'billing' && user?.role !== 'owner') return false;
      return true;
    });
  }, [query, user?.role]);

  const runAction = (href: string) => {
    setEffectiveOpen(false);
    setQuery('');
    navigate(href);
  };

  return (
    <AnimatePresence>
      {effectiveOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/65 px-4 pt-24 backdrop-blur-sm"
          onClick={() => setEffectiveOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Command label="Command palette" shouldFilter={false} value={query} onValueChange={setQuery}>
              <div className="flex items-center border-b border-white/10 px-4 py-3 text-sm text-zinc-400">
                <Search className="mr-2 h-4 w-4" />
                Search actions...
              </div>
              <Command.List className="max-h-80 overflow-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-zinc-400">No results found.</div>
                ) : (
                  filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        value={item.label}
                        onSelect={() => runAction(item.href)}
                        className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm text-zinc-100 outline-none data-[selected=true]:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-white/10 p-2">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-zinc-400">{item.description}</p>
                          </div>
                        </div>
                      </Command.Item>
                    );
                  })
                )}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
