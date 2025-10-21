import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { createTransporter, createEmailOptions } from './email'
import crypto from 'crypto'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Password must be less than 128 characters' }
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  
  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter' }
  }
  
  return { valid: true }
}

// Generate password reset token
export async function createPasswordResetToken(email: string): Promise<string> {
  // Generate secure random token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email: email.toLowerCase() },
  })

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      email: email.toLowerCase(),
      token,
      expiresAt,
    },
  })

  return token
}

// Verify password reset token
export async function verifyPasswordResetToken(
  token: string
): Promise<{ valid: boolean; email?: string; message?: string }> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
    return { valid: false, message: 'Invalid reset link' }
  }

  if (new Date() > resetToken.expiresAt) {
    return { valid: false, message: 'Reset link has expired' }
  }

  if (resetToken.usedAt) {
    return { valid: false, message: 'Reset link has already been used' }
  }

  return { valid: true, email: resetToken.email }
}

// Mark password reset token as used
export async function markPasswordResetTokenUsed(token: string): Promise<void> {
  await prisma.passwordResetToken.update({
    where: { token },
    data: { usedAt: new Date() },
  })
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const transporter = createTransporter()
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  const mailOptions = createEmailOptions({
    to: email,
    subject: 'Reset Your Password - TheQRCode.io',
    text: `
You requested to reset your password for TheQRCode.io.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email and your password will remain unchanged.

Best regards,
The TheQRCode.io Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">TheQRCode.io</h1>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #374151; margin-top: 0;">Reset Your Password</h2>
    
    <p style="color: #4b5563; line-height: 1.6;">
      You requested to reset your password for your TheQRCode.io account.
    </p>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #2563eb; font-size: 12px; word-break: break-all;">
      ${resetUrl}
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        This link will <strong>expire in 1 hour</strong>.
      </p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
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

// Clean up expired password reset tokens
export async function cleanupExpiredPasswordResetTokens(): Promise<number> {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  return result.count
}

