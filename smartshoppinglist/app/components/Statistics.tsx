import { History, TrendingUp, Package, Target, ShoppingCart, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { ShoppingItem, ItemSuggestion } from '../types'
import { formatDate } from '../utils/helpers'
import { useState } from 'react'

interface StatisticsProps {
  purchaseHistory: ShoppingItem[]
  suggestions: ItemSuggestion[]
  pantryItems: ShoppingItem[]
}

export const Statistics = ({ 
  purchaseHistory, 
  suggestions, 
  pantryItems 
}: StatisticsProps) => {
  const [showDetails, setShowDetails] = useState(false)
  // חישובי סטטיסטיקות מתקדמות
  const totalPurchased = purchaseHistory.length
  const totalSuggestions = suggestions.length
  const totalPantryItems = pantryItems.length
  
  // מוצרים שנקנו השבוע
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const purchasedThisWeek = purchaseHistory.filter(item => 
    item.purchasedAt && new Date(item.purchasedAt) >= weekAgo
  ).length

  // מוצרים שעומדים לפוג בקרוב (3 ימים)
  const now = new Date()
  const expiringShortly = pantryItems.filter(item => {
    if (!item.expiryDate) return false
    const expiryDate = new Date(item.expiryDate)
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
  }).length

  // הקטגוריה הפופולרית ביותר
  const categoryCount: Record<string, number> = {}
  purchaseHistory.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
  })
  const mostPopularCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'אין נתונים'

  // ממוצע קניות בשבוע
  const weeksOfData = Math.max(1, Math.ceil(purchaseHistory.length / 7))
  const avgPerWeek = Math.round(totalPurchased / weeksOfData)

  // מגמת קניות (האם עולה או יורדת)
  const lastTwoWeeks = purchaseHistory.filter(item => {
    if (!item.purchasedAt) return false
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    return new Date(item.purchasedAt) >= twoWeeksAgo
  })
  
  const lastWeekPurchases = lastTwoWeeks.filter(item => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return new Date(item.purchasedAt!) >= oneWeekAgo
  }).length
  
  const previousWeekPurchases = lastTwoWeeks.filter(item => {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const purchaseDate = new Date(item.purchasedAt!)
    return purchaseDate >= twoWeeksAgo && purchaseDate < oneWeekAgo
  }).length

  const trend = lastWeekPurchases > previousWeekPurchases ? 'עולה' : 
                lastWeekPurchases < previousWeekPurchases ? 'יורדת' : 'יציבה'
  const trendIcon = lastWeekPurchases > previousWeekPurchases ? '📈' : 
                   lastWeekPurchases < previousWeekPurchases ? '📉' : '➡️'

  const stats = [
    {
      label: 'סה"כ נקנה',
      value: totalPurchased,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      subtext: `${avgPerWeek} בממוצע לשבוע`
    },
    {
      label: 'נקנה השבוע',
      value: purchasedThisWeek,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      subtext: `מתוך ${totalPurchased} סה"כ`
    },
    {
      label: 'הצעות חכמות',
      value: totalSuggestions,
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      subtext: 'מחכות לך'
    },
    {
      label: 'במזווה',
      value: totalPantryItems,
      icon: Package,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      subtext: `${expiringShortly} עומדים לפוג`
    },
    {
      label: 'קטגוריה פופולרית',
      value: mostPopularCategory,
      icon: Award,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
      subtext: `${categoryCount[mostPopularCategory] || 0} מוצרים`,
      isText: true
    },
    {
      label: 'עומדים לפוג',
      value: expiringShortly,
      icon: Clock,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      subtext: 'ב-3 הימים הקרובים'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="text-sm">פרטים</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
            <History className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-xl text-gray-800">סטטיסטיקות מתקדמות</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-xl p-3 lg:p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <div className={`inline-flex p-2 lg:p-3 rounded-full bg-gradient-to-r ${stat.color} mb-2 lg:mb-3 shadow-lg`}>
                <IconComponent className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className={`${stat.isText ? 'text-base lg:text-lg' : 'text-2xl lg:text-3xl'} font-bold ${stat.textColor} mb-1 lg:mb-2`}>
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 font-medium mb-1">
                {stat.label}
              </div>
              {stat.subtext && (
                <div className="text-xs text-gray-500 font-normal">
                  {stat.subtext}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* סטטיסטיקות נוספות */}
      {showDetails && purchaseHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-4 text-right">פרטים נוספים</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 text-right">רכישה אחרונה:</div>
              <div className="font-medium text-gray-800 text-right">
                {purchaseHistory.length > 0 
                  ? formatDate(new Date(purchaseHistory[purchaseHistory.length - 1].purchasedAt!))
                  : 'אין נתונים'
                }
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 text-right">מוצר פופולרי:</div>
              <div className="font-medium text-gray-800 text-right">
                {(() => {
                  const itemCount: Record<string, number> = {}
                  purchaseHistory.forEach(item => {
                    itemCount[item.name] = (itemCount[item.name] || 0) + 1
                  })
                  const mostPopular = Object.entries(itemCount)
                    .sort(([,a], [,b]) => b - a)[0]
                  return mostPopular ? `${mostPopular[0]} (${mostPopular[1]})` : 'אין נתונים'
                })()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 text-right">מגמת קניות:</div>
              <div className="font-medium text-gray-800 text-right">
                {trendIcon} {trend}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 text-right">שינוי שבועי:</div>
              <div className="font-medium text-gray-800 text-right">
                {lastWeekPurchases - previousWeekPurchases > 0 ? '+' : ''}
                {lastWeekPurchases - previousWeekPurchases} מוצרים
              </div>
            </div>
          </div>

          {/* גרף פשוט של קניות בשבוע האחרון */}
          {purchasedThisWeek > 0 && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-3 text-right">פעילות השבוע</h5>
              <div className="flex items-end justify-between h-16 gap-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (6 - i))
                  const dayPurchases = purchaseHistory.filter(item => 
                    item.purchasedAt && 
                    new Date(item.purchasedAt).toDateString() === date.toDateString()
                  ).length
                  const maxHeight = Math.max(1, purchasedThisWeek)
                  const height = Math.max(4, (dayPurchases / maxHeight) * 48)
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-blue-400 to-blue-600 rounded-t"
                        style={{ height: `${height}px`, width: '20px' }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {date.getDate()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">קניות ביום</div>
            </div>
          )}

          {/* חלוקה לפי קטגוריות */}
          {Object.keys(categoryCount).length > 1 && (
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-3 text-right">חלוקה לפי קטגוריות</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {Object.entries(categoryCount)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count], index) => {
                    const percentage = Math.round((count / totalPurchased) * 100)
                    return (
                      <div key={category} className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              ['from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 
                               'from-indigo-400 to-indigo-600', 'from-blue-400 to-blue-600',
                               'from-green-400 to-green-600'][index] || 'from-gray-400 to-gray-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-600 text-right min-w-0 flex-shrink-0">
                          {category} ({count})
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* פריטים שעומדים לפוג - תצוגה מפורטת */}
      {showDetails && expiringShortly > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-orange-700 mb-4 text-right flex items-center gap-2">
            <Clock className="w-4 h-4" />
            מוצרים שעומדים לפוג בקרוב
          </h4>
          <div className="space-y-2">
            {pantryItems
              .filter(item => {
                if (!item.expiryDate) return false
                const expiryDate = new Date(item.expiryDate)
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
              })
              .slice(0, 3)
              .map((item, index) => {
                const expiryDate = new Date(item.expiryDate!)
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex justify-between items-center">
                      <div className={`text-sm font-medium ${
                        daysUntilExpiry === 0 ? 'text-red-600' : 
                        daysUntilExpiry === 1 ? 'text-orange-600' : 'text-yellow-600'
                      }`}>
                        {daysUntilExpiry === 0 ? 'פג היום!' : 
                         daysUntilExpiry === 1 ? 'פג מחר' : `${daysUntilExpiry} ימים`}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">{formatDate(expiryDate)}</div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}

      {/* כפתורי פעולה */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start lg:justify-center xl:justify-start">
            <button
              onClick={() => {
                const data = {
                  purchaseHistory,
                  pantryItems,
                  exportDate: new Date().toISOString()
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `shopping-data-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              ייצא נתונים
            </button>
            <button
              onClick={() => {
                if (window.confirm('האם אתה בטוח שברצונך לנקות היסטוריה ישנה (מעל 30 ימים)?')) {
                  const thirtyDaysAgo = new Date()
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                  // כאן נצטרך להוסיף לוגיקה לניקוי ההיסטוריה
                  alert('הפיצ\'ר יתווסף בקרוב!')
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              נקה היסטוריה ישנה
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
