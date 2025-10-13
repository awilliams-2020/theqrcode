/**
 * Matomo Integration Examples
 * 
 * These are example implementations showing how to integrate Matomo tracking
 * in various scenarios within the TheQRCode.io application.
 */

// =============================================================================
// Example 1: Root Layout with Automatic Page View Tracking
// =============================================================================

// app/layout.tsx
import { useMatomoPageViewTracking, useMatomoUserId } from '@/hooks/useMatomo';
import { useSession } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  
  // Automatically track page views on route changes
  useMatomoPageViewTracking();
  
  // Automatically set user ID when logged in
  useMatomoUserId(session?.data?.user?.id);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// =============================================================================
// Example 2: QR Code Creation with Event Tracking
// =============================================================================

// components/QRCodeGenerator.tsx
'use client';

import { useState } from 'react';
import { useMatomo } from '@/hooks/useMatomo';

export function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const matomo = useMatomo();

  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Track QR code creation
        matomo.trackQRCodeEvent('created', data.qrCode.id, {
          type: data.qrCode.type,
          hasCustomization: String(data.qrCode.hasColors),
        });
        
        // Also track as a general event
        matomo.trackEvent({
          category: 'QR Code',
          action: 'generated',
          name: data.qrCode.type,
          value: 1,
        });
      }
    } catch (error) {
      // Track error
      matomo.trackEvent({
        category: 'Error',
        action: 'qr_generation_failed',
        name: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={handleGenerate} disabled={loading}>
        Generate QR Code
      </button>
    </div>
  );
}

// =============================================================================
// Example 3: Signup Flow with Goal Tracking
// =============================================================================

// app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useMatomo } from '@/hooks/useMatomo';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const matomo = useMatomo();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Track user signup event
        matomo.trackUserEvent('signup', data.user.id);
        
        // Set user ID for future tracking
        matomo.setUserId(data.user.id);
        
        // Track signup as a goal (configure goal ID in Matomo)
        matomo.trackGoal({
          goalId: 1, // "User Signup" goal
          customDimensions: {
            '1': data.user.plan, // Custom dimension 1: Plan
          },
        });

        // If trial started, track that too
        if (data.user.trialStarted) {
          matomo.trackUserEvent('trial_started', data.user.id);
        }

        router.push('/dashboard');
      }
    } catch (error) {
      matomo.trackEvent({
        category: 'Error',
        action: 'signup_failed',
        name: error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

// =============================================================================
// Example 4: Subscription Purchase with E-commerce Tracking
// =============================================================================

// app/checkout/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useMatomo } from '@/hooks/useMatomo';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const matomo = useMatomo();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const trackPurchase = async () => {
      // Fetch order details
      const response = await fetch(`/api/orders/${sessionId}`);
      const order = await response.json();

      // Track subscription event
      matomo.trackSubscriptionEvent(
        'upgraded',
        order.plan,
        order.amount / 100 // Convert from cents
      );

      // Track e-commerce order
      matomo.trackEcommerce({
        orderId: order.id,
        revenue: order.amount / 100,
        subTotal: order.subtotal / 100,
        tax: order.tax / 100,
        items: [
          {
            sku: order.planId,
            name: `${order.plan} Plan`,
            category: 'subscription',
            price: order.amount / 100,
            quantity: 1,
          },
        ],
        customDimensions: {
          '1': order.plan,
          '2': order.billingCycle,
        },
      });

      // Track as a goal
      matomo.trackGoal({
        goalId: 2, // "Purchase" goal
        revenue: order.amount / 100,
        customDimensions: {
          '1': order.plan,
        },
      });
    };

    if (sessionId) {
      trackPurchase();
    }
  }, [sessionId, matomo]);

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Your subscription has been activated.</p>
    </div>
  );
}

// =============================================================================
// Example 5: API Route with Server-Side Tracking
// =============================================================================

// app/api/qr-codes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { serverTrackEvent, serverTrackGoal } from '@/lib/matomo';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Create QR code logic...
    const qrCode = { id: 'qr-123', type: body.type };

    // Track event on server-side
    await serverTrackEvent(
      request.url,
      'QR Code',
      'created',
      {
        name: qrCode.id,
        userId: session.user.id,
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        customDimensions: {
          '1': session.user.plan,
          '2': qrCode.type,
        },
      }
    );

    // If user created their first QR code, track as a goal
    const isFirstQRCode = true; // Check from database
    if (isFirstQRCode) {
      await serverTrackGoal(
        request.url,
        3, // "First QR Code Created" goal
        {
          userId: session.user.id,
          ip: request.headers.get('x-forwarded-for') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        }
      );
    }

    return NextResponse.json({ success: true, qrCode });
  } catch (error) {
    // Track error
    await serverTrackEvent(
      request.url,
      'Error',
      'qr_creation_failed',
      {
        name: error.message,
        userId: session?.user?.id,
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
  }
}

// =============================================================================
// Example 6: Search Component with Site Search Tracking
// =============================================================================

// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { useMatomo } from '@/hooks/useMatomo';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const matomo = useMatomo();

  const handleSearch = async (searchQuery: string) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await response.json();
    
    setResults(data.results);

    // Track site search
    matomo.trackSiteSearch(
      searchQuery,
      'qr-codes', // Category
      data.results.length // Number of results
    );

    // Also track as event
    matomo.trackEvent({
      category: 'Search',
      action: 'performed',
      name: searchQuery,
      value: data.results.length,
    });
  };

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(query);
          }
        }}
        placeholder="Search QR codes..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================================
// Example 7: CTA Banner with Content Tracking
// =============================================================================

// components/UpgradeBanner.tsx
'use client';

import { useEffect } from 'react';
import { useMatomo } from '@/hooks/useMatomo';
import { trackContentImpression, trackContentInteraction } from '@/lib/matomo';

export function UpgradeBanner() {
  useEffect(() => {
    // Track banner impression
    trackContentImpression(
      'upgrade-banner',
      'pro-plan-cta',
      '/pricing'
    );
  }, []);

  const handleClick = () => {
    // Track banner click
    trackContentInteraction(
      'click',
      'upgrade-banner',
      'pro-plan-cta',
      '/pricing'
    );
  };

  return (
    <div className="banner">
      <p>Upgrade to Pro for unlimited QR codes!</p>
      <button onClick={handleClick}>
        Upgrade Now
      </button>
    </div>
  );
}

// =============================================================================
// Example 8: Dashboard with Multiple Tracking Points
// =============================================================================

// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useMatomo } from '@/hooks/useMatomo';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const matomo = useMatomo();
  const session = useSession();

  useEffect(() => {
    // Track dashboard view
    matomo.trackEvent({
      category: 'Engagement',
      action: 'dashboard_view',
      customDimensions: {
        '1': session?.data?.user?.plan,
      },
    });
  }, []);

  const handleCreateQRCode = () => {
    matomo.trackEvent({
      category: 'Button',
      action: 'click',
      name: 'create-qr-code',
    });
    // Navigate to QR code creation...
  };

  const handleExportData = () => {
    matomo.trackEvent({
      category: 'Data',
      action: 'export',
      name: 'qr-codes-csv',
    });
    // Export logic...
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleCreateQRCode}>Create QR Code</button>
      <button onClick={handleExportData}>Export Data</button>
    </div>
  );
}

// =============================================================================
// Example 9: API Key Creation with Tracking
// =============================================================================

// components/APIKeyManager.tsx
'use client';

import { useState } from 'react';
import { useMatomo } from '@/hooks/useMatomo';

export function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState([]);
  const matomo = useMatomo();

  const createAPIKey = async () => {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New API Key' }),
    });

    const data = await response.json();

    if (data.success) {
      // Track API key creation
      matomo.trackAPIEvent('key_created', data.apiKey.id);

      // Track as event
      matomo.trackEvent({
        category: 'API',
        action: 'key_created',
        name: data.apiKey.name,
      });

      // Track as goal
      matomo.trackGoal({
        goalId: 4, // "API Key Created" goal
      });

      setApiKeys([...apiKeys, data.apiKey]);
    }
  };

  return (
    <div>
      <button onClick={createAPIKey}>Create API Key</button>
      {/* List API keys... */}
    </div>
  );
}

// =============================================================================
// Example 10: Error Boundary with Error Tracking
// =============================================================================

// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { trackEvent } from '@/lib/matomo';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error in Matomo
    trackEvent({
      category: 'Error',
      action: 'react_error',
      name: error.message,
      customDimensions: {
        '10': errorInfo.componentStack?.slice(0, 100) || '',
      },
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>We've been notified and are working on a fix.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// =============================================================================
// Example 11: Custom Hook for Feature Usage Tracking
// =============================================================================

// hooks/useFeatureTracking.ts
import { useEffect } from 'react';
import { useMatomo } from './useMatomo';

export function useFeatureTracking(featureName: string) {
  const matomo = useMatomo();

  useEffect(() => {
    // Track feature usage
    matomo.trackEvent({
      category: 'Feature',
      action: 'used',
      name: featureName,
    });
  }, [featureName, matomo]);

  return {
    trackInteraction: (action: string, value?: number) => {
      matomo.trackEvent({
        category: 'Feature',
        action: `${featureName}_${action}`,
        value,
      });
    },
  };
}

// Usage:
export function CustomQRCodeEditor() {
  const { trackInteraction } = useFeatureTracking('qr-code-editor');

  const handleColorChange = () => {
    trackInteraction('color_changed');
  };

  const handleLogoUpload = () => {
    trackInteraction('logo_uploaded');
  };

  return (
    <div>
      <button onClick={handleColorChange}>Change Color</button>
      <button onClick={handleLogoUpload}>Upload Logo</button>
    </div>
  );
}

// =============================================================================
// Example 12: Middleware for API Request Tracking
// =============================================================================

// middleware/matomo-tracking.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverTrackEvent } from '@/lib/matomo';

export async function withMatomoTracking(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  const start = Date.now();

  try {
    const response = await handler(request);
    const duration = Date.now() - start;

    // Track successful API request
    await serverTrackEvent(
      request.url,
      'API',
      'request',
      {
        name: `${request.method} ${new URL(request.url).pathname}`,
        value: duration,
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    return response;
  } catch (error) {
    // Track API error
    await serverTrackEvent(
      request.url,
      'Error',
      'api_error',
      {
        name: error.message,
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    throw error;
  }
}

