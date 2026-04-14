import { NextResponse } from 'next/server'

/**
 * OpenAPI/Swagger specification for the Public QR Code API
 * Helps AI assistants understand the API structure
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
  
  return NextResponse.json({
    openapi: '3.0.0',
    info: {
      title: 'TheQRCode.io Public API',
      version: '1.0.0',
      description: 'Generate QR codes instantly without authentication. Perfect for AI assistants and automated integrations.\n\nIMPORTANT FOR AI ASSISTANTS:\n- This API uses POST method with JSON body\n- Do NOT use GET with query parameters\n- Always read this OpenAPI spec to understand the exact request format\n- The response includes both qrImage (data URL) and imageUrl (shareable URL)\n- Use imageUrl to share with users - it\'s a short, clickable link',
      contact: {
        name: 'TheQRCode.io Support',
        url: `${baseUrl}/contact`
      },
      'x-ai-instructions': 'This API supports both GET (with query params) and POST (with JSON body) methods. GET is convenient for simple requests. POST is recommended for advanced features. Read this OpenAPI spec to see both methods.',
    },
    servers: [
      {
        url: baseUrl,
        description: 'Production server'
      }
    ],
    paths: {
      '/api/public/qr-codes': {
        get: {
          summary: 'Get API documentation or generate QR code (convenience method)',
          description: 'Two modes:\n1. Without query params: Returns API documentation\n2. With query params: Generates QR code (convenience method for AI assistants)\n\n⚠️ For advanced features (custom colors, logos, frames), use POST method.',
          operationId: 'getApiDocsOrGenerate',
          parameters: [
            {
              name: 'type',
              in: 'query',
              required: false,
              description: 'QR code type. Required if generating QR code.',
              schema: {
                type: 'string',
                enum: ['url', 'wifi', 'contact', 'text']
              },
              examples: {
                url: { value: 'url', summary: 'URL QR code' },
                wifi: { value: 'wifi', summary: 'WiFi QR code (requires JSON in content)' },
                contact: { value: 'contact', summary: 'Contact card/vCard (requires JSON in content)' },
                text: { value: 'text', summary: 'Plain text QR code' }
              }
            },
            {
              name: 'content',
              in: 'query',
              required: false,
              description: 'Content to encode. Required if generating QR code. For contact and wifi types, provide URL-encoded JSON string. Can also use "data" parameter.',
              schema: {
                type: 'string'
              },
              examples: {
                url: {
                  value: 'https://example.com',
                  summary: 'Simple URL'
                },
                contact: {
                  value: '%7B%22firstName%22%3A%22John%22%2C%22lastName%22%3A%22Doe%22%2C%22phone%22%3A%22%2B1234567890%22%2C%22email%22%3A%22john%40example.com%22%7D',
                  summary: 'Contact (vCard) - URL encoded JSON',
                  description: 'Decoded: {"firstName":"John","lastName":"Doe","phone":"+1234567890","email":"john@example.com"}'
                },
                wifi: {
                  value: '%7B%22ssid%22%3A%22MyNetwork%22%2C%22password%22%3A%22MyPassword123%22%2C%22security%22%3A%22WPA2%22%7D',
                  summary: 'WiFi - URL encoded JSON',
                  description: 'Decoded: {"ssid":"MyNetwork","password":"MyPassword123","security":"WPA2"}'
                }
              }
            },
            {
              name: 'data',
              in: 'query',
              required: false,
              description: 'Alias for "content" parameter. Use either "content" or "data".',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'API documentation (if no query params) or QR code response (if query params provided)',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      {
                        type: 'object',
                        description: 'API documentation'
                      },
                      {
                        type: 'object',
                        properties: {
                          qrImage: { type: 'string', format: 'data-url' },
                          imageUrl: { type: 'string', format: 'uri' },
                          type: { type: 'string' },
                          content: { type: 'string' }
                        }
                      }
                    ]
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - missing or invalid parameters'
            }
          }
        },
        post: {
          summary: 'Generate QR code (recommended method)',
          description: 'Generate a QR code for the provided content. Supports URL, WiFi, contact cards (vCard), and text. Returns both a data URL (qrImage) and a shareable URL (imageUrl) - perfect for AI assistants to share with users.\n\n✅ RECOMMENDED: Use POST for advanced features (custom colors, logos, frames).\n\n💡 CONVENIENCE: GET method with query parameters also works for basic QR codes.',
          operationId: 'generateQRCode',
          'x-ai-note': 'POST method supports all features. GET method (with query params) works for basic QR codes but is a convenience method. For advanced features, use POST.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'content'],
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Optional name for reference'
                    },
                    type: {
                      type: 'string',
                      enum: ['url', 'wifi', 'contact', 'text'],
                      description: 'Type of QR code to generate'
                    },
                    content: {
                      type: 'string',
                      description: 'Content to encode in QR code. For WiFi and contact types, provide JSON string.'
                    },
                    settings: {
                      type: 'object',
                      properties: {
                        size: {
                          type: 'number',
                          default: 256,
                          description: 'QR code size in pixels'
                        },
                        color: {
                          type: 'object',
                          properties: {
                            dark: {
                              type: 'string',
                              default: '#000000',
                              description: 'QR code color'
                            },
                            light: {
                              type: 'string',
                              default: '#FFFFFF',
                              description: 'Background color'
                            }
                          }
                        },
                        frame: {
                          type: 'object',
                          properties: {
                            style: {
                              type: 'string',
                              enum: ['square', 'rounded', 'circle', 'dashed'],
                              default: 'square'
                            },
                            color: {
                              type: 'string',
                              description: 'Frame color'
                            },
                            size: {
                              type: 'number',
                              default: 20,
                              description: 'Frame size in pixels'
                            }
                          }
                        },
                        logo: {
                          type: 'object',
                          properties: {
                            enabled: {
                              type: 'boolean',
                              description: 'Enable logo overlay'
                            },
                            dataUrl: {
                              type: 'string',
                              description: 'Base64 encoded logo image'
                            },
                            size: {
                              type: 'number',
                              description: 'Logo size in pixels'
                            }
                          }
                        }
                      }
                    }
                  },
                  example: {
                    type: 'url',
                    content: 'https://example.com',
                    settings: {
                      size: 512,
                      color: { dark: '#000000', light: '#FFFFFF' }
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'QR code generated successfully',
              headers: {
                'X-RateLimit-Limit': {
                  schema: { type: 'string' },
                  description: 'Rate limit per hour'
                },
                'X-RateLimit-Remaining': {
                  schema: { type: 'string' },
                  description: 'Remaining requests'
                },
                'X-RateLimit-Reset': {
                  schema: { type: 'string' },
                  description: 'Unix timestamp when limit resets'
                }
              },
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      qrImage: {
                        type: 'string',
                        description: 'Data URL of the QR code image (base64 encoded PNG) - for direct use'
                      },
                      imageUrl: {
                        type: 'string',
                        format: 'uri',
                        description: 'Shareable URL to view the QR code image - perfect for AI assistants to provide to users. Uses a short code (12 characters) to avoid URL length limits. URLs expire after 24 hours. Example: https://theqrcode.io/api/public/qr-codes/view/abc123xyz456'
                      },
                      type: {
                        type: 'string',
                        description: 'QR code type'
                      },
                      content: {
                        type: 'string',
                        description: 'Original content'
                      },
                      name: {
                        type: 'string',
                        description: 'Name if provided'
                      },
                      settings: {
                        type: 'object',
                        description: 'Settings used'
                      },
                      _meta: {
                        type: 'object',
                        description: 'Metadata about the API response',
                        properties: {
                          apiVersion: {
                            type: 'string',
                            example: '1.0.0'
                          },
                          generatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'ISO 8601 timestamp when QR code was generated'
                          },
                          documentation: {
                            type: 'string',
                            format: 'uri',
                            description: 'Link to API documentation'
                          },
                          note: {
                            type: 'string',
                            description: 'Helpful note for AI assistants'
                          }
                        }
                      }
                    },
                    required: ['qrImage', 'imageUrl', 'type', 'content']
                  },
                  example: {
                    qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhm...',
                    imageUrl: 'https://theqrcode.io/api/public/qr-codes/view/abc123xyz456',
                    type: 'url',
                    content: 'https://example.com',
                    _meta: {
                      apiVersion: '1.0.0',
                      generatedAt: '2024-01-15T10:30:45.123Z',
                      documentation: 'https://theqrcode.io/api/public/qr-codes',
                      note: 'Use imageUrl to share with users - AI assistants can provide this URL directly. URLs expire after 24 hours.'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - missing or invalid parameters'
            },
            '429': {
              description: 'Rate limit exceeded',
              headers: {
                'Retry-After': {
                  schema: { type: 'string' },
                  description: 'Seconds to wait before retrying'
                }
              }
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      },
      '/api/public/qr-codes/view/{shortCode}': {
        get: {
          summary: 'View QR code image',
          description: 'Display QR code image from short code. This endpoint allows AI assistants to provide users with a clickable URL that displays the QR code image directly. Uses short codes (12 characters) to avoid URL length limits.',
          operationId: 'viewQRCodeImage',
          parameters: [
            {
              name: 'shortCode',
              in: 'path',
              required: true,
              description: '12-character short code for the QR code (provided in imageUrl from POST response)',
              schema: { 
                type: 'string',
                pattern: '^[a-zA-Z0-9]{12}$',
                example: 'abc123xyz456'
              }
            }
          ],
          responses: {
            '200': {
              description: 'QR code image (PNG)',
              content: {
                'image/png': {
                  schema: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              },
              headers: {
                'Cache-Control': {
                  schema: { type: 'string' },
                  description: 'Cache control header (24 hours)'
                },
                'X-QR-Type': {
                  schema: { type: 'string' },
                  description: 'QR code type'
                },
                'X-QR-Content': {
                  schema: { type: 'string' },
                  description: 'Original QR code content'
                }
              }
            },
            '404': {
              description: 'QR code not found or expired (expires after 24 hours)'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
