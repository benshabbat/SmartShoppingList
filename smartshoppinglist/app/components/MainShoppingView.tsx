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
import { QuickAddButtons } from './QuickAddButtons'
import { ReceiptScanner } from './ReceiptScanner'
import { ExpiryDateModal } from './ExpiryDateModal'
import { DataImportModal } from './DataImportModal'

// Types
import { ShoppingItem } from '../types'

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
    updateItemWithExpiry,
    addItemsFromReceipt,
    removeFromPantry,
    setExpiringItems,
    importGuestData,
    hasGuestData,
    // Modal state from context
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
    checkoutItems,
    // Modal actions from context
    openReceiptScanner,
    closeReceiptScanner,
    openExpiryModal,
    closeExpiryModal,
    openDataImportModal,
    closeDataImportModal,
    // Complex actions from context
    handleCreateQuickList,
    handleReceiptProcessed,
    handleExpiryModalSubmit,
    handleAddExpiringItem,
    handleCheckoutWithExpiry,
    // Helper computed values
    isPantryEmpty,
    hasItemsInCart,
    hasExpiringItems,
    hasPurchaseHistory,
    // Guest functions
    shouldShowGuestExplanation,
    dismissGuestExplanation,
  } = useShoppingListContext()

  // Get items by status
  const { pending, inCart, purchased } = getItemsByStatus()

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Guest Welcome */}
      {isGuest && (
        <GuestWelcomeMessage isGuest={isGuest} />
      )}

      {/* First-time guest explanation */}
      {isGuest && shouldShowGuestExplanation() && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 border border-indigo-200">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 rounded-full p-2 mt-1">
              <span className="text-indigo-600">ℹ️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-indigo-900 mb-2">
                🎉 ברוך הבא למצב אורח!
              </h3>
              <p className="text-sm text-indigo-700 mb-3 leading-relaxed">
                אתה כעת במצב אורח - כל הנתונים שלך נשמרים באופן מקומי במכשיר זה ולא נשלחים לשום שרת. 
                זה אומר פרטיות מלאה, אבל גם שהנתונים זמינים רק במכשיר הזה.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    dismissGuestExplanation()
                    if (typeof window !== 'undefined') {
                      window.location.reload()
                    }
                  }}
                  className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  הבנתי
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Quick Add Buttons */}
      <QuickAddButtons 
        onAddItem={async (name: string, category: string) => {
          await addItem(name, category)
          showSuccess(`${name} נוסף לרשימה`)
        }}
      />

      {/* Expiry Notifications */}
      {hasExpiringItems && expiringItems.length > 0 && (
        <ExpiryNotification
          expiringItems={expiringItems}
          onAddToList={handleAddExpiringItem}
          onRemoveFromPantry={removeFromPantry}
          onDismiss={() => setExpiringItems([])}
        />
      )}

      {/* Shopping List Sections */}
      <ShoppingListSections
        pending={pending}
        inCart={inCart}
        purchased={purchased}
        onToggleCart={handleToggleCart}
        onRemove={handleRemoveItem}
        onCheckout={handleCheckoutWithExpiry}
        onClearCart={handleClearCart}
        onClearPurchased={handleClearPurchased}
      />

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

      {/* Receipt Scanner Modal */}
      {showReceiptScanner && (
        <ReceiptScanner
          onReceiptProcessed={handleReceiptProcessed}
          onClose={closeReceiptScanner}
        />
      )}

      {/* Expiry Date Modal */}
      {showExpiryModal && (
        <ExpiryDateModal
          items={checkoutItems}
          isOpen={showExpiryModal}
          onClose={closeExpiryModal}
          onSubmit={handleExpiryModalSubmit}
        />
      )}

      {/* Data Import Modal */}
      {showDataImportModal && (
        <DataImportModal
          isOpen={showDataImportModal}
          onClose={closeDataImportModal}
          onImportGuestData={async () => {
            await importGuestData()
            showSuccess('נתונים יובאו בהצלחה!')
            closeDataImportModal()
          }}
          hasGuestData={hasGuestData()}
        />
      )}
    </div>
  )
}
