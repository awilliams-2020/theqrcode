export interface RealtimeScanData {
  id: string
  qrCodeId: string
  qrCodeName: string
  qrCodeType: string
  timestamp: Date
  location: {
    country: string
    city: string
  }
  device: {
    type: string
    browser: string
    os: string
  }
  userId: string
}

// Broadcast scan data to user's SSE connection
export async function broadcastScan(userId: string, scanData: RealtimeScanData) {
  try {
    if (global.sseConnections && global.sseConnections.has(userId)) {
      const connection = global.sseConnections.get(userId)
      if (connection) {
        connection.sendMessage({
          type: 'scan',
          data: scanData,
          timestamp: new Date()
        })
        console.log(`Broadcasted scan to user ${userId}:`, scanData.qrCodeName)
      }
    } else {
      console.log(`No SSE connection found for user ${userId}`)
    }
  } catch (error) {
    console.error('Error broadcasting scan:', error)
  }
}

// Broadcast analytics update to user's SSE connection
export async function broadcastAnalyticsUpdate(userId: string, updateData: any) {
  try {
    if (global.sseConnections && global.sseConnections.has(userId)) {
      const connection = global.sseConnections.get(userId)
      if (connection) {
        connection.sendMessage({
          type: 'analytics_update',
          data: updateData,
          timestamp: new Date()
        })
        console.log(`Broadcasted analytics update to user ${userId}`)
      }
    }
  } catch (error) {
    console.error('Error broadcasting analytics update:', error)
  }
}

// Broadcast to all connected users (for QR code updates)
export async function broadcastToQRCode(qrCodeId: string, data: any) {
  try {
    // For now, we'll broadcast to all connected users
    // In a more complex scenario, you'd track which users are viewing which QR codes
    if (global.sseConnections) {
      global.sseConnections.forEach((connection, userId) => {
        connection.sendMessage({
          type: 'qr_update',
          data,
          timestamp: new Date()
        })
      })
      console.log(`Broadcasted to all connected users for QR code ${qrCodeId}`)
    }
  } catch (error) {
    console.error('Error broadcasting to QR code:', error)
  }
}

// Create scan data for broadcasting
export function createScanData(
  scanId: string,
  qrCode: any,
  scanRecord: any,
  deviceInfo: any,
  locationInfo: any
): RealtimeScanData {
  return {
    id: scanId,
    qrCodeId: qrCode.id,
    qrCodeName: qrCode.name,
    qrCodeType: qrCode.type,
    timestamp: new Date(scanRecord.scannedAt),
    location: {
      country: locationInfo.country || 'Unknown',
      city: locationInfo.city || 'Unknown'
    },
    device: {
      type: deviceInfo.type || 'unknown',
      browser: deviceInfo.browser || 'unknown',
      os: deviceInfo.os || 'unknown'
    },
    userId: qrCode.userId
  }
}