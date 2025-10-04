// API utility functions to reduce code duplication

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function createQRCode(qrData: any): Promise<ApiResponse> {
  return apiRequest('/api/qr-codes', {
    method: 'POST',
    body: JSON.stringify(qrData),
  })
}

export async function updateQRCode(id: string, qrData: any): Promise<ApiResponse> {
  return apiRequest(`/api/qr-codes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(qrData),
  })
}

export async function deleteQRCode(id: string): Promise<ApiResponse> {
  return apiRequest(`/api/qr-codes/${id}`, {
    method: 'DELETE',
  })
}

export async function getQRCodes(): Promise<ApiResponse> {
  return apiRequest('/api/qr-codes')
}
