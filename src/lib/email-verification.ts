import crypto from 'crypto'
import { prisma } from './prisma'
import { createTransporter, createEmailOptions } from './email'

// Generate email verification token
export async function createEmailVerificationToken(email: string): Promise<string> {
  // Generate secure random token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

  // Delete any existing tokens for this email
  await prisma.emailVerificationToken.deleteMany({
    where: { email: email.toLowerCase() },
  })

  // Create new token
  await prisma.emailVerificationToken.create({
    data: {
      email: email.toLowerCase(),
      token,
      expiresAt,
    },
  })

  return token
}

// Verify email verification token
export async function verifyEmailVerificationToken(
  token: string
): Promise<{ valid: boolean; email?: string; message?: string }> {
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return { valid: false, message: 'Invalid verification link' }
  }

  if (new Date() > verificationToken.expiresAt) {
    return { valid: false, message: 'Verification link has expired' }
  }

  if (verificationToken.usedAt) {
    return { valid: false, message: 'Verification link has already been used' }
  }

  return { valid: true, email: verificationToken.email }
}

// Mark email verification token as used
export async function markEmailVerificationTokenUsed(token: string): Promise<void> {
  await prisma.emailVerificationToken.update({
    where: { token },
    data: { usedAt: new Date() },
  })
}

// Send email verification email
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const transporter = createTransporter()
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  const mailOptions = createEmailOptions({
    to: email,
    subject: 'Verify Your Email - TheQRCode.io',
    text: `
Welcome to TheQRCode.io!

Please verify your email address by clicking the link below:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with TheQRCode.io, you can safely ignore this email.

Best regards,
The TheQRCode.io Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">TheQRCode.io</h1>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #374151; margin-top: 0;">Verify Your Email Address</h2>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Welcome to TheQRCode.io! Please verify your email address to get started.
    </p>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Click the button below to verify your email:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Verify Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #2563eb; font-size: 12px; word-break: break-all;">
      ${verificationUrl}
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        This link will <strong>expire in 24 hours</strong>.
      </p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        If you didn't create an account with TheQRCode.io, you can safely ignore this email.
      </p>
    </div>
    
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
  })

  await transporter.sendMail(mailOptions)
}

// Clean up expired email verification tokens
export async function cleanupExpiredEmailVerificationTokens(): Promise<number> {
  const result = await prisma.emailVerificationToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  return result.count
}

