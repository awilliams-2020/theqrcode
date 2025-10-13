import nodemailer from 'nodemailer'

// Create reusable transporter
export const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '465')
  const config = {
    host: process.env.SMTP_HOST || 'mail.redbudway.com',
    port: port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
  }

  return nodemailer.createTransport(config)
}

// Email template for contact form submissions
export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  newsletter: boolean
}

export const sendContactEmail = async (data: ContactFormData) => {
  const transporter = createTransporter()
  
  const subjectLabels: Record<string, string> = {
    general: 'General Question',
    technical: 'Technical Support',
    billing: 'Billing Question',
    feature: 'Feature Request',
    bug: 'Bug Report',
    partnership: 'Partnership Inquiry',
  }

  const subjectLabel = subjectLabels[data.subject] || data.subject

  // Email to support team
  const supportEmail = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || 'support@theqrcode.io',
    replyTo: data.email,
    subject: `Contact Form: ${subjectLabel} - ${data.firstName} ${data.lastName}`,
    text: `
New contact form submission:

From: ${data.firstName} ${data.lastName}
Email: ${data.email}
Subject: ${subjectLabel}
Newsletter: ${data.newsletter ? 'Yes' : 'No'}

Message:
${data.message}
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">New Contact Form Submission</h2>
  
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>From:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Subject:</strong> ${subjectLabel}</p>
    <p><strong>Newsletter:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #374151;">Message:</h3>
    <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <p style="color: #6b7280; font-size: 12px;">
    This email was sent from the TheQRCode.io contact form.
  </p>
</div>
    `,
  }

  // Auto-reply to user
  const userEmail = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: data.email,
    subject: 'Thanks for contacting TheQRCode.io',
    text: `
Hi ${data.firstName},

Thank you for contacting TheQRCode.io! We've received your message regarding "${subjectLabel}" and will get back to you as soon as possible.

Our typical response time is within 24 hours during business days. If your inquiry is urgent, you may also reach us through live chat in your dashboard.

Your message:
${data.message}

Best regards,
The TheQRCode.io Support Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">TheQRCode.io</h1>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff;">
    <h2 style="color: #374151;">Hi ${data.firstName},</h2>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Thank you for contacting TheQRCode.io! We've received your message regarding 
      <strong>"${subjectLabel}"</strong> and will get back to you as soon as possible.
    </p>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Our typical response time is within <strong>24 hours</strong> during business days. 
      If your inquiry is urgent, you may also reach us through live chat in your dashboard.
    </p>
    
    <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid #2563eb; margin: 25px 0;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-weight: bold;">Your message:</p>
      <p style="color: #374151; white-space: pre-wrap; line-height: 1.6; margin: 0;">${data.message}</p>
    </div>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Best regards,<br>
      <strong>The TheQRCode.io Support Team</strong>
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

  // Send both emails
  await Promise.all([
    transporter.sendMail(supportEmail),
    transporter.sendMail(userEmail),
  ])
}

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { success: true, message: 'Email connection verified' }
  } catch (error) {
    console.error('Email connection test failed:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

