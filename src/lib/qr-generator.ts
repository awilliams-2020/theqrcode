import QRCode from 'qrcode'
import { QRCodeOptions, WiFiConfig, ContactConfig } from '@/types'

export type { QRCodeOptions, WiFiConfig, ContactConfig }

export class QRGenerator {
  static async generateQRCode(options: QRCodeOptions): Promise<string> {
    const { type, content, size = 256, color = {}, frame, logo } = options
    
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
    const errorCorrectionLevel = logo ? 'H' : 'M'
    
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
      
      // Apply logo if provided
      if (logo) {
        qrDataURL = await this.addLogoToQR(qrDataURL, logo)
      }
      
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
      address
    } = config
    
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'
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
  
  static async generateSVG(options: QRCodeOptions): Promise<string> {
    const { type, content, size = 256, color = {}, frame, logo } = options
    
    let qrContent = content
    if (type === 'wifi') {
      const wifiConfig: WiFiConfig = JSON.parse(content)
      qrContent = this.formatWiFiQR(wifiConfig)
    } else if (type === 'contact') {
      const contactConfig: ContactConfig = JSON.parse(content)
      qrContent = this.formatContactQR(contactConfig)
    }
    
    // Higher error correction level if logo is present
    const errorCorrectionLevel = logo ? 'H' : 'M'
    
    const qrOptions = {
      width: size,
      margin: 2,
      color: {
        dark: color.dark || '#000000',
        light: color.light || '#FFFFFF'
      },
      errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
    }
    
    let svgString = await QRCode.toString(qrContent, { ...qrOptions, type: 'svg' })
    
    // Apply frame if provided
    if (frame && frame.style !== 'square') {
      svgString = this.addFrameToSVG(svgString, frame, size)
    }
    
    return svgString
  }


  private static async addLogoToQR(qrDataURL: string, logo: { file: File; size?: number }): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      const qrImage = new Image()
      qrImage.onload = () => {
        canvas.width = qrImage.width
        canvas.height = qrImage.height
        
        // Draw QR code
        ctx.drawImage(qrImage, 0, 0)
        
        // Load and draw logo
        const logoImage = new Image()
        logoImage.onload = () => {
          const logoSize = logo.size || Math.min(qrImage.width * 0.25, 64)
          const logoX = (qrImage.width - logoSize) / 2
          const logoY = (qrImage.height - logoSize) / 2
          
          // Draw white background for logo
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8)
          
          // Draw logo
          ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
          
          resolve(canvas.toDataURL())
        }
        logoImage.onerror = () => reject(new Error('Failed to load logo'))
        
        // Convert file to data URL
        const reader = new FileReader()
        reader.onload = (e) => {
          logoImage.src = e.target?.result as string
        }
        reader.onerror = () => reject(new Error('Failed to read logo file'))
        reader.readAsDataURL(logo.file)
      }
      qrImage.onerror = () => reject(new Error('Failed to load QR code'))
      qrImage.src = qrDataURL
    })
  }

  private static async addFrameToQR(qrDataURL: string, frame: { style?: string; color?: string; size?: number }, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      // Increase canvas size to accommodate frame
      const frameSize = frame?.size || 20
      canvas.width = size + (frameSize * 2)
      canvas.height = size + (frameSize * 2)
      
      const qrImage = new Image()
      qrImage.onload = () => {
        // Draw frame background
        ctx.fillStyle = frame.color || '#000000'
        
        switch (frame.style) {
          case 'rounded':
            this.drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, frameSize)
            ctx.fill()
            break
          case 'circle':
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI)
            ctx.fill()
            break
          case 'dashed':
            ctx.setLineDash([10, 5])
            ctx.lineWidth = frameSize
            ctx.strokeStyle = frame.color || '#000000'
            ctx.strokeRect(frameSize / 2, frameSize / 2, canvas.width - frameSize, canvas.height - frameSize)
            break
          default:
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        // For circular frames, we need to clip the QR code to fit within the circle
        if (frame.style === 'circle') {
          // Save the current state
          ctx.save()
          
          // Create a circular clipping path with adaptive radius for scannability
          ctx.beginPath()
          // Use very conservative clipping to preserve quiet zone and ensure scannability
          const clippingFactor = frameSize < 15 ? 0.1 : 0.2
          const clipRadius = (canvas.width / 2) - (frameSize * clippingFactor)
          ctx.arc(canvas.width / 2, canvas.height / 2, clipRadius, 0, 2 * Math.PI)
          ctx.clip()
          
          // Draw QR code in center
          ctx.drawImage(qrImage, frameSize, frameSize, size, size)
          
          // Restore the state
          ctx.restore()
        } else {
          // Draw QR code in center for non-circular frames
          ctx.drawImage(qrImage, frameSize, frameSize, size, size)
        }
        
        resolve(canvas.toDataURL())
      }
      qrImage.onerror = () => reject(new Error('Failed to load QR code'))
      qrImage.src = qrDataURL
    })
  }

  private static addFrameToSVG(svgString: string, frame: { style?: string; color?: string; size?: number }, size: number): string {
    const frameSize = frame?.size || 20
    const totalSize = size + (frameSize * 2)
    
    let frameElement = ''
    let clipPath = ''
    
    switch (frame.style) {
      case 'rounded':
        frameElement = `<rect x="0" y="0" width="${totalSize}" height="${totalSize}" rx="${frameSize}" ry="${frameSize}" fill="${frame.color || '#000000'}" />`
        break
      case 'circle':
        frameElement = `<circle cx="${totalSize / 2}" cy="${totalSize / 2}" r="${totalSize / 2}" fill="${frame.color || '#000000'}" />`
        // Add circular clipping path for QR code with more generous radius
        // Use very conservative clipping to preserve quiet zone and ensure scannability
        const clippingFactor = frameSize < 15 ? 0.1 : 0.2
        const clipRadius = (totalSize / 2) - (frameSize * clippingFactor)
        clipPath = `<defs><clipPath id="qrClip"><circle cx="${totalSize / 2}" cy="${totalSize / 2}" r="${clipRadius}" /></clipPath></defs>`
        break
      case 'dashed':
        frameElement = `<rect x="${frameSize / 2}" y="${frameSize / 2}" width="${totalSize - frameSize}" height="${totalSize - frameSize}" fill="none" stroke="${frame.color || '#000000'}" stroke-width="${frameSize}" stroke-dasharray="10,5" />`
        break
      default:
        frameElement = `<rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="${frame.color || '#000000'}" />`
    }
    
    // Update SVG dimensions and add frame
    let updatedSvg = svgString
      .replace(/width="[^"]*"/, `width="${totalSize}"`)
      .replace(/height="[^"]*"/, `height="${totalSize}"`)
      .replace(/viewBox="[^"]*"/, `viewBox="0 0 ${totalSize} ${totalSize}"`)
      .replace('<svg', `<svg>${clipPath}${frameElement}<g transform="translate(${frameSize}, ${frameSize})"${frame.style === 'circle' ? ' clip-path="url(#qrClip)"' : ''}>`)
      .replace('</svg>', '</g></svg>')
    
    return updatedSvg
  }

  private static drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

}
