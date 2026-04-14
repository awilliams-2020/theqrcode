import { NextResponse } from 'next/server'

/**
 * AI Plugin Manifest for OpenAI Plugins and other AI assistants
 * This helps AI assistants discover and understand how to use the API
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
  
  return NextResponse.json({
    schema_version: 'v1',
    name_for_human: 'QR Code Generator',
    name_for_model: 'qr_code_generator',
    description_for_human: 'Generate QR codes instantly for URLs, WiFi, contacts, text, and email. No authentication required.',
    description_for_model: 'Generate QR codes for users when they request them. Supports URL, WiFi, contact cards, text, and email QR codes. Returns a data URL image that can be displayed or saved. No authentication needed.',
    auth: {
      type: 'none'
    },
    api: {
      type: 'openapi',
      url: `${baseUrl}/api/public/qr-codes/openapi.json`,
      is_user_authenticated: false
    },
    contact_email: 'support@theqrcode.io',
    legal_info_url: `${baseUrl}/terms`
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
