import { useNavigate } from 'react-router-dom';
import { ChevronDown, UserCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileAvatar } from './ProfileAvatar';

export function ProfileSwitcher() {
  const { activeProfile } = useProfile();
  const navigate = useNavigate();

  if (!activeProfile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground-secondary hover:bg-background-tertiary">
        <ProfileAvatar name={activeProfile.name} size="sm" className="pointer-events-none h-8 w-8 text-xs" />
        <span className="hidden sm:inline">{activeProfile.name}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate('/profiles')}>
          <UserCircle className="mr-2 h-4 w-4" />
          Switch Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
