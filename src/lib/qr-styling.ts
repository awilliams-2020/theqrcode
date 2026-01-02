import { QRStylingOptions } from '@/types'
// @ts-ignore - qr-code-styling doesn't have perfect TypeScript definitions
import QRCodeStyling from 'qr-code-styling'

export class QRStyleRenderer {
  static async generateStyledQRCode(
    content: string,
    styling: QRStylingOptions | undefined,
    size: number,
    color: { dark: string; light: string },
    logo?: { file: File; size?: number; dataUrl?: string }
  ): Promise<string> {
    const config: any = {
      width: size,
      height: size,
      data: content,
      margin: 10,
      qrOptions: {
        errorCorrectionLevel: logo ? 'H' : 'M'
      },
      dotsOptions: {
        color: color.dark,
        type: styling?.dotsType || "rounded"
      },
      cornersSquareOptions: {
        color: color.dark,
        type: styling?.cornersSquareType || "extra-rounded"
      },
      cornersDotOptions: {
        color: color.dark,
        type: styling?.cornersDotType || "dot"
      }
    }

    // Handle background styling
    if (styling?.backgroundType === 'linear-gradient' && styling.gradientColorStops && styling.gradientColorStops.length >= 2) {
      config.backgroundOptions = {
        color: color.light,
        gradient: {
          type: 'linear',
          rotation: styling.gradientDirection || 0,
          colorStops: styling.gradientColorStops
        }
      }
    } else if (styling?.backgroundType === 'radial-gradient' && styling.gradientColorStops && styling.gradientColorStops.length >= 2) {
      config.backgroundOptions = {
        color: color.light,
        gradient: {
          type: 'radial',
          rotation: styling.gradientDirection || 0,
          colorStops: styling.gradientColorStops
        }
      }
    } else {
      config.backgroundOptions = {
        color: color.light
      }
    }

    // Add logo if provided - ensure image is loaded before generating QR code
    if (logo) {
      // If we have a dataUrl (from persisted data), use it directly
      // Otherwise, convert the file to a dataUrl
      const logoDataURL = logo.dataUrl || await this.fileToDataURL(logo.file)
      
      // Preload the image to ensure it's fully loaded before generating QR code
      await this.preloadImage(logoDataURL)
      
      config.image = logoDataURL
      config.imageOptions = {
        hideBackgroundDots: true,
        imageSize: 0.4, // Use ratio instead of pixels (40% of QR code size)
        margin: 5
      }
    }

    const qrCode = new QRCodeStyling(config)
    return this.qrCodeToDataURL(qrCode, !!logo)
  }

  private static async qrCodeToDataURL(qrCode: any, hasLogo: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create a container div (qr-code-styling requires a container, not a canvas)
        const container = document.createElement('div')
        container.style.position = 'absolute'
        container.style.left = '-9999px'
        container.style.top = '0'
        
        // Attach to DOM (required for qr-code-styling to render properly)
        document.body.appendChild(container)
        
        // Append QR code to the container
        qrCode.append(container)
        
        let lastDataURL = ''
        let stableCount = 0
        const requiredStableChecks = hasLogo ? 3 : 2 // Need more stable checks with logo
        
        // Function to check if QR code is ready
        const checkQRCodeReady = () => {
          try {
            // Get the canvas element that was created by qr-code-styling
            const canvas = container.querySelector('canvas')
            
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
              return false
            }
            
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL('image/png')
            
            // Verify data URL is valid
            if (!dataURL || dataURL === 'data:,' || dataURL.length < 100) {
              return false
            }
            
            // Ensure the canvas content is stable (rendered consistently)
            // This prevents premature resolution, especially on route changes
            if (dataURL === lastDataURL) {
              stableCount++
              if (stableCount >= requiredStableChecks) {
                // Content is stable, QR code is ready
                document.body.removeChild(container)
                resolve(dataURL)
                return true
              }
            } else {
              // Content changed, reset stability counter
              stableCount = 0
              lastDataURL = dataURL
            }
            return false
          } catch (error) {
            if (document.body.contains(container)) {
              document.body.removeChild(container)
            }
            reject(error)
            return true
          }
        }
        
        // Use polling with appropriate intervals
        let attempts = 0
        const maxAttempts = hasLogo ? 150 : 60 // More attempts if logo is present
        const checkInterval = hasLogo ? 50 : 30 // Check more frequently with logo
        
        const checkLoop = () => {
          attempts++
          
          if (checkQRCodeReady()) {
            return // Success, already resolved/rejected
          }
          
          if (attempts >= maxAttempts) {
            // Final attempt after timeout
            setTimeout(() => {
              if (!checkQRCodeReady()) {
                if (document.body.contains(container)) {
                  document.body.removeChild(container)
                }
                reject(new Error('QR code generation timeout - image may not have loaded properly'))
              }
            }, 500)
            return
          }
          
          setTimeout(checkLoop, checkInterval)
        }
        
        // Start checking after initial render delay (longer for logos)
        setTimeout(checkLoop, hasLogo ? 150 : 50)
      } catch (error) {
        reject(error)
      }
    })
  }
  
  private static async preloadImage(dataUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load logo image'))
      img.src = dataUrl
    })
  }

  private static async fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }
}
