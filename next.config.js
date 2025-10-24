const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client'],
  // Subdomain configuration
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 31536000, // 1 year
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // instrumentationHook is enabled by default in Next.js 15+
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'chart.js'],
  },
  // Enable static optimization for better SEO
  trailingSlash: false,
  // Optimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

// Sentry configuration
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

  silent: true, // Suppresses source map uploading logs during build
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

const sentryOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  
  // Upload source maps to Sentry
  widenClientFileUpload: true,
  
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/api/sentry-tunnel",
  
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  
  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  automaticVercelMonitors: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions);
