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

    // Add logo if provided
    if (logo) {
      // If we have a dataUrl (from persisted data), use it directly
      // Otherwise, convert the file to a dataUrl
      const logoDataURL = logo.dataUrl || await this.fileToDataURL(logo.file)
      config.image = logoDataURL
      config.imageOptions = {
        hideBackgroundDots: true,
        imageSize: 0.4, // Use ratio instead of pixels (40% of QR code size)
        margin: 5
      }
    }

    const qrCode = new QRCodeStyling(config)
    return this.qrCodeToDataURL(qrCode)
  }

  private static async qrCodeToDataURL(qrCode: any): Promise<string> {
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
        
        // Wait for the QR code to be drawn (especially important for images)
        setTimeout(() => {
          try {
            // Get the canvas element that was created by qr-code-styling
            const canvas = container.querySelector('canvas')
            
            if (!canvas) {
              document.body.removeChild(container)
              reject(new Error('Canvas element not found'))
              return
            }
            
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL('image/png')
            
            // Clean up
            document.body.removeChild(container)
            
            if (!dataURL || dataURL === 'data:,' || dataURL.length < 100) {
              reject(new Error('Failed to generate QR code image'))
              return
            }
            
            resolve(dataURL)
          } catch (error) {
            if (document.body.contains(container)) {
              document.body.removeChild(container)
            }
            reject(error)
          }
        }, 500) // Wait for rendering to complete including logo
      } catch (error) {
        reject(error)
      }
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
