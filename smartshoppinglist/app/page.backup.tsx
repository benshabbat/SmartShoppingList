'use client'

import { useState } from 'react'

// Components
import { Header } from './components/Header'
import { AddItemForm } from './components/AddItemForm'
import { SmartSuggestions } from './components/SmartSuggestions'
import { CategorySection } from './components/CategorySection'
import { QuickAddButtons } from './components/QuickAddButtons'
import { Tutorial, useTutorial } from './components/Tutorial'
import { ToastContainer, useToasts } from './components/Toast'
import { QuickListCreator } from './components/QuickListCreator'
import { DataExport } from './components/DataExport'
import { Card, CardHeader } from './components/Card'
import { ReceiptScanner } from './components/ReceiptScanner'
import { ExpiryDateModal } from './components/ExpiryDateModal'
import { ExpiryNotification } from './components/ExpiryNotification'
import { GuestModeNotification } from './components/GuestModeNotification'
import { DataImportModal } from './components/DataImportModal'
import { LoginForm } from './components/LoginForm'

// Hooks and Utils
import { 
  useShoppingList, 
  useItemOperations,
  useStatistics,
  useAuthContext,
  useAnalytics
} from './hooks'
import { ShoppingItem } from './types'
import { useSoundManager } from './utils/soundManager'
import { MESSAGES } from './utils'

export default function ShoppingListApp() {
  const { loading, isAuthenticated, isGuest } = useAuthContext()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [showDataImportModal, setShowDataImportModal] = useState(false)

  // Debug log
  console.log('🚀 App render:', { loading, isAuthenticated, isGuest, showLoginForm })

  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>([])

  // Main shopping list functionality - hooks must be called unconditionally
  const {
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchased,
    addSuggestedItem,
    updateItemWithExpiry,
    addItemsFromReceipt,
    removeFromPantry,
    setExpiringItems,
    importGuestData,
    hasGuestData
  } = useShoppingList()

  // Analytics functionality
  const analytics = useAnalytics(purchaseHistory, pantryItems)

  // Tutorial hook
  const { showTutorial, closeTutorial, openTutorial } = useTutorial()
  
  // Toast hook
  const { showSuccess, showError, showInfo } = useToasts()
  
  // Sound hook
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()

  // Item operations hook
  const {
    handleToggleCart,
    handleRemoveItem,
    handleClearPurchased,
    handleClearCart,
    handleCheckout,
    handleCompletePurchase,
    getItemsByStatus,
  } = useItemOperations({
    items,
    onToggleCart: toggleItemInCart,
    onRemoveItem: removeItem,
    onClearPurchased: clearPurchased,
    onUpdateItemWithExpiry: updateItemWithExpiry,
    onShowSuccess: showSuccess,
    onShowError: showError,
    onShowInfo: showInfo,
    onShowExpiryModal: (cartItems) => {
      setCheckoutItems(cartItems)
      setShowExpiryModal(true)
    },
    onPlaySound: (soundType) => {
      switch (soundType) {
        case 'addToCart': playAddToCart(); break
        case 'removeFromCart': playRemoveFromCart(); break
        case 'purchase': playPurchase(); break
        case 'delete': playDelete(); break
      }
    },
  })

  // Statistics hook
  const {} = useStatistics({
    purchaseHistory,
    suggestions,
    pantryItems,
  })

  // Wrapper function for adding items
  const handleAddItem = (name: string, category: string) => {
    addItem(name, category)
    playAddToCart()
    showSuccess(MESSAGES.SUCCESS.ITEM_ADDED, `${name} נוסף לרשימה`)
  }

  const handleCreateQuickList = (items: Array<{name: string, category: string}>) => {
    items.forEach(item => {
      addItem(item.name, item.category)
    })
    showSuccess(MESSAGES.SUCCESS.LIST_CREATED, `נוספו ${items.length} פריטים`)
  }

  const handleReceiptProcessed = (receiptItems: ShoppingItem[], storeName: string) => {
    addItemsFromReceipt(receiptItems)
    setShowReceiptScanner(false)
    showSuccess(
      'קבלה נוספה בהצלחה!', 
      `נוספו ${receiptItems.length} פריטים מ${storeName}`
    )
  }

  const handleExpiryModalSubmit = (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => {
    handleCompletePurchase(itemsWithExpiry)
    setShowExpiryModal(false)
    setCheckoutItems([])
  }

  const handleExpiryModalClose = () => {
    setShowExpiryModal(false)
    setCheckoutItems([])
  }

  const handleAddExpiringItem = (itemName: string) => {
    handleAddItem(itemName, 'אחר') // Default category for expired items
  }

  const { pending, inCart, purchased } = getItemsByStatus()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    )
  }

  // Show login form if user is not authenticated 
  if (!isAuthenticated) {
    return (
      <LoginForm 
        onSuccess={() => {
          console.log('LoginForm onSuccess called')
          setShowLoginForm(false)
          // Check if there's guest data to import after successful login
          if (hasGuestData()) {
            setShowDataImportModal(true)
          }
        }} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ToastContainer />
      
      {showTutorial && <Tutorial isOpen={showTutorial} onClose={closeTutorial} />}
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header 
          onOpenTutorial={openTutorial} 
          onOpenReceiptScanner={() => setShowReceiptScanner(true)}
        />
        
        {/* Guest Mode Notification - More subtle version after authentication */}
        <GuestModeNotification onSwitchToAuth={() => setShowLoginForm(true)} />
        
        {/* First-time guest explanation */}
        {isGuest && typeof window !== 'undefined' && !localStorage.getItem('guest_explanation_seen') && (
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
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('guest_explanation_seen', 'true')
                        location.reload()
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
        
        {/* Expiry Notifications */}
        {expiringItems.length > 0 && (
          <ExpiryNotification
            expiringItems={expiringItems}
            onAddToList={handleAddExpiringItem}
            onRemoveFromPantry={removeFromPantry}
            onDismiss={() => setExpiringItems([])}
          />
        )}
        
        {/* Quick Stats */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 sm:p-4 text-center shadow-md text-white">
              <div className="text-lg sm:text-2xl font-bold">{pending.length}</div>
              <div className="text-xs sm:text-sm opacity-90">לקנות</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2 sm:p-4 text-center shadow-md text-white">
              <div className="text-lg sm:text-2xl font-bold">{inCart.length}</div>
              <div className="text-xs sm:text-sm opacity-90">בסל</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2 sm:p-4 text-center shadow-md text-white">
              <div className="text-lg sm:text-2xl font-bold">{purchased.length}</div>
              <div className="text-xs sm:text-sm opacity-90">נקנו</div>
            </div>
          </div>
        </Card>

        {/* Quick List Creator */}
        <QuickListCreator 
          onCreateList={handleCreateQuickList}
          onAddToCart={handleCreateQuickList}
        />

        {/* Add Item Form */}
        <AddItemForm 
          purchaseHistory={purchaseHistory}
          currentItems={items}
        />

        {/* Smart Suggestions */}
        <SmartSuggestions 
          onAddSuggestion={addSuggestedItem}
        />

        {/* Quick Add Buttons */}
        <QuickAddButtons 
          onAddItem={handleAddItem}
        />

        {/* Shopping List by Categories */}
        <div className="space-y-4">
          {pending.length > 0 ? (
            <CategorySection
              title="רשימת קניות"
              items={pending}
              onToggleCart={handleToggleCart}
              onRemove={handleRemoveItem}
            />
          ) : (
            <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <div className="py-8">
                <div className="text-6xl mb-4">�</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">הרשימה ריקה</h3>
                <p className="text-gray-600 mb-4">התחל להוסיף מוצרים או צור רשימה מהירה</p>
                <div className="text-2xl">✨</div>
              </div>
            </Card>
          )}

          {inCart.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
              <CardHeader
                title="🛒 בסל הקניות"
                icon={<div className="text-2xl">�️</div>}
                action={
                  <div className="flex gap-2">
                    <button
                      onClick={handleCheckout}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                    >
                      🛒 סיימתי קניות ({inCart.length})
                    </button>
                    <button
                      onClick={handleClearCart}
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
                onToggleCart={handleToggleCart}
                onRemove={handleRemoveItem}
                variant="inCart"
              />
            </Card>
          )}

          {purchased.length > 0 && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200">
              <CardHeader
                title="רכישות שהושלמו"
                icon={<div className="text-2xl">✅</div>}
                action={
                  <button
                    onClick={handleClearPurchased}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    🗑️ נקה הכל ({purchased.length})
                  </button>
                }
              />
              <CategorySection
                title=""
                items={purchased}
                onToggleCart={handleToggleCart}
                onRemove={handleRemoveItem}
                variant="purchased"
              />
            </Card>
          )}
        </div>

        {/* Data Export */}
        <DataExport 
          items={items}
          purchaseHistory={purchaseHistory}
          pantryItems={pantryItems}
        />

        {/* Receipt Scanner Modal */}
        {showReceiptScanner && (
          <ReceiptScanner
            onReceiptProcessed={handleReceiptProcessed}
            onClose={() => setShowReceiptScanner(false)}
          />
        )}

        {/* Expiry Date Modal */}
        {showExpiryModal && (
          <ExpiryDateModal
            items={checkoutItems}
            isOpen={showExpiryModal}
            onClose={handleExpiryModalClose}
            onSubmit={handleExpiryModalSubmit}
          />
        )}

        {/* Data Import Modal */}
        {showDataImportModal && (
          <DataImportModal
            isOpen={showDataImportModal}
            onClose={() => setShowDataImportModal(false)}
            onImportGuestData={async () => {
              await importGuestData()
              showSuccess('נתונים יובאו בהצלחה!', 'הנתונים ממצב האורח נוספו לחשבון שלך')
            }}
            hasGuestData={hasGuestData()}
          />
        )}
      </div>
    </div>
  )
}