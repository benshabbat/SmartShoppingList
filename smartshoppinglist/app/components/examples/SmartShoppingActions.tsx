/**
 * Example Smart Shopping Actions Component
 * Demonstrates enhanced shopping actions with validation and feedback
 */

'use client'

import { useState } from 'react'
import { useShoppingActions, useShoppingData, useGlobalShopping } from '../../contexts/GlobalShoppingContext'

export const SmartShoppingActions = () => {
  const [newItemName, setNewItemName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('פירות וירקות')
  
  const { addItem, clearPurchasedItems } = useShoppingActions()
  const { totalItems, completionRate } = useShoppingData()
  const { 
    createQuickList, 
    addBulkToCart, 
    handleCheckout,
    purchasedItems,
    cartItems 
  } = useGlobalShopping()

  const handleAddItem = async (addToCart = false) => {
    if (!newItemName.trim()) return
    
    await addItem(newItemName.trim(), selectedCategory, addToCart)
    setNewItemName('')
  }

  const handleQuickBreakfast = async () => {
    const breakfastItems = [
      { name: 'לחם', category: 'לחם ומאפים' },
      { name: 'חמאה', category: 'מוצרי חלב' },
      { name: 'ריבה', category: 'חטיפים ומתוקים' },
      { name: 'חלב', category: 'מוצרי חלב' }
    ]
    
    await createQuickList(breakfastItems)
  }

  const handleQuickDinner = async () => {
    const dinnerItems = [
      { name: 'עוף', category: 'בשר ודגים' },
      { name: 'אורז', category: 'אחר' },
      { name: 'ירקות', category: 'פירות וירקות' },
      { name: 'שמן זית', category: 'אחר' }
    ]
    
    await addBulkToCart(dinnerItems)
  }

  const categories = [
    'פירות וירקות',
    'מוצרי חלב',
    'בשר ודגים',
    'לחם ומאפים',
    'משקאות',
    'חטיפים ומתוקים',
    'אחר'
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">פעולות קניות חכמות</h2>
      
      {/* Stats Bar */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span>סך הכל פריטים: <strong>{totalItems}</strong></span>
          <span>בסל: <strong>{cartItems.length}</strong></span>
          <span>נקנו: <strong>{purchasedItems.length}</strong></span>
          <span>השלמה: <strong>{completionRate}%</strong></span>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">הוסף פריט</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="שם הפריט..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleAddItem(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              הוסף לרשימה
            </button>
            
            <button
              onClick={() => handleAddItem(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              הוסף לסל
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">פעולות מהירות</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleQuickBreakfast}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🍞</div>
              <div className="text-sm font-medium">ארוחת בוקר</div>
            </div>
          </button>
          
          <button
            onClick={handleQuickDinner}
            className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🍽️</div>
              <div className="text-sm font-medium">ערב לסל</div>
            </div>
          </button>
          
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 ${
              cartItems.length > 0
                ? 'bg-green-50 border border-green-200 hover:bg-green-100 focus:ring-green-500'
                : 'bg-gray-50 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🛒</div>
              <div className="text-sm font-medium">סיום קנייה</div>
            </div>
          </button>
          
          <button
            onClick={clearPurchasedItems}
            disabled={purchasedItems.length === 0}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 ${
              purchasedItems.length > 0
                ? 'bg-red-50 border border-red-200 hover:bg-red-100 focus:ring-red-500'
                : 'bg-gray-50 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🗑️</div>
              <div className="text-sm font-medium">נקה נקנו</div>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalItems > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">התקדמות קניות</span>
            <span className="text-sm font-medium text-gray-700">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
