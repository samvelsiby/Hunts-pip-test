import { auth, currentUser } from '@clerk/nextjs/server';

export interface UserSubscriptionData {
  tradingViewUsername?: string;
  subscriptionTier: 'free' | 'premium' | 'ultimate';
  accessLevel: number; // 0: free, 1: premium, 2: ultimate
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  isActive: boolean;
  keyword?: string;
}

export const DEFAULT_SUBSCRIPTION: UserSubscriptionData = {
  subscriptionTier: 'free',
  accessLevel: 0,
  isActive: true,
};

export async function getUserSubscription(): Promise<UserSubscriptionData | null> {
  try {
    const session = await auth();
    if (!session.userId) return null;

    const user = await currentUser();
    if (!user) return null;

    const subscriptionData = user.publicMetadata.subscription as UserSubscriptionData | undefined;
    
    return subscriptionData || DEFAULT_SUBSCRIPTION;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

export async function updateUserSubscription(
  subscriptionData: Partial<UserSubscriptionData>
): Promise<boolean> {
  try {
    const session = await auth();
    if (!session.userId) return false;

    const user = await currentUser();
    if (!user) return false;

    const currentSubscription = (user.publicMetadata.subscription as UserSubscriptionData) || DEFAULT_SUBSCRIPTION;
    
    // Update the subscription data
    const updatedSubscription = {
      ...currentSubscription,
      ...subscriptionData,
    };

    // We need to use the Clerk API to update the user's metadata
    // This is a placeholder - in a real app, you would use the Clerk API
    // or create an API route to handle this
    console.log('Would update user metadata with:', updatedSubscription);
    
    // For now, we'll just return true to simulate success
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
}

export async function getTradingViewUsername(): Promise<string | null> {
  try {
    const subscription = await getUserSubscription();
    return subscription?.tradingViewUsername || null;
  } catch (error) {
    console.error('Error getting TradingView username:', error);
    return null;
  }
}

export async function updateTradingViewUsername(username: string): Promise<boolean> {
  try {
    return await updateUserSubscription({ tradingViewUsername: username });
  } catch (error) {
    console.error('Error updating TradingView username:', error);
    return false;
  }
}

export async function updateKeyword(keyword: string): Promise<boolean> {
  try {
    return await updateUserSubscription({ keyword });
  } catch (error) {
    console.error('Error updating keyword:', error);
    return false;
  }
}

export function getAccessLevelFromTier(tier: string): number {
  switch (tier.toLowerCase()) {
    case 'ultimate':
      return 2;
    case 'premium':
      return 1;
    case 'free':
    default:
      return 0;
  }
}

export function getTierFromAccessLevel(level: number): 'free' | 'premium' | 'ultimate' {
  switch (level) {
    case 2:
      return 'ultimate';
    case 1:
      return 'premium';
    case 0:
    default:
      return 'free';
  }
}
