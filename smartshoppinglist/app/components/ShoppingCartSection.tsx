'use client'

import { ShoppingItem } from '../types'
import { Card, CardHeader } from './Card'
import { CategorySection } from './CategorySection'

interface ShoppingCartSectionProps {
  inCart: ShoppingItem[]
  onToggleCart: (id: string) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  onClearCart: () => void
}

export function ShoppingCartSection({ 
  inCart, 
  onToggleCart, 
  onRemove, 
  onCheckout, 
  onClearCart 
}: ShoppingCartSectionProps) {
  if (inCart.length === 0) {
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
  )
}
