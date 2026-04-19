// Email templates for marketing automation and user engagement

interface EmailTemplate {
  subject: string
  html: (data: any) => string
  text: (data: any) => string
}

// Welcome email for new users
export const welcomeEmail: EmailTemplate = {
  subject: 'Welcome to TheQRCode.io! 🎉',
  html: (data: { name: string; trialDays?: number; isOnTrial?: boolean; qrCodeLimit?: number | string; plan?: string }) => {
    const plan = (data.plan || 'free').toLowerCase()
    
    // Build feature list based on plan - 3 key features per plan
    const features: string[] = []
    
    if (plan === 'free') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 10 QR codes')
      features.push('Track scans with basic analytics')
      features.push('URL, Text, WiFi, and Contact QR code types')
    } else if (plan === 'starter') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 100 QR codes')
      features.push('Track scans with advanced analytics')
      features.push('Customize colors and styles')
    } else if (plan === 'developer') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 500 QR codes')
      features.push('Full API access with 5,000 requests/hr')
      features.push('MCP server access for AI agent integration')
      features.push('Webhooks and sandbox environment')
    } else if (plan === 'pro') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 500 QR codes')
      features.push('Track scans with detailed analytics')
      features.push('Download in multiple formats (SVG, PDF)')
    } else {
      // Fallback for unknown plans
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create QR codes')
      features.push('Track scans with analytics')
      features.push('Customize your QR codes')
    }
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to TheQRCode.io!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Welcome to TheQRCode.io!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Thanks for joining TheQRCode.io! We're excited to help you create, manage, and track beautiful QR codes.
              </p>
              
              ${data.isOnTrial && data.trialDays ? `
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Your <strong>${data.trialDays}-day free trial</strong> is now active. Here's what you can do:
              </p>
              ` : `
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Here's what you can do with TheQRCode.io:
              </p>
              `}
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                ${features.map(feature => `<li style="margin-bottom: 8px;">${feature}</li>`).join('')}
              </ul>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/dashboard" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">Get Started</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                Need help? Reply to this email or check out our <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: underline;">help center</a>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  text: (data: { name: string; trialDays?: number; isOnTrial?: boolean; qrCodeLimit?: number | string; plan?: string }) => {
    const plan = (data.plan || 'free').toLowerCase()
    
    // Build feature list based on plan - 3 key features per plan
    const features: string[] = []
    
    if (plan === 'free') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 10 QR codes')
      features.push('Track scans with basic analytics')
      features.push('URL, Text, WiFi, and Contact QR code types')
    } else if (plan === 'starter') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 100 QR codes')
      features.push('Track scans with advanced analytics')
      features.push('Customize colors and styles')
    } else if (plan === 'developer') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 500 QR codes')
      features.push('Full API access with 5,000 requests/hr')
      features.push('MCP server access for AI agent integration')
      features.push('Webhooks and sandbox environment')
    } else if (plan === 'pro') {
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create up to 500 QR codes')
      features.push('Track scans with detailed analytics')
      features.push('Download in multiple formats (SVG, PDF)')
    } else {
      // Fallback for unknown plans
      features.push(data.qrCodeLimit ? `Create up to ${data.qrCodeLimit} QR codes` : 'Create QR codes')
      features.push('Track scans with analytics')
      features.push('Customize your QR codes')
    }
    
    return `
Hi ${data.name}!

Thanks for joining TheQRCode.io! We're excited to help you create, manage, and track beautiful QR codes.

${data.isOnTrial && data.trialDays ? `Your ${data.trialDays}-day free trial is now active. ` : ''}Here's what you can do:
${features.map(f => `- ${f}`).join('\n')}

Get started: https://theqrcode.io/dashboard

Need help? Reply to this email or check out our help center: https://theqrcode.io/help

Best regards,
The TheQRCode.io Team
    `
  }
}

// Trial ending soon reminder
export const trialEndingEmail: EmailTemplate = {
  subject: 'Your trial ends in {days} days - Keep your QR codes active',
  html: (data: { name: string; daysLeft: number; qrCodeCount: number; scanCount: number; plan?: string }) => {
    const plan = (data.plan || 'starter').toLowerCase()
    
    // Build feature list based on plan - 3 key features per plan
    const features: string[] = []
    
    if (plan === 'starter') {
      features.push('Create up to 100 QR codes')
      features.push('Track scans with advanced analytics')
      features.push('Customize colors and styles')
    } else if (plan === 'developer') {
      features.push('Create up to 500 QR codes')
      features.push('Full API access with 5,000 requests/hr')
      features.push('MCP server access for AI agent integration')
    } else if (plan === 'pro') {
      features.push('Create up to 500 QR codes')
      features.push('Track scans with detailed analytics')
      features.push('Download in multiple formats (SVG, PDF)')
    } else {
      // Fallback for unknown plans
      features.push('More QR codes and scans')
      features.push('Advanced analytics and exports')
      features.push('Custom styling and branding')
    }
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Trial is Ending Soon</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">🕐 Your Trial is Ending Soon</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name},</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Your free trial ends in <strong>${data.daysLeft} days</strong>. Here's what you've accomplished so far:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" width="50%" style="padding: 10px;">
                          <h3 style="color: #2563eb; font-size: 32px; margin: 0; font-weight: bold;">${data.qrCodeCount}</h3>
                          <p style="color: #6b7280; margin: 5px 0;">QR Codes Created</p>
                        </td>
                        <td align="center" width="50%" style="padding: 10px;">
                          <h3 style="color: #2563eb; font-size: 32px; margin: 0; font-weight: bold;">${data.scanCount}</h3>
                          <p style="color: #6b7280; margin: 5px 0;">Total Scans</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Upgrade now to keep these features:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                ${features.map(feature => `<li style="margin-bottom: 8px;">${feature}</li>`).join('')}
              </ul>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/pricing" style="background-color: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">Upgrade Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
  },
  text: (data: { name: string; daysLeft: number; qrCodeCount: number; scanCount: number; plan?: string }) => {
    const plan = (data.plan || 'starter').toLowerCase()
    
    // Build feature list based on plan - 3 key features per plan
    const features: string[] = []
    
    if (plan === 'starter') {
      features.push('Create up to 100 QR codes')
      features.push('Track scans with advanced analytics')
      features.push('Customize colors and styles')
    } else if (plan === 'developer') {
      features.push('Create up to 500 QR codes')
      features.push('Full API access with 5,000 requests/hr')
      features.push('MCP server access for AI agent integration')
    } else if (plan === 'pro') {
      features.push('Create up to 500 QR codes')
      features.push('Track scans with detailed analytics')
      features.push('Download in multiple formats (SVG, PDF)')
    } else {
      // Fallback for unknown plans
      features.push('More QR codes and scans')
      features.push('Advanced analytics and exports')
      features.push('Custom styling and branding')
    }
    
    return `
Hi ${data.name},

Your free trial ends in ${data.daysLeft} days. Here's what you've accomplished so far:

- QR Codes Created: ${data.qrCodeCount}
- Total Scans: ${data.scanCount}

Upgrade now to keep these features:
${features.map(f => `- ${f}`).join('\n')}

Upgrade now: https://theqrcode.io/pricing

Best regards,
The TheQRCode.io Team
    `
  }
}

// Monthly usage insights
export const usageInsightsEmail: EmailTemplate = {
  subject: '📊 Your Monthly QR Code Insights',
  html: (data: { name: string; month: string; qrCodeCount: number; scanCount: number; topQrCode: string; scanGrowth: number }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Monthly QR Code Insights</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">📊 Your ${data.month} Insights</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Here's how your QR codes performed in ${data.month}:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px; text-align: center;">
                          <h3 style="color: #1e40af; font-size: 36px; margin: 0; font-weight: bold;">${data.scanCount}</h3>
                          <p style="color: #1f2937; margin: 5px 0; font-weight: 600;">Total Scans</p>
                          <p style="color: ${data.scanGrowth >= 0 ? '#059669' : '#dc2626'}; font-size: 14px; margin: 0; font-weight: bold;">
                            ${data.scanGrowth === 0 ? '→' : data.scanGrowth >= 0 ? '↑' : '↓'} ${data.scanGrowth === 0 ? 'No change' : data.scanGrowth === 999 ? 'New!' : Math.abs(data.scanGrowth) + '%'} from last month
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; text-align: center;">
                          <h3 style="color: #1e40af; font-size: 36px; margin: 0; font-weight: bold;">${data.qrCodeCount}</h3>
                          <p style="color: #1f2937; margin: 5px 0; font-weight: 600;">Active QR Codes</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; text-align: center;">
                          <p style="color: #1f2937; margin: 5px 0; font-weight: bold;">Top Performing QR Code:</p>
                          <p style="color: #111827; margin: 5px 0; font-weight: 600;">${data.topQrCode}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/analytics" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">View Full Analytics</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                Keep up the great work! 🎉
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; month: string; qrCodeCount: number; scanCount: number; topQrCode: string; scanGrowth: number }) => `
Hi ${data.name}!

Here's how your QR codes performed in ${data.month}:

Total Scans: ${data.scanCount}
Growth: ${data.scanGrowth === 0 ? '→ No change' : data.scanGrowth === 999 ? '↑ New!' : (data.scanGrowth >= 0 ? '↑' : '↓') + ' ' + Math.abs(data.scanGrowth) + '%'} from last month

Active QR Codes: ${data.qrCodeCount}

Top Performing QR Code: ${data.topQrCode}

View full analytics: https://theqrcode.io/analytics

Keep up the great work! 🎉

Best regards,
The TheQRCode.io Team
  `
}

// Feature announcement
export const featureAnnouncementEmail: EmailTemplate = {
  subject: '🚀 New Feature: {featureName}',
  html: (data: { name: string; featureName: string; featureDescription: string; ctaUrl: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Feature Available</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">🚀 New Feature Available!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                We're excited to announce a new feature: <strong>${data.featureName}</strong>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-left: 4px solid #7c3aed; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #374151; line-height: 1.6; margin: 0;">${data.featureDescription}</p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.ctaUrl}" style="background-color: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">Try It Now</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                As always, we'd love to hear your feedback!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; featureName: string; featureDescription: string; ctaUrl: string }) => `
Hi ${data.name}!

We're excited to announce a new feature: ${data.featureName}

${data.featureDescription}

Try it now: ${data.ctaUrl}

As always, we'd love to hear your feedback!

Best regards,
The TheQRCode.io Team
  `
}

// Trial expired - downgraded to free plan
export const trialExpiredEmail: EmailTemplate = {
  subject: 'Your trial has ended - Welcome to the Free plan',
  html: (data: { name: string; previousPlan: string; qrCodeCount: number; scanCount: number }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Trial Has Ended</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Your Trial Has Ended</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name},</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Your 14-day ${data.previousPlan} trial has ended. Don't worry - your account is still active on our <strong>Free plan</strong>!
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Here's what you accomplished during your trial:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" width="50%" style="padding: 10px;">
                          <h3 style="color: #2563eb; font-size: 32px; margin: 0; font-weight: bold;">${data.qrCodeCount}</h3>
                          <p style="color: #6b7280; margin: 5px 0;">QR Codes Created</p>
                        </td>
                        <td align="center" width="50%" style="padding: 10px;">
                          <h3 style="color: #2563eb; font-size: 32px; margin: 0; font-weight: bold;">${data.scanCount}</h3>
                          <p style="color: #6b7280; margin: 5px 0;">Total Scans</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                <strong>What's included in the Free plan:</strong>
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Up to 10 QR codes</li>
                <li style="margin-bottom: 8px;">1,000 scans per month</li>
                <li style="margin-bottom: 8px;">Basic analytics</li>
                <li style="margin-bottom: 8px;">URL, Text, WiFi, and Contact QR codes</li>
              </ul>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                <strong>Want to keep your ${data.previousPlan} features?</strong> Upgrade anytime to unlock:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                ${(() => {
                  const prevPlan = data.previousPlan.toLowerCase()
                  if (prevPlan === 'starter') {
                    return `
                      <li style="margin-bottom: 8px;">Create up to 100 QR codes</li>
                      <li style="margin-bottom: 8px;">Track scans with advanced analytics</li>
                      <li style="margin-bottom: 8px;">Customize colors and styles</li>
                    `
                  } else if (prevPlan === 'pro') {
                    return `
                      <li style="margin-bottom: 8px;">Create up to 500 QR codes</li>
                      <li style="margin-bottom: 8px;">Track scans with detailed analytics</li>
                      <li style="margin-bottom: 8px;">Download in multiple formats (SVG, PDF)</li>
                    `
                  } else {
                    return `
                      <li style="margin-bottom: 8px;">More QR codes and scans</li>
                      <li style="margin-bottom: 8px;">Advanced analytics and exports</li>
                      <li style="margin-bottom: 8px;">Custom styling and branding</li>
                    `
                  }
                })()}
              </ul>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/pricing" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">View Plans & Upgrade</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                Thanks for trying TheQRCode.io! We're here if you need anything.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; previousPlan: string; qrCodeCount: number; scanCount: number }) => `
Hi ${data.name},

Your 14-day ${data.previousPlan} trial has ended. Don't worry - your account is still active on our Free plan!

Here's what you accomplished during your trial:
- QR Codes Created: ${data.qrCodeCount}
- Total Scans: ${data.scanCount}

What's included in the Free plan:
- Up to 10 QR codes
- 1,000 scans per month
- Basic analytics
- URL, Text, WiFi, and Contact QR codes

Want to keep your ${data.previousPlan} features? Upgrade anytime to unlock:
${(() => {
  const prevPlan = data.previousPlan.toLowerCase()
  if (prevPlan === 'starter') {
    return '- Create up to 100 QR codes\n- Track scans with advanced analytics\n- Customize colors and styles'
  } else if (prevPlan === 'pro') {
    return '- Create up to 500 QR codes\n- Track scans with detailed analytics\n- Download in multiple formats (SVG, PDF)'
  } else {
    return '- More QR codes and scans\n- Advanced analytics and exports\n- Custom styling and branding'
  }
})()}

View plans and upgrade: https://theqrcode.io/pricing

Thanks for trying TheQRCode.io! We're here if you need anything.

Best regards,
The TheQRCode.io Team
  `
}

// Re-engagement email for inactive users
export const reEngagementEmail: EmailTemplate = {
  subject: 'We miss you! Your QR code journey continues',
  html: (data: { name: string; daysSinceLastLogin: number }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>We Miss You</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">We Miss You! 💙</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">It's been ${data.daysSinceLastLogin} days</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name},</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 30px 0; font-size: 16px;">
                We noticed you haven't been around for a while. Your account is still here, and we'd love to see you create amazing QR codes again!
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                <strong>Quick tips to get you started:</strong>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 4px; margin-bottom: 12px;">
                    <p style="color: #1e40af; margin: 0; font-weight: 600; font-size: 15px;">💡 Start with a simple URL QR code</p>
                    <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px; line-height: 1.6;">Perfect for linking to your website, landing pages, or social media profiles. It's the easiest way to get started!</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #16a34a; border-radius: 4px; margin-bottom: 12px;">
                    <p style="color: #15803d; margin: 0; font-weight: 600; font-size: 15px;">📱 Use WiFi QR codes for guests</p>
                    <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px; line-height: 1.6;">Create a QR code that automatically connects visitors to your WiFi network - no password sharing needed!</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="color: #d97706; margin: 0; font-weight: 600; font-size: 15px;">📊 Track your results</p>
                    <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px; line-height: 1.6;">Check your analytics dashboard to see where and when your QR codes are being scanned - valuable insights await!</p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0; background-color: #eff6ff; border-radius: 8px; border: 1px solid #dbeafe;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #1e40af; margin: 0 0 10px 0; font-weight: 600; font-size: 16px;">📚 Want to learn more?</p>
                    <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                      Check out our blog for tips, best practices, and creative ways to use QR codes in your business.
                    </p>
                    <a href="https://theqrcode.io/blog" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">Read our blog →</a>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border-radius: 8px;">
                <tr>
                  <td align="center" style="padding: 25px;">
                    <a href="https://theqrcode.io/dashboard" style="background-color: #ffffff; color: #2563eb; padding: 16px 36px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px; border: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Return to Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; daysSinceLastLogin: number }) => `
Hi ${data.name},

We noticed you haven't been around for a while. Your account is still here, and we'd love to see you create amazing QR codes again!

QUICK TIPS TO GET YOU STARTED:

💡 START WITH A SIMPLE URL QR CODE
Perfect for linking to your website, landing pages, or social media profiles. It's the easiest way to get started!

📱 USE WIFI QR CODES FOR GUESTS
Create a QR code that automatically connects visitors to your WiFi network - no password sharing needed!

📊 TRACK YOUR RESULTS
Check your analytics dashboard to see where and when your QR codes are being scanned - valuable insights await!

📚 WANT TO LEARN MORE?
Check out our blog for tips, best practices, and creative ways to use QR codes in your business.
Read our blog: https://theqrcode.io/blog

Return to your dashboard: https://theqrcode.io/dashboard

Best regards,
The TheQRCode.io Team

---
TheQRCode.io | https://theqrcode.io
Pricing: https://theqrcode.io/pricing
Help Center: https://theqrcode.io/help
© 2025 TheQRCode.io. All rights reserved.
  `
}

// Inactive user deletion warning (60 days before)
export const inactiveUserWarning60Days: EmailTemplate = {
  subject: 'Your account will be deleted in 60 days due to inactivity',
  html: (data: { name: string; daysUntilDeletion: number; lastActiveDate: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Account Deletion Warning</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">⚠️ Account Deletion Notice</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name},</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                We noticed you haven't logged into your TheQRCode.io account since <strong>${data.lastActiveDate}</strong>. 
                To keep your account secure and our database clean, we'll automatically delete inactive accounts after 90 days.
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                <strong>Your account will be deleted in ${data.daysUntilDeletion} days</strong> if you don't log in.
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                To keep your account active, simply log in to your dashboard. All your QR codes and data will be preserved.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/dashboard" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">Log In Now</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                If you no longer need this account, you can ignore this email and it will be automatically deleted.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; daysUntilDeletion: number; lastActiveDate: string }) => `
Hi ${data.name},

We noticed you haven't logged into your TheQRCode.io account since ${data.lastActiveDate}. 
To keep your account secure and our database clean, we'll automatically delete inactive accounts after 90 days.

Your account will be deleted in ${data.daysUntilDeletion} days if you don't log in.

To keep your account active, simply log in to your dashboard. All your QR codes and data will be preserved.

Log in now: https://theqrcode.io/dashboard

If you no longer need this account, you can ignore this email and it will be automatically deleted.

Best regards,
The TheQRCode.io Team
  `
}

// Inactive user deletion warning (30 days before)
export const inactiveUserWarning30Days: EmailTemplate = {
  subject: '⚠️ Final Warning: Your account will be deleted in 30 days',
  html: (data: { name: string; daysUntilDeletion: number; lastActiveDate: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Final Account Deletion Warning</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">⚠️ Final Warning: Account Deletion</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name},</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                This is your final warning. Your TheQRCode.io account hasn't been accessed since <strong>${data.lastActiveDate}</strong>.
              </p>
              
              <p style="color: #dc2626; line-height: 1.6; margin: 0 0 20px 0; font-weight: bold; font-size: 18px;">
                ⚠️ Your account will be permanently deleted in ${data.daysUntilDeletion} days.
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Once deleted, all your QR codes, analytics data, and account information will be permanently removed and cannot be recovered.
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                To prevent deletion, log in to your account now:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/dashboard" style="background-color: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">Log In to Save Account</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                If you no longer need this account, no action is needed and it will be automatically deleted.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; daysUntilDeletion: number; lastActiveDate: string }) => `
Hi ${data.name},

This is your final warning. Your TheQRCode.io account hasn't been accessed since ${data.lastActiveDate}.

⚠️ Your account will be permanently deleted in ${data.daysUntilDeletion} days.

Once deleted, all your QR codes, analytics data, and account information will be permanently removed and cannot be recovered.

To prevent deletion, log in to your account now: https://theqrcode.io/dashboard

If you no longer need this account, no action is needed and it will be automatically deleted.

Best regards,
The TheQRCode.io Team
  `
}

// Inactive user deletion warning (15 days before)
export const inactiveUserWarning15Days: EmailTemplate = {
  subject: '🚨 URGENT: Your account will be deleted in 15 days',
  html: (data: { name: string; daysUntilDeletion: number; lastActiveDate: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Urgent Account Deletion Warning</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 2px solid #dc2626; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">🚨 URGENT: Account Deletion Imminent</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name},</h2>
              
              <p style="color: #dc2626; line-height: 1.6; margin: 0 0 20px 0; font-weight: bold; font-size: 18px;">
                ⚠️ Your account will be permanently deleted in ${data.daysUntilDeletion} days!
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Your TheQRCode.io account hasn't been accessed since <strong>${data.lastActiveDate}</strong>. 
                We're required to delete inactive accounts after 90 days to maintain data security and compliance.
              </p>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                <strong>This deletion is permanent and irreversible.</strong> All your data will be lost:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">All QR codes you've created</li>
                <li style="margin-bottom: 8px;">Analytics and scan history</li>
                <li style="margin-bottom: 8px;">Account settings and preferences</li>
                <li style="margin-bottom: 8px;">API keys and webhooks</li>
              </ul>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                <strong>To save your account, log in immediately:</strong>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/dashboard" style="background-color: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none; font-size: 16px;">Log In Now to Save Account</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 14px;">
                If you no longer need this account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/pricing" style="color: #2563eb; text-decoration: none;">Pricing</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; daysUntilDeletion: number; lastActiveDate: string }) => `
Hi ${data.name},

⚠️ Your account will be permanently deleted in ${data.daysUntilDeletion} days!

Your TheQRCode.io account hasn't been accessed since ${data.lastActiveDate}. 
We're required to delete inactive accounts after 90 days to maintain data security and compliance.

This deletion is permanent and irreversible. All your data will be lost:
- All QR codes you've created
- Analytics and scan history
- Account settings and preferences
- API keys and webhooks

To save your account, log in immediately: https://theqrcode.io/dashboard

If you no longer need this account, you can safely ignore this email.

Best regards,
The TheQRCode.io Team
  `
}

// Daily analytics digest email template
export const dailyAnalyticsDigestEmail: EmailTemplate = {
  subject: '📊 Your Daily QR Code Analytics Summary',
  html: (data: { name: string; todayScans: number; yesterdayScans: number; percentageChange: number; uniqueCountries: number; trend: string; changeText: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Daily Analytics Summary</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">📊 Daily Analytics Summary</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
                Here's your QR code performance summary for today:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <h3 style="color: #1e40af; font-size: 48px; margin: 0; font-weight: bold;">${data.todayScans}</h3>
                    <p style="color: #1f2937; margin: 10px 0 5px 0; font-weight: 600; font-size: 18px;">Scans Today</p>
                    <p style="color: ${data.percentageChange >= 0 ? '#059669' : data.percentageChange < 0 ? '#dc2626' : '#6b7280'}; font-size: 16px; margin: 0; font-weight: bold;">
                      ${data.trend} ${data.changeText}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #1f2937; margin: 0; font-weight: 600;">🌍 ${data.uniqueCountries} ${data.uniqueCountries === 1 ? 'Country' : 'Countries'}</p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/analytics" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">View Full Analytics</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                Keep tracking your QR code performance! 🎉
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; padding: 25px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                <a href="https://theqrcode.io" style="color: #2563eb; text-decoration: none; font-weight: 600;">TheQRCode.io</a> | 
                <a href="https://theqrcode.io/analytics" style="color: #2563eb; text-decoration: none;">Analytics</a> | 
                <a href="https://theqrcode.io/help" style="color: #2563eb; text-decoration: none;">Help Center</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                © 2025 TheQRCode.io. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  text: (data: { name: string; todayScans: number; yesterdayScans: number; percentageChange: number; uniqueCountries: number; trend: string; changeText: string }) => `
Hi ${data.name}!

Here's your QR code performance summary for today:

Scans Today: ${data.todayScans}
${data.changeText}

Countries: ${data.uniqueCountries} ${data.uniqueCountries === 1 ? 'country' : 'countries'}

View full analytics: https://theqrcode.io/analytics

Keep tracking your QR code performance! 🎉

Best regards,
The TheQRCode.io Team
  `
}

export const emailTemplates = {
  welcome: welcomeEmail,
  trialEnding: trialEndingEmail,
  trialExpired: trialExpiredEmail,
  usageInsights: usageInsightsEmail,
  dailyAnalyticsDigest: dailyAnalyticsDigestEmail,
  featureAnnouncement: featureAnnouncementEmail,
  reEngagement: reEngagementEmail,
  inactiveUserWarning60Days: inactiveUserWarning60Days,
  inactiveUserWarning30Days: inactiveUserWarning30Days,
  inactiveUserWarning15Days: inactiveUserWarning15Days,
}

