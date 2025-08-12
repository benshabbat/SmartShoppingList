'use client'

import { ShoppingItem } from '../types'
import { Card, CardHeader } from './Card'
import { CategorySection } from './CategorySection'

interface ShoppingListSectionsProps {
  pending: ShoppingItem[]
  inCart: ShoppingItem[]
  purchased: ShoppingItem[]
  onToggleCart: (id: string) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  onClearCart: () => void
  onClearPurchased: () => void
}

export function ShoppingListSections({
  pending,
  inCart,
  purchased,
  onToggleCart,
  onRemove,
  onCheckout,
  onClearCart,
  onClearPurchased
}: ShoppingListSectionsProps) {
  return (
    <div className="space-y-4">
      {/* Pending Items */}
      {pending.length > 0 ? (
        <CategorySection
          title="רשימת קניות"
          items={pending}
          onToggleCart={onToggleCart}
          onRemove={onRemove}
        />
      ) : (
        <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="py-8">
            <div className="text-6xl mb-4">🛍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">הרשימה ריקה</h3>
            <p className="text-gray-600 mb-4">התחל להוסיף מוצרים או צור רשימה מהירה</p>
            <div className="text-2xl">✨</div>
          </div>
        </Card>
      )}

      {/* In Cart Items */}
      {inCart.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
          <CardHeader
            title="🛒 בסל הקניות"
            icon={<div className="text-2xl">🛒️</div>}
            action={
              <div className="flex gap-2">
                <button
                  onClick={onCheckout}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  🛒 סיימתי קניות ({inCart.length})
                </button>
                <button
                  onClick={onClearCart}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🗑️
                </button>
              </div>
            }
          />
          <CategorySection 
            title=""
            items={inCart}
            onToggleCart={onToggleCart}
            onRemove={onRemove}
            variant="inCart"
          />
        </Card>
      )}

      {/* Purchased Items */}
      {purchased.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200">
          <CardHeader
            title="רכישות שהושלמו"
            icon={<div className="text-2xl">✅</div>}
            action={
              <button
                onClick={onClearPurchased}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                🗑️ נקה הכל ({purchased.length})
              </button>
            }
          />
          <CategorySection
            title=""
            items={purchased}
            onToggleCart={onToggleCart}
            onRemove={onRemove}
            variant="purchased"
          />
        </Card>
      )}
    </div>
  )
}
