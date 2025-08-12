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
import { LoginForm } from './components/LoginForm'

// Hooks and Utils
import { 
  useShoppingList, 
  useItemOperations,
  useStatistics,
  useAuth
} from './hooks'
import { ShoppingItem } from './types'
import { getPopularItems } from './utils/smartSuggestions'
import { useSoundManager } from './utils/soundManager'
import { MESSAGES } from './utils'

export default function ShoppingListApp() {
  const { isAuthenticated, loading } = useAuth()
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>([])

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
    setExpiringItems
  } = useShoppingList()

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

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ToastContainer />
      
      {showTutorial && <Tutorial isOpen={showTutorial} onClose={closeTutorial} />}
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header 
          onOpenTutorial={openTutorial} 
          onOpenReceiptScanner={() => setShowReceiptScanner(true)}
        />
        
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
        <Card className="mb-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-md">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{pending.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">לקנות</div>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-md">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{inCart.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">בסל</div>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-md">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{purchased.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">נקנו</div>
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
          onAddItem={handleAddItem}
          purchaseHistory={purchaseHistory}
          currentItems={items}
        />

        {/* Smart Suggestions */}
        <SmartSuggestions 
          suggestions={suggestions}
          onAddSuggestion={addSuggestedItem}
        />

        {/* Quick Add Buttons */}
        <QuickAddButtons 
          onAddItem={handleAddItem}
          popularItems={getPopularItems(purchaseHistory)}
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
            <Card className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">הרשימה ריקה</h3>
              <p className="text-gray-600">התחל להוסיף מוצרים או צור רשימה מהירה</p>
            </Card>
          )}

          {inCart.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader
                title="בסל הקניות"
                icon={<div className="text-2xl">🛒</div>}
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
      </div>
    </div>
  )
}