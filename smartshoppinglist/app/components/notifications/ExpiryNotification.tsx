'use client'

import { AlertTriangle, Clock, X, ShoppingCart } from 'lucide-react'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { getExpiryColor, logger } from '../../utils/core/helpers'

export function ExpiryNotification() {
  // Get everything from global context - NO PROPS DRILLING!
  const { expiringItems, addItem, dismissGuestExplanation } = useGlobalShopping()
  
  if (expiringItems.length === 0) return null

  const urgentItems = expiringItems.filter(item => item.daysUntilExpiry <= 1)
  const soonItems = expiringItems.filter(item => item.daysUntilExpiry > 1 && item.daysUntilExpiry <= 3)

  const handleAddToList = (itemName: string) => {
    addItem(itemName, 'כללי') // Default category
  }

  const handleRemoveFromPantry = (itemName: string) => {
    // TODO: Implement remove from pantry in global context
    logger.info('Remove from pantry:', itemName)
  }

  const handleDismiss = () => {
    dismissGuestExplanation() // Reuse existing function or create new one
  }

  const getExpiryMessage = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'פג תוקף!'
    if (daysUntilExpiry === 0) return 'פג תוקף היום'
    if (daysUntilExpiry === 1) return 'פג תוקף מחר'
    return `פג תוקף בעוד ${daysUntilExpiry} ימים`
  }

  return (
    <div className="mb-6">
      {urgentItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-bold text-red-800">🚨 דחוף - מוצרים שפג תוקפם!</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            {urgentItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className={`text-sm px-2 py-1 rounded ${getExpiryColor(item.daysUntilExpiry)}`}>
                      {getExpiryMessage(item.daysUntilExpiry)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToList(item.name)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
                  >
                    <ShoppingCart size={16} />
                    קנה עוד
                  </button>
                  <button
                    onClick={() => handleRemoveFromPantry(item.name)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    הסר מהמטבח
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {soonItems.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-600" size={20} />
              <h3 className="font-bold text-yellow-800">⏰ מוצרים שמתקרבים לפג תוקף</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-yellow-400 hover:text-yellow-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            {soonItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className={`text-sm px-2 py-1 rounded ${getExpiryColor(item.daysUntilExpiry)}`}>
                      {getExpiryMessage(item.daysUntilExpiry)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToList(item.name)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                  >
                    <ShoppingCart size={16} />
                    קנה עוד
                  </button>
                  <button
                    onClick={() => handleRemoveFromPantry(item.name)}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    הסר
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
