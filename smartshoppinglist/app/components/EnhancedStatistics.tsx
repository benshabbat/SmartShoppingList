import { History, TrendingUp, Package, Target, ShoppingCart, Clock, Award, ChevronDown, ChevronUp, BarChart3, PieChart, Calendar } from 'lucide-react'
import { ShoppingItem, ItemSuggestion } from '../types'
import { formatDate } from '../utils/helpers'
import { useState } from 'react'

interface StatisticsProps {
  purchaseHistory: ShoppingItem[]
  suggestions: ItemSuggestion[]
  pantryItems: ShoppingItem[]
}

interface StatCard {
  label: string
  value: string | number
  icon: any
  color: string
  bgColor: string
  textColor: string
  subtext?: string
  isText?: boolean
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
}

export const EnhancedStatistics = ({ 
  purchaseHistory, 
  suggestions, 
  pantryItems 
}: StatisticsProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'categories'>('overview')
  
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

  const trend = lastWeekPurchases > previousWeekPurchases ? 'up' : 
                lastWeekPurchases < previousWeekPurchases ? 'down' : 'stable'
  const trendValue = lastWeekPurchases - previousWeekPurchases

  // כרטיסי סטטיסטיקה עיקריים
  const mainStats: StatCard[] = [
    {
      label: 'סה"כ נקנה',
      value: totalPurchased,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      textColor: 'text-blue-700',
      subtext: `${avgPerWeek} בממוצע לשבוע`,
      trend: trend,
      trendValue: Math.abs(trendValue)
    },
    {
      label: 'נקנה השבוע',
      value: purchasedThisWeek,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      textColor: 'text-green-700',
      subtext: `${Math.round((purchasedThisWeek / Math.max(totalPurchased, 1)) * 100)}% מהסה"כ`,
      trend: trend
    },
    {
      label: 'הצעות חכמות',
      value: totalSuggestions,
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
      textColor: 'text-purple-700',
      subtext: 'מחכות לך'
    },
    {
      label: 'במזווה',
      value: totalPantryItems,
      icon: Package,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
      textColor: 'text-amber-700',
      subtext: `${expiringShortly} עומדים לפוג`
    }
  ]

  const secondaryStats: StatCard[] = [
    {
      label: 'קטגוריה פופולרית',
      value: mostPopularCategory,
      icon: Award,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-red-100',
      textColor: 'text-rose-700',
      subtext: `${categoryCount[mostPopularCategory] || 0} מוצרים`,
      isText: true
    },
    {
      label: 'עומדים לפוג',
      value: expiringShortly,
      icon: Clock,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-100',
      textColor: 'text-orange-700',
      subtext: 'ב-3 הימים הקרובים'
    }
  ]

  const StatCard = ({ stat }: { stat: StatCard }) => {
    const IconComponent = stat.icon
    return (
      <div className={`${stat.bgColor} rounded-2xl p-6 border border-white shadow-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          {stat.trend && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              stat.trend === 'up' ? 'bg-green-100 text-green-700' :
              stat.trend === 'down' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {stat.trend === 'up' ? '↗️' : stat.trend === 'down' ? '↘️' : '➡️'}
              {stat.trendValue && stat.trendValue > 0 && stat.trendValue}
            </div>
          )}
        </div>
        
        <div className={`${stat.isText ? 'text-lg' : 'text-3xl'} font-bold ${stat.textColor} mb-2 group-hover:scale-110 transition-transform`}>
          {stat.value}
        </div>
        
        <div className="text-sm text-gray-700 font-medium mb-1">
          {stat.label}
        </div>
        
        {stat.subtext && (
          <div className="text-xs text-gray-600 font-normal">
            {stat.subtext}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-800">סטטיסטיקות מתקדמות</h3>
            <p className="text-gray-600">תובנות על הרגלי הקנייה שלך</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="text-sm font-medium">פרטים</span>
        </button>
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {secondaryStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
          {/* Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-2xl p-1">
              {[
                { id: 'overview', label: 'סקירה', icon: BarChart3 },
                { id: 'trends', label: 'מגמות', icon: TrendingUp },
                { id: 'categories', label: 'קטגוריות', icon: PieChart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h4 className="font-bold text-xl text-gray-800 text-center mb-6">פרטים נוספים</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-gray-600 text-right mb-2">רכישה אחרונה:</div>
                    <div className="font-bold text-gray-800 text-right">
                      {purchaseHistory.length > 0 
                        ? formatDate(new Date(purchaseHistory[purchaseHistory.length - 1].purchasedAt!))
                        : 'אין נתונים'
                      }
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-gray-600 text-right mb-2">מוצר פופולרי:</div>
                    <div className="font-bold text-gray-800 text-right">
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
                </div>
              </div>
            )}

            {activeTab === 'trends' && purchasedThisWeek > 0 && (
              <div className="space-y-6">
                <h4 className="font-bold text-xl text-gray-800 text-center mb-6">פעילות השבוע</h4>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - (6 - i))
                      const dayPurchases = purchaseHistory.filter(item => 
                        item.purchasedAt && 
                        new Date(item.purchasedAt).toDateString() === date.toDateString()
                      ).length
                      const maxHeight = Math.max(1, purchasedThisWeek)
                      const height = Math.max(8, (dayPurchases / maxHeight) * 96)
                      
                      return (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg w-full transition-all duration-500 hover:from-blue-500 hover:to-blue-700"
                            style={{ height: `${height}px` }}
                            title={`${dayPurchases} קניות`}
                          />
                          <div className="text-xs text-gray-500 mt-2 font-medium">
                            {date.getDate()}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-sm text-gray-600 text-center mt-4 font-medium">קניות ביום</div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && Object.keys(categoryCount).length > 1 && (
              <div className="space-y-6">
                <h4 className="font-bold text-xl text-gray-800 text-center mb-6">חלוקה לפי קטגוריות</h4>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="space-y-4">
                    {Object.entries(categoryCount)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([category, count], index) => {
                        const percentage = Math.round((count / totalPurchased) * 100)
                        const colors = [
                          'from-purple-400 to-purple-600', 
                          'from-pink-400 to-pink-600', 
                          'from-indigo-400 to-indigo-600', 
                          'from-blue-400 to-blue-600',
                          'from-green-400 to-green-600',
                          'from-yellow-400 to-yellow-600'
                        ]
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-700">
                                {percentage}%
                              </div>
                              <div className="text-sm text-gray-600 text-right">
                                {category} ({count})
                              </div>
                            </div>
                            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`h-full rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-700 ease-out`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expiring Items */}
          {expiringShortly > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <h4 className="font-bold text-xl text-orange-800 mb-4 text-center flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                מוצרים שעומדים לפוג בקרוב
              </h4>
              <div className="grid gap-4">
                {pantryItems
                  .filter(item => {
                    if (!item.expiryDate) return false
                    const expiryDate = new Date(item.expiryDate)
                    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
                  })
                  .slice(0, 4)
                  .map((item, index) => {
                    const expiryDate = new Date(item.expiryDate!)
                    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={index} className="bg-white rounded-xl p-4 border-l-4 border-orange-400 shadow-md">
                        <div className="flex justify-between items-center">
                          <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                            daysUntilExpiry === 0 ? 'bg-red-100 text-red-700' : 
                            daysUntilExpiry === 1 ? 'bg-orange-100 text-orange-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {daysUntilExpiry === 0 ? 'פג היום!' : 
                             daysUntilExpiry === 1 ? 'פג מחר' : `${daysUntilExpiry} ימים`}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-800">{item.name}</div>
                            <div className="text-sm text-gray-500">{formatDate(expiryDate)}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200">
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
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Package className="w-4 h-4" />
              ייצא נתונים
            </button>
            <button
              onClick={() => {
                if (window.confirm('האם אתה בטוח שברצונך לנקות היסטוריה ישנה (מעל 30 ימים)?')) {
                  alert('הפיצ\'ר יתווסף בקרוב!')
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
