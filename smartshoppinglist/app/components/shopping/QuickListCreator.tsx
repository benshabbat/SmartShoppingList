'use client'

import { useState } from 'react'
import { Wand2, Plus, X, Sparkles, ShoppingCart, List, Eye, Check } from 'lucide-react'
import { PRESET_LISTS, parseCustomList, getPresetListKeys } from '../../utils/data/presetLists'
import { CATEGORY_EMOJIS } from '../../constants'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { gradientStyles, gradientBackgrounds } from '../../utils/ui/classNames'

export const QuickListCreator: React.FC = () => {
  // Get functions from global context - NO PROPS DRILLING!
  const { createQuickList, addBulkToCart } = useGlobalShopping()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [customList, setCustomList] = useState('')
  const [actionMode, setActionMode] = useState<'list' | 'cart'>('list')
  const [showPreview, setShowPreview] = useState(false)
  
  // פרוק הרשימה המותאמת אישית לתצוגה מקדימה
  const parsedItems = customList.trim() ? parseCustomList(customList) : []

  const handlePresetList = (listKey: string) => {
    const list = PRESET_LISTS[listKey]
    if (!list) return
    
    if (actionMode === 'cart') {
      addBulkToCart(list.items)
    } else {
      createQuickList(list.items)
    }
    
    setIsExpanded(false)
  }

  const handleCustomList = () => {
    if (!customList.trim()) return
    
    const items = parseCustomList(customList)
    
    if (actionMode === 'cart') {
      addBulkToCart(items)
    } else {
      createQuickList(items)
    }
    
    setCustomList('')
    setIsExpanded(false)
  }

  return (
    <div className={`${gradientBackgrounds.accent} p-6 rounded-2xl border border-purple-200 mb-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${gradientStyles.accent} rounded-full`}>
            <Wand2 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-purple-900 text-lg">יצירת רשימה מהירה</h3>
            <p className="text-sm text-purple-600">צור רשימת קניות במהירות עם זיהוי אוטומטי של קטגוריות</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 hover:bg-purple-100 rounded-full transition-all duration-200 transform hover:scale-105"
        >
          {isExpanded ? <X size={20} className="text-purple-600" /> : <Plus size={20} className="text-purple-600" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
          {/* בחירת מצב פעולה */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-xl p-1 border border-purple-200">
              <button
                onClick={() => setActionMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  actionMode === 'list' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <List size={16} />
                הוסף לרשימה
              </button>
              <button
                onClick={() => setActionMode('cart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  actionMode === 'cart' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <ShoppingCart size={16} />
                הוסף לסל
              </button>
            </div>
          </div>

          {/* רשימות מוכנות */}
          <div>
            <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} />
              רשימות מוכנות
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPresetListKeys().map((key) => {
                const list = PRESET_LISTS[key]
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetList(key)}
                    className="group p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-right transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{list.icon}</span>
                      <h5 className="font-bold text-purple-700 group-hover:text-purple-900">
                        {list.title}
                      </h5>
                    </div>
                    <p className="text-sm text-purple-600 mb-3">{list.description}</p>
                    <div className="text-xs text-purple-500">
                      {list.items.length} מוצרים
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* רשימה מותאמת אישית */}
          <div className="bg-white rounded-xl p-4 border border-purple-200">
            <h4 className="text-lg font-bold text-purple-800 mb-4">צור רשימה מותאמת אישית</h4>
            <div className="space-y-4">
              <textarea
                value={customList}
                onChange={(e) => setCustomList(e.target.value)}
                placeholder="רשום כל פריט בשורה נפרדת...&#10;&#10;לדוגמה:&#10;חלב&#10;לחם&#10;עגבניות&#10;בננה&#10;&#10;💡 הקטגוריות יזוהו אוטומטיט!"
                className="w-full p-4 border-2 border-purple-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                rows={6}
              />
              
              {/* תצוגה מקדימה של הפריטים והקטגוריות */}
              {parsedItems.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      <Eye size={16} />
                      {showPreview ? 'הסתר תצוגה מקדימה' : 'הצג תצוגה מקדימה'}
                    </button>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Check size={16} />
                      <span className="text-sm">קטגוריות זוהו אוטומטית</span>
                    </div>
                  </div>
                  
                  {showPreview && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {parsedItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{CATEGORY_EMOJIS[item.category as keyof typeof CATEGORY_EMOJIS] || '📦'}</span>
                            <span className="text-purple-600 font-medium">{item.category}</span>
                          </div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600">
                  {parsedItems.length} מוצרים
                  {parsedItems.length > 0 && (
                    <span className="mr-2 text-green-600">
                      ✓ קטגוריות זוהו
                    </span>
                  )}
                </span>
                <button
                  onClick={handleCustomList}
                  disabled={!customList.trim()}
                  className={`px-6 py-3 ${gradientStyles.accent} text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium shadow-md`}
                >
                  {actionMode === 'cart' ? 'הוסף לסל' : 'צור רשימה'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}