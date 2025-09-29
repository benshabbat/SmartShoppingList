/**
 * Recent Purchases Component
 * Displays the user's recent purchases with the ability to re-add items
 */

'use client'

import React from 'react'
import { Calendar, MapPin, ShoppingCart, Plus, Clock } from 'lucide-react'
import { useShoppingData, useShoppingActions } from '../../contexts/GlobalShoppingContext'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { ActionButton } from '../ui/ActionButton'
import { formatDate } from '../../utils/core/formatters'
import { getCategoryEmoji } from '../../utils/ui/categoryHelpers'

export const RecentPurchases: React.FC = () => {
  const { recentPurchases, loading } = useShoppingData()
  const { addItem } = useShoppingActions()

  const handleReAddItem = async (itemName: string, category: string) => {
    try {
      await addItem(itemName, category, false)
    } catch (error) {
      console.error('Failed to re-add item:', error)
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader title="טוען..." />
        <CardBody>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  if (recentPurchases.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardBody>
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין קניות אחרונות</h3>
          <p className="text-gray-500">
            הקניות שתבצע יופיעו כאן לצפייה מהירה ולהוספה חוזרת לרשימה
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader 
        title="קניות אחרונות"
        subtitle="קניות מהשבוע האחרון - לחץ להוספה חוזרת לרשימה"
        icon={
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {recentPurchases.length}
            </span>
          </div>
        }
      />
      
      <CardBody>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentPurchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">
                  {getCategoryEmoji(purchase.category)}
                </span>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{purchase.name}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    {purchase.purchasedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(purchase.purchasedAt)}</span>
                      </div>
                    )}
                    
                    {purchase.purchaseLocation && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{purchase.purchaseLocation}</span>
                      </div>
                    )}
                    
                    {purchase.price && (
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        <span>₪{purchase.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <ActionButton
                onClick={() => handleReAddItem(purchase.name, purchase.category)}
                icon={Plus}
                variant="secondary"
                size="sm"
                className="shrink-0"
                ariaLabel={`הוסף שוב את ${purchase.name} לרשימה`}
              >
                הוסף שוב
              </ActionButton>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

// Quick add from recent purchases floating action
export const QuickAddFromRecent: React.FC = () => {
  const { recentPurchases } = useShoppingData()
  const { addItem } = useShoppingActions()
  
  if (recentPurchases.length === 0) return null

  const recentItems = recentPurchases.slice(0, 3)

  return (
    <div className="fixed bottom-20 left-4 z-50 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">הוספה מהירה</h4>
        <div className="space-y-1">
          {recentItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item.name, item.category, false)}
              className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
            >
              <span>{getCategoryEmoji(item.category)}</span>
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}