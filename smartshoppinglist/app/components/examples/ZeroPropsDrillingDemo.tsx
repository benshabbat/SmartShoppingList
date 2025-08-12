/**
 * Zero Props Drilling Demo Component
 * מדגים איך רכיב יכול לקבל הכל מהקונטקסט ללא props
 */

'use client'

import { 
  useShoppingData, 
  useShoppingActions, 
  useShoppingComputed,
  useShoppingAnalytics,
  useGlobalShopping 
} from '../../contexts/GlobalShoppingContext'

export const ZeroPropsDrillingDemo = () => {
  // === NO PROPS NEEDED! Everything from context ===
  
  // Data from context
  const { items, loading, error } = useShoppingData()
  
  // Actions from context
  const { addItem, removeItem, toggleItemInCart } = useShoppingActions()
  
  // Computed values from context
  const { cartItems, pendingItems, hasItemsInCart } = useShoppingComputed()
  
  // Analytics from context
  const { totalItems, completionRate, categoryStats } = useShoppingAnalytics()
  
  // Notifications from context
  const { showSuccess, showError } = useGlobalShopping()

  // === Component Logic (no props!) ===
  const handleQuickAdd = async () => {
    try {
      await addItem('דוגמה ללא props drilling', 'אחר')
    } catch (error) {
      // Error handling already in context!
    }
  }

  const handleDemo = () => {
    showSuccess(
      `🎉 מושלם! הרכיב הזה לא מקבל שום props!\n` +
      `סך הכל פריטים: ${totalItems}\n` +
      `בסל: ${cartItems.length}\n` +
      `אחוז השלמה: ${completionRate}%`
    )
  }

  if (loading) {
    return <div className="text-center text-gray-500">טוען...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">שגיאה: {error}</div>
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🚀 Zero Props Drilling Demo
        </h2>
        <p className="text-gray-600">
          הרכיב הזה לא מקבל שום props! הכל מגיע מהקונטקסט הגלובלי
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
          <div className="text-sm text-gray-600">סך הכל</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{cartItems.length}</div>
          <div className="text-sm text-gray-600">בסל</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{pendingItems.length}</div>
          <div className="text-sm text-gray-600">ממתין</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">הושלם</div>
        </div>
      </div>

      {/* Categories Chart */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">פילוג קטגוריות</h3>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(count / totalItems) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-6">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleQuickAdd}
          className="flex-1 bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium"
        >
          🎯 הוסף פריט דוגמה
        </button>
        
        <button
          onClick={handleDemo}
          className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
        >
          ✨ הצג מידע מהקונטקסט
        </button>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border ${
          hasItemsInCart 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hasItemsInCart ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">
              {hasItemsInCart ? 'יש פריטים בסל' : 'הסל ריק'}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${
          error 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium">
              {error ? 'יש שגיאה' : 'מערכת תקינה'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Items List */}
      {items.slice(0, 3).length > 0 && (
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">פריטים אחרונים</h3>
          <div className="space-y-2">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{item.name}</span>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.isInCart 
                      ? 'bg-blue-100 text-blue-700' 
                      : item.isPurchased
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.isInCart ? 'בסל' : item.isPurchased ? 'נקנה' : 'ממתין'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-gray-500">
        💡 רכיב זה מדגים Zero Props Drilling - כל הנתונים והפעולות מגיעים מהקונטקסט הגלובלי
      </div>
    </div>
  )
}
