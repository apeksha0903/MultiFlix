import { Plus } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import type { Profile } from '@/types/user.types';

interface ProfileGridProps {
  profiles: Profile[];
  onSelect: (profile: Profile) => void;
  onAdd: () => void;
}

export function ProfileGrid({ profiles, onSelect, onAdd }: ProfileGridProps) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
      {profiles.map((profile) => (
        <div key={profile._id} className="flex flex-col items-center gap-3">
          <ProfileAvatar
            name={profile.name}
            size="lg"
            onClick={() => onSelect(profile)}
          />
          <span className="text-lg text-foreground-secondary">{profile.name}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onAdd}
          className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-foreground-muted text-foreground-muted transition-all hover:border-brand hover:text-brand"
        >
          <Plus className="h-12 w-12" />
        </button>
        <span className="text-lg text-foreground-secondary">Add profile</span>
      </div>
    </div>
  );
}
