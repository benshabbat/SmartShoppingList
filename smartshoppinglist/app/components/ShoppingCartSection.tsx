'use client'

import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { Card, CardHeader } from './Card'
import { CategorySection } from './CategorySection'

export function ShoppingCartSection() {
  const { 
    cartItems, 
    toggleItemInCart, 
    removeItem, 
    handleCheckout, 
    clearPurchasedItems 
  } = useGlobalShopping()

  if (cartItems.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
      <CardHeader
        title="🛒 בסל הקניות"
        icon={<div className="text-2xl">🛒️</div>}
        action={
          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              🛒 סיימתי קניות ({cartItems.length})
            </button>
            <button
              onClick={clearPurchasedItems}
              className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🗑️
            </button>
          </div>
        }
      />
      <CategorySection 
        title=""
        items={cartItems}
        onToggleCart={toggleItemInCart}
        onRemove={removeItem}
        variant="inCart"
      />
    </Card>
  )
}
