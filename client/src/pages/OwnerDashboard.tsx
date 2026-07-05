import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, LayoutDashboard, Sparkles, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { BillingCard } from '@/components/billing/BillingCard';
import { MemberList } from '@/components/billing/MemberList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryState } from '@/components/ui/query-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getBillingAccount,
  getBillingMembers,
  getMyPlan,
  removeMember,
} from '@/api/billing.api';
import { sendInvite } from '@/api/invite.api';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  generateAccountInsights,
  getGreeting,
  getOnboardingProgress,
  getOnboardingRecommendation,
  setOnboardingStep,
} from '@/utils/personalization';
import { notifyUser } from '@/components/ui/notification-center';
import toast from 'react-hot-toast';

const PLAN_COST: Record<string, number> = {
  free: 0,
  standard: 14.99,
  premium: 19.99,
};

const quickActions = [
  { label: 'Create Profile', description: 'Add a new view for your household', icon: Sparkles, href: '/profiles' },
  { label: 'Invite Member', description: 'Share access in seconds', icon: UserPlus, href: '/dashboard' },
  { label: 'Manage Account', description: 'Fine-tune your plan and preferences', icon: LayoutDashboard, href: '/account' },
  { label: 'View Plan', description: 'See billing and renewal details', icon: CreditCard, href: '/dashboard' },
];

export default function OwnerDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profiles, refreshProfiles } = useProfile();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  const displayName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    void refreshProfiles();
  }, [refreshProfiles]);

  const billing = useQuery({
    queryKey: ['billing'],
    queryFn: getBillingAccount,
  });

  const members = useQuery({
    queryKey: ['billing-members'],
    queryFn: getBillingMembers,
  });

  const myPlan = useQuery({
    queryKey: ['my-plan'],
    queryFn: getMyPlan,
  });

  const inviteMutation = useMutation({
    mutationFn: () => sendInvite(email),
    onSuccess: () => {
      setOnboardingStep('inviteMember', true);
      notifyUser('Member invited', 'Your invite is on its way.');
      toast.success('Invite sent!');
      setShowInvite(false);
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['billing-members'] });
      queryClient.invalidateQueries({ queryKey: ['my-plan'] });
    },
    onError: (err: unknown) => {
      const limitReached = (err as { response?: { data?: { limitReached?: boolean } } })?.response?.data?.limitReached;
      toast.error(limitReached ? 'Member limit reached' : 'Failed to send invite');
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      toast.success('Member removed');
      queryClient.invalidateQueries({ queryKey: ['billing-members'] });
    },
    onError: () => toast.error('Failed to remove member'),
  });

  const activeMembers = members.data?.filter((m) => m.status === 'active') ?? [];
  const memberCount = myPlan.data?.memberCount ?? activeMembers.filter((m) => m.role === 'member').length;
  const memberLimitReached = memberCount >= 1;
  const planCost = PLAN_COST[billing.data?.plan ?? 'free'] ?? 0;
  const costPerMember = activeMembers.length > 0 ? planCost / activeMembers.length : planCost;
  const onboarding = useMemo(() => getOnboardingProgress(), []);
  const insights = useMemo(() => generateAccountInsights(user, billing.data, profiles), [profiles, user, billing.data]);
  const isLoading = billing.isLoading || members.isLoading || myPlan.isLoading;

  useEffect(() => {
    if (onboarding.percentage === 100) {
      const timer = window.setTimeout(() => setShowSetupBanner(false), 500);
      return () => window.clearTimeout(timer);
    }
    setShowSetupBanner(true);
  }, [onboarding.percentage]);

  return (
    <PageWrapper>
      <div className="p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mb-8 overflow-hidden rounded-3xl p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Premium sharing</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{getGreeting()}, {displayName}</h1>
              <p className="mt-3 max-w-2xl text-sm text-zinc-400">
                Your account is tuned like a modern streaming service with smart recommendations and one-click actions.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-300">
              <p className="font-semibold text-foreground">Premium Plan</p>
              <p>{activeMembers.length} active member{activeMembers.length === 1 ? '' : 's'}</p>
              <p>{profiles.length} profile{profiles.length === 1 ? '' : 's'}</p>
            </div>
          </div>
        </motion.div>

        {showSetupBanner ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mb-8 rounded-3xl border border-brand/20 bg-brand/10 p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand">Complete your setup</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-300">
                  <span className="rounded-full bg-white/10 px-2 py-1">✓ Display Name</span>
                  <span className="rounded-full bg-white/10 px-2 py-1">✓ Avatar</span>
                  <span className={!onboarding.state.createProfile ? 'rounded-full bg-white/10 px-2 py-1' : 'rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300'}>{onboarding.state.createProfile ? '✓' : '○'} Create Profile</span>
                  <span className={!onboarding.state.inviteMember ? 'rounded-full bg-white/10 px-2 py-1' : 'rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300'}>{onboarding.state.inviteMember ? '✓' : '○'} Invite Member</span>
                </div>
              </div>
              <Button onClick={() => setShowSetupBanner(false)}>Continue</Button>
            </div>
          </motion.div>
        ) : null}

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (action.label === 'Invite Member') {
                    if (memberLimitReached) {
                      toast.error('Member limit reached');
                    } else {
                      setShowInvite(true);
                    }
                  } else {
                    navigate(action.href);
                  }
                }}
                className={`glass-panel rounded-2xl p-4 text-left ${action.label === 'Invite Member' && memberLimitReached ? 'opacity-50' : ''}`}
              >
                <div className="mb-3 inline-flex rounded-xl bg-brand/15 p-2 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground">{action.label}</p>
                <p className="mt-1 text-sm text-zinc-400">{action.description}</p>
              </motion.button>
            );
          })}
        </div>

        <QueryState
          isLoading={isLoading}
          isError={billing.isError || members.isError || myPlan.isError}
          error={billing.error ?? members.error ?? myPlan.error}
          onRetry={() => {
            billing.refetch();
            members.refetch();
            myPlan.refetch();
          }}
          skeleton={
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          }
        >
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-zinc-400">Members</p>
                <p className="text-3xl font-bold">{memberCount}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  {memberLimitReached ? '1 member slot used' : '0 / 1 member slots used'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-zinc-400">Next billing</p>
                <p className="text-3xl font-bold">
                  {billing.data?.currentPeriodEnd ? formatDate(billing.data.currentPeriodEnd) : '—'}
                </p>
                <p className="mt-2 text-sm text-zinc-400">Renewal is always one step away</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-zinc-400">Cost per member</p>
                <p className="text-3xl font-bold">{formatCurrency(costPerMember)}</p>
                <p className="mt-2 text-sm text-zinc-400">Smart sharing at a premium rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>AI insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight) => (
                  <div key={insight} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
                    {insight}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-2 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${onboarding.percentage}%` }}
                    className="h-2 rounded-full bg-gradient-to-r from-brand to-blue-500"
                  />
                </div>
                <p className="text-sm text-zinc-400">{onboarding.percentage}% complete</p>
                <p className="text-sm text-zinc-300">{getOnboardingRecommendation(onboarding.state)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <MemberList
                    members={members.data ?? []}
                    onRemove={(id) => removeMutation.mutate(id)}
                    isRemoving={removeMutation.isPending}
                  />
                </CardContent>
              </Card>
            </div>
            {billing.data && <BillingCard account={billing.data} />}
          </div>
        </QueryState>

        <Dialog open={showInvite} onOpenChange={setShowInvite}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${memberLimitReached ? 'bg-violet-500' : 'border border-white/20 bg-white/10'}`} />
                <span className="text-sm text-foreground-secondary">
                  {memberLimitReached ? '1 member slot used' : '0 / 1 member slots used'}
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@example.com"
                />
              </div>
              <Button
                onClick={() => inviteMutation.mutate()}
                disabled={!email.trim() || inviteMutation.isPending || memberLimitReached}
                title={memberLimitReached ? 'Member limit reached for your plan' : undefined}
                className="w-full"
              >
                {memberLimitReached ? 'Member limit reached' : inviteMutation.isPending ? 'Sending...' : 'Send invite'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
