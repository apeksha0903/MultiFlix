import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getInvite, acceptInvite } from '@/api/invite.api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QueryState } from '@/components/ui/query-state';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchInvite = async () => {
    if (!token) {
      setError(new Error('Invalid invite link'));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getInvite(token);
      setInviteEmail(data.email);
      setError(null);
    } catch {
      setError(new Error('This invite is invalid or has expired'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (password !== confirm) next.confirm = 'Passwords do not match';
    setFormErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const data = await acceptInvite(token, password);
      setAuth(data.token, data.user);
      toast.success('Welcome to BillNest!');
      navigate('/profiles');
    } catch {
      toast.error('Failed to accept invite');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <QueryState
          isLoading={loading}
          isError={!!error}
          error={error}
          onRetry={fetchInvite}
          skeleton={
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          }
        >
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">You're invited!</h1>
              <p className="mt-2 text-foreground-secondary">
                Join a shared plan as <span className="text-foreground">{inviteEmail}</span>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-background-secondary p-6">
              <div className="space-y-2">
                <Label htmlFor="password">Create password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {formErrors.password && <p className="text-xs text-danger">{formErrors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                {formErrors.confirm && <p className="text-xs text-danger">{formErrors.confirm}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Joining...' : 'Accept invite'}
              </Button>
            </form>
          </div>
        </QueryState>
      </div>
    </div>
  );
}
