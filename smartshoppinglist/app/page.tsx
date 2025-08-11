'use client'

import { useState } from 'react'
import { Clock, ShoppingCart, X } from 'lucide-react'

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
import { useSoundManager } from './utils/soundManager'
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
  // Toast hook
  const { showSuccess, showError, showInfo } = useToasts()
  
  // Sound hook
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()

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
      playPurchase()
      showSuccess('קנייה הושלמה!', 'כל המוצרים נוספו למזווה')
    }
  }

  // Wrapper functions with toasts and sounds
  const handleAddItem = (name: string, category: string) => {
    addItem(name, category)
    playAddToCart()
    showSuccess('מוצר נוסף', `${name} נוסף לרשימה`)
  }

  const handleToggleCart = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      toggleItemInCart(id)
      if (item.isInCart) {
        playRemoveFromCart()
        showInfo('הוסר מהסל', item.name)
      } else {
        playAddToCart()
        showSuccess('נוסף לסל', item.name)
      }
    }
  }

  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      removeItem(id)
      playDelete()
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-2">
                <button
                  onClick={startCheckout}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>סיימתי קניות!</span>
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                    {inCart.length}
                  </div>
                </button>
                <div className="text-xs text-gray-600 text-center">
                  לחץ כדי לסמן הכל כנקנה
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-gray-800 text-right mb-2">בסל הקניות</h3>
                <div className="text-4xl">🛒</div>
              </div>
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
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  <span>נקה הכל ({purchased.length})</span>
                </button>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl text-gray-800 text-right">רכישות שהושלמו</h3>
                  <div className="text-3xl animate-bounce-gentle">✅</div>
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