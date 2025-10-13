import { prisma } from './prisma'
import { createTransporter } from './email'

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Create and store OTP token
export async function createOTPToken(email: string): Promise<string> {
  const token = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

  // Invalidate any existing tokens for this email
  await prisma.otpToken.deleteMany({
    where: {
      email: email.toLowerCase(),
    },
  })

  // Create new token
  await prisma.otpToken.create({
    data: {
      email: email.toLowerCase(),
      token,
      expiresAt,
    },
  })

  return token
}

// Verify OTP token
export async function verifyOTPToken(
  email: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  const otpRecord = await prisma.otpToken.findFirst({
    where: {
      email: email.toLowerCase(),
      token,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!otpRecord) {
    return { success: false, message: 'Invalid code' }
  }

  // Check if token is expired
  if (new Date() > otpRecord.expiresAt) {
    return { success: false, message: 'Code has expired' }
  }

  // Check if token has already been used
  if (otpRecord.usedAt) {
    return { success: false, message: 'Code has already been used' }
  }

  // Check attempts (prevent brute force)
  if (otpRecord.attempts >= 5) {
    return { success: false, message: 'Too many attempts. Please request a new code.' }
  }

  // Mark token as used
  await prisma.otpToken.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  })

  return { success: true, message: 'Code verified successfully' }
}

// Increment failed attempts
export async function incrementOTPAttempts(email: string, token: string): Promise<void> {
  await prisma.otpToken.updateMany({
    where: {
      email: email.toLowerCase(),
      token,
    },
    data: {
      attempts: {
        increment: 1,
      },
    },
  })
}

// Send OTP via email
export async function sendOTPEmail(email: string, token: string): Promise<void> {
  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your TheQRCode.io Sign-In Code',
    text: `
Your sign-in code is: ${token}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
The TheQRCode.io Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">TheQRCode.io</h1>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff;">
    <h2 style="color: #374151;">Your Sign-In Code</h2>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Use the code below to sign in to your account:
    </p>
    
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; font-family: 'Courier New', monospace;">
        ${token}
      </div>
    </div>
    
    <p style="color: #4b5563; line-height: 1.6;">
      This code will <strong>expire in 10 minutes</strong>.
    </p>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
      If you didn't request this code, please ignore this email. Your account remains secure.
    </p>
    
    <p style="color: #4b5563; line-height: 1.6; margin-top: 20px;">
      Best regards,<br>
      <strong>The TheQRCode.io Team</strong>
    </p>
  </div>
  
  <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      © 2025 TheQRCode.io. All rights reserved.
    </p>
  </div>
</div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// Clean up expired OTP tokens (should be run periodically)
export async function cleanupExpiredOTPTokens(): Promise<number> {
  const result = await prisma.otpToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  return result.count
}

