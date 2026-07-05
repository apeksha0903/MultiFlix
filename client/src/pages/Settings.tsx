import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getGreeting } from '@/utils/personalization';

export default function Settings() {
  const { user, logout } = useAuth();
  const { activeProfile, clearProfile } = useProfile();
  const navigate = useNavigate();
  const displayName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'there';

  const handleLogout = () => {
    clearProfile();
    logout();
    navigate('/login');
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mb-6 rounded-3xl p-6"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Account</p>
          <h1 className="mt-2 text-2xl font-semibold">{getGreeting()}, {displayName}</h1>
          <p className="mt-2 text-sm text-zinc-400">Fine-tune your account and keep your streaming setup in sync.</p>
        </motion.div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Role</span>
                <Badge>{user?.role}</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Name</span>
                <span>{activeProfile?.name ?? 'None selected'}</span>
              </div>
              <Button variant="outline" onClick={() => navigate('/profiles')}>
                Switch profile
              </Button>
            </CardContent>
          </Card>
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            Log out
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
