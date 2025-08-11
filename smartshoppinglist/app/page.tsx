'use client'

// Components
import { Header } from './components/Header'
import { AddItemForm } from './components/AddItemForm'
import { SmartSuggestions } from './components/SmartSuggestions'
import { CategorySection } from './components/CategorySection'
import { EnhancedStatistics } from './components/EnhancedStatistics'
import { QuickAddButtons } from './components/QuickAddButtons'
import { Tutorial, useTutorial } from './components/Tutorial'
import { ToastContainer, useToasts } from './components/Toast'
import { QuickListCreator } from './components/QuickListCreator'
import { DataExport } from './components/DataExport'

// Hooks and Utils
import { useShoppingList } from './hooks/useShoppingList'
import { getPopularItems } from './utils/smartSuggestions'
import { useSoundManager } from './utils/soundManager'

export default function ShoppingListApp() {
  const {
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    addItem,
    addItemToCart,
    toggleItemInCart,
    removeItem,
    clearPurchased,
    addSuggestedItem,
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

  const handleClearPurchased = () => {
    clearPurchased()
    playDelete()
    showInfo('נוקה', 'כל הרכישות הושלמו נמחקו')
  }

  const handleClearCart = () => {
    const cartItems = items.filter(item => item.isInCart && !item.isPurchased)
    if (cartItems.length === 0) {
      showError('הסל ריק', 'אין מוצרים בסל')
      return
    }
    
    // הסר את כל הפריטים מהסל
    cartItems.forEach(item => {
      toggleItemInCart(item.id)
    })
    
    playRemoveFromCart()
    showInfo('הסל נוקה', `${cartItems.length} מוצרים הוסרו מהסל`)
  }

  const handleCheckout = () => {
    const cartItems = items.filter(item => item.isInCart && !item.isPurchased)
    if (cartItems.length === 0) {
      showError('הסל ריק', 'אין מוצרים בסל לקנייה')
      return
    }
    
    // סמן את כל הפריטים בסל כנקנו
    cartItems.forEach(item => {
      updateItemWithExpiry(item.id, undefined)
    })
    
    playPurchase()
    showSuccess('קנייה הושלמה!', `${cartItems.length} מוצרים נקנו`)
  }

  const { pending, inCart, purchased } = getItemsByStatus()

  const handleCreateQuickList = (items: Array<{name: string, category: string}>) => {
    items.forEach(item => {
      addItem(item.name, item.category)
    })
    showSuccess('רשימה נוצרה!', `נוספו ${items.length} פריטים`)
  }

  const handleAddToCart = (items: Array<{name: string, category: string}>) => {
    items.forEach(item => {
      addItemToCart(item.name, item.category)
    })
    showSuccess('נוסף לסל!', `${items.length} פריטים נוספו ישירות לסל`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Header - Full Width */}
          <div className="xl:col-span-12">
            <Header onOpenTutorial={openTutorial} />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 mb-6">
              <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-md">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{items.filter(item => !item.isInCart && !item.isPurchased).length}</div>
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
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-8 space-y-4">
            
            {/* Quick List Creator */}
            <QuickListCreator 
              onCreateList={handleCreateQuickList}
              onAddToCart={handleAddToCart}
            />

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
              {pending.length > 0 ? (
                <CategorySection
                  title="רשימת קניות"
                  items={pending}
                  onToggleCart={handleToggleCart}
                  onRemove={handleRemoveItem}
                />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">הרשימה ריקה</h3>
                  <p className="text-gray-600">התחל להוסיף מוצרים או צור רשימה מהירה</p>
                </div>
              )}

              {inCart.length > 0 ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleCheckout}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
                      >
                        🛒 סיימתי קניות!
                        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                          {inCart.length}
                        </div>
                      </button>
                      <button
                        onClick={handleClearCart}
                        className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        🗑️ נקה סל
                      </button>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">בסל הקניות</h3>
                      <div className="text-4xl">🛒</div>
                    </div>
                  </div>
                  <CategorySection 
                    title=""
                    items={inCart}
                    onToggleCart={handleToggleCart}
                    onRemove={handleRemoveItem}
                  />
                </div>
              ) : items.some(item => !item.isPurchased) ? (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 text-center border-2 border-gray-200">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">הסל ריק</h3>
                  <p className="text-gray-600">לחץ על ✓ ליד הפריטים כדי להוסיף לסל</p>
                </div>
              ) : null}

              {purchased.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 border-2 border-green-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <button
                      onClick={handleClearPurchased}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🗑️ נקה הכל ({purchased.length})
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <h3 className="font-bold text-xl text-gray-800">רכישות שהושלמו</h3>
                        <div className="text-3xl">✅</div>
                      </div>
                    </div>
                  </div>
                  <CategorySection
                    title=""
                    items={purchased}
                    onToggleCart={handleToggleCart}
                    onRemove={handleRemoveItem}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-4">
            
            {/* Export Data */}
            <div className="flex justify-center xl:justify-start">
              <DataExport 
                items={items}
                purchaseHistory={purchaseHistory}
                pantryItems={pantryItems}
              />
            </div>

            {/* Enhanced Statistics */}
            <EnhancedStatistics 
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
      </div>
    </div>
  )
}