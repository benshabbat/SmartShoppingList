/**
 * Example Shopping Analytics Component
 * Demonstrates the new enhanced context logic with analytics
 */

'use client'

import { useShoppingAnalytics, useShoppingComputed } from '../../contexts/GlobalShoppingContext'

export const ShoppingAnalytics = () => {
  const {
    totalItems,
    completionRate,
    categoryStats,
    recentlyAdded,
    priorityItems
  } = useShoppingAnalytics()

  const {
    hasItemsInCart,
    hasExpiringItems
  } = useShoppingComputed()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">סטטיסטיקות קניות</h2>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
          <div className="text-sm text-gray-600">סך הכל פריטים</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">אחוז השלמה</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{priorityItems.length}</div>
          <div className="text-sm text-gray-600">פריטים דחופים</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{Object.keys(categoryStats).length}</div>
          <div className="text-sm text-gray-600">קטגוריות</div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${hasItemsInCart ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} border`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${hasItemsInCart ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium">יש פריטים בסל</span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${hasExpiringItems ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} border`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${hasExpiringItems ? 'bg-red-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium">יש פריטים שפג תוקפם</span>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">פילוג לפי קטגוריות</h3>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / totalItems) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Added Items */}
      {recentlyAdded.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">נוספו לאחרונה</h3>
          <div className="space-y-2">
            {recentlyAdded.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-500">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
