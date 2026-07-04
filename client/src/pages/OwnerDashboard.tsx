import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
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
  removeMember,
} from '@/api/billing.api';
import { sendInvite } from '@/api/invite.api';
import { formatDate, formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

const PLAN_COST: Record<string, number> = {
  free: 0,
  standard: 14.99,
  premium: 19.99,
};

export default function OwnerDashboard() {
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');

  const billing = useQuery({
    queryKey: ['billing'],
    queryFn: getBillingAccount,
  });

  const members = useQuery({
    queryKey: ['billing-members'],
    queryFn: getBillingMembers,
  });

  const inviteMutation = useMutation({
    mutationFn: () => sendInvite(email),
    onSuccess: () => {
      toast.success('Invite sent!');
      setShowInvite(false);
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['billing-members'] });
    },
    onError: () => toast.error('Failed to send invite'),
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
  const planCost = PLAN_COST[billing.data?.plan ?? 'free'] ?? 0;
  const costPerMember =
    activeMembers.length > 0 ? planCost / activeMembers.length : planCost;

  const isLoading = billing.isLoading || members.isLoading;

  return (
    <PageWrapper>
      <div className="p-4 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <Button onClick={() => setShowInvite(true)} className="gap-2">
            <UserPlus className="h-4 w-4" /> Invite member
          </Button>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={billing.isError || members.isError}
          error={billing.error ?? members.error}
          onRetry={() => {
            billing.refetch();
            members.refetch();
          }}
          skeleton={
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          }
        >
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-foreground-secondary">Members</p>
                <p className="text-3xl font-bold">{activeMembers.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-foreground-secondary">Next billing</p>
                <p className="text-3xl font-bold">
                  {billing.data?.currentPeriodEnd
                    ? formatDate(billing.data.currentPeriodEnd)
                    : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-foreground-secondary">Cost per member</p>
                <p className="text-3xl font-bold">{formatCurrency(costPerMember)}</p>
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
            {billing.data && (
              <BillingCard account={billing.data} />
            )}
          </div>
        </QueryState>

        <Dialog open={showInvite} onOpenChange={setShowInvite}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                disabled={!email.trim() || inviteMutation.isPending}
                className="w-full"
              >
                {inviteMutation.isPending ? 'Sending...' : 'Send invite'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
