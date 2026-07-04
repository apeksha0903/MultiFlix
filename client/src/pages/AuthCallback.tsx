import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/login?error=google_failed');
      return;
    }

    loginWithToken(token);
    navigate('/profiles');
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-foreground-secondary">Signing you in...</p>
    </div>
  );
}
