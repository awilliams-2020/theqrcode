import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Filter out admin routes from server-side error tracking
  beforeSend(event, hint) {
    // Skip events from admin routes by checking the request URL
    const request = hint.request;
    if (request && request.url && request.url.includes('/admin')) {
      return null;
    }
    
    return event;
  },
});
