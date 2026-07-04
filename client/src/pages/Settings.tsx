import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const { activeProfile, clearProfile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearProfile();
    logout();
    navigate('/login');
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
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
