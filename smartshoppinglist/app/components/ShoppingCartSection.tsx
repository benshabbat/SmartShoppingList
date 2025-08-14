'use client'

import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { Card, CardHeader } from './Card'
import { CategorySection } from './CategorySection'
import { gradientBackgrounds, commonButtons } from '../utils/classNames'

export function ShoppingCartSection() {
  const { 
    cartItems, 
    toggleItemInCart: _toggleItemInCart, 
    removeItem: _removeItem, 
    handleCheckout, 
    clearPurchasedItems 
  } = useGlobalShopping()

  if (cartItems.length === 0) {
    return null
  }

  return (
    <Card className={`${gradientBackgrounds.blue} backdrop-blur-sm border-2 border-blue-200 shadow-lg`}>
      <CardHeader
        title="🛒 בסל הקניות"
        icon={<div className="text-2xl">🛒️</div>}
        action={
          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
              className={commonButtons.successLarge}
            >
              🛒 סיימתי קניות ({cartItems.length})
            </button>
            <button
              onClick={clearPurchasedItems}
              className={commonButtons.dangerLarge}
            >
              🗑️
            </button>
          </div>
        }
      />
      <CategorySection 
        title=""
        items={cartItems}
        variant="inCart"
      />
    </Card>
  )
}
