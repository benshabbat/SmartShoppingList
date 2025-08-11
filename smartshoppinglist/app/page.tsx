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
import { QuickListCreator } from './components/QuickListCreator'
import { DataExport } from './components/DataExport'

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

  const handleCreateQuickList = (items: Array<{name: string, category: string}>) => {
    items.forEach(item => {
      addItem(item.name, item.category)
    })
    showSuccess('רשימה נוצרה!', `נוספו ${items.length} פריטים`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Header - Full Width */}
          <div className="lg:col-span-12">
            <Header onOpenTutorial={openTutorial} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Quick List Creator */}
            <QuickListCreator onCreateList={handleCreateQuickList} />

            {/* Add Item Form */}
            <AddItemForm onAddItem={handleAddItem} />

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
              {pending.length > 0 && (
                <CategorySection
                  title="רשימת קניות"
                  items={pending}
                  onToggleCart={handleToggleCart}
                  onRemove={handleRemoveItem}
                />
              )}

              {inCart.length > 0 && (
                <CategorySection
                  title="בעגלה"
                  items={inCart}
                  onToggleCart={handleToggleCart}
                  onRemove={handleRemoveItem}
                />
              )}

              {purchased.length > 0 && (
                <CategorySection
                  title="נקנו"
                  items={purchased}
                  onToggleCart={handleToggleCart}
                  onRemove={handleRemoveItem}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Export Data */}
            <div className="flex justify-center lg:justify-start">
              <DataExport 
                items={items}
                purchaseHistory={purchaseHistory}
                pantryItems={pantryItems}
              />
            </div>

            {/* Statistics */}
            <Statistics 
              purchaseHistory={purchaseHistory}
              suggestions={suggestions}
              pantryItems={pantryItems}
            />
          </div>
        </div>

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
      </div>
    </div>
  )
}