// Google Ads (gtag.js) Type Definitions
interface Window {
  gtag: (
    command: 'event' | 'config' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer: any[];
}

// Extend global namespace for server-side
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export {};

