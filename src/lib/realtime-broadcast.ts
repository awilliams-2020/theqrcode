// Note: Socket.IO and SSE functionality removed as polling is used instead

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

// Note: SSE broadcast functions removed as polling is used instead

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