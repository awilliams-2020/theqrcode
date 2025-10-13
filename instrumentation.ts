// This file is automatically loaded by Next.js for monitoring and instrumentation
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Instrumentation registered for Node.js runtime')
    // Import monitoring setup
    const { setupGlobalMonitoring } = await import('./src/lib/monitoring-setup')
    setupGlobalMonitoring()
  }
}

