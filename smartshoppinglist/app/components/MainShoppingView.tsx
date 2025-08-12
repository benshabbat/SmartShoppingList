'use client'

import { useShoppingListContext } from '../providers'
import { useAuthContext } from '../hooks'

// Components
import { AddItemForm } from './AddItemForm'
import { SmartSuggestions } from './SmartSuggestions'
import { DataExport } from './DataExport'
import { ExpiryNotification } from './ExpiryNotification'
import { GuestWelcomeMessage } from './GuestWelcomeMessage'
import { ShoppingListSections } from './ShoppingListSections'
import { QuickStatsCards } from './QuickStatsCards'
import { QuickListCreator } from './QuickListCreator'

export function MainShoppingView() {
  const { isGuest } = useAuthContext()
  const {
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    addSuggestedItem,
    addItem,
    handleToggleCart,
    handleRemoveItem,
    handleCheckout,
    handleClearCart,
    handleClearPurchased,
    getItemsByStatus,
    showSuccess,
  } = useShoppingListContext()

  // Helper function to check if user has items
  const hasExpiringItems = expiringItems.length > 0
  const hasPurchaseHistory = purchaseHistory.length > 0
  
  // Get items by status
  const { pending, inCart, purchased } = getItemsByStatus()

  // Handle quick list creation
  const handleCreateQuickList = async (items: Array<{name: string, category: string}>) => {
    for (const item of items) {
      await addItem(item.name, item.category)
    }
    showSuccess(`נוספו ${items.length} פריטים לרשימה`)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Guest Welcome */}
      {isGuest && (
        <GuestWelcomeMessage isGuest={isGuest} />
      )}

      {/* Quick Stats */}
      <QuickStatsCards 
        pending={pending}
        inCart={inCart}
        purchased={purchased}
      />

      {/* Quick List Creator */}
      <QuickListCreator 
        onCreateList={handleCreateQuickList}
        onAddToCart={handleCreateQuickList}
      />

      {/* Add Item Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <AddItemForm />
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <SmartSuggestions 
          onAddSuggestion={addSuggestedItem}
        />
      )}

      {/* Shopping List Sections */}
      <ShoppingListSections
        pending={pending}
        inCart={inCart}
        purchased={purchased}
        onToggleCart={handleToggleCart}
        onRemove={handleRemoveItem}
        onCheckout={handleCheckout}
        onClearCart={handleClearCart}
        onClearPurchased={handleClearPurchased}
      />

      {/* Expiry Notifications */}
      {hasExpiringItems && (
        <ExpiryNotification
          expiringItems={expiringItems}
          onAddToList={() => {}}
          onRemoveFromPantry={() => {}}
          onDismiss={() => {}}
        />
      )}

      {/* Data Export */}
      {hasPurchaseHistory && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DataExport
            items={items}
            purchaseHistory={purchaseHistory}
            pantryItems={pantryItems}
          />
        </div>
      )}
    </div>
  )
}
