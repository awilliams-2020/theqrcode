// Shared types for the application

export interface QRCode {
  id: string
  name: string
  type: string
  content: string
  shortUrl?: string
  settings: Record<string, unknown>
  isDynamic: boolean
  createdAt: Date
  scans: Array<{
    id: string
    scannedAt: Date
    device?: string
    country?: string
  }>
}

export interface QRCodeFormData {
  id?: string
  name: string
  type: string
  content: string
  shortUrl?: string
  settings: Record<string, unknown>
  isDynamic: boolean
}

export interface Subscription {
  id: string
  plan: string
  status: string
  trialEndsAt?: Date | null
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
}

export interface PlanLimits {
  qrCodes: number
  scans: number
}

export interface DashboardProps {
  qrCodes: QRCode[]
  subscription: Subscription | null
  totalScans: number
  limits: PlanLimits
  currentPlan: string
  isTrialActive?: boolean
  planDisplayName?: string
  isAdmin?: boolean
}

export interface QRCodeCardProps {
  qr: QRCode
  onEdit: () => void
  onDelete: () => void
}

export interface QRGeneratorModalProps {
  qrCode?: QRCode | null
  onSave: (qrData: QRCodeFormData) => void
  onCancel: () => void
  currentPlan?: string
  isTrialActive?: boolean
}

export interface WiFiConfig {
  ssid: string
  password: string
  security: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}

export interface ContactConfig {
  firstName: string
  lastName: string
  organization?: string
  phone?: string
  email?: string
  url?: string
  address?: string
}

export interface QRCodeOptions {
  type: 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'menu'
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

export interface MenuItem {
  id: string
  name: string
  description?: string
  price?: string
  category: string
  image?: string
  available: boolean
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export interface MenuData {
  restaurantName: string
  description?: string
  categories: MenuCategory[]
  theme?: {
    primaryColor?: string
    secondaryColor?: string
  }
}

export type PlanType = 'free' | 'starter' | 'pro' | 'business'
export type QRCodeType = 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'menu'
export type FrameStyle = 'square' | 'rounded' | 'circle' | 'dashed'
