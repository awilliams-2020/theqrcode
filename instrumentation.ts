// This file is automatically loaded by Next.js for monitoring and instrumentation
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('./src/lib/logger')
    logger.info('SYSTEM', 'Instrumentation registered for Node.js runtime')

    // Import monitoring setup
    const { setupGlobalMonitoring } = await import('./src/lib/monitoring-setup')
    setupGlobalMonitoring()
  }
}
