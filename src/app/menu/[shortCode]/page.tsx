'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Utensils, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { MenuData, MenuCategory, MenuItem } from '@/types'

interface PageProps {
  params: Promise<{
    shortCode: string
  }>
}

export default function MenuDisplayPage({ params }: PageProps) {
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const { shortCode } = await params
        
        // Track the scan with deduplication
        const SESSION_KEY = `qr_scans_${shortCode}`
        const REFRESH_DETECTION_KEY = `qr_refresh_${shortCode}`
        const DEDUP_WINDOW = 120000 // 2 minutes
        const REFRESH_WINDOW = 30000 // 30 seconds
        
        // Check if this is likely a page refresh
        const lastPageLoad = sessionStorage.getItem(REFRESH_DETECTION_KEY)
        const now = Date.now()
        
        // Create a simple fingerprint
        const sessionFingerprint = navigator.userAgent + '_' + screen.width + 'x' + screen.height + '_' + new Date().getTimezoneOffset()
        
        let shouldTrack = true
        
        // If we loaded this page recently, likely a refresh
        if (lastPageLoad && (now - parseInt(lastPageLoad)) < REFRESH_WINDOW) {
          console.log('Likely page refresh detected, skipping scan recording')
          shouldTrack = false
        }
        
        // Check if we've already recorded a scan recently
        const lastScan = sessionStorage.getItem(SESSION_KEY)
        if (lastScan && (now - parseInt(lastScan)) < DEDUP_WINDOW) {
          console.log('Scan already recorded recently, skipping duplicate')
          shouldTrack = false
        }
        
        // Record this page load and scan timestamp
        sessionStorage.setItem(REFRESH_DETECTION_KEY, now.toString())
        
        if (shouldTrack) {
          sessionStorage.setItem(SESSION_KEY, now.toString())
          sessionStorage.setItem(`qr_fingerprint_${shortCode}`, sessionFingerprint)
          
          // Track the scan
          await fetch(`/api/track/${shortCode}`, { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fingerprint: sessionFingerprint,
              timestamp: now
            })
          }).catch(console.error)
        }
        
        // Fetch menu data
        const response = await fetch(`/api/qr-info/${shortCode}`)
        
        if (response.status === 404) {
          setError('Menu not found')
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch menu data')
        }

        const data = await response.json()
        
        if (data.type !== 'menu') {
          setError('This QR code is not a menu')
          setLoading(false)
          return
        }

        // Parse the menu data from content
        const menu: MenuData = JSON.parse(data.content)
        setMenuData(menu)
        
        // Expand all categories by default
        setExpandedCategories(new Set(menu.categories.map(cat => cat.id)))
      } catch (err) {
        console.error('Error fetching menu data:', err)
        setError('Failed to load menu')
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [params])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const filteredMenu = menuData ? {
    ...menuData,
    categories: menuData.categories.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })).filter(category => category.items.length > 0)
  } : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load menu'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const primaryColor = menuData.theme?.primaryColor || '#ea580c'
  const secondaryColor = menuData.theme?.secondaryColor || '#fb923c'

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      {/* Header */}
      <header 
        className="sticky top-0 z-10 shadow-md"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` 
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-2">
            <Utensils className="h-8 w-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">{menuData.restaurantName}</h1>
          </div>
          {menuData.description && (
            <p className="text-center text-white/90 text-sm">{menuData.description}</p>
          )}
        </div>
      </header>

      {/* Main Content - Grows to fill space */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>
        </div>

        {/* Menu Categories */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          {filteredMenu && filteredMenu.categories.length > 0 ? (
            <div className="space-y-4">
              {filteredMenu.categories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    style={{ 
                      borderLeft: `4px solid ${primaryColor}` 
                    }}
                  >
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                      <span className="ml-3 text-sm text-gray-500">
                        ({category.items.length} {category.items.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                    {expandedCategories.has(category.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {/* Category Items */}
                  {expandedCategories.has(category.id) && (
                    <div className="divide-y divide-gray-100">
                      {category.items.map((item) => (
                        <MenuItem
                          key={item.id}
                          item={item}
                          primaryColor={primaryColor}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No menu items found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Sticks to bottom */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by <a href="https://theqrcode.io" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 hover:text-orange-600 transition-colors">TheQRCode.io</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

function MenuItem({ item, primaryColor }: { item: MenuItem; primaryColor: string }) {
  return (
    <div className={`px-6 py-4 ${!item.available ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            {!item.available && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                Out of Stock
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          )}
          {item.price && (
            <p 
              className="text-lg font-bold"
              style={{ color: primaryColor }}
            >
              {item.price}
            </p>
          )}
        </div>
        {item.image && (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  )
}

