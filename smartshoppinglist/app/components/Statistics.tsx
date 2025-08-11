import { History, TrendingUp, Package, Target } from 'lucide-react'

interface StatisticsProps {
  purchaseHistoryCount: number
  suggestionsCount: number
  pantryItemsCount: number
}

export const Statistics = ({ 
  purchaseHistoryCount, 
  suggestionsCount, 
  pantryItemsCount 
}: StatisticsProps) => {
  const stats = [
    {
      label: 'מוצרים נקנו',
      value: purchaseHistoryCount,
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      label: 'הצעות חכמות',
      value: suggestionsCount,
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'במזווה',
      value: pantryItemsCount,
      icon: Package,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
          <History className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-xl text-gray-800">סטטיסטיקות</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-4 text-center border border-gray-100 hover:shadow-md transition-all duration-200`}>
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-3`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
