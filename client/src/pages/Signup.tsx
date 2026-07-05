import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Invalid email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (password !== confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(email, password);
      toast.success('Account created!');
      navigate('/profiles');
    } catch {
      toast.error('Signup failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-brand">MultiFlix</Link>
          <h1 className="mt-4 text-2xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-foreground-secondary">
            Start as an owner and invite members later
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-background-secondary p-6">
          <GoogleSignInButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background-secondary px-2 text-foreground-muted">or</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            {errors.confirm && <p className="text-xs text-danger">{errors.confirm}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Get started'}
          </Button>
        </form>
        <p className="text-center text-sm text-foreground-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-brand hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
