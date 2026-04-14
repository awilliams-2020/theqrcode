import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LandingPage from '@/components/LandingPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TheQRCode.io | QR Code API for Developers & AI Agents',
  description: 'QR code API built for developers and AI agents. No auth required. MCP ready for Claude and Cursor. REST API, OpenAPI spec, 100 req/hr free. Integrate in 60 seconds.',
  keywords: [
    'qr code api', 'qr code mcp', 'qr code for developers', 'qr code ai agent',
    'free qr code api', 'qr code rest api', 'qr code generator', 'free qr code generator',
    'qr code no auth', 'qr code mcp server', 'claude qr code', 'cursor qr code',
    'qr code io', 'qr io', 'theqrcode', 'dynamic qr code', 'qr code analytics',
  ],
  openGraph: {
    title: 'TheQRCode.io | QR Code API for Developers & AI Agents',
    description: 'QR code API built for developers and AI agents. No auth required. MCP ready. Integrate in 60 seconds.',
    type: 'website',
    url: 'https://theqrcode.io',
  },
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }
  
  return <LandingPage />
}