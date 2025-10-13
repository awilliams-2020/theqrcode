interface LocationData {
  country: string | null
  city: string | null
  region: string | null
  timezone: string | null
}

export class LocationService {
  private static readonly IPINFO_API_KEY = process.env.IPINFO_API_KEY
  private static readonly IPINFO_BASE_URL = 'https://ipinfo.io'

  /**
   * Get location data from IP address
   */
  static async getLocationFromIP(ipAddress: string): Promise<LocationData> {
    // Skip local/private IPs
    if (this.isPrivateIP(ipAddress)) {
      return {
        country: null,
        city: null,
        region: null,
        timezone: null
      }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(
        `${this.IPINFO_BASE_URL}/${ipAddress}/json${this.IPINFO_API_KEY ? `?token=${this.IPINFO_API_KEY}` : ''}`,
        {
          headers: {
            'User-Agent': 'QR-Analytics/1.0'
          },
          signal: controller.signal
        }
      )
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      return {
        country: data.country || null,
        city: data.city || null,
        region: data.region || null,
        timezone: data.timezone || null
      }
    } catch (error) {
      console.warn('Failed to get location from IP:', error)
      return {
        country: null,
        city: null,
        region: null,
        timezone: null
      }
    }
  }

  /**
   * Check if IP address is private/local
   */
  private static isPrivateIP(ip: string): boolean {
    // Remove IPv6 prefix if present
    const cleanIP = ip.replace(/^::ffff:/, '')
    
    // Check for localhost
    if (cleanIP === '127.0.0.1' || cleanIP === 'localhost') {
      return true
    }

    // Check for private IPv4 ranges
    const privateRanges = [
      /^10\./,                    // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./,               // 192.168.0.0/16
      /^169\.254\./,              // Link-local
      /^0\./,                     // Invalid/unknown
    ]

    return privateRanges.some(range => range.test(cleanIP))
  }

  /**
   * Get a fallback location based on common patterns
   */
  static getFallbackLocation(): LocationData {
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      timezone: null
    }
  }
}
