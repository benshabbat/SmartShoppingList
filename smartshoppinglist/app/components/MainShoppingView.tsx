'use client'

import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { useAuth } from '../hooks/useAuth'

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

export function MainShoppingView() {
  const { isGuest } = useAuth()
  
  // Get everything from global context - NO PROPS DRILLING!
  const {
    // Data
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    pendingItems,
    cartItems,
    purchasedItems,
    
    // UI State
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
    checkoutItems,
    
    // Actions - no need to pass as props!
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchasedItems,
    handleCheckout,
    createQuickList,
    processReceipt,
    submitExpiryModal,
    
    // UI Actions
    openReceiptScanner,
    closeReceiptScanner,
    openExpiryModal,
    closeExpiryModal,
    openDataImportModal,
    closeDataImportModal,
    
    // Computed values
    hasItemsInCart,
    hasExpiringItems,
    hasPurchaseHistory,
    isPantryEmpty,
    shouldShowGuestExplanation,
    dismissGuestExplanation,
    
    // Additional actions
    showSuccess,
  } = useGlobalShopping()

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Guest Welcome */}
      {isGuest && (
        <GuestWelcomeMessage isGuest={isGuest} />
      )}

      {/* First-time guest explanation */}
      {isGuest && shouldShowGuestExplanation && (
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

      {/* Quick Stats - NO PROPS! */}
      <QuickStatsCards />

      {/* Quick List Creator - SIMPLIFIED */}
      <QuickListCreator />

      {/* Add Item Form - NO PROPS DRILLING! */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <AddItemForm />
      </div>

      {/* Smart Suggestions - NO PROPS! */}
      {suggestions.length > 0 && (
        <SmartSuggestions />
      )}

      {/* Quick Add Buttons - NO PROPS! */}
      <QuickAddButtons />

      {/* Expiry Notifications - SIMPLIFIED */}
      {hasExpiringItems && expiringItems.length > 0 && (
        <ExpiryNotification />
      )}

      {/* Shopping List Sections - NO PROPS! */}
      <ShoppingListSections />

      {/* Data Export - NO PROPS! */}
      {hasPurchaseHistory && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DataExport />
        </div>
      )}

      {/* Modals - SIMPLIFIED */}
      {showReceiptScanner && (
        <ReceiptScanner />
      )}

      {showExpiryModal && (
        <ExpiryDateModal />
      )}

      {showDataImportModal && (
        <DataImportModal />
      )}
    </div>
  )
}
