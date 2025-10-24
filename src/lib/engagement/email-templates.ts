// Email templates for marketing automation and user engagement

interface EmailTemplate {
  subject: string
  html: (data: any) => string
  text: (data: any) => string
}

// Welcome email for new users
export const welcomeEmail: EmailTemplate = {
  subject: 'Welcome to TheQRCode.io! 🎉',
  html: (data: { name: string; trialDays?: number; isOnTrial?: boolean }) => `
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Welcome to TheQRCode.io!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Thanks for joining TheQRCode.io! We're excited to help you create, manage, and track beautiful QR codes.
              </p>
              
              ${data.isOnTrial && data.trialDays ? `
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Your <strong>${data.trialDays}-day free trial</strong> is now active. Here's what you can do:
              </p>
              ` : `
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Here's what you can do with TheQRCode.io:
              </p>
              `}
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Create unlimited QR codes</li>
                <li style="margin-bottom: 8px;">Track scans with detailed analytics</li>
                <li style="margin-bottom: 8px;">Customize colors and styles</li>
                <li style="margin-bottom: 8px;">Download in multiple formats</li>
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
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
  text: (data: { name: string; trialDays?: number; isOnTrial?: boolean }) => `
Hi ${data.name}!

Thanks for joining TheQRCode.io! We're excited to help you create, manage, and track beautiful QR codes.

${data.isOnTrial && data.trialDays ? `Your ${data.trialDays}-day free trial is now active. ` : ''}Here's what you can do:
- Create unlimited QR codes
- Track scans with detailed analytics
- Customize colors and styles
- Download in multiple formats

Get started: https://theqrcode.io/dashboard

Need help? Reply to this email or check out our help center: https://theqrcode.io/help

Best regards,
The TheQRCode.io Team
  `
}

// Trial ending soon reminder
export const trialEndingEmail: EmailTemplate = {
  subject: 'Your trial ends in {days} days - Keep your QR codes active',
  html: (data: { name: string; daysLeft: number; qrCodeCount: number; scanCount: number }) => `
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #dc2626, #ea580c); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">🕐 Your Trial is Ending Soon</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">Hi ${data.name},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
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
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Upgrade now to keep your QR codes active and unlock advanced features:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Custom domains and branding</li>
                <li style="margin-bottom: 8px;">Advanced analytics and exports</li>
                <li style="margin-bottom: 8px;">Priority support</li>
                <li style="margin-bottom: 8px;">API access</li>
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
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
  text: (data: { name: string; daysLeft: number; qrCodeCount: number; scanCount: number }) => `
Hi ${data.name},

Your free trial ends in ${data.daysLeft} days. Here's what you've accomplished so far:

- QR Codes Created: ${data.qrCodeCount}
- Total Scans: ${data.scanCount}

Upgrade now to keep your QR codes active and unlock advanced features:
- Custom domains and branding
- Advanced analytics and exports
- Priority support
- API access

Upgrade now: https://theqrcode.io/pricing

Best regards,
The TheQRCode.io Team
  `
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #059669, #10b981); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">📊 Your ${data.month} Insights</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Here's how your QR codes performed in ${data.month}:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px; text-align: center;">
                          <h3 style="color: #2563eb; font-size: 36px; margin: 0; font-weight: bold;">${data.scanCount}</h3>
                          <p style="color: #6b7280; margin: 5px 0;">Total Scans</p>
                          <p style="color: ${data.scanGrowth >= 0 ? '#059669' : '#dc2626'}; font-size: 14px; margin: 0; font-weight: bold;">
                            ${data.scanGrowth >= 0 ? '↑' : '↓'} ${Math.abs(data.scanGrowth)}% from last month
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; text-align: center;">
                          <h3 style="color: #2563eb; font-size: 36px; margin: 0; font-weight: bold;">${data.qrCodeCount}</h3>
                          <p style="color: #6b7280; margin: 5px 0;">Active QR Codes</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; text-align: center;">
                          <p style="color: #6b7280; margin: 5px 0; font-weight: bold;">Top Performing QR Code:</p>
                          <p style="color: #374151; margin: 5px 0;">${data.topQrCode}</p>
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
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
Growth: ${data.scanGrowth >= 0 ? '↑' : '↓'} ${Math.abs(data.scanGrowth)}% from last month

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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #7c3aed, #a855f7); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">🚀 New Feature Available!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">Hi ${data.name}! 👋</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
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
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Your Trial Has Ended</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">Hi ${data.name},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Your 14-day ${data.previousPlan} trial has ended. Don't worry - your account is still active on our <strong>Free plan</strong>!
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
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
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                <strong>What's included in the Free plan:</strong>
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Up to 10 QR codes</li>
                <li style="margin-bottom: 8px;">1,000 scans per month</li>
                <li style="margin-bottom: 8px;">Basic analytics</li>
                <li style="margin-bottom: 8px;">URL, Text, WiFi, and Contact QR codes</li>
              </ul>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                <strong>Want to keep your ${data.previousPlan} features?</strong> Upgrade anytime to unlock:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">More QR codes and scans</li>
                <li style="margin-bottom: 8px;">Advanced analytics and exports</li>
                <li style="margin-bottom: 8px;">Custom styling and branding</li>
                <li style="margin-bottom: 8px;">Priority support</li>
                ${data.previousPlan === 'Pro' || data.previousPlan === 'Business' ? '<li style="margin-bottom: 8px;">API access and webhooks</li>' : ''}
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
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
- More QR codes and scans
- Advanced analytics and exports
- Custom styling and branding
- Priority support
${data.previousPlan === 'Pro' || data.previousPlan === 'Business' ? '- API access and webhooks' : ''}

View plans and upgrade: https://theqrcode.io/pricing

Thanks for trying TheQRCode.io! We're here if you need anything.

Best regards,
The TheQRCode.io Team
  `
}

// Re-engagement email for inactive users
export const reEngagementEmail: EmailTemplate = {
  subject: 'We miss you! Come back and create amazing QR codes',
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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">We Miss You! 💙</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">Hi ${data.name},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                We noticed it's been ${data.daysSinceLastLogin} days since you last visited TheQRCode.io. 
                We'd love to have you back!
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Here's what's new since you've been away:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Enhanced analytics dashboard</li>
                <li style="margin-bottom: 8px;">New QR code customization options</li>
                <li style="margin-bottom: 8px;">Improved export features</li>
                <li style="margin-bottom: 8px;">Faster generation speed</li>
              </ul>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://theqrcode.io/dashboard" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: none;">Welcome Back</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                Need help with something? Just reply to this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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

We noticed it's been ${data.daysSinceLastLogin} days since you last visited TheQRCode.io. We'd love to have you back!

Here's what's new since you've been away:
- Enhanced analytics dashboard
- New QR code customization options
- Improved export features
- Faster generation speed

Welcome back: https://theqrcode.io/dashboard

Need help with something? Just reply to this email.

Best regards,
The TheQRCode.io Team
  `
}

export const emailTemplates = {
  welcome: welcomeEmail,
  trialEnding: trialEndingEmail,
  trialExpired: trialExpiredEmail,
  usageInsights: usageInsightsEmail,
  featureAnnouncement: featureAnnouncementEmail,
  reEngagement: reEngagementEmail,
}

