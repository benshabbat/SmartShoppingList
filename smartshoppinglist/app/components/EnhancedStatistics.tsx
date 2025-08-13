import { History, TrendingUp, Package, Target, ShoppingCart, Clock, Award, ChevronDown, ChevronUp, BarChart3, PieChart } from 'lucide-react'
import { formatDate } from '../utils/dateUtils'
import { useState, useEffect } from 'react'
import { 
  useAnalyticsStore, 
  useAnalyticsSelectors 
} from '../stores/data/analyticsStore'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'

import { LucideIcon } from 'lucide-react'

interface StatCard {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  textColor: string
  subtext?: string
  isText?: boolean
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
}

/**
 * Enhanced Statistics Component - ZERO PROPS DRILLING
 * Gets all data from global context
 */
export const EnhancedStatistics = () => {
  // Get data from global context - NO PROPS!
  const { purchaseHistory, pantryItems } = useGlobalShopping()
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'categories'>('overview')
  
  // Analytics store hooks
  const refreshAnalytics = useAnalyticsStore(state => state.refreshAnalytics)
  const categoryStats = useAnalyticsSelectors.useCategoryStats()
  const isAnalyzing = useAnalyticsSelectors.useIsAnalyzing()
  const totalPurchased = useAnalyticsStore(state => state.totalPurchased)
  const totalPantryItems = useAnalyticsStore(state => state.totalPantryItems)
  const topCategory = useAnalyticsSelectors.useTopCategory()
  const expiringItemsCount = useAnalyticsStore(state => state.expiringItemsCount)
  const _weeklyTrends = useAnalyticsSelectors.useTrends()
  
  // Refresh analytics when data changes
  useEffect(() => {
    refreshAnalytics(purchaseHistory, pantryItems)
  }, [purchaseHistory, pantryItems, refreshAnalytics])
  
  // Some local calculations still needed for specific UI components
  const now = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const purchasedThisWeek = purchaseHistory.filter(item => 
    item.purchasedAt && new Date(item.purchasedAt) >= weekAgo
  ).length
  
  const categoryCount: Record<string, number> = {}
  purchaseHistory.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
  })
  
  const expiringShortly = pantryItems.filter(item => {
    if (!item.expiryDate) return false
    const expiryDate = new Date(item.expiryDate)
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
  }).length
  
  // ממוצע קניות בשבוע
  const weeksOfData = Math.max(1, Math.ceil(totalPurchased / 7))
  const avgPerWeek = Math.round(totalPurchased / weeksOfData)

  // מגמת קניות - חישוב מהנתונים הקיימים
  const thisWeekPurchases = useAnalyticsStore(state => state.purchasedThisWeek)
  const lastWeekPurchases = useAnalyticsStore(state => state.purchasedLastWeek)
  const growthValue = lastWeekPurchases > 0 ? 
    ((thisWeekPurchases - lastWeekPurchases) / lastWeekPurchases) * 100 : 0
  const trend = growthValue > 0 ? 'up' : 
                growthValue < 0 ? 'down' : 'stable'
  const trendValue = Math.round(growthValue)

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
      value: useAnalyticsStore.getState().smartSuggestions.length,
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
      subtext: `${expiringItemsCount} עומדים לפוג`
    }
  ]

  const secondaryStats: StatCard[] = [
    {
      label: 'קטגוריה פופולרית',
      value: topCategory || 'אין נתונים',
      icon: Award,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-red-100',
      textColor: 'text-rose-700',
      subtext: `${categoryStats.find((c: { category: string; count: number }) => c.category === topCategory)?.count || 0} מוצרים`,
      isText: true
    },
    {
      label: 'עומדים לפוג',
      value: expiringItemsCount,
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
      <div className={`${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white shadow-md sm:shadow-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl group`}>
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
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
        
        <div className={`${stat.isText ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl lg:text-3xl'} font-bold ${stat.textColor} mb-2 group-hover:scale-110 transition-transform`}>
          {stat.value}
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 font-medium mb-1">
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
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 backdrop-blur-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800">סטטיסטיקות מתקדמות</h3>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">תובנות על הרגלי הקנייה שלך</p>
          </div>
          {isAnalyzing && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
          )}
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base self-end sm:self-auto"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="font-medium">פרטים</span>
        </button>
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {mainStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {secondaryStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-top-4 duration-500">
          {/* Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-1 w-full sm:w-auto overflow-x-auto">
              <div className="flex min-w-max sm:min-w-0">
                {[
                  { id: 'overview', label: 'סקירה', icon: BarChart3 },
                  { id: 'trends', label: 'מגמות', icon: TrendingUp },
                  { id: 'categories', label: 'קטגוריות', icon: PieChart }
                ].map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'trends' | 'categories')}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                <h4 className="font-bold text-lg sm:text-xl text-gray-800 text-center mb-4 sm:mb-6">פרטים נוספים</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="text-gray-600 text-right mb-2 text-sm sm:text-base">רכישה אחרונה:</div>
                    <div className="font-bold text-gray-800 text-right text-sm sm:text-base">
                      {purchaseHistory.length > 0 
                        ? formatDate(new Date(purchaseHistory[purchaseHistory.length - 1].purchasedAt!))
                        : 'אין נתונים'
                      }
                    </div>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="text-gray-600 text-right mb-2 text-sm sm:text-base">מוצר פופולרי:</div>
                    <div className="font-bold text-gray-800 text-right text-sm sm:text-base">
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
              <div className="space-y-4 sm:space-y-6">
                <h4 className="font-bold text-lg sm:text-xl text-gray-800 text-center mb-4 sm:mb-6">פעילות השבוע</h4>
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md overflow-x-auto">
                  <div className="flex items-end justify-between h-24 sm:h-32 gap-1 sm:gap-2 min-w-max">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - (6 - i))
                      const dayPurchases = purchaseHistory.filter(item => 
                        item.purchasedAt && 
                        new Date(item.purchasedAt).toDateString() === date.toDateString()
                      ).length
                      const maxHeight = Math.max(1, purchasedThisWeek)
                      const height = Math.max(8, (dayPurchases / maxHeight) * (window.innerWidth < 640 ? 64 : 96))
                      
                      return (
                        <div key={i} className="flex flex-col items-center flex-1 min-w-0">
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
                  <div className="text-xs sm:text-sm text-gray-600 text-center mt-4 font-medium">קניות ביום</div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && Object.keys(categoryCount).length > 1 && (
              <div className="space-y-4 sm:space-y-6">
                <h4 className="font-bold text-lg sm:text-xl text-gray-800 text-center mb-4 sm:mb-6">חלוקה לפי קטגוריות</h4>
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md">
                  <div className="space-y-3 sm:space-y-4">
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
                              <div className="text-sm text-gray-600 text-right truncate">
                                {category} ({count})
                              </div>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
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
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
              <h4 className="font-bold text-lg sm:text-xl text-orange-800 mb-4 text-center flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                מוצרים שעומדים לפוג בקרוב
              </h4>
              <div className="grid gap-3 sm:gap-4">
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
                      <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 border-orange-400 shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                          <div className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full ${
                            daysUntilExpiry === 0 ? 'bg-red-100 text-red-700' : 
                            daysUntilExpiry === 1 ? 'bg-orange-100 text-orange-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {daysUntilExpiry === 0 ? 'פג היום!' : 
                             daysUntilExpiry === 1 ? 'פג מחר' : `${daysUntilExpiry} ימים`}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-800 text-sm sm:text-base">{item.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{formatDate(expiryDate)}</div>
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
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 border-t border-gray-200">
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
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto"
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
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg sm:rounded-xl text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto"
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
