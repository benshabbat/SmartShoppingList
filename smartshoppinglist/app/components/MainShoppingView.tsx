'use client'

import { useState, useEffect } from 'react'
import { ShoppingItem } from '../types'

// Components
import { Header } from './Header'
import { AddItemForm } from './AddItemForm'
import { SmartSuggestions } from './SmartSuggestions'
import { QuickAddButtons } from './QuickAddButtons'
import { Tutorial, useTutorial } from './Tutorial'
import { ToastContainer, useToasts } from './Toast'
import { QuickListCreator } from './QuickListCreator'
import { DataExport } from './DataExport'
import { ExpiryNotification } from './ExpiryNotification'
import { GuestModeNotification } from './GuestModeNotification'
import { QuickStatsCards } from './QuickStatsCards'
import { GuestWelcomeMessage } from './GuestWelcomeMessage'
import { ShoppingListSections } from './ShoppingListSections'
import { ModalsContainer } from './ModalsContainer'

// Hooks and Utils
import { 
  useShoppingList, 
  useItemOperations,
  useStatistics,
  useAuthContext,
  useAnalytics
} from '../hooks'
import { useSoundManager } from '../utils/soundManager'
import { MESSAGES } from '../utils'

export function MainShoppingView() {
  const { isAuthenticated, isGuest } = useAuthContext()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [showDataImportModal, setShowDataImportModal] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>([])

  // Main shopping list functionality
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
  
  // Auto-refresh analytics when items change
  useEffect(() => {
    analytics.refreshAnalytics()
  }, [items.length, analytics.refreshAnalytics])

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

  // Event handlers
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ToastContainer />
      
      {showTutorial && <Tutorial isOpen={showTutorial} onClose={closeTutorial} />}
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header 
          onOpenTutorial={openTutorial} 
          onOpenReceiptScanner={() => setShowReceiptScanner(true)}
        />
        
        {/* Guest Mode Notification */}
        <GuestModeNotification onSwitchToAuth={() => setShowLoginForm(true)} />
        
        {/* First-time guest explanation */}
        <GuestWelcomeMessage isGuest={isGuest} />
        
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

        {/* Data Export */}
        <DataExport 
          items={items}
          purchaseHistory={purchaseHistory}
          pantryItems={pantryItems}
        />

        {/* Modals */}
        <ModalsContainer
          showReceiptScanner={showReceiptScanner}
          showExpiryModal={showExpiryModal}
          showDataImportModal={showDataImportModal}
          checkoutItems={checkoutItems}
          hasGuestData={hasGuestData()}
          onReceiptProcessed={handleReceiptProcessed}
          onCloseReceiptScanner={() => setShowReceiptScanner(false)}
          onExpiryModalSubmit={handleExpiryModalSubmit}
          onExpiryModalClose={handleExpiryModalClose}
          onCloseDataImportModal={() => setShowDataImportModal(false)}
          onImportGuestData={async () => {
            await importGuestData()
            showSuccess('נתונים יובאו בהצלחה!', 'הנתונים ממצב האורח נוספו לחשבון שלך')
          }}
        />
      </div>
    </div>
  )
}
