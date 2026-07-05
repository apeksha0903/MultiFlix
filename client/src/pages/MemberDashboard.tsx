import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Clapperboard, Bookmark, History, Settings } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryState } from '@/components/ui/query-state';
import { getMyPlan } from '@/api/billing.api';
import { getProfiles } from '@/api/profile.api';
import { formatDate } from '@/utils/formatters';

const quickLinks = [
  { label: 'Browse content', href: '/home', icon: Clapperboard },
  { label: 'My watchlist', href: '/watchlist', icon: Bookmark },
  { label: 'Watch history', href: '/history', icon: History },
  { label: 'Account settings', href: '/account', icon: Settings },
];

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Free';
}

function statusClass(status: string) {
  if (status === 'active' || status === 'trialing') return 'bg-emerald-500/15 text-emerald-300';
  if (status === 'canceled') return 'bg-red-500/15 text-red-300';
  if (status === 'past_due') return 'bg-yellow-500/15 text-yellow-300';
  return 'bg-white/10 text-zinc-300';
}

export default function MemberDashboard() {
  const plan = useQuery({ queryKey: ['my-plan'], queryFn: getMyPlan });
  const profiles = useQuery({ queryKey: ['profiles'], queryFn: getProfiles });
  const profileCount = profiles.data?.length ?? 0;
  const renews = plan.data?.currentPeriodEnd ? `Renews ${formatDate(plan.data.currentPeriodEnd)}` : '-';

  return (
    <PageWrapper>
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Member dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Your shared plan</h1>
          <p className="mt-2 text-sm text-zinc-400">Manage your profiles and jump back into your private viewing space.</p>
        </div>

        <QueryState
          isLoading={plan.isLoading || profiles.isLoading}
          isError={plan.isError || profiles.isError}
          error={plan.error ?? profiles.error}
          onRetry={() => {
            plan.refetch();
            profiles.refetch();
          }}
          skeleton={<Skeleton className="h-80 rounded-2xl" />}
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Member of {plan.data?.ownerEmail ?? 'the owner'}'s plan</CardTitle>
                    <p className="mt-2 text-sm text-zinc-400">{capitalize(plan.data?.plan ?? 'free')} plan</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClass(plan.data?.subscriptionStatus ?? '')}`}>
                    {plan.data?.subscriptionStatus ?? 'unknown'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-zinc-400">Plan</p>
                    <p className="mt-2 text-2xl font-semibold">{capitalize(plan.data?.plan ?? 'free')}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-zinc-400">Status</p>
                    <p className="mt-2 text-2xl font-semibold capitalize">{plan.data?.subscriptionStatus ?? '-'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-zinc-400">Renews</p>
                    <p className="mt-2 text-2xl font-semibold">{renews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your profiles</CardTitle>
                  <span className="text-sm text-zinc-400">{profileCount} / 2 used</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${Math.min(profileCount, 2) / 2 * 100}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profiles.data?.map((profile) => (
                    <span key={profile._id} className="rounded-full bg-white/10 px-3 py-1 text-sm text-zinc-300">
                      {profile.name}
                    </span>
                  ))}
                  {profileCount === 0 && <span className="text-sm text-zinc-400">No profiles yet</span>}
                </div>
                <div className="mt-5">
                  {profileCount < 2 ? (
                    <Button asChild>
                      <Link to="/profiles">Add profile</Link>
                    </Button>
                  ) : (
                    <p className="text-sm text-zinc-400">Profile limit reached</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-violet-500/20 bg-violet-500/5">
              <CardContent className="flex gap-4 p-6">
                <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="text-sm leading-6 text-zinc-300">
                  Your profiles and watch history are completely private. The account owner cannot see your activity, watchlist, or recommendations.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} to={link.href} className="glass-panel rounded-2xl p-4 transition hover:-translate-y-1 hover:border-brand/40">
                    <Icon className="mb-3 h-5 w-5 text-brand" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </QueryState>
      </div>
    </PageWrapper>
  );
}
