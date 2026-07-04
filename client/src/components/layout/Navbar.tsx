import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileSwitcher } from '@/components/profile/ProfileSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('billnest_active_profile');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link to="/home" className="text-xl font-bold text-brand">
            BillNest
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link to="/home" className="text-sm text-foreground-secondary hover:text-foreground">
              Home
            </Link>
            <Link to="/watchlist" className="text-sm text-foreground-secondary hover:text-foreground">
              Watchlist
            </Link>
            <Link to="/history" className="text-sm text-foreground-secondary hover:text-foreground">
              History
            </Link>
            {user?.role === 'owner' && (
              <Link to="/dashboard" className="text-sm text-foreground-secondary hover:text-foreground">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/search')}
            className="rounded-md p-2 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            className="rounded-md p-2 text-foreground-secondary hover:bg-background-tertiary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <ProfileSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 text-foreground-secondary hover:bg-background-tertiary">
              <span className="sr-only">User menu</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                {user?.email?.[0]?.toUpperCase()}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="text-xs text-foreground-muted">
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user?.role === 'owner' && (
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
