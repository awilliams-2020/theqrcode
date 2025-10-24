import QRCode from 'qrcode'
import sharp from 'sharp'

export interface QRCodeOptions {
  type: 'url' | 'text' | 'wifi' | 'contact' | 'email'
  content: string
  size?: number
  color?: {
    dark?: string
    light?: string
  }
  frame?: {
    style?: 'square' | 'rounded' | 'circle' | 'dashed'
    color?: string
    size?: number
  }
  logo?: {
    file: File
    size?: number
  }
}

export interface WiFiConfig {
  ssid: string
  password: string
  security: 'WPA' | 'WPA2' | 'WEP' | 'nopass'
  hidden?: boolean
}

export interface ContactConfig {
  firstName?: string
  lastName?: string
  organization?: string
  phone: string // Required field
  email?: string
  url?: string
  website?: string
  title?: string
  address?: string
}

export class QRGeneratorServer {
  static async generateQRCode(options: QRCodeOptions): Promise<string> {
    const { type, content, size = 256, color = {}, frame } = options
    
    let qrContent = content
    
    // Format content based on type
    switch (type) {
      case 'wifi':
        // Check if content is JSON or a URL
        if (content.startsWith('http')) {
          qrContent = content // Use URL directly for dynamic QR codes
        } else {
          const wifiConfig: WiFiConfig = JSON.parse(content)
          qrContent = this.formatWiFiQR(wifiConfig)
        }
        break
      case 'contact':
        // Check if content is JSON or a URL
        if (content.startsWith('http')) {
          qrContent = content // Use URL directly for dynamic QR codes
        } else {
          const contactConfig: ContactConfig = JSON.parse(content)
          qrContent = this.formatContactQR(contactConfig)
        }
        break
      case 'email':
        qrContent = content.startsWith('http') ? content : `mailto:${content}`
        break
      case 'url':
        qrContent = content.startsWith('http') ? content : `https://${content}`
        break
      default:
        qrContent = content
    }
    
    // Higher error correction level if logo is present
    const errorCorrectionLevel = options.logo ? 'H' : 'M'
    
    const qrOptions = {
      width: size,
      margin: 2,
      color: {
        dark: color.dark || '#000000',
        light: color.light || '#FFFFFF'
      },
      errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
    }
    
    try {
      let qrDataURL = await QRCode.toDataURL(qrContent, qrOptions)
      
      // Apply frame if provided
      if (frame && frame.style !== 'square') {
        qrDataURL = await this.addFrameToQR(qrDataURL, frame, size)
      }
      
      return qrDataURL
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`)
    }
  }
  
  static formatWiFiQR(config: WiFiConfig): string {
    const { ssid, password, security, hidden = false } = config
    const hiddenFlag = hidden ? 'H:true' : 'H:false'
    return `WIFI:T:${security};S:${ssid};P:${password};${hiddenFlag};;`
  }
  
  static formatContactQR(config: ContactConfig): string {
    const {
      firstName,
      lastName,
      organization,
      phone,
      email,
      url,
      website,
      title,
      address
    } = config
    
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'
    
    // Name fields
    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    if (fullName) {
      vcard += `FN:${fullName}\n`
      vcard += `N:${lastName || ''};${firstName || ''};;;\n`
    }
    
    if (organization) vcard += `ORG:${organization}\n`
    if (title) vcard += `TITLE:${title}\n`
    if (phone) vcard += `TEL:${phone}\n`
    if (email) vcard += `EMAIL:${email}\n`
    if (website) vcard += `URL:${website}\n`
    if (url) vcard += `URL:${url}\n` // Support legacy field
    if (address) vcard += `ADR:;;${address};;;;\n`
    
    vcard += 'END:VCARD'
    return vcard
  }
  
  static async generateSVG(options: QRCodeOptions): Promise<string> {
    const { type, content, size = 256, color = {} } = options
    
    let qrContent = content
    if (type === 'wifi') {
      const wifiConfig: WiFiConfig = JSON.parse(content)
      qrContent = this.formatWiFiQR(wifiConfig)
    } else if (type === 'contact') {
      const contactConfig: ContactConfig = JSON.parse(content)
      qrContent = this.formatContactQR(contactConfig)
    }
    
    // Higher error correction level if logo is present
    const errorCorrectionLevel = options.logo ? 'H' : 'M'
    
    const qrOptions = {
      width: size,
      margin: 2,
      color: {
        dark: color.dark || '#000000',
        light: color.light || '#FFFFFF'
      },
      errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
    }
    
    const svgString = await QRCode.toString(qrContent, { ...qrOptions, type: 'svg' })
    
    return svgString
  }


  private static async addFrameToQR(qrDataURL: string, frame: { style?: string; color?: string; size?: number }, size: number): Promise<string> {
    try {
      // Convert data URL to buffer
      const base64Data = qrDataURL.split(',')[1]
      const qrBuffer = Buffer.from(base64Data, 'base64')
      
      // Frame size - use dynamic size from frame options
      const frameSize = frame?.size || 20
      const totalSize = size + (frameSize * 2)
      
      // Create frame background first (match client-side approach exactly)
      let frameBuffer: Buffer
      
      switch (frame.style) {
        case 'rounded':
          frameBuffer = await this.createRoundedFrame(totalSize, frame.color || '#000000', frameSize)
          break
        case 'circle':
          frameBuffer = await this.createCircularFrame(totalSize, frame.color || '#000000')
          break
        case 'dashed':
          frameBuffer = await this.createDashedFrame(totalSize, frame.color || '#000000', frameSize)
          break
        default:
          frameBuffer = await this.createSquareFrame(totalSize, frame.color || '#000000')
      }
      
      // Handle circular frames with clipping (match client-side logic exactly)
      if (frame.style === 'circle') {
        // Create circular mask for QR code - match client-side logic exactly
        const maskSize = size // QR code size
        // Use very conservative clipping to preserve quiet zone and ensure scannability
        const clippingFactor = frameSize < 15 ? 0.1 : 0.2
        const maskRadius = (totalSize / 2) - (frameSize * clippingFactor)
        const mask = await sharp({
          create: {
            width: maskSize,
            height: maskSize,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        })
        .composite([{
          input: Buffer.from(`
            <svg width="${maskSize}" height="${maskSize}">
              <circle cx="${maskSize/2}" cy="${maskSize/2}" r="${maskRadius}" fill="white"/>
            </svg>
          `),
          left: 0,
          top: 0
        }])
        .png()
        .toBuffer()
        
        // Apply mask to QR code
        const maskedQR = await sharp(qrBuffer)
          .composite([{
            input: mask,
            blend: 'dest-in'
          }])
          .png()
          .toBuffer()
        
        // Composite masked QR code onto circular frame
        const result = await sharp(frameBuffer)
          .composite([{
            input: maskedQR,
            left: frameSize,
            top: frameSize
          }])
          .png()
          .toBuffer()
        
        return `data:image/png;base64,${result.toString('base64')}`
      }
      
      // Handle other frame styles (non-circular)
      // Composite QR code onto frame
      const result = await sharp(frameBuffer)
        .composite([{
          input: qrBuffer,
          left: frameSize,
          top: frameSize
        }])
        .png()
        .toBuffer()
      
      // Convert back to data URL
      return `data:image/png;base64,${result.toString('base64')}`
    } catch (error) {
      console.error('Error adding frame to QR code:', error)
      return qrDataURL // Return original if frame fails
    }
  }

  private static async createSquareFrame(size: number, color: string): Promise<Buffer> {
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: this.hexToRgba(color)
      }
    }).png().toBuffer()
  }

  private static async createRoundedFrame(size: number, color: string, radius: number): Promise<Buffer> {
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: Buffer.from(`
        <svg width="${size}" height="${size}">
          <rect x="0" y="0" width="${size}" height="${size}" 
                rx="${radius}" ry="${radius}" fill="${color}"/>
        </svg>
      `),
      left: 0,
      top: 0
    }])
    .png()
    .toBuffer()
  }

  private static async createCircularFrame(size: number, color: string): Promise<Buffer> {
    // Match client-side: ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI)
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: Buffer.from(`
        <svg width="${size}" height="${size}">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
        </svg>
      `),
      left: 0,
      top: 0
    }])
    .png()
    .toBuffer()
  }

  private static async createDashedFrame(size: number, color: string, frameSize: number): Promise<Buffer> {
    // Match client-side dashed implementation exactly
    // Client-side: ctx.strokeRect(frameSize / 2, frameSize / 2, canvas.width - frameSize, canvas.height - frameSize)
    // Client-side: ctx.setLineDash([10, 5]) and ctx.lineWidth = frameSize
    const dashLength = 10
    const gapLength = 5
    
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: Buffer.from(`
        <svg width="${size}" height="${size}">
          <rect x="${frameSize/2}" y="${frameSize/2}" 
                width="${size - frameSize}" height="${size - frameSize}" 
                fill="none" stroke="${color}" stroke-width="${frameSize}" 
                stroke-dasharray="${dashLength},${gapLength}"/>
        </svg>
      `),
      left: 0,
      top: 0
    }])
    .png()
    .toBuffer()
  }

  private static hexToRgba(hex: string): { r: number; g: number; b: number; alpha: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) {
      return { r: 0, g: 0, b: 0, alpha: 1 }
    }
    
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      alpha: 1
    }
  }
}
