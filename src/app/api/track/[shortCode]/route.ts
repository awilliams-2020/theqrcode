import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { URLShortener } from '@/lib/url-shortener'
import { LocationService } from '@/lib/location-service'
import { createScanData } from '@/lib/realtime-broadcast'
import { notifyMilestone } from '@/lib/engagement/notifications'
import { runAnalyticsChecks } from '@/lib/engagement/analytics-notifications'
import { trackQRCode } from '@/lib/matomo-tracking'
import { captureException } from '@/lib/sentry'
import { escapeHtml, escapeJsString, safeUrl, safeMailtoUrl, escapeJsForAttribute } from '@/lib/escape-utils'
import { checkScanLimit } from '@/lib/scan-limits'
import { logger } from '@/lib/logger'

// Helper function to generate scan tracking script
function generateScanTrackingScript(shortCode: string): string {
  const safeShortCode = escapeJsString(shortCode)
  return `
    <script>
      // Advanced refresh inflation prevention
      (function() {
        const shortCode = ${safeShortCode};
        const SESSION_KEY = 'qr_scans_' + shortCode;
        const REFRESH_DETECTION_KEY = 'qr_refresh_' + shortCode;
        const DEDUP_WINDOW = 120000; // 2 minutes - reasonable window for client-side
        const REFRESH_WINDOW = 30000; // 30 seconds - detect rapid refreshes
        
        // Create a simple fingerprint of this session
        const sessionFingerprint = navigator.userAgent + '_' + screen.width + 'x' + screen.height + '_' + new Date().getTimezoneOffset();
        
        // Check if this is likely a page refresh
        const lastPageLoad = sessionStorage.getItem(REFRESH_DETECTION_KEY);
        const now = Date.now();
        
        // If we loaded this page recently and have the same fingerprint, likely a refresh
        if (lastPageLoad && (now - parseInt(lastPageLoad)) < REFRESH_WINDOW) {
          console.log('Likely page refresh detected, skipping scan recording');
          return;
        }
        
        // Check if we've already recorded a scan recently (longer window)
        const lastScan = sessionStorage.getItem(SESSION_KEY);
        if (lastScan && (now - parseInt(lastScan)) < DEDUP_WINDOW) {
          console.log('Scan already recorded recently, skipping duplicate');
          return;
        }
        
        // Record this page load and scan timestamp
        sessionStorage.setItem(REFRESH_DETECTION_KEY, now.toString());
        sessionStorage.setItem(SESSION_KEY, now.toString());
        
        // Store fingerprint to detect refreshes
        sessionStorage.setItem('qr_fingerprint_' + shortCode, sessionFingerprint);
        
        // Make the actual scan tracking request
        fetch('/api/track/' + shortCode, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fingerprint: sessionFingerprint,
            timestamp: now
          })
        }).catch(error => {
          console.error('Failed to record scan:', error);
        });
      })();
    </script>`;
}

// Helper function to record a scan
async function recordScan(qrCode: any, headersList: any) {
  const userAgent = headersList.get('user-agent') || ''
  const ipAddress = headersList.get('x-forwarded-for') ||
                   headersList.get('x-real-ip') ||
                   '127.0.0.1'
  const referrer = headersList.get('referer') || ''

  // Parse user agent for device info
  const deviceInfo = parseUserAgent(userAgent)

  // Get location from IP address
  const locationInfo = await LocationService.getLocationFromIP(ipAddress)

  // Record the scan
  const scanRecord = await prisma.scan.create({
    data: {
      qrCodeId: qrCode.id,
      ipAddress,
      userAgent,
      device: deviceInfo.device,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      referrer,
      country: locationInfo.country,
      city: locationInfo.city
    }
  })

  // Broadcast real-time scan data
  try {
    const scanData = createScanData(
      scanRecord.id,
      qrCode,
      scanRecord,
      deviceInfo,
      locationInfo
    )
    
    // Note: Real-time broadcasting removed as polling is used instead
    logger.info('QR-CODE', 'Scan recorded', { qrCodeName: qrCode.name, qrCodeId: qrCode.id })
  } catch (error) {
    logger.logError(error as Error, 'QR-CODE', 'Error processing scan data', { qrCodeId: qrCode.id })
    // Don't fail the scan recording if data processing fails
  }

  return scanRecord
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  let shortCode: string = ''
  try {
    const { shortCode: code } = await params
    shortCode = code
    const shortUrl = URLShortener.getFullShortUrl(shortCode)
    
    logger.debug('API', 'Track API request', { shortCode, shortUrl })
    
    // Find the QR code by short URL
    const qrCode = await prisma.qrCode.findUnique({
      where: { shortUrl }
    })

    logger.debug('API', 'QR code lookup', { shortCode, found: !!qrCode, name: qrCode?.name })

    // Check if QR code exists and if it's been soft deleted
    if (!qrCode || qrCode.isDeleted) {
      // Return HTML page for 404 error, similar to display page
      const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>QR Code Not Found</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .qr-icon {
            width: 64px;
            height: 64px;
            color: #9CA3AF;
            margin: 0 auto 16px;
        }
        .error-title {
            color: #111827;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 8px;
        }
        .error-message {
            color: #6B7280;
            margin: 0 0 24px;
        }
        .home-button {
            background: #2563EB;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .home-button:hover {
            background: #1D4ED8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="qr-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="64" height="64">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
        </div>
        <h1 class="error-title">QR Code Not Found</h1>
        <p class="error-message">The QR code you're looking for doesn't exist or has been removed.</p>
        <button class="home-button" onclick="window.location.href='/'">
            Go Home
        </button>
    </div>
</body>
</html>`

      return new NextResponse(html, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }

    // Note: Scan recording is handled by the JavaScript tracking script
    // to prevent double counting. The script makes a POST request to record the scan.

    // Handle different QR code types
    if (qrCode.type === 'url') {
      // For URL types, return HTML page with tracking and auto-redirect
      const redirectUrl = safeUrl(qrCode.content)
      const safeRedirectUrlJs = escapeJsString(redirectUrl)
      const safeRedirectUrlDisplay = escapeHtml(qrCode.content) // Display original for user visibility
      
      const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Redirecting...</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2563EB;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .redirect-title {
            color: #111827;
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 8px;
        }
        .redirect-message {
            color: #6B7280;
            margin: 0 0 20px;
        }
        .redirect-url {
            color: #2563EB;
            font-size: 14px;
            word-break: break-all;
            margin: 0 0 20px;
        }
        .manual-link {
            background: #2563EB;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        .manual-link:hover {
            background: #1D4ED8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="loading-spinner"></div>
        <h1 class="redirect-title">Redirecting...</h1>
        <p class="redirect-message">Taking you to your destination</p>
        <p class="redirect-url">${safeRedirectUrlDisplay}</p>
        <a href="${redirectUrl}" class="manual-link">Click here if not redirected automatically</a>
    </div>
    
    <script>
        // Redirect after a short delay to allow tracking
        setTimeout(() => {
            window.location.href = ${safeRedirectUrlJs};
        }, 1000);
    </script>
    ${generateScanTrackingScript(shortCode)}
</body>
</html>`

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    } else if (qrCode.type === 'contact') {
          // For contact types, return HTML page that auto-downloads vCard
          try {
            const contactData = JSON.parse(qrCode.content)
            const vCard = formatContactVCard(contactData)
            
            const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Add Contact</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .contact-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            text-align: left;
        }
        .avatar {
            width: 50px;
            height: 50px;
            background: #007AFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            font-weight: bold;
            margin-right: 15px;
        }
        .contact-info h1 {
            color: #333;
            margin: 0 0 5px;
            font-size: 20px;
        }
        .contact-info p {
            color: #666;
            margin: 0;
            font-size: 14px;
        }
        .contact-details {
            text-align: left;
            margin: 20px 0;
        }
        .detail-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 0;
        }
        .detail-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            color: #666;
        }
        .detail-text {
            color: #333;
            font-size: 14px;
        }
        .download-btn {
            background: #007AFF;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: block;
            width: 100%;
            margin-top: 20px;
            box-sizing: border-box;
            text-align: center;
        }
        .download-btn:hover {
            background: #0056CC;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="contact-header">
            <div class="avatar">${escapeHtml((contactData.firstName?.[0] || 'C') + (contactData.lastName?.[0] || ''))}</div>
            <div class="contact-info">
                <h1>${escapeHtml(contactData.firstName || '')} ${escapeHtml(contactData.lastName || '')}</h1>
                ${contactData.organization ? `<p>${escapeHtml(contactData.organization)}</p>` : ''}
            </div>
        </div>
        
        <div class="contact-details">
            ${contactData.email ? `
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="detail-text">${escapeHtml(contactData.email)}</span>
            </div>
            ` : ''}
            
            ${contactData.phone ? `
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="detail-text">${escapeHtml(contactData.phone)}</span>
            </div>
            ` : ''}
            
            ${contactData.url ? `
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span class="detail-text">${escapeHtml(contactData.url)}</span>
            </div>
            ` : ''}
            
            ${contactData.address ? `
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="detail-text">${escapeHtml(contactData.address)}</span>
            </div>
            ` : ''}
        </div>
        
        <a href="#" id="downloadBtn" class="download-btn">Add to Contacts</a>
    </div>
    <script>
        // Create vCard data (using raw data for vCard format)
        const vCardData = \`${vCard.replace(/`/g, '\\`')}\`;
        
        // Set up download button
        document.getElementById('downloadBtn').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create blob and download
            const blob = new Blob([vCardData], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = ${escapeJsString((contactData.firstName || 'contact') + '.vcf')};
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
    </script>
    ${generateScanTrackingScript(shortCode)}
</body>
</html>`
            
            return new NextResponse(html, {
              headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              }
            })
          } catch (error) {
            // If JSON parsing fails, redirect to display page
            // shortCode is already available from the function scope
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
            return NextResponse.redirect(`${baseUrl}/display/${shortCode}`)
          }
    } else if (qrCode.type === 'email') {
      // For email types, return HTML page with email card
      const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Address</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .email-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            text-align: left;
        }
        .email-icon {
            width: 50px;
            height: 50px;
            background: #10B981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin-right: 15px;
        }
        .email-info h1 {
            color: #333;
            margin: 0 0 5px;
            font-size: 20px;
        }
        .email-info p {
            color: #666;
            margin: 0;
            font-size: 14px;
        }
        .email-content {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .email-address {
            color: #059669;
            font-size: 18px;
            font-weight: 500;
            margin: 0;
            word-break: break-all;
        }
        .email-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .copy-btn, .mailto-btn {
            flex: 1;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }
        .copy-btn {
            background: #2563EB;
            color: white;
        }
        .copy-btn:hover {
            background: #1D4ED8;
        }
        .mailto-btn {
            background: #10B981;
            color: white;
        }
        .mailto-btn:hover {
            background: #059669;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        .footer a {
            color: #666;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            color: #2563EB;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-header">
            <div class="email-icon">
                ✉️
            </div>
            <div class="email-info">
                <h1>Email Address</h1>
                <p>Contact information from QR code</p>
            </div>
        </div>
        
        <div class="email-content">
            <p class="email-address">${escapeHtml(qrCode.content)}</p>
        </div>
        
        <div class="email-actions">
            <button class="copy-btn" onclick='copyToClipboard("${escapeJsForAttribute(qrCode.content)}")'>
                Copy Email
            </button>
            <button class="mailto-btn" onclick='window.location.href="${escapeJsForAttribute(safeMailtoUrl(qrCode.content))}"'>
                Send Email
            </button>
        </div>
        
        <div class="footer">
            Powered by <a href="https://theqrcode.io" target="_blank" rel="noopener noreferrer">TheQRCode.io</a>
        </div>
    </div>
    
    <script>
        function copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function() {
                    console.log('Copied to clipboard: ' + text);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('Copied to clipboard: ' + text);
            }
        }
    </script>
    ${generateScanTrackingScript(shortCode)}
</body>
</html>`

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    } else if (qrCode.type === 'wifi') {
      // For WiFi types, return HTML page with WiFi connection card
      try {
        const wifiData = JSON.parse(qrCode.content)
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WiFi Network</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .wifi-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            text-align: left;
        }
        .wifi-icon {
            width: 50px;
            height: 50px;
            background: #10B981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin-right: 15px;
        }
        .wifi-info h1 {
            color: #333;
            margin: 0 0 5px;
            font-size: 20px;
        }
        .wifi-info p {
            color: #666;
            margin: 0;
            font-size: 14px;
        }
        .wifi-details {
            text-align: left;
            margin: 20px 0;
        }
        .detail-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .detail-icon.network { background: #DBEAFE; color: #2563EB; }
        .detail-icon.password { background: #FED7AA; color: #EA580C; }
        .detail-icon.security { background: #E9D5FF; color: #7C3AED; }
        .detail-icon.hidden { background: #F3F4F6; color: #6B7280; }
        .detail-content {
            flex: 1;
        }
        .detail-label {
            color: #666;
            font-size: 12px;
            margin-bottom: 2px;
        }
        .detail-value {
            color: #333;
            font-size: 14px;
            font-weight: 500;
        }
        .detail-value.password {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        .copy-btn {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            margin-left: 8px;
            transition: color 0.2s;
        }
        .copy-btn:hover {
            color: #333;
        }
        .instructions {
            background: #EBF8FF;
            border: 1px solid #BEE3F8;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: left;
        }
        .instructions h3 {
            color: #2B6CB0;
            margin: 0 0 8px;
            font-size: 14px;
        }
        .instructions p {
            color: #2C5282;
            margin: 4px 0;
            font-size: 13px;
        }
        .instructions .tip {
            font-weight: 500;
            margin-top: 8px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        .footer a {
            color: #666;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            color: #2563EB;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="wifi-header">
            <div class="wifi-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
            </div>
            <div class="wifi-info">
                <h1>WiFi Network</h1>
                <p>${escapeHtml(wifiData.ssid)}</p>
            </div>
        </div>
        
        <div class="wifi-details">
            <div class="detail-item">
                <div class="detail-icon network">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                </div>
                <div class="detail-content">
                    <div class="detail-label">Network Name</div>
                    <div class="detail-value">${escapeHtml(wifiData.ssid)}</div>
                </div>
                <button class="copy-btn" onclick='copyToClipboard("${escapeJsForAttribute(wifiData.ssid)}")' title="Copy network name">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>
            
            ${wifiData.password && wifiData.security !== 'nopass' ? `
            <div class="detail-item">
                <div class="detail-icon password">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div class="detail-content">
                    <div class="detail-label">Password</div>
                    <div class="detail-value password">${escapeHtml(wifiData.password)}</div>
                </div>
                <button class="copy-btn" onclick='copyToClipboard("${escapeJsForAttribute(wifiData.password)}")' title="Copy password">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>
            ` : ''}
            
            ${wifiData.security ? `
            <div class="detail-item">
                <div class="detail-icon security">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div class="detail-content">
                    <div class="detail-label">Security Type</div>
                    <div class="detail-value">${escapeHtml(wifiData.security)}</div>
                </div>
            </div>
            ` : ''}
            
            ${wifiData.hidden ? `
            <div class="detail-item">
                <div class="detail-icon hidden">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                </div>
                <div class="detail-content">
                    <div class="detail-label">Network Type</div>
                    <div class="detail-value">Hidden Network</div>
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="instructions">
            <h3>Connection Instructions</h3>
            <p>1. Go to your device's WiFi settings</p>
            <p>2. Look for "${escapeHtml(wifiData.ssid)}" in the network list</p>
            <p>3. Enter the password when prompted</p>
            ${wifiData.password && wifiData.security !== 'nopass' ? `<p class="tip">💡 Tip: You can copy the password above to paste it easily!</p>` : ''}
        </div>
        
        <div class="footer">
            Powered by <a href="https://theqrcode.io" target="_blank" rel="noopener noreferrer">TheQRCode.io</a>
        </div>
    </div>
    
    <script>
        function copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function() {
                    // Visual feedback could be added here
                    console.log('Copied to clipboard: ' + text);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('Copied to clipboard: ' + text);
            }
        }
    </script>
    ${generateScanTrackingScript(shortCode)}
</body>
</html>`

        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      } catch (error) {
        // If JSON parsing fails, redirect to display page
      // shortCode is already available from the function scope
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
      return NextResponse.redirect(`${baseUrl}/display/${shortCode}`)
      }
    } else if (qrCode.type === 'text') {
      // For text types, return HTML page with text content
      const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Plain Text</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .text-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            text-align: left;
        }
        .text-icon {
            width: 50px;
            height: 50px;
            background: #2563EB;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin-right: 15px;
        }
        .text-info h1 {
            color: #333;
            margin: 0 0 5px;
            font-size: 20px;
        }
        .text-info p {
            color: #666;
            margin: 0;
            font-size: 14px;
        }
        .text-content {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .text-content p {
            color: #333;
            font-size: 16px;
            line-height: 1.5;
            margin: 0;
            word-wrap: break-word;
        }
        .copy-btn {
            background: #2563EB;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 15px;
        }
        .copy-btn:hover {
            background: #1D4ED8;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        .footer a {
            color: #666;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            color: #2563EB;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="text-header">
            <div class="text-icon">
                📄
            </div>
            <div class="text-info">
                <h1>Plain Text</h1>
                <p>Text content from QR code</p>
            </div>
        </div>
        
        <div class="text-content">
            <p>${escapeHtml(qrCode.content)}</p>
        </div>
        
        <button class="copy-btn" onclick='copyToClipboard("${escapeJsForAttribute(qrCode.content)}")'>
            Copy Text
        </button>
        
        <div class="footer">
            Powered by <a href="https://theqrcode.io" target="_blank" rel="noopener noreferrer">TheQRCode.io</a>
        </div>
    </div>
    
    <script>
        function copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function() {
                    console.log('Copied to clipboard: ' + text);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('Copied to clipboard: ' + text);
            }
        }
    </script>
    ${generateScanTrackingScript(shortCode)}
</body>
</html>`

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    } else if (qrCode.type === 'menu') {
      // For menu types, redirect to the menu display page
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
      return NextResponse.redirect(`${baseUrl}/menu/${shortCode}`)
    } else {
      // For other types, redirect to display page
      // shortCode is already available from the function scope
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
      return NextResponse.redirect(`${baseUrl}/display/${shortCode}`)
    }
  } catch (error) {
    logger.logError(error as Error, 'API', 'Error tracking scan (GET)', { shortCode })
    captureException(error, {
      endpoint: '/api/track/[shortCode]',
      method: 'GET',
      shortCode
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatContactVCard(contactData: any): string {
  const {
    firstName,
    lastName,
    organization,
    phone,
    email,
    url,
    address
  } = contactData

  let vcard = 'BEGIN:VCARD\n'
  vcard += 'VERSION:3.0\n'
  vcard += `FN:${firstName} ${lastName}\n`
  vcard += `N:${lastName};${firstName};;;\n`
  
  if (organization) vcard += `ORG:${organization}\n`
  if (phone) vcard += `TEL:${phone}\n`
  if (email) vcard += `EMAIL:${email}\n`
  if (url) vcard += `URL:${url}\n`
  if (address) vcard += `ADR:;;${address};;;;\n`
  
  vcard += 'END:VCARD'
  return vcard
}

function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()
  
  let device = 'desktop'
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile'
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'tablet'
  }

  let os = 'unknown'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
  else if (/linux/i.test(ua)) os = 'Linux'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS'

  let browser = 'unknown'
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = 'Chrome'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
  else if (/edge/i.test(ua)) browser = 'Edge'
  else if (/opera/i.test(ua)) browser = 'Opera'

  return { device, os, browser }
}

// POST method for tracking scans without redirecting
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  let shortCode: string = ''
  try {
    const { shortCode: code } = await params
    shortCode = code
    const shortUrl = URLShortener.getFullShortUrl(shortCode)
    
    let qrCode
    try {
      qrCode = await prisma.qrCode.findUnique({
        where: { shortUrl }
      })
    } catch (dbError) {
      logger.logError(dbError as Error, 'API', 'Database error in track POST', {
        message: (dbError as any).message,
        code: (dbError as any).code,
        stack: (dbError as any).stack
      })
      return NextResponse.json({ 
        error: 'Database error', 
        details: (dbError as any).message 
      }, { status: 500 })
    }

    // Check if QR code exists or has been soft deleted
    if (!qrCode || qrCode.isDeleted) {
      logger.info('API', 'QR code not found or deleted', { shortCode, shortUrl })
      return NextResponse.json({ error: 'QR code not found', shortCode, shortUrl }, { status: 404 })
    }

    // If tracking is disabled (isDynamic is false), don't record scans but allow redirect
    if (!qrCode.isDynamic) {
      logger.debug('API', 'Tracking disabled for QR code, skipping scan recording', { shortCode, qrCodeId: qrCode.id })
      return NextResponse.json({ success: true, message: 'Tracking disabled, scan not recorded' })
    }

    // Get request body for fingerprint data
    const body = await request.json().catch(() => ({}))
    const { fingerprint, timestamp } = body

    // Server-side deduplication: Only check for very recent identical scans
    if (fingerprint && timestamp) {
      const headersList = await headers()
      const userAgent = headersList.get('user-agent') || ''
      const ipAddress = headersList.get('x-forwarded-for') ||
                       headersList.get('x-real-ip') ||
                       'unknown'
      
      // Only check for very recent scans (within 2 minutes) with EXACT same IP and User Agent
      // This prevents rapid refreshes but allows different browsers/devices
      const recentScan = await prisma.scan.findFirst({
        where: {
          qrCodeId: qrCode.id,
          ipAddress,
          userAgent,
          scannedAt: {
            gte: new Date(Date.now() - 2 * 60 * 1000) // Only 2 minutes for exact matches
          }
        },
        orderBy: {
          scannedAt: 'desc'
        }
      })

      if (recentScan) {
        logger.debug('API', 'Exact duplicate scan detected, skipping recording', { shortCode, qrCodeId: qrCode.id })
        return NextResponse.json({ success: true, message: 'Duplicate scan detected, not recorded' })
      }
    }

    // Check scan limits before recording
    const scanLimitCheck = await checkScanLimit(qrCode.userId)
    
    if (scanLimitCheck.allowed) {
      // Record the scan if within limits
      logger.debug('API', 'Recording scan for QR code', { qrCodeId: qrCode.id })
      try {
        // Get headers and device/location info
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || ''
        const ipAddress = headersList.get('x-forwarded-for') ||
                         headersList.get('x-real-ip') ||
                         '127.0.0.1'
        const deviceInfo = parseUserAgent(userAgent)
        const locationInfo = await LocationService.getLocationFromIP(ipAddress)
        
        // Record the scan
        await recordScan(qrCode, headersList)
        logger.info('QR-CODE', 'Scan recorded successfully', { qrCodeId: qrCode.id })
        
        // Check for scan milestones (asynchronous, don't block response)
        const totalScans = await prisma.scan.count({
          where: {
            qrCode: {
              userId: qrCode.userId
            }
          }
        })
        
        // Notify on scan milestones
        const scanMilestones = [100, 500, 1000, 5000, 10000, 50000]
        if (scanMilestones.includes(totalScans)) {
          notifyMilestone(qrCode.userId, 'scans', totalScans).catch(err =>
            logger.logError(err as Error, 'NOTIFICATION', 'Failed to send scan milestone notification', { userId: qrCode.userId, totalScans })
          )
        }
        
        // Run real-time analytics checks (non-blocking)
        runAnalyticsChecks(qrCode.userId, qrCode.id, {
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          country: locationInfo.country,
          city: locationInfo.city
        }).catch(err => {
          logger.logError(err as Error, 'ANALYTICS', 'Failed to run analytics checks', { userId: qrCode.userId, qrCodeId: qrCode.id })
        })
        
        // Track QR code scan in Matomo (async, don't block response)
        trackQRCode.scan(
          qrCode.id,
          qrCode.userId,
          qrCode.type,
          qrCode.isDynamic,
          totalScans,
          {
            ip: ipAddress,
            userAgent,
            country: locationInfo.country || undefined,
            device: deviceInfo.device,
          }
        ).catch(err => logger.logError(err as Error, 'MATOMO', 'Failed to track QR scan in Matomo', { qrCodeId: qrCode.id }))
        
        return NextResponse.json({ success: true, message: 'Scan recorded' })
      } catch (recordError) {
        logger.logError(recordError as Error, 'API', 'Error recording scan', { qrCodeId: qrCode.id })
        return NextResponse.json({ error: 'Failed to record scan' }, { status: 500 })
      }
    } else {
      // Limit exceeded - return error with details
      logger.warn('API', 'Scan limit exceeded', {
        userId: qrCode.userId,
        currentCount: scanLimitCheck.currentCount,
        limit: scanLimitCheck.limit
      })
      return NextResponse.json({ 
        success: false, 
        error: 'Scan limit exceeded',
        details: {
          currentCount: scanLimitCheck.currentCount,
          limit: scanLimitCheck.limit
        }
      }, { status: 403 })
    }
  } catch (error) {
    logger.logError(error as Error, 'API', 'Error tracking scan (POST)', { shortCode })
    captureException(error, {
      endpoint: '/api/track/[shortCode]',
      method: 'POST',
      shortCode
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}