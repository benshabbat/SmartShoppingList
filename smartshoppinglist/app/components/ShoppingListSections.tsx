'use client'

import { useShoppingComputed, usePurchaseOperations } from '../contexts'
import { Card, CardHeader } from './Card'
import { PendingItemsSection, PurchasedItemsSection } from './SpecializedCategorySections'
import { ShoppingCartSection } from './ShoppingCartSection'

export function ShoppingListSections() {
  // Get only what we need from context - NO PROPS DRILLING!
  const { pendingItems, cartItems, purchasedItems } = useShoppingComputed()
  const { clearPurchased } = usePurchaseOperations()
  return (
    <div className="space-y-4">
      {/* Pending Items */}
      {pendingItems.length > 0 ? (
        <PendingItemsSection />
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
      {cartItems.length > 0 && <ShoppingCartSection/>}

      {/* Purchased Items */}
      {purchasedItems.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200">
          <CardHeader
            title="רכישות שהושלמו"
            icon={<div className="text-2xl">✅</div>}
            action={
              <button
                onClick={clearPurchased}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                🗑️ נקה הכל ({purchasedItems.length})
              </button>
            }
          />
          <PurchasedItemsSection />
        </Card>
      )}
    </div>
  )
}
