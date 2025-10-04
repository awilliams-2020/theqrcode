import { prisma } from './prisma'

export class URLShortener {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
  private static readonly SHORT_URL_PREFIX = '/r/'
  
  static getBaseUrl() {
    return this.BASE_URL
  }

  /**
   * Generate a unique short URL for a QR code
   */
  static async generateShortUrl(qrCodeId: string): Promise<string> {
    // Generate a unique short code
    const shortCode = this.generateShortCode()
    
    // Ensure the short code is unique
    const existingQR = await prisma.qrCode.findFirst({
      where: { shortUrl: { contains: shortCode } }
    })
    
    if (existingQR) {
      // If collision, generate a new one
      return this.generateShortUrl(qrCodeId)
    }
    
    const shortUrl = `${this.BASE_URL}${this.SHORT_URL_PREFIX}${shortCode}`
    return shortUrl
  }

  /**
   * Generate a random short code
   */
  private static generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    
    // Generate 8-character code
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  /**
   * Extract short code from URL
   */
  static extractShortCode(url: string): string | null {
    const match = url.match(new RegExp(`${this.SHORT_URL_PREFIX}([a-zA-Z0-9]+)$`))
    return match ? match[1] : null
  }

  /**
   * Get the full short URL from a short code
   */
  static getFullShortUrl(shortCode: string): string {
    return `${this.BASE_URL}${this.SHORT_URL_PREFIX}${shortCode}`
  }
}
