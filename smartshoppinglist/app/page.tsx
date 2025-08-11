'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'

// Components
import { Header } from './components/Header'
import { AddItemForm } from './components/AddItemForm'
import { SmartSuggestions } from './components/SmartSuggestions'
import { CategorySection } from './components/CategorySection'
import { Statistics } from './components/Statistics'
import { CheckoutModal, ExpiryModal } from './components/Modals'
import { QuickAddButtons } from './components/QuickAddButtons'
import { Tutorial, useTutorial } from './components/Tutorial'
import { ToastContainer, useToasts } from './components/Toast'

// Hooks and Utils
import { useShoppingList } from './hooks/useShoppingList'
import { getPopularItems } from './utils/smartSuggestions'
import { ShoppingItem } from './types'

export default function ShoppingListApp() {
  const {
    items,
    suggestions,
    expiringItems,
    purchaseHistory,
    pantryItems,
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchased,
    addSuggestedItem,
    addExpiringItemToList,
    removeFromPantry,
    getItemsByStatus,
    updateItemWithExpiry
  } = useShoppingList()

  // Tutorial hook
  const { showTutorial, closeTutorial, openTutorial } = useTutorial()
  
  // Toast hook
  const { showSuccess, showError, showInfo } = useToasts()

  // Modal states
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>([])
  const [currentCheckoutIndex, setCurrentCheckoutIndex] = useState(0)

  const startCheckout = () => {
    const itemsInCart = items.filter(item => item.isInCart && !item.isPurchased)
    if (itemsInCart.length === 0) {
      showInfo('הסל ריק', 'אין מוצרים בסל הקניות')
      return
    }
    
    setCheckoutItems(itemsInCart)
    setCurrentCheckoutIndex(0)
    setShowCheckoutModal(true)
    showInfo('התחלת קנייה', `${itemsInCart.length} מוצרים לרכישה`)
  }

  const handleCheckoutNext = (expiryDate?: Date) => {
    const currentItem = checkoutItems[currentCheckoutIndex]
    updateItemWithExpiry(currentItem.id, expiryDate)
    
    if (currentCheckoutIndex < checkoutItems.length - 1) {
      setCurrentCheckoutIndex(prev => prev + 1)
    } else {
      setShowCheckoutModal(false)
      setCheckoutItems([])
      setCurrentCheckoutIndex(0)
      showSuccess('קנייה הושלמה!', 'כל המוצרים נוספו למזווה')
    }
  }

  // Wrapper functions with toasts
  const handleAddItem = (name: string, category: string) => {
    addItem(name, category)
    showSuccess('מוצר נוסף', `${name} נוסף לרשימה`)
  }

  const handleToggleCart = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      toggleItemInCart(id)
      if (item.isInCart) {
        showInfo('הוסר מהסל', item.name)
      } else {
        showSuccess('נוסף לסל', item.name)
      }
    }
  }

  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      removeItem(id)
      showError('מוצר הוסר', item.name)
    }
  }

  const { pending, inCart, purchased } = getItemsByStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Header onOpenTutorial={openTutorial} />

        {/* Toast Container */}
        <ToastContainer />

        {/* Tutorial */}
        <Tutorial 
          isOpen={showTutorial} 
          onClose={closeTutorial} 
        />

        {/* Modals */}
        <CheckoutModal
          isOpen={showCheckoutModal}
          items={checkoutItems}
          currentIndex={currentCheckoutIndex}
          onNext={handleCheckoutNext}
          onClose={() => setShowCheckoutModal(false)}
        />

        <ExpiryModal
          isOpen={showExpiryModal}
          expiringItems={expiringItems}
          onAddToList={addExpiringItemToList}
          onRemoveFromPantry={removeFromPantry}
          onClose={() => setShowExpiryModal(false)}
        />

        {/* Add new item */}
        <AddItemForm 
          onAddItem={handleAddItem} 
          purchaseHistory={purchaseHistory}
          currentItems={items}
        />

        {/* Quick Add Buttons */}
        <QuickAddButtons 
          onAddItem={handleAddItem}
          popularItems={getPopularItems(purchaseHistory)}
        />

        {/* Toast Container */}
        <ToastContainer />

        {/* Smart Suggestions */}
        <SmartSuggestions 
          suggestions={suggestions} 
          onAddSuggestion={addSuggestedItem} 
        />

        {/* Expiring Items Alert */}
        {expiringItems.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500 rounded-full">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">מוצרים שעומדים לפוג</h3>
            </div>
            <div className="text-gray-600 mb-4 text-right">
              יש לך {expiringItems.length} מוצרים שעומדים לפוג בקרוב
            </div>
            <button
              onClick={() => setShowExpiryModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all font-medium shadow-lg"
            >
              הצג פרטים
            </button>
          </div>
        )}

        {/* Shopping List */}
        <CategorySection
          title="רשימת קניות 📝"
          items={pending}
          onToggleCart={handleToggleCart}
          onRemove={handleRemoveItem}
          variant="pending"
          headerColor="bg-gray-100 text-gray-700"
          emptyMessage="הרשימה ריקה. התחל להוסיף מוצרים!"
        />

        {/* Shopping Cart */}
        {inCart.length > 0 && (
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={startCheckout}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                סיימתי קניות ({inCart.length})
              </button>
              <h3 className="font-semibold text-gray-800 text-right">בסל 🛒</h3>
            </div>
            <CategorySection 
              title=""
              items={inCart}
              onToggleCart={handleToggleCart}
              onRemove={handleRemoveItem}
              variant="inCart"
            />
          </div>
        )}

        {/* Purchased Items */}
        {purchased.length > 0 && (
          <div className="relative">
            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg z-10">
              ✓
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 mb-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={clearPurchased}
                  className="text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-all"
                >
                  נקה הכל
                </button>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl text-gray-800 text-right">נקנה</h3>
                  <div className="text-2xl">✅</div>
                </div>
              </div>

              <CategorySection
                title=""
                items={purchased}
                onToggleCart={handleToggleCart}
                onRemove={handleRemoveItem}
                variant="purchased"
              />
            </div>
          </div>
        )}

        {/* Statistics */}
        <Statistics
          purchaseHistory={purchaseHistory}
          suggestions={suggestions}
          pantryItems={pantryItems}
        />

      </div>
    </div>
  )
}