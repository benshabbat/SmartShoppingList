import { Search, Clock, TrendingUp } from 'lucide-react'
import { useShoppingData } from '../contexts'
import { SuggestionItemProps } from '../types'

export const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  isHighlighted,
  onClick
}) => {
  // Get purchase history from specific hook - NO PROPS DRILLING!
  const { purchaseHistory } = useShoppingData()
  
  // חישוב תדירות מוצרים
  const getProductFrequency = (productName: string): number => {
    return purchaseHistory.filter(item => 
      item.name.toLowerCase() === productName.toLowerCase()
    ).length
  }

  const frequency = getProductFrequency(suggestion)
  const isPopular = frequency >= 2
  const isRecent = purchaseHistory
    .filter(item => item.name.toLowerCase() === suggestion.toLowerCase())
    .some(item => {
      if (!item.purchasedAt) return false
      const daysSince = Math.floor((Date.now() - new Date(item.purchasedAt).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince <= 7
    })

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-right hover:bg-indigo-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
        isHighlighted ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {isRecent && (
            <div className="flex items-center gap-1 text-green-500">
              <Clock className="w-3 h-3" />
              <span className="text-xs">לאחרונה</span>
            </div>
          )}
          {isPopular && (
            <div className="flex items-center gap-1 text-blue-500">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">{frequency}</span>
            </div>
          )}
          <Search className="w-4 h-4" />
        </div>
        <div className="font-medium">
          {suggestion}
        </div>
      </div>
    </button>
  )
}
