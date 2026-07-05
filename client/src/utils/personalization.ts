import type { BillingAccount } from '@/types/user.types';

export type OnboardingStep = 'createProfile' | 'setAvatar' | 'addDisplayName' | 'inviteMember';

const ONBOARDING_STORAGE_KEY = 'multiflix_onboarding_state';

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function generateAccountInsights(
  user: { email?: string | null } | null,
  billing: BillingAccount | null | undefined,
  profiles: Array<{ name: string }> | undefined,
) {
  const insights: string[] = [];

  if (!profiles?.length) {
    insights.push('No profiles yet. Create your first profile to personalize your experience.');
  } else if (profiles.length === 1) {
    insights.push('You still have one profile slot available.');
  } else {
    insights.push('Your profile slots are fully utilized.');
  }

  if (!billing) {
    insights.push('Billing details are still syncing. Your account is almost ready.');
  } else if (billing.plan === 'free') {
    insights.push('Upgrade to unlock more member slots and premium sharing.');
  } else if (user?.email) {
    insights.push(`Your ${billing.plan} plan is ready for ${user.email}.`);
  }

  if (!profiles?.length) {
    insights.push('Start with a profile to keep recommendations and history personal.');
  }

  return insights;
}

export function getOnboardingState() {
  if (typeof window === 'undefined') {
    return {
      createProfile: false,
      setAvatar: false,
      addDisplayName: false,
      inviteMember: false,
    };
  }

  try {
    const stored = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!stored) {
      return {
        createProfile: false,
        setAvatar: false,
        addDisplayName: false,
        inviteMember: false,
      };
    }

    return JSON.parse(stored) as Record<OnboardingStep, boolean>;
  } catch {
    return {
      createProfile: false,
      setAvatar: false,
      addDisplayName: false,
      inviteMember: false,
    };
  }
}

export function setOnboardingStep(step: OnboardingStep, value: boolean) {
  if (typeof window === 'undefined') return getOnboardingState();

  const state = getOnboardingState();
  const nextState = { ...state, [step]: value };
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function getOnboardingProgress() {
  const state = getOnboardingState();
  const steps: OnboardingStep[] = ['createProfile', 'setAvatar', 'addDisplayName', 'inviteMember'];
  const completed = steps.filter((step) => state[step]).length;

  return {
    completed,
    total: steps.length,
    percentage: Math.round((completed / steps.length) * 100),
    steps,
    state,
  };
}

export function getOnboardingRecommendation(state: Record<OnboardingStep, boolean>) {
  if (!state.createProfile) return 'Add a profile to personalize your account.';
  if (!state.inviteMember) return 'Invite one member to complete your setup.';
  return 'Your setup is looking great. Keep exploring your new workspace.';
}
