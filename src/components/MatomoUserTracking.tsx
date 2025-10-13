/**
 * Matomo User Tracking Component
 * 
 * Automatically sets/unsets user ID in Matomo based on session state
 */

'use client';

import { useSession } from 'next-auth/react';
import { useMatomoUserId } from '@/hooks/useMatomo';

export function MatomoUserTracking() {
  const { data: session } = useSession();
  
  // Automatically set/unset user ID based on session
  useMatomoUserId(session?.user?.id);
  
  return null; // This component doesn't render anything
}

export default MatomoUserTracking;

