import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProfiles } from '@/api/profile.api';
import type { Profile } from '@/types/user.types';

const PROFILE_KEY = 'billnest_active_profile';

interface ProfileContextValue {
  activeProfile: Profile | null;
  profiles: Profile[];
  isLoading: boolean;
  switchProfile: (profile: Profile) => void;
  clearProfile: () => void;
  refreshProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProfiles();
      setProfiles(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(PROFILE_KEY);
    if (stored) {
      try {
        setActiveProfile(JSON.parse(stored) as Profile);
      } catch {
        sessionStorage.removeItem(PROFILE_KEY);
      }
    }
  }, []);

  const switchProfile = useCallback((profile: Profile) => {
    setActiveProfile(profile);
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, []);

  const clearProfile = useCallback(() => {
    setActiveProfile(null);
    sessionStorage.removeItem(PROFILE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      activeProfile,
      profiles,
      isLoading,
      switchProfile,
      clearProfile,
      refreshProfiles,
    }),
    [activeProfile, profiles, isLoading, switchProfile, clearProfile, refreshProfiles],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
