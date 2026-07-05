import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, Clock, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const baseLinks = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const links = user?.role === 'owner'
    ? [...baseLinks.slice(0, 4), { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, ...baseLinks.slice(4)]
    : baseLinks;

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-background-secondary lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              location.pathname === to
                ? 'bg-brand/15 text-brand'
                : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
