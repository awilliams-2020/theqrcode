/**
 * Trackable Button Component
 * 
 * A button component that automatically tracks clicks in Matomo
 */

'use client';

import React from 'react';
import { trackEngagement } from '@/lib/matomo-tracking';

interface TrackableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackingName: string;
  trackingLocation?: string;
  children: React.ReactNode;
}

export function TrackableButton({
  trackingName,
  trackingLocation = 'unknown',
  children,
  onClick,
  ...props
}: TrackableButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click
    trackEngagement.clickButton(trackingName, trackingLocation);
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default TrackableButton;

