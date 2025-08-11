'use client'

import { useState } from 'react'
import { Wand2, Plus, X } from 'lucide-react'

interface QuickListCreatorProps {
  onCreateList: (items: Array<{name: string, category: string}>) => void
}

// רשימות מוכנות לפי סוגי ארוחות ואירועים
const PRESET_LISTS = {
  breakfast: {
    title: 'ארוחת בוקר',
    items: [
      { name: 'חלב', category: 'מוצרי חלב' },
      { name: 'לחם', category: 'לחם ומאפים' },
      { name: 'ביצים', category: 'מוצרי חלב' },
      { name: 'גבינה צהובה', category: 'מוצרי חלב' },
      { name: 'חמאה', category: 'מוצרי חלב' },
      { name: 'דבש', category: 'מתוקים' },
      { name: 'בננה', category: 'פירות' },
      { name: 'תפוח', category: 'פירות' }
    ]
  },
  dinner: {
    title: 'ארוחת ערב',
    items: [
      { name: 'עוף', category: 'בשר ודגים' },
      { name: 'אורז', category: 'דגנים' },
      { name: 'עגבניות', category: 'ירקות' },
      { name: 'מלפפון', category: 'ירקות' },
      { name: 'בצל', category: 'ירקות' },
      { name: 'שמן זית', category: 'שמנים ותבלינים' },
      { name: 'מלח', category: 'שמנים ותבלינים' },
      { name: 'פלפל שחור', category: 'שמנים ותבלינים' }
    ]
  },
  party: {
    title: 'מסיבה/אירוח',
    items: [
      { name: 'צ\'יפס', category: 'חטיפים' },
      { name: 'אגוזים', category: 'חטיפים' },
      { name: 'קולה', category: 'משקאות' },
      { name: 'בירה', category: 'משקאות' },
      { name: 'חומוס', category: 'מוכן' },
      { name: 'פיתה', category: 'לחם ומאפים' },
      { name: 'שוקולד', category: 'מתוקים' },
      { name: 'גלידה', category: 'קפואים' }
    ]
  },
  shabbat: {
    title: 'שבת',
    items: [
      { name: 'יין', category: 'משקאות' },
      { name: 'חלה', category: 'לחם ומאפים' },
      { name: 'דגים', category: 'בשר ודגים' },
      { name: 'תפוחי אדמה', category: 'ירקות' },
      { name: 'גזר', category: 'ירקות' },
      { name: 'בשר בקר', category: 'בשר ודגים' },
      { name: 'ממתקים', category: 'מתוקים' },
      { name: 'סלט', category: 'ירקות' }
    ]
  }
}

export const QuickListCreator: React.FC<QuickListCreatorProps> = ({ onCreateList }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [customList, setCustomList] = useState('')

  const handlePresetList = (listKey: keyof typeof PRESET_LISTS) => {
    const list = PRESET_LISTS[listKey]
    onCreateList(list.items)
  }

  const handleCustomList = () => {
    if (!customList.trim()) return
    
    // פרק את הטקסט לפריטים ונסה לזהות קטגוריה
    const items = customList.split('\n').map(line => {
      const item = line.trim()
      if (!item) return null
      
      // זיהוי קטגוריה פשוט לפי מילות מפתח
      let category = 'כללי'
      const lowerItem = item.toLowerCase()
      
      if (lowerItem.includes('חלב') || lowerItem.includes('גבינה') || lowerItem.includes('יוגורט') || lowerItem.includes('ביצים')) {
        category = 'מוצרי חלב'
      } else if (lowerItem.includes('עוף') || lowerItem.includes('בשר') || lowerItem.includes('דג')) {
        category = 'בשר ודגים'
      } else if (lowerItem.includes('עגבני') || lowerItem.includes('מלפפון') || lowerItem.includes('בצל') || lowerItem.includes('גזר')) {
        category = 'ירקות'
      } else if (lowerItem.includes('תפוח') || lowerItem.includes('בננה') || lowerItem.includes('תפוז')) {
        category = 'פירות'
      } else if (lowerItem.includes('לחם') || lowerItem.includes('חלה') || lowerItem.includes('פיתה')) {
        category = 'לחם ומאפים'
      } else if (lowerItem.includes('אורז') || lowerItem.includes('פסטה') || lowerItem.includes('בורגול')) {
        category = 'דגנים'
      } else if (lowerItem.includes('שוקולד') || lowerItem.includes('עוגה') || lowerItem.includes('ממתק')) {
        category = 'מתוקים'
      } else if (lowerItem.includes('מים') || lowerItem.includes('יין') || lowerItem.includes('בירה') || lowerItem.includes('קולה')) {
        category = 'משקאות'
      }
      
      return { name: item, category }
    }).filter(Boolean) as Array<{name: string, category: string}>
    
    onCreateList(items)
    setCustomList('')
    setIsExpanded(false)
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wand2 className="text-purple-600" size={20} />
          <h3 className="font-semibold text-purple-900">יצירת רשימה מהירה</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
        >
          {isExpanded ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* רשימות מוכנות */}
          <div>
            <h4 className="text-sm font-medium text-purple-800 mb-2">רשימות מוכנות:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mobile-grid">
              {Object.entries(PRESET_LISTS).map(([key, list]) => (
                <button
                  key={key}
                  onClick={() => handlePresetList(key as keyof typeof PRESET_LISTS)}
                  className="p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-sm font-medium text-purple-700 mobile-padding mobile-text"
                >
                  {list.title}
                </button>
              ))}
            </div>
          </div>

          {/* רשימה מותאמת אישית */}
          <div>
            <h4 className="text-sm font-medium text-purple-800 mb-2">צור רשימה מותאמת:</h4>
            <textarea
              value={customList}
              onChange={(e) => setCustomList(e.target.value)}
              placeholder="רשום כל פריט בשורה נפרדת...&#10;לדוגמה:&#10;חלב&#10;לחם&#10;עגבניות"
              className="w-full p-3 border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mobile-text"
              rows={4}
            />
            <button
              onClick={handleCustomList}
              disabled={!customList.trim()}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mobile-text"
            >
              צור רשימה
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
