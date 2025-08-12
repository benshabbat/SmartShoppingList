'use client'

import { useShoppingListContext } from '../providers'
import { useAuthContext } from '../hooks'

// Components
import { AddItemForm } from './AddItemForm'
import { SmartSuggestions } from './SmartSuggestions'
import { DataExport } from './DataExport'
import { ExpiryNotification } from './ExpiryNotification'
import { GuestWelcomeMessage } from './GuestWelcomeMessage'

export function MainShoppingView() {
  const { isGuest } = useAuthContext()
  const {
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    addSuggestedItem,
  } = useShoppingListContext()

  // Helper function to check if user has items
  const hasExpiringItems = expiringItems.length > 0
  const hasPurchaseHistory = purchaseHistory.length > 0

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Guest Welcome */}
      {isGuest && (
        <GuestWelcomeMessage isGuest={isGuest} />
      )}

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
