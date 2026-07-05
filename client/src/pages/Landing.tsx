import { Link } from 'react-router-dom';
import { Users, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Users,
    title: 'Multi-tenancy',
    description:
      'One subscription covers your whole household. Each person gets their own independent account with separate profiles and watch history.',
  },
  {
    icon: Shield,
    title: 'Privacy isolation',
    description:
      'Your recommendations, watchlist, and viewing history stay completely private. No cross-contamination between family members.',
  },
  {
    icon: Mail,
    title: 'Invite-based onboarding',
    description:
      'Owners invite members by email. Each member creates their own login while sharing the same billing plan.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-background to-background" />
        <div className="relative z-10 max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand">
            MultiFlix
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            One subscription.
            <br />
            <span className="text-brand">Independent accounts.</span>
          </h1>
          <p className="mb-10 text-lg text-foreground-secondary">
            Share the cost, not the watch history. MultiFlix gives every member their own
            private streaming experience under a single shared billing plan.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/signup">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-card-gradient border-border">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/15">
                  <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-foreground-secondary">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
