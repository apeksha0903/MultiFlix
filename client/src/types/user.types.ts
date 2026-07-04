export interface Profile {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete';

export interface BillingAccount {
  _id: string;
  plan: string;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd?: string;
  createdAt: string;
}

export interface BillingMember {
  id: string;
  email: string;
  role: 'owner' | 'member';
  status: 'active' | 'pending';
  joinedAt: string;
}

export interface InvitePreview {
  email: string;
}

export interface InviteResponse {
  message: string;
  inviteLink: string;
}
