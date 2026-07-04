import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  role: 'owner' | 'member';
}

export function RoleGuard({ children, role }: RoleGuardProps) {
  const { user } = useAuth();

  if (user?.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
