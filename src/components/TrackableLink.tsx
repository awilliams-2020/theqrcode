/**
 * Trackable Link Component
 * 
 * A link component that automatically tracks clicks in Matomo
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { trackEngagement } from '@/lib/matomo-tracking';

interface TrackableLinkProps {
  href: string;
  trackingName: string;
  trackingLocation?: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function TrackableLink({
  href,
  trackingName,
  trackingLocation = 'navigation',
  children,
  ...props
}: TrackableLinkProps) {
  const handleClick = () => {
    // Track the click
    trackEngagement.clickButton(trackingName, trackingLocation);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

export default TrackableLink;

