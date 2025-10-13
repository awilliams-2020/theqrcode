'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Save } from 'lucide-react'
import type { MenuData, MenuCategory, MenuItem } from '@/types'

interface MenuBuilderProps {
  initialData?: MenuData
  onSave: (menuData: MenuData) => void
  onCancel: () => void
}

export default function MenuBuilder({ initialData, onSave, onCancel }: MenuBuilderProps) {
  const [menuData, setMenuData] = useState<MenuData>(initialData || {
    restaurantName: '',
    description: '',
    categories: [],
    theme: {
      primaryColor: '#ea580c',
      secondaryColor: '#fb923c'
    }
  })

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const addCategory = () => {
    const newCategory: MenuCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      items: []
    }
    setMenuData({
      ...menuData,
      categories: [...menuData.categories, newCategory]
    })
    setExpandedCategories(new Set([...expandedCategories, newCategory.id]))
  }

  const updateCategory = (categoryId: string, updates: Partial<MenuCategory>) => {
    setMenuData({
      ...menuData,
      categories: menuData.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    })
  }

  const deleteCategory = (categoryId: string) => {
    setMenuData({
      ...menuData,
      categories: menuData.categories.filter(cat => cat.id !== categoryId)
    })
    const newExpanded = new Set(expandedCategories)
    newExpanded.delete(categoryId)
    setExpandedCategories(newExpanded)
  }

  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'New Item',
      description: '',
      price: '',
      category: categoryId,
      available: true
    }
    
    setMenuData({
      ...menuData,
      categories: menuData.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      )
    })
  }

  const updateItem = (categoryId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenuData({
      ...menuData,
      categories: menuData.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          : cat
      )
    })
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    setMenuData({
      ...menuData,
      categories: menuData.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
          : cat
      )
    })
  }

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

  const handleSave = () => {
    if (!menuData.restaurantName.trim()) {
      alert('Please enter a restaurant name')
      return
    }
    if (menuData.categories.length === 0) {
      alert('Please add at least one category')
      return
    }
    onSave(menuData)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900">Menu Builder</h2>
        <p className="text-sm text-gray-600 mt-1">Create your digital restaurant menu</p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Restaurant Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Restaurant Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={menuData.restaurantName}
                onChange={(e) => setMenuData({ ...menuData, restaurantName: e.target.value })}
                placeholder="e.g., The Cozy Bistro"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={menuData.description || ''}
                onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
                placeholder="e.g., Fresh ingredients, traditional recipes"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={menuData.theme?.primaryColor || '#ea580c'}
                    onChange={(e) => setMenuData({
                      ...menuData,
                      theme: { ...menuData.theme, primaryColor: e.target.value }
                    })}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    {menuData.theme?.primaryColor || '#ea580c'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={menuData.theme?.secondaryColor || '#fb923c'}
                    onChange={(e) => setMenuData({
                      ...menuData,
                      theme: { ...menuData.theme, secondaryColor: e.target.value }
                    })}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    {menuData.theme?.secondaryColor || '#fb923c'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Menu Categories</h3>
              <button
                onClick={addCategory}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            {menuData.categories.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">No categories yet. Add your first category to get started!</p>
                <button
                  onClick={addCategory}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Category
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {menuData.categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gray-50 border-b border-gray-200">
                      <div className="px-6 py-4 flex items-center gap-4">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-move flex-shrink-0" />
                        
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                          placeholder="Category name"
                        />

                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          title={expandedCategories.has(category.id) ? 'Collapse' : 'Expand'}
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>

                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Category Items */}
                    {expandedCategories.has(category.id) && (
                      <div className="p-6 space-y-4">
                        <button
                          onClick={() => addItem(category.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>

                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                          >
                            <div className="flex items-start gap-3">
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-move mt-2 flex-shrink-0" />
                              
                              <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(category.id, item.id, { name: e.target.value })}
                                    placeholder="Item name"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                  <input
                                    type="text"
                                    value={item.price || ''}
                                    onChange={(e) => updateItem(category.id, item.id, { price: e.target.value })}
                                    placeholder="Price (e.g., $12.99)"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                </div>

                                <textarea
                                  value={item.description || ''}
                                  onChange={(e) => updateItem(category.id, item.id, { description: e.target.value })}
                                  placeholder="Item description (optional)"
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                />

                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={item.available}
                                      onChange={(e) => updateItem(category.id, item.id, { available: e.target.checked })}
                                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">Available</span>
                                  </label>
                                </div>
                              </div>

                              <button
                                onClick={() => deleteItem(category.id, item.id)}
                                className="p-2 text-red-600 hover:text-red-700 transition-colors flex-shrink-0"
                                title="Delete item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          <Save className="h-4 w-4" />
          Save Menu
        </button>
      </div>
    </div>
  )
}

