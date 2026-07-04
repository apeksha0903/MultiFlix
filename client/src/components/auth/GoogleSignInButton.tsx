import { Button } from '@/components/ui/button';

export function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-3 bg-background-secondary"
      onClick={handleGoogleSignIn}
    >
      <img src="/google-icon.svg" alt="" className="h-5 w-5" />
      Continue with Google
    </Button>
  );
}
