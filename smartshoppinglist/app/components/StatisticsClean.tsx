import { History, TrendingUp, Package, Target, ShoppingCart, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { ShoppingItem, ItemSuggestion } from '../types'
import { formatDate } from '../utils/helpers'
import { useState } from 'react'
import { useStatistics } from '../hooks'
import { Card, CardHeader, CardBody } from './Card'
import { CHART_COLORS } from '../utils'

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
  
  const { 
    basicStats, 
    weeklyStats, 
    categoryStats, 
    expiryStats, 
    insights 
  } = useStatistics({
    purchaseHistory,
    suggestions,
    pantryItems,
  })

  return (
    <Card className="mb-6">
      <CardHeader
        title="סטטיסטיקות"
        icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        action={
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                הסתר פרטים
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                הצג פרטים
              </>
            )}
          </button>
        }
      />
      
      <CardBody>
        {/* Basic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Package className="w-5 h-5 text-purple-500" />}
            value={basicStats.totalPurchased}
            label="סה״כ נקנו"
            color="purple"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-blue-500" />}
            value={basicStats.totalSuggestions}
            label="הצעות"
            color="blue"
          />
          <StatCard
            icon={<ShoppingCart className="w-5 h-5 text-green-500" />}
            value={weeklyStats.purchasedThisWeek}
            label="השבוע"
            color="green"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-orange-500" />}
            value={expiryStats.expiringShortly}
            label="עומדים לפוג"
            color="orange"
          />
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">💡 תובנות</h4>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Statistics */}
        {showDetails && (
          <div className="space-y-6">
            {/* Weekly Trend */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                מגמה שבועית
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">{weeklyStats.avgPerWeek}</div>
                  <div className="text-xs text-gray-600">ממוצע שבועי</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-bold ${
                    weeklyStats.weeklyGrowth > 0 ? 'text-green-600' : 
                    weeklyStats.weeklyGrowth < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {weeklyStats.weeklyGrowth > 0 ? '+' : ''}{weeklyStats.weeklyGrowth}%
                  </div>
                  <div className="text-xs text-gray-600">שינוי שבועי</div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            {categoryStats.topCategories.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  קטגוריות פופולריות
                </h4>
                <div className="space-y-2">
                  {categoryStats.topCategories.slice(0, 5).map((category, index) => {
                    const percentage = Math.round((category.count / basicStats.totalPurchased) * 100)
                    return (
                      <div key={category.item} className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              CHART_COLORS[index] || 'from-gray-400 to-gray-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 text-right min-w-0 flex-shrink-0">
                          {category.item} ({category.count})
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recent Purchases */}
            {purchaseHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  רכישות אחרונות
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {purchaseHistory
                    .slice(-5)
                    .reverse()
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <div className="text-xs text-gray-500">
                          {item.purchasedAt ? formatDate(item.purchasedAt) : 'לא ידוע'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

// Helper component for stat cards
interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  color: 'purple' | 'blue' | 'green' | 'orange'
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <div className="text-lg font-bold">{value}</div>
      </div>
      <div className="text-xs">{label}</div>
    </div>
  )
}
