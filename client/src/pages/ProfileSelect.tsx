import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { createProfile, deleteProfile } from '@/api/profile.api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProfileGrid } from '@/components/profile/ProfileGrid';
import { QueryState } from '@/components/ui/query-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import type { Profile } from '@/types/user.types';
import { getGreeting, setOnboardingStep } from '@/utils/personalization';
import { notifyUser } from '@/components/ui/notification-center';

export default function ProfileSelect() {
  const { activeProfile, profiles, refreshProfiles, switchProfile, clearProfile, isLoading } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  const displayName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  const handleSelect = (profile: Profile) => {
    switchProfile(profile);
    navigate('/home');
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    if (profiles.length >= 2) {
      toast.error('Profile limit reached');
      setShowAdd(false);
      return;
    }
    setCreating(true);
    try {
      await createProfile(name.trim());
      setOnboardingStep('createProfile', true);
      setOnboardingStep('setAvatar', true);
      setOnboardingStep('addDisplayName', true);
      notifyUser('Profile created', `${name.trim()} is ready to personalize your experience.`);
      if (profiles.length === 0) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
      toast.success('Profile created');
      setShowAdd(false);
      setName('');
      await refreshProfiles();
    } catch (err: unknown) {
      const limitReached = (err as { response?: { data?: { limitReached?: boolean } } })?.response?.data?.limitReached;
      toast.error(limitReached ? 'Profile limit reached' : 'Failed to create profile');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (profile: Profile) => {
    const confirmed = window.confirm(`Delete ${profile.name}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingProfileId(profile._id);
    try {
      await deleteProfile(profile._id);
      if (activeProfile?._id === profile._id) {
        clearProfile();
      }
      toast.success('Profile deleted');
      await refreshProfiles();
    } catch {
      toast.error('Failed to delete profile');
    } finally {
      setDeletingProfileId(null);
    }
  };

  return (
    <div className="ambient-shell flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel mb-10 w-full max-w-2xl rounded-3xl px-6 py-8 text-center shadow-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-brand">Streaming profile</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{getGreeting()}, {displayName}</h1>
        <p className="mt-3 text-sm text-zinc-400">Choose a profile or create a new one for a more personalized experience.</p>
      </motion.div>
      <QueryState
        isLoading={isLoading}
        isError={false}
        skeleton={
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-32 rounded-full" />
            ))}
          </div>
        }
      >
        <ProfileGrid
          profiles={profiles}
          onSelect={handleSelect}
          onAdd={() => setShowAdd(true)}
          onDelete={handleDelete}
          deletingProfileId={deletingProfileId}
        />
      </QueryState>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name"
              />
            </div>
            <Button onClick={handleCreate} disabled={creating || !name.trim()} className="w-full">
              {creating ? 'Creating...' : 'Create profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
