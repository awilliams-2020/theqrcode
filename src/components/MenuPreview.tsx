import { Utensils } from 'lucide-react'
import type { MenuData } from '@/types'

interface MenuPreviewProps {
  content: string
  className?: string
}

export default function MenuPreview({ content, className = '' }: MenuPreviewProps) {
  let menuData: MenuData | null = null
  try {
    menuData = JSON.parse(content) as MenuData
  } catch {
    return (
      <div className={`rounded-lg border border-gray-200 p-4 ${className}`}>
        <p className="text-sm text-gray-500 text-center">Unable to display menu preview.</p>
      </div>
    )
  }

  const primaryColor = menuData.theme?.primaryColor || '#ea580c'
  const backgroundColor = menuData.theme?.secondaryColor || '#fb923c'

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: primaryColor }}>
        {menuData.logo ? (
          <img src={menuData.logo} alt="" className="h-6 w-6 object-contain rounded shrink-0" />
        ) : (
          <Utensils className="h-5 w-5 text-gray-900 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{menuData.restaurantName}</p>
          {menuData.description && (
            <p className="text-xs text-gray-700 truncate">{menuData.description}</p>
          )}
        </div>
      </div>

      {/* Categories and items — mirrors full menu page: backgroundColor bg, white cards per category */}
      <div className="max-h-52 overflow-y-auto p-2 space-y-1.5" style={{ background: backgroundColor }}>
        {menuData.categories.length === 0 ? (
          <div className="bg-white rounded-lg px-3 py-4">
            <p className="text-sm text-gray-400 text-center">No menu items yet.</p>
          </div>
        ) : (
          menuData.categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg overflow-hidden">
              <p
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700 bg-gray-50"
                style={{ borderLeft: `3px solid ${primaryColor}` }}
              >
                {cat.name}
              </p>
              <div className="divide-y divide-gray-100">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className={`px-3 py-2 flex items-center justify-between gap-2 ${!item.available ? 'opacity-50' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!item.available && <span className="text-xs text-red-500">Out of stock</span>}
                      {item.price && (
                        <span className="text-xs font-semibold text-gray-900">
                          {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
