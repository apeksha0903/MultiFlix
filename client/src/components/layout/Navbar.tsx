import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, LayoutDashboard, UserCog } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileSwitcher } from '@/components/profile/ProfileSwitcher';
import { UserAvatar } from '@/components/profile/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandPalette } from '@/components/ui/command-palette';
import { NotificationCenter } from '@/components/ui/notification-center';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('multiflix_active_profile');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link to="/home" className="text-xl font-bold text-brand">
            MultiFlix
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
            <Link to="/dashboard" className="text-sm text-foreground-secondary hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaletteOpen(true)}
            className="rounded-md p-2 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
            aria-label="Open command palette"
          >
            <Search className="h-5 w-5" />
          </button>
          <NotificationCenter />
          <ProfileSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 text-foreground-secondary hover:bg-background-tertiary">
              <span className="sr-only">User menu</span>
              {user?.email && <UserAvatar email={user.email} avatarStyle={user.avatarStyle} size={28} className="h-7 w-7" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="text-xs text-foreground-muted">
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/account')}>
                <UserCog className="mr-2 h-4 w-4" /> Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
