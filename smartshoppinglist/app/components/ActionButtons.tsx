import { Sparkles, TrendingUp } from 'lucide-react'
import { FadeIn } from './Animations'

interface ActionButtonsProps {
  inCartCount: number
  purchasedCount: number
  onStartCheckout: () => void
  onClearPurchased: () => void
}

export const ActionButtons = ({ 
  inCartCount, 
  purchasedCount, 
  onStartCheckout, 
  onClearPurchased 
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Checkout Button */}
      {inCartCount > 0 && (
        <FadeIn>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-green-800 mb-2">מוכן לקניות?</h3>
              <p className="text-green-600 text-sm">יש לך {inCartCount} מוצרים בסל</p>
            </div>
            <button
              onClick={onStartCheckout}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              <span>בואו נתחיל לקנות!</span>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                {inCartCount}
              </div>
            </button>
          </div>
        </FadeIn>
      )}

      {/* Clear Purchased Button */}
      {purchasedCount > 0 && (
        <FadeIn delay={100}>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
            <button
              onClick={onClearPurchased}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>נקה רשימת קניות ({purchasedCount})</span>
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
