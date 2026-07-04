import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import type { BillingAccount } from '@/types/user.types';

interface BillingCardProps {
  account: BillingAccount;
}

export function BillingCard({ account }: BillingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-foreground-secondary">Plan</span>
          <span className="font-medium capitalize">{account.plan}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground-secondary">Status</span>
          <Badge variant={account.subscriptionStatus === 'active' ? 'success' : 'warning'}>
            {account.subscriptionStatus}
          </Badge>
        </div>
        {account.currentPeriodEnd && (
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary">Next billing</span>
            <span>{formatDate(account.currentPeriodEnd)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
