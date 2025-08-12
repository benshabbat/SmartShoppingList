import React from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { useShoppingListItems } from '../stores/shoppingListStore'
import { SmartSuggestions } from './SmartSuggestions'
import { QuickAddButtons } from './QuickAddButtons'
import { EnhancedStatistics } from './EnhancedStatistics'

/**
 * דוגמה לקומפוננט שמשתמש בניהול המצב החדש עבור analytics
 * מראה איך להשתמש בחנות Analytics עם קומפוננטות שונות
 */
export const AnalyticsDemo = () => {
  const items = useShoppingListItems()
  
  // קבלת כל הנתונים והפעולות של analytics
  const analytics = useAnalytics(
    items.filter(item => item.isPurchased), // purchase history
    items.filter(item => !item.isPurchased && item.expiryDate) // pantry items
  )

  const handleAddSuggestion = (name: string) => {
    // כאן תהיה הלוגיקה להוספת פריט לרשימה
    console.log('Adding suggested item:', name)
  }

  const handleAddQuickItem = (name: string, category: string) => {
    // כאן תהיה הלוגיקה להוספת פריט מהיר
    console.log('Adding quick item:', name, category)
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800 text-right">
        Analytics Demo - ניהול מצב חכם
      </h2>
      
      {/* מצב טעינה */}
      {analytics.isAnalyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800">מנתח נתונים...</span>
          </div>
        </div>
      )}

      {/* הצעות חכמות */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">
          הצעות חכמות ({analytics.smartSuggestions.length})
        </h3>
        <SmartSuggestions onAddSuggestion={handleAddSuggestion} />
      </div>

      {/* כפתורי הוספה מהירה */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">
          הוספה מהירה (מבוסס על פופולריות)
        </h3>
        <QuickAddButtons onAddItem={handleAddQuickItem} />
      </div>

      {/* סטטיסטיקות מתקדמות */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">
          סטטיסטיקות מתקדמות
        </h3>
        <EnhancedStatistics 
          purchaseHistory={items.filter(item => item.isPurchased)}
          pantryItems={items.filter(item => !item.isPurchased && item.expiryDate)}
        />
      </div>

      {/* מידע debug */}
      <details className="bg-gray-50 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-700">
          מידע טכני (לצורכי פיתוח)
        </summary>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div>סה״כ פריטים: {items.length}</div>
          <div>נקנו: {items.filter(item => item.isPurchased).length}</div>
          <div>במלאי: {items.filter(item => !item.isPurchased).length}</div>
          <div>הצעות זמינות: {analytics.smartSuggestions.length}</div>
          <div>פריטים פופולריים: {analytics.popularItems.length}</div>
          <div>קטגוריות: {analytics.categoryStats.length}</div>
          <div>קטגוריה מובילה: {analytics.topCategory}</div>
          <div>קניות השבוע: {analytics.weeklyStats.thisWeek}</div>
          <div>קניות השבוע שעבר: {analytics.weeklyStats.lastWeek}</div>
          <div>מגמה: {analytics.weeklyStats.growth > 0 ? 'עולה' : analytics.weeklyStats.growth < 0 ? 'יורדת' : 'יציבה'}</div>
          <div>עומדים לפוג: {analytics.expiringItemsCount}</div>
          <div>ניתוח אחרון: {analytics.lastAnalysisDate?.toLocaleString('he-IL')}</div>
        </div>
      </details>

      {/* פעולות ניהול */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-800 mb-3 text-right">פעולות ניהול</h4>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={analytics.refreshAnalytics}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            disabled={analytics.isAnalyzing}
          >
            רענן ניתוח
          </button>
          <button
            onClick={analytics.clearSuggestions}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            נקה הצעות
          </button>
          <button
            onClick={() => analytics.updateSettings({ maxSuggestions: 10 })}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            הגדר 10 הצעות
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDemo
