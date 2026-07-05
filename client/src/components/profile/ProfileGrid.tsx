import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import type { Profile } from '@/types/user.types';

interface ProfileGridProps {
  profiles: Profile[];
  onSelect: (profile: Profile) => void;
  onAdd: () => void;
  onDelete?: (profile: Profile) => void;
  deletingProfileId?: string | null;
}

export function ProfileGrid({ profiles, onSelect, onAdd, onDelete, deletingProfileId }: ProfileGridProps) {
  const limitReached = profiles.length >= 2;
  const recommendation = profiles.length === 0
    ? 'Create your first profile to separate preferences and history.'
    : profiles.length === 1
      ? 'You still have one profile slot available.'
      : 'Your profile slots are fully utilized.';

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-foreground-secondary">Your profiles</span>
          <span className="text-sm text-foreground-secondary">{profiles.length} / 2 used</span>
        </div>
        <div className="mb-2 h-1.5 w-full rounded-full bg-white/5">
          <div
            className="h-1.5 rounded-full bg-violet-500 transition-all duration-500"
            style={{ width: `${Math.min(profiles.length, 2) / 2 * 100}%` }}
          />
        </div>
      </div>
      <div className="glass-panel rounded-2xl px-6 py-4 text-center text-sm text-zinc-300">
        <p className="font-medium text-foreground">Recommended</p>
        <p>{recommendation}</p>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
        {profiles.map((profile) => (
          <motion.div
            key={profile._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex flex-col items-center gap-3"
          >
            <ProfileAvatar
              name={profile.name}
              size="lg"
              onClick={() => onSelect(profile)}
            />
            <span className="text-lg text-foreground-secondary">{profile.name}</span>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(profile)}
                disabled={deletingProfileId === profile._id}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Delete ${profile.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deletingProfileId === profile._id ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </motion.div>
        ))}
        {limitReached ? (
          <div className="flex flex-col items-center gap-3 opacity-40">
            <div className="flex h-32 w-32 cursor-not-allowed items-center justify-center rounded-full border-2 border-dashed border-white/20 text-foreground-muted">
              <Plus className="h-12 w-12" />
            </div>
            <span className="text-sm text-foreground-muted">Limit reached</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={onAdd}
              className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-foreground-muted text-foreground-muted transition-all hover:border-brand hover:text-brand"
            >
              <Plus className="h-12 w-12" />
            </button>
            <span className="text-lg text-foreground-secondary">Add profile</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
