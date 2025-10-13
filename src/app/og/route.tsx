import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function GET() {
  // Read the image from public folder and convert to base64
  const imagePath = path.join(process.cwd(), 'public', 'SignUp.png')
  const imageBuffer = await fs.readFile(imagePath)
  const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Main Content Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1000px',
            padding: '0 40px',
            gap: '60px',
          }}
        >
          {/* QR Code Icon Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* QR Code Icon Container */}
            <div
              style={{
                width: '240px',
                height: '240px',
                backgroundColor: 'white',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                marginBottom: '10px',
              }}
            >
              {/* Lucide QrCode Icon */}
              <img src={base64Image} width="202" height="202" />
            </div>

            {/* Icon Label */}
            <div
              style={{
                fontSize: '18px',
                color: '#374151',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              QR Code Generator
            </div>
          </div>

          {/* Text Content Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              maxWidth: '600px',
            }}
          >
            {/* Main Title */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0 0 16px 0',
                lineHeight: 1.1,
              }}
            >
              TheQRCode.io
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: '#2563eb',
                margin: '0 0 32px 0',
                fontWeight: '600',
                lineHeight: 1.2,
              }}
            >
              Create & Track QR Codes with Analytics
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: '22px',
                color: '#4b5563',
                margin: '0 0 32px 0',
                lineHeight: 1.4,
              }}
            >
              Generate beautiful QR codes and track their performance with detailed analytics. 
              Perfect for businesses, marketers, and developers.
            </p>

            {/* Pricing Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}
              >
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
              </svg>
              Starting at $9/month
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}