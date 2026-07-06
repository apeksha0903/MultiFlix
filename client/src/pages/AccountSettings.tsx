import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryState } from '@/components/ui/query-state';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { changePassword, getMe, updateMe } from '@/api/account.api';
import { AVATAR_STYLES, generateAvatarUrl } from '@/utils/avatar';
import { useAuth } from '@/hooks/useAuth';

function monthYear(value?: string) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(value));
}

export default function AccountSettings() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const account = useQuery({ queryKey: ['account-me'], queryFn: getMe });
  const user = account.data;
  const [displayName, setDisplayName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? '');
      setSelectedStyle(user.avatarStyle ?? 'avataaars');
    }
  }, [user]);

  const fallbackName = user?.email?.split('@')[0] ?? 'Account';
  const visibleName = displayName.trim() || user?.displayName || fallbackName;
  const strength = useMemo(() => {
    if (!newPassword) return { label: 'Enter a new password', width: '0%', color: 'bg-white/10' };
    if (newPassword.length < 8) return { label: 'Too short', width: '33%', color: 'bg-red-500' };
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) return { label: 'Good', width: '66%', color: 'bg-yellow-500' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-500' };
  }, [newPassword]);

  const updateMutation = useMutation({
    mutationFn: () => updateMe({ displayName: displayName.trim(), avatarStyle: selectedStyle }),
    onSuccess: async () => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['account-me'] });
      toast.success('Account updated');
    },
    onError: () => toast.error('Failed to update account'),
  });

  const passwordMutation = useMutation({
    mutationFn: () => changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? 'Failed to update password');
    },
  });

  const handlePasswordChange = () => {
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    passwordMutation.mutate();
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <QueryState
          isLoading={account.isLoading}
          isError={account.isError}
          error={account.error}
          onRetry={() => account.refetch()}
          skeleton={<Skeleton className="h-96 rounded-2xl" />}
        >
          {user && (
            <div className="space-y-6">
              <Card>
                <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                  <UserAvatar email={user.email} avatarStyle={selectedStyle} size={96} className="h-24 w-24" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-semibold">{visibleName}</h1>
                      <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>{user.role === 'owner' ? 'Owner' : 'Member'}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">{user.email}</p>
                    <p className="mt-1 text-sm text-zinc-400">Member since {monthYear(user.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Edit info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display name</Label>
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value.slice(0, 30))}
                      placeholder={fallbackName}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Avatar</Label>
                    <div className="flex flex-wrap gap-3">
                      {AVATAR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={`overflow-hidden rounded-xl border-2 transition-all ${
                            selectedStyle === style.id
                              ? 'scale-105 border-violet-500'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={generateAvatarUrl(user.email, style.id)} alt={style.label} width={64} height={64} />
                          <p className="bg-white/5 py-1 text-center text-xs text-zinc-400">{style.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                    <Save className="h-4 w-4" />
                    {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                </CardContent>
              </Card>

              {!user.isGoogleUser && (
                <Card>
                  <CardHeader>
                    <CardTitle>Change password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current password</Label>
                      <PasswordInput id="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New password</Label>
                      <PasswordInput id="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className={`h-1.5 rounded-full ${strength.color}`} style={{ width: strength.width }} />
                      </div>
                      <p className="text-xs text-zinc-400">{strength.label}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm new password</Label>
                      <PasswordInput id="confirm-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    </div>
                    <Button
                      onClick={handlePasswordChange}
                      disabled={passwordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
                    >
                      <KeyRound className="h-4 w-4" />
                      {passwordMutation.isPending ? 'Updating...' : 'Update password'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </QueryState>
      </div>
    </PageWrapper>
  );
}
