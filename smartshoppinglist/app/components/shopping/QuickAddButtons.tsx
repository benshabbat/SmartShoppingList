import { ShoppingBag, Zap, Star } from 'lucide-react'
import { CATEGORY_EMOJIS } from '../../constants'
import { FadeIn } from '../ui/Animations'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { useAnalyticsSelectors } from '../../stores/data/analyticsStore'
import { createAsyncHandler, MESSAGES } from '../../utils'
import { gradientBackgrounds } from '../../utils/ui/classNames'

export const QuickAddButtons = () => {
  // Get everything from global context - NO PROPS!
  const { addItem, showSuccess, showError } = useGlobalShopping()
  const popularItems = useAnalyticsSelectors.usePopularItems()
  
  // Async handler for consistent error handling
  const asyncHandler = createAsyncHandler('QuickAddButtons', showError)
  
  if (popularItems.length === 0) return null

  const topItems = popularItems.slice(0, 6) // 6 הכי פופולריים

  const handleAddItem = async (name: string, category: string) => {
    await asyncHandler(async () => {
      await addItem(name, category)
      showSuccess(MESSAGES.SUCCESS.ITEM_ADDED(name))
    }, MESSAGES.ERROR.ADD_ITEM_FAILED())
  }

  return (
    <FadeIn delay={200}>
      <div className={`${gradientBackgrounds.accent} rounded-2xl shadow-lg p-4 mb-6 border border-purple-200 hover:shadow-xl transition-shadow duration-300`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-purple-100 rounded-full animate-bounce-gentle">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-right">הוספה מהירה</h3>
          <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {topItems.map((item, index) => (
            <FadeIn key={index} delay={300 + (index * 100)}>
              <button
                onClick={() => handleAddItem(item.name, item.category)}
                className="p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all text-right group hover:shadow-md transform hover:scale-105 duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-purple-500 font-medium bg-purple-100 px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                    <ShoppingBag className="w-3 h-3 text-purple-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm group-hover:text-purple-800 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-sm transform group-hover:scale-110 transition-transform">
                      {CATEGORY_EMOJIS[item.category as keyof typeof CATEGORY_EMOJIS]}
                    </span>
                  </div>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
        
        <div className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
          <Star className="w-3 h-3 text-yellow-400" />
          <span>המוצרים הפופולריים שלך</span>
          <Star className="w-3 h-3 text-yellow-400" />
        </div>
      </div>
    </FadeIn>
  )
}
