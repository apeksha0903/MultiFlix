import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatters';
import type { BillingMember } from '@/types/user.types';

interface MemberListProps {
  members: BillingMember[];
  onRemove: (userId: string) => void;
  isRemoving?: boolean;
}

export function MemberList({ members, onRemove, isRemoving }: MemberListProps) {
  if (!members.length) {
    return (
      <p className="py-8 text-center text-foreground-secondary">
        No members yet. Invite someone to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-foreground-secondary">
            <th className="pb-3 pr-4 font-medium">Email</th>
            <th className="pb-3 pr-4 font-medium">Role</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Joined</th>
            <th className="pb-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-border/50">
              <td className="py-3 pr-4">{member.email}</td>
              <td className="py-3 pr-4 capitalize">{member.role}</td>
              <td className="py-3 pr-4">
                <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                  {member.status}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-foreground-secondary">
                {formatDate(member.joinedAt)}
              </td>
              <td className="py-3">
                {member.role !== 'owner' && member.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isRemoving}
                    onClick={() => onRemove(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
