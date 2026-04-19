import { NextRequest, NextResponse } from 'next/server'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { PublicRateLimiter, buildFingerprint } from '@/lib/public-rate-limiter'
import { QRCache } from '@/lib/qr-cache'
import { logger } from '@/lib/logger'
import { recordPerformanceMetric } from '@/lib/monitoring'
import { trackAPI } from '@/lib/matomo-tracking'

/**
 * Extract IP address from request
 */
function extractIP(request: NextRequest): string {
  // cf-connecting-ip is set by Cloudflare and cannot be spoofed by the client,
  // so check it first. x-forwarded-for is last because it can be faked.
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  const realIP         = request.headers.get('x-real-ip')
  const forwarded      = request.headers.get('x-forwarded-for')

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

/**
 * Detect if the request is from an AI assistant based on user agent and headers
 * Common AI assistant user agents:
 * - OpenAI (ChatGPT, GPT-4, etc.)
 * - Anthropic (Claude)
 * - Google (Bard/Gemini)
 * - Microsoft (Copilot)
 * - Cursor/Composer (AI coding assistants)
 * - Custom AI assistants
 */
function detectAIAssistant(userAgent: string, request?: NextRequest): {
  isAI: boolean
  aiType?: string
  userAgent: string
} {
  const ua = userAgent.toLowerCase()
  
  // Check for custom headers that indicate AI assistants
  if (request) {
    // Check for Cursor/Composer specific headers
    const cursorHeader = request.headers.get('x-cursor-client') || 
                        request.headers.get('x-composer-client') ||
                        request.headers.get('x-ai-client')
    if (cursorHeader) {
      const headerLower = cursorHeader.toLowerCase()
      if (headerLower.includes('cursor')) {
        return {
          isAI: true,
          aiType: 'Cursor',
          userAgent
        }
      }
      if (headerLower.includes('composer')) {
        return {
          isAI: true,
          aiType: 'Composer',
          userAgent
        }
      }
      return {
        isAI: true,
        aiType: 'AI Client',
        userAgent
      }
    }

    // Check referer for Cursor/Composer
    const referer = request.headers.get('referer') || ''
    if (referer.toLowerCase().includes('cursor') || referer.toLowerCase().includes('composer')) {
      return {
        isAI: true,
        aiType: referer.toLowerCase().includes('cursor') ? 'Cursor' : 'Composer',
        userAgent
      }
    }
  }
  
  // Common AI assistant patterns in user agent
  const aiPatterns = [
    { pattern: /openai|gpt|chatgpt/i, type: 'OpenAI' },
    { pattern: /anthropic|claude/i, type: 'Anthropic' },
    { pattern: /google.*bard|gemini/i, type: 'Google' },
    { pattern: /microsoft.*copilot|bing.*chat/i, type: 'Microsoft' },
    { pattern: /perplexity/i, type: 'Perplexity' },
    { pattern: /cursor/i, type: 'Cursor' },
    { pattern: /composer/i, type: 'Composer' },
    { pattern: /ai.*assistant|assistant.*ai/i, type: 'AI Assistant' },
    { pattern: /bot.*ai|ai.*bot/i, type: 'AI Bot' },
    { pattern: /langchain|llm/i, type: 'LLM Framework' },
  ]
  
  for (const { pattern, type } of aiPatterns) {
    if (pattern.test(ua)) {
      return {
        isAI: true,
        aiType: type,
        userAgent
      }
    }
  }
  
  return {
    isAI: false,
    userAgent
  }
}

/**
 * POST /api/public/qr-codes
 * Create a QR code without authentication (for AI assistants and public use)
 * 
 * Rate limited: 100 requests per hour per IP address
 * 
 * Request body:
 * {
 *   name: string (optional, for reference)
 *   type: 'url' | 'wifi' | 'contact' | 'text'
 *   content: string (the content to encode)
 *   settings?: {
 *     size?: number (default: 256)
 *     color?: { dark?: string, light?: string }
 *     frame?: { style?: string, color?: string, size?: number }
 *     logo?: { enabled: boolean, dataUrl?: string, size?: number }
 *   }
 * }
 * 
 * Response:
 * {
 *   qrImage: string (data URL of the QR code image)
 *   imageUrl: string (shareable URL to view the QR code - perfect for AI assistants)
 *   type: string
 *   content: string
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ipAddress = extractIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const aiDetection = detectAIAssistant(userAgent, request)
  
  // Log request entry with AI assistant detection (include headers for debugging)
  logger.info('PUBLIC-API', 'Public API request received', {
    endpoint: '/api/public/qr-codes',
    method: 'POST',
    ipAddress,
    userAgent,
    isAIAssistant: aiDetection.isAI,
    aiType: aiDetection.aiType || undefined,
    // Debug headers that might indicate AI assistant
    xCursorClient: request.headers.get('x-cursor-client') || undefined,
    xComposerClient: request.headers.get('x-composer-client') || undefined,
    xAiClient: request.headers.get('x-ai-client') || undefined,
    referer: request.headers.get('referer') || undefined
  })
  
  try {
    // Check rate limit — Redis sliding window with composite IP+UA fingerprint
    const fingerprint    = buildFingerprint(ipAddress, userAgent)
    const rateLimitResult = await PublicRateLimiter.check(fingerprint, ipAddress)
    
    if (!rateLimitResult.allowed) {
      const responseTime = Date.now() - startTime
      
      // Record performance metric for rate limit
      recordPerformanceMetric({
        endpoint: '/api/public/qr-codes',
        method: 'POST',
        responseTime,
        statusCode: 429,
        timestamp: new Date(),
        userAgent,
        ip: ipAddress
      })

      // Track rate limit in Matomo
      trackAPI.rateLimited(
        '/api/public/qr-codes',
        undefined,
        {
          ip: ipAddress,
          userAgent,
        }
      ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track rate limit in Matomo'))

      // Rate limit exceeded is already logged in PublicRateLimiter
      // But we can add additional context here if needed
      logger.warn('PUBLIC-API', 'Rate limit exceeded - request blocked', {
        ipAddress,
        endpoint: '/api/public/qr-codes',
        retryAfter: rateLimitResult.retryAfter,
        userAgent,
        isAIAssistant: aiDetection.isAI,
        aiType: aiDetection.aiType || undefined
      })
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, type, content, settings } = body

    // Validate required fields
    if (!type || !content) {
      logger.warn('PUBLIC-API', 'Invalid request - missing required fields', {
        endpoint: '/api/public/qr-codes',
        ipAddress,
        userAgent,
        isAIAssistant: aiDetection.isAI,
        aiType: aiDetection.aiType || undefined,
        hasType: !!type,
        hasContent: !!content
      })
      
      return NextResponse.json(
        { error: 'Missing required fields', message: 'type and content are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['url', 'wifi', 'contact', 'text']
    if (!validTypes.includes(type)) {
      logger.warn('PUBLIC-API', 'Invalid request - invalid QR code type', {
        endpoint: '/api/public/qr-codes',
        ipAddress,
        userAgent,
        isAIAssistant: aiDetection.isAI,
        aiType: aiDetection.aiType || undefined,
        providedType: type,
        validTypes
      })
      
      return NextResponse.json(
        { error: 'Invalid type', message: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate QR code
    const frameSettings = settings?.frame || { style: 'square', color: '#000000', size: 20 }
    if (!frameSettings.size) {
      frameSettings.size = 20
    }

    const qrImage = await QRGeneratorServer.generateQRCode({
      type,
      content,
      size: settings?.size || 256,
      color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
      frame: frameSettings,
      logo: (settings?.logo as any)?.enabled ? {
        dataUrl: (settings.logo as any).dataUrl,
        size: (settings.logo as any).size
      } : undefined
    })

    // Log successful generation with AI assistant detection
    const responseTime = Date.now() - startTime
    
    // Record performance metric
    recordPerformanceMetric({
      endpoint: '/api/public/qr-codes',
      method: 'POST',
      responseTime,
      statusCode: 200,
      timestamp: new Date(),
      userAgent,
      ip: ipAddress
    })

    // Track in Matomo (async, don't block response)
    trackAPI.request(
      '/api/public/qr-codes',
      'POST',
      undefined, // No userId for public API
      {
        ip: ipAddress,
        userAgent,
        statusCode: 200,
        responseTime,
      }
    ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track API request in Matomo'))

    logger.info('PUBLIC-API', 'QR code generated via public API', {
      endpoint: '/api/public/qr-codes',
      ipAddress,
      type,
      userAgent,
      isAIAssistant: aiDetection.isAI,
      aiType: aiDetection.aiType || undefined,
      responseTime: `${responseTime}ms`,
      rateLimitRemaining: rateLimitResult.remaining
    })

    // Create shareable image URL using short code (avoids URL length issues)
    const base64Data = qrImage.split(',')[1]
    const shortCode = await QRCache.store(base64Data, type, content)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
    const imageUrl = `${baseUrl}/api/public/qr-codes/view/${shortCode}`

    return NextResponse.json(
      {
        qrImage, // Data URL for direct use
        imageUrl, // Shareable URL for AI assistants to provide to users
        type,
        content,
        name: name || undefined,
        settings: settings || undefined,
        // Add helpful metadata for AI assistants
        _meta: {
          apiVersion: '1.0.0',
          generatedAt: new Date().toISOString(),
          documentation: `${baseUrl}/api/public/qr-codes`,
          note: 'Use imageUrl to share with users - AI assistants can provide this URL directly. URLs use short codes and expire after 24 hours.'
        }
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'X-API-Version': '1.0.0',
          'X-AI-Assistant-Friendly': 'true'
        }
      }
    )
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    // Record performance metric for error
    recordPerformanceMetric({
      endpoint: '/api/public/qr-codes',
      method: 'POST',
      responseTime,
      statusCode: 500,
      timestamp: new Date(),
      userAgent,
      ip: ipAddress
    })

    // Track error in Matomo
    trackAPI.request(
      '/api/public/qr-codes',
      'POST',
      undefined,
      {
        ip: ipAddress,
        userAgent,
        statusCode: 500,
        responseTime,
      }
    ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track error in Matomo'))

    logger.logError(error, 'PUBLIC-API', 'Error generating QR code via public API', {
      endpoint: '/api/public/qr-codes',
      method: 'POST',
      ipAddress,
      userAgent,
      isAIAssistant: aiDetection.isAI,
      aiType: aiDetection.aiType || undefined,
      responseTime: `${responseTime}ms`
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to generate QR code'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/public/qr-codes
 * Health check and documentation endpoint
 * Enhanced for AI assistant discovery and usage
 */
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
  const { searchParams } = new URL(request.url)
  
  // Check if AI assistant tried GET with query params (common mistake)
  const hasQueryParams = searchParams.has('type') || searchParams.has('content') || searchParams.has('data')
  
  if (hasQueryParams) {
    // AI assistant tried GET with query params - support it as convenience method
    // This allows AI assistants that just build URLs to still work
    const type = searchParams.get('type')
    const content = searchParams.get('content') || searchParams.get('data')
    
    if (type && content) {
      const startTime = Date.now()
      const ipAddress = extractIP(request)
      const userAgent = request.headers.get('user-agent') || 'unknown'
      const aiDetection = detectAIAssistant(userAgent, request)
      
      logger.info('PUBLIC-API', 'Public API GET request with query params (convenience method)', {
        endpoint: '/api/public/qr-codes',
        method: 'GET',
        ipAddress,
        userAgent,
        isAIAssistant: aiDetection.isAI,
        aiType: aiDetection.aiType || undefined,
        type,
        hasContent: !!content
      })
      
      try {
        // Validate type
        const validTypes = ['url', 'wifi', 'contact', 'text']
        if (!validTypes.includes(type)) {
          return NextResponse.json(
            { 
              error: 'Invalid type', 
              message: `type must be one of: ${validTypes.join(', ')}`,
              hint: 'For advanced features (custom colors, logos), use POST method with JSON body.'
            },
            { status: 400 }
          )
        }
        
        // For contact and wifi types, content should be a JSON string
        // Next.js automatically URL-decodes query params, but validate JSON format
        let processedContent = content
        if ((type === 'contact' || type === 'wifi') && content) {
          try {
            // Try to parse as JSON to validate format
            JSON.parse(content)
            // If parsing succeeds, content is already a JSON string (good)
          } catch {
            // If parsing fails, try URL decoding (in case it's double-encoded)
            try {
              processedContent = decodeURIComponent(content)
              JSON.parse(processedContent) // Validate it's valid JSON after decoding
            } catch {
              return NextResponse.json(
                {
                  error: 'Invalid content format',
                  message: `For ${type} type, content must be a valid JSON string`,
                  example: type === 'contact' 
                    ? '/api/public/qr-codes?type=contact&content=%7B%22firstName%22%3A%22John%22%2C%22lastName%22%3A%22Doe%22%2C%22phone%22%3A%22%2B1234567890%22%7D'
                    : '/api/public/qr-codes?type=wifi&content=%7B%22ssid%22%3A%22Network%22%2C%22password%22%3A%22pass%22%2C%22security%22%3A%22WPA2%22%7D',
                  hint: 'Use POST method with JSON body for easier handling of complex data',
                  decodedExample: type === 'contact'
                    ? '{"firstName":"John","lastName":"Doe","phone":"+1234567890"}'
                    : '{"ssid":"Network","password":"pass","security":"WPA2"}'
                },
                { status: 400 }
              )
            }
          }
        }
        
        // Generate QR code using the same logic as POST
        const frameSettings = { style: 'square' as const, color: '#000000', size: 20 }
        const qrImage = await QRGeneratorServer.generateQRCode({
          type: type as any,
          content: processedContent,
          size: 256,
          color: { dark: '#000000', light: '#FFFFFF' },
          frame: frameSettings,
        })
        
        const responseTime = Date.now() - startTime
        
        // Record performance metric
        recordPerformanceMetric({
          endpoint: '/api/public/qr-codes',
          method: 'GET',
          responseTime,
          statusCode: 200,
          timestamp: new Date(),
          userAgent,
          ip: ipAddress
        })
        
        // Track in Matomo
        trackAPI.request(
          '/api/public/qr-codes',
          'GET',
          undefined,
          {
            ip: ipAddress,
            userAgent,
            statusCode: 200,
            responseTime,
          }
        ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track GET request in Matomo'))
        
        // Create shareable image URL
        const base64Data = qrImage.split(',')[1]
        const shortCode = await QRCache.store(base64Data, type, content)
        const imageUrl = `${baseUrl}/api/public/qr-codes/view/${shortCode}`
        
        logger.info('PUBLIC-API', 'QR code generated via GET (convenience method)', {
          endpoint: '/api/public/qr-codes',
          method: 'GET',
          ipAddress,
          type,
          userAgent,
          isAIAssistant: aiDetection.isAI,
          aiType: aiDetection.aiType || undefined,
          responseTime: `${responseTime}ms`
        })
        
        return NextResponse.json({
          qrImage,
          imageUrl,
          type,
          content,
          _meta: {
            apiVersion: '1.0.0',
            generatedAt: new Date().toISOString(),
            documentation: `${baseUrl}/api/public/qr-codes`,
            note: 'GET with query params is a convenience method. For advanced features (custom colors, logos, frames), use POST with JSON body.',
            method: 'GET'
          }
        }, {
          status: 200,
          headers: {
            'X-API-Version': '1.0.0',
            'X-AI-Assistant-Friendly': 'true',
            'X-Method': 'GET (convenience)'
          }
        })
      } catch (error) {
        const responseTime = Date.now() - startTime
        logger.logError(error, 'PUBLIC-API', 'Error generating QR code via GET', {
          endpoint: '/api/public/qr-codes',
          method: 'GET',
          ipAddress,
          userAgent
        })
        
        return NextResponse.json(
          {
            error: 'Internal server error',
            message: 'Failed to generate QR code',
            hint: 'Try using POST method with JSON body for better error handling'
          },
          { status: 500 }
        )
      }
    }
    
    // Query params provided but incomplete
    return NextResponse.json({
      error: 'Missing parameters',
      message: 'Both "type" and "content" (or "data") query parameters are required.',
      example: `${baseUrl}/api/public/qr-codes?type=url&content=https://example.com`,
      note: 'For advanced features, use POST method with JSON body.'
    }, { status: 400 })
  }
  
  // No query params - return API documentation
  return NextResponse.json({
    // API Metadata
    name: 'TheQRCode.io Public API',
    version: '1.0.0',
    description: 'Generate QR codes instantly without authentication. Perfect for AI assistants, chatbots, and automated integrations.',
    baseUrl: `${baseUrl}/api/public/qr-codes`,
    
    // AI Assistant Specific Information
    aiAssistantFriendly: true,
    noAuthenticationRequired: true,
    useCase: 'When users ask you to create QR codes, use this API to generate them instantly. No account creation needed.',
    
    // IMPORTANT: Read OpenAPI Specification First
    openApiSpec: `${baseUrl}/api/public/qr-codes/openapi.json`,
    instruction: 'This API supports both GET (with query params) and POST (with JSON body) methods. GET is convenient for simple requests. POST is recommended for advanced features. Read the OpenAPI spec to see both methods.',
    
    // Endpoint Details
    endpoint: '/api/public/qr-codes',
    methods: {
      GET: {
        description: 'Convenience method - works with query parameters',
        example: `${baseUrl}/api/public/qr-codes?type=url&content=https://example.com`,
        note: 'Simple and easy for AI assistants. Supports basic QR codes only.',
        parameters: ['type (required)', 'content or data (required)']
      },
      POST: {
        description: 'Recommended method - supports all features',
        contentType: 'application/json',
        example: `POST ${baseUrl}/api/public/qr-codes\nContent-Type: application/json\n{"type":"url","content":"https://example.com"}`,
        note: 'Supports custom colors, logos, frames, and all advanced features.',
        body: { type: 'string (required)', content: 'string (required)', settings: 'object (optional)' }
      }
    },
    
    // Rate Limiting
    rateLimit: {
      limit: 100,
      window: '1 hour',
      per: 'IP address',
      headers: {
        'X-RateLimit-Limit': 'Current limit',
        'X-RateLimit-Remaining': 'Remaining requests',
        'X-RateLimit-Reset': 'Unix timestamp when limit resets'
      }
    },
    
    // Request Format
    requestFormat: {
      name: 'string (optional) - Name for reference',
      type: 'url | wifi | contact | text (required)',
      content: 'string (required) - Content to encode in QR code',
      settings: {
        size: 'number (optional, default: 256) - QR code size in pixels',
        color: {
          dark: 'string (optional, default: "#000000") - QR code color',
          light: 'string (optional, default: "#FFFFFF") - Background color'
        },
        frame: {
          style: 'square | rounded | circle | dashed (optional)',
          color: 'string (optional) - Frame color',
          size: 'number (optional, default: 20) - Frame size in pixels'
        },
        logo: {
          enabled: 'boolean (optional) - Enable logo overlay',
          dataUrl: 'string (optional) - Base64 encoded logo image',
          size: 'number (optional) - Logo size in pixels'
        }
      }
    },
    
    // Examples for AI Assistants
    examples: {
      simple: {
        description: 'Generate a simple URL QR code',
        request: {
          type: 'url',
          content: 'https://example.com'
        }
      },
      wifi: {
        description: 'Generate a WiFi QR code',
        request: {
          type: 'wifi',
          content: JSON.stringify({
            ssid: 'MyNetwork',
            password: 'MyPassword123',
            security: 'WPA2'
          })
        }
      },
      contact: {
        description: 'Generate a contact card (vCard) QR code',
        request: {
          type: 'contact',
          content: JSON.stringify({
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            email: 'john@example.com'
          })
        }
      },
      custom: {
        description: 'Generate a custom styled QR code',
        request: {
          type: 'url',
          content: 'https://example.com',
          settings: {
            size: 512,
            color: { dark: '#FF0000', light: '#FFFFFF' },
            frame: { style: 'rounded', color: '#000000', size: 30 }
          }
        }
      }
    },
    
    // Response Format
    responseFormat: {
      qrImage: 'string (data URL) - Base64 encoded PNG image ready to use',
      imageUrl: 'string (shareable URL) - Short URL to view the QR code image - perfect for AI assistants to share with users. Uses 12-character code, expires after 24 hours. Example: https://theqrcode.io/api/public/qr-codes/view/abc123xyz456',
      type: 'string - QR code type',
      content: 'string - Original content',
      name: 'string (optional) - Name if provided',
      settings: 'object (optional) - Settings used'
    },
    
    // Usage Instructions for AI Assistants
    instructions: [
      'STEP 1: Read the OpenAPI specification first:',
      `  GET ${baseUrl}/api/public/qr-codes/openapi.json`,
      '  This will show you both GET and POST methods, required fields, and response structure.',
      '',
      'STEP 2: Choose your method:',
      '',
      '  OPTION A - GET (Convenience, simple requests):',
      `    GET ${baseUrl}/api/public/qr-codes?type=url&content=https://example.com`,
      '    - Works with query parameters',
      '    - Perfect for AI assistants that build URLs',
      '    - Supports basic QR codes only',
      '',
      '  OPTION B - POST (Recommended, advanced features):',
      '    POST /api/public/qr-codes',
      '    Content-Type: application/json',
      '    Body: {"type": "url", "content": "https://example.com", "settings": {...}}',
      '    - Supports custom colors, logos, frames, and all advanced features',
      '',
      'STEP 3: Use the response:',
      '  - The API returns both qrImage (data URL) and imageUrl (shareable URL)',
      '  - Use imageUrl to share with users - they can click it to view the QR code',
      '  - imageUrl uses short codes (12 characters) and expires after 24 hours',
      '',
      'IMPORTANT NOTES:',
      '  - Both GET and POST methods are supported',
      '  - GET is convenient for simple requests and AI assistants that build URLs',
      '  - POST is recommended for advanced features (custom colors, logos, frames)',
      '  - No authentication required',
      '  - Rate limited to 100 requests per hour per IP address',
      '  - Supports: URL, WiFi, Contact (vCard), Text QR code types'
    ],
    
    // Common Use Cases
    useCases: [
      'Generate QR codes for URLs when users share links',
      'Create WiFi QR codes for network sharing',
      'Generate contact card QR codes for business cards',
      'Create text QR codes for messages or notes',
    ],
    
    // Error Handling
    errorCodes: {
      400: 'Bad Request - Missing or invalid parameters',
      429: 'Rate Limit Exceeded - Too many requests',
      500: 'Internal Server Error - QR code generation failed'
    },
    
    // Additional Resources
    documentation: `${baseUrl}/docs`,
    website: baseUrl,
    support: `${baseUrl}/contact`
  }, {
    headers: {
      'X-API-Version': '1.0.0',
      'X-AI-Assistant-Friendly': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
