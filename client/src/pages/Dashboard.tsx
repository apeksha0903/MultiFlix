import { useAuth } from '@/hooks/useAuth';
import OwnerDashboard from './OwnerDashboard';
import MemberDashboard from './MemberDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === 'owner' ? <OwnerDashboard /> : <MemberDashboard />;
}
