'use client'

import { useCartOperations, usePurchaseOperations } from '../../../contexts'
import { Card, CardHeader } from '../../ui/Card'
import { CartItemsSection } from '../categories/SpecializedCategorySections'
import { gradientBackgrounds, commonButtons } from '../../../utils/ui/classNames'

export function ShoppingCartSection() {
  const { cartItems, checkout } = useCartOperations()
  const { clearPurchased } = usePurchaseOperations()

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
              onClick={checkout}
              className={commonButtons.successLarge}
            >
              🛒 סיימתי קניות ({cartItems.length})
            </button>
            <button
              onClick={clearPurchased}
              className={commonButtons.dangerLarge}
            >
              🗑️
            </button>
          </div>
        }
      />
      <CartItemsSection />
    </Card>
  )
}
