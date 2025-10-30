// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Set test environment
process.env.NODE_ENV = 'test'

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'

// Polyfills for Node.js environment (for API tests)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock fetch for API tests
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

// Mock Headers for API tests
if (typeof global.Headers === 'undefined') {
  global.Headers = require('node-fetch').Headers
}

// Suppress console output during tests for cleaner output
// Only show console output if VERBOSE env var is set
const originalError = console.error
const originalLog = console.log
const originalWarn = console.warn

if (!process.env.VERBOSE) {
  // Use no-op functions to suppress output
  console.error = () => {}
  console.log = () => {}
  // Keep console.warn for actual warnings (uncomment if you want to suppress those too)
  // console.warn = () => {}
}

// Restore console methods if needed for debugging
global.restoreConsole = () => {
  console.error = originalError
  console.log = originalLog
  console.warn = originalWarn
}
