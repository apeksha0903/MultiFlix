import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '@/api/profile.api';
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

export default function ProfileSelect() {
  const { profiles, refreshProfiles, switchProfile, isLoading } = useProfile();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  const handleSelect = (profile: Profile) => {
    switchProfile(profile);
    navigate('/home');
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await createProfile(name.trim());
      toast.success('Profile created');
      setShowAdd(false);
      setName('');
      await refreshProfiles();
    } catch {
      toast.error('Failed to create profile');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="mb-12 text-3xl font-semibold md:text-4xl">Who's watching?</h1>
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
