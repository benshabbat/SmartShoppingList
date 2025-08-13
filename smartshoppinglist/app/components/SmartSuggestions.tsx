import { Lightbulb, Sparkles } from 'lucide-react'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'

export const SmartSuggestions = () => {
  // Get everything from global context - NO PROPS!
  const { suggestions, addItem, showSuccess } = useGlobalShopping()

  if (suggestions.length === 0) return null

  const handleAddSuggestion = async (name: string) => {
    try {
      await addItem(name, 'כלל') // Default category
      showSuccess(`${name} נוסף לרשימה`)
    } catch (_error) {
      // Error already handled in global context
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-lg p-6 mb-6 border border-amber-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-500 rounded-full">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-xl text-gray-800">הצעות חכמות</h3>
        <Sparkles className="w-5 h-5 text-amber-500" />
      </div>
      
      <p className="text-gray-600 mb-4 text-right">
        על בסיס ההיסטוריה שלך, אולי תרצה להוסיף:
      </p>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-amber-100 hover:shadow-md transition-all">
            <button
              onClick={() => handleAddSuggestion(suggestion.name)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              הוסף
            </button>
            
            <div className="text-right flex-1 mr-4">
              <span className="font-semibold text-lg text-gray-800">{suggestion.name}</span>
              <div className="text-sm text-gray-500 flex items-center gap-3 justify-end mt-1">
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  נקנה {suggestion.frequency} פעמים
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  לפני {suggestion.daysSinceLastBought} ימים
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
