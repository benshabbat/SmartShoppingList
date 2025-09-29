'use client'

import { useState } from 'react'
import { Download, FileText, Share2, Copy, Check, Clock } from 'lucide-react'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { formatDate, logger } from '../../utils'
import { ScheduledExport } from './ScheduledExport'

// Advanced export utilities
const generateCSV = (data: Record<string, unknown>[], _filename: string) => {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => `"${row[header] || ''}"`).join(',')
    )
  ].join('\n')
  
  return csvContent
}

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const downloadJSON = (data: unknown, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const DataExport: React.FC = () => {
  // Get data from global context - NO PROPS!
  const { items, pantryItems, recentPurchases } = useGlobalShopping()
  
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<'simple' | 'detailed' | 'shopping' | 'json' | 'csv' | 'excel'>('simple')
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showScheduler, setShowScheduler] = useState(false)

  // Filter data based on selected filters
  const getFilteredData = () => {
    let filteredItems = items
    let filteredRecent = recentPurchases // Use recentPurchases instead of purchaseHistory
    
    // Date filtering
    if (dateFilter !== 'all') {
      const now = new Date()
      const daysBack = dateFilter === 'week' ? 7 : 30
      const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
      
      filteredItems = items.filter(item => 
        item.addedAt && new Date(item.addedAt) >= cutoffDate
      )
      filteredRecent = recentPurchases.filter(item =>
        item.purchasedAt && new Date(item.purchasedAt) >= cutoffDate
      )
    }
    
    // Category filtering
    if (categoryFilter !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === categoryFilter)
      filteredRecent = filteredRecent.filter(item => item.category === categoryFilter)
    }
    
    return { items: filteredItems, recent: filteredRecent }
  }

  // Get unique categories for filter dropdown
  const allCategories = [...new Set([
    ...items.map(item => item.category),
    ...recentPurchases.map(item => item.category)
  ])].filter(Boolean)

  // Advanced export functions
  const generateAdvancedData = () => {
    const { items: filteredItems, recent: filteredRecent } = getFilteredData()
    
    switch (exportFormat) {
      case 'json':
        return {
          exportInfo: {
            exportDate: new Date().toISOString(),
            format: 'json',
            filters: { dateFilter, categoryFilter }
          },
          currentItems: filteredItems,
          recentPurchases: filteredRecent,
          pantryItems,
          statistics: {
            totalItems: filteredItems.length,
            itemsInCart: filteredItems.filter(item => item.isInCart).length,
            purchasedItems: filteredItems.filter(item => item.isPurchased).length,
            categories: allCategories.length,
            totalPurchases: filteredRecent.length
          }
        }
        
      case 'csv':
        return filteredItems.map(item => ({
          שם: item.name,
          קטגוריה: item.category,
          נוסף_בתאריך: item.addedAt ? formatDate(item.addedAt) : '',
          בעגלה: item.isInCart ? 'כן' : 'לא',
          נקנה: item.isPurchased ? 'כן' : 'לא',
          תאריך_קנייה: item.purchasedAt ? formatDate(item.purchasedAt) : '',
          מחיר: item.price || '',
          מיקום_קנייה: item.purchaseLocation || ''
        }))
        
      case 'excel':
        return {
          רשימה_נוכחית: filteredItems.map(item => ({
            שם: item.name,
            קטגוריה: item.category,
            נוסף_בתאריך: item.addedAt ? formatDate(item.addedAt) : '',
            סטטוס: item.isPurchased ? 'נקנה' : item.isInCart ? 'בעגלה' : 'ממתין'
          })),
          קניות_אחרונות: filteredRecent.map(item => ({
            שם: item.name,
            קטגוריה: item.category,
            תאריך_קנייה: item.purchasedAt ? formatDate(item.purchasedAt) : '',
            מחיר: item.price || '',
            מיקום: item.purchaseLocation || ''
          }))
        }
        
      default:
        return getExportData()
    }
  }

  const handleAdvancedDownload = () => {
    const data = generateAdvancedData()
    const timestamp = new Date().toISOString().split('T')[0]
    
    switch (exportFormat) {
      case 'json':
        downloadJSON(data, `רשימת-קניות-${timestamp}`)
        break
        
      case 'csv':
        if (Array.isArray(data)) {
          const csvContent = generateCSV(data, '')
          downloadCSV(csvContent, `רשימת-קניות-${timestamp}`)
        }
        break
        
      case 'excel':
        // For Excel, we'll create a more complex structure
        const excelData = data as { רשימה_נוכחית: unknown[], קניות_אחרונות: unknown[] }
        const workbook = {
          שם_קובץ: `רשימת-קניות-${timestamp}`,
          גיליונות: {
            רשימה_נוכחית: excelData.רשימה_נוכחית,
            קניות_אחרונות: excelData.קניות_אחרונות
          }
        }
        downloadJSON(workbook, `רשימת-קניות-excel-${timestamp}`)
        break
        
      default:
        downloadFile()
    }
  }

  const generateSimpleList = () => {
    const pendingItems = items.filter(item => !item.isPurchased)
    const categories = [...new Set(pendingItems.map(item => item.category))]
    
    let output = '🛒 רשימת קניות\n'
    output += '================\n\n'
    
    categories.forEach(category => {
      const categoryItems = pendingItems.filter(item => item.category === category)
      if (categoryItems.length > 0) {
        output += `📂 ${category}:\n`
        categoryItems.forEach(item => {
          const status = item.isInCart ? '✅' : '⬜'
          output += `${status} ${item.name}\n`
        })
        output += '\n'
      }
    })
    
    return output
  }

  const generateDetailedReport = () => {
    const { items: filteredItems, recent: filteredRecent } = getFilteredData()
    
    let output = '📊 דוח קניות מפורט\n'
    output += '==================\n\n'
    
    // סטטיסטיקות כלליות מעודכנות
    output += '📈 סטטיסטיקות כלליות:\n'
    output += `• פריטים ברשימה: ${filteredItems.length}\n`
    output += `• פריטים בעגלה: ${filteredItems.filter(item => item.isInCart).length}\n`
    output += `• פריטים שנקנו: ${filteredItems.filter(item => item.isPurchased).length}\n`
    output += `• קניות אחרונות: ${filteredRecent.length} פריטים\n`
    output += `• פריטים במזווה: ${pantryItems.length}\n\n`
    
    // אנליזה של קניות אחרונות
    if (filteredRecent.length > 0) {
      output += '🛒 ניתוח קניות אחרונות:\n'
      
      // קטגוריות פופולריות
      const categoryStats = filteredRecent.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const topCategories = Object.entries(categoryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
      
      output += '• קטגוריות פופולריות:\n'
      topCategories.forEach(([category, count]) => {
        output += `  ${category}: ${count} פריטים\n`
      })
      
      // ניתוח מחירים (אם יש)
      const itemsWithPrice = filteredRecent.filter(item => item.price && item.price > 0)
      if (itemsWithPrice.length > 0) {
        const totalPrice = itemsWithPrice.reduce((sum, item) => sum + (item.price || 0), 0)
        const avgPrice = totalPrice / itemsWithPrice.length
        output += `\n💰 ניתוח מחירים:\n`
        output += `• סה"כ הוצאות: ₪${totalPrice.toFixed(2)}\n`
        output += `• מחיר ממוצע: ₪${avgPrice.toFixed(2)}\n`
        output += `• פריטים עם מחיר: ${itemsWithPrice.length}/${filteredRecent.length}\n`
      }
      
      // מקומות קנייה פופולריים
      const locationStats = filteredRecent
        .filter(item => item.purchaseLocation)
        .reduce((acc, item) => {
          acc[item.purchaseLocation!] = (acc[item.purchaseLocation!] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      
      if (Object.keys(locationStats).length > 0) {
        output += `\n🏪 מקומות קנייה פופולריים:\n`
        Object.entries(locationStats)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .forEach(([location, count]) => {
            output += `• ${location}: ${count} פריטים\n`
          })
      }
    }
    
    // פריטים לפי קטגוריות
    const categories = [...new Set(filteredItems.map(item => item.category))]
    output += '\n📂 רשימה נוכחית לפי קטגוריות:\n'
    categories.forEach(category => {
      const categoryItems = filteredItems.filter(item => item.category === category)
      output += `\n${category} (${categoryItems.length} פריטים):\n`
      categoryItems.forEach(item => {
        let status = '⬜ ממתין'
        if (item.isPurchased) status = '✅ נקנה'
        else if (item.isInCart) status = '🛒 בעגלה'
        
        output += `  ${status} ${item.name}`
        if (item.addedAt) {
          output += ` (נוסף: ${formatDate(item.addedAt)})`
        }
        output += '\n'
      })
    })
    
    // המלצות חכמות
    output += '\n💡 המלצות חכמות:\n'
    
    // פריטים שחוזרים הרבה
    if (filteredRecent.length > 0) {
      const frequentItems = filteredRecent
        .reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      
      const topItems = Object.entries(frequentItems)
        .filter(([,count]) => count > 1)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
      
      if (topItems.length > 0) {
        output += '• פריטים שנקנים הרבה:\n'
        topItems.forEach(([item, count]) => {
          output += `  ${item} (${count} פעמים)\n`
        })
      }
    }
    
    // פריטים שפג תוקפם
    const expiredItems = pantryItems.filter(item => 
      item.expiryDate && new Date(item.expiryDate) < new Date()
    )
    if (expiredItems.length > 0) {
      output += '\n⚠️ פריטים שפג תוקפם:\n'
      expiredItems.forEach(item => {
        output += `• ${item.name} (פג ב-${formatDate(item.expiryDate!)})\n`
      })
    }
    
    // מידע טכני
    output += '\n📊 מידע טכני:\n'
    output += `• תאריך יצירת הדוח: ${formatDate(new Date())}\n`
    output += `• סינון זמן: ${dateFilter === 'all' ? 'כל הזמן' : dateFilter === 'week' ? 'שבוע אחרון' : 'חודש אחרון'}\n`
    output += `• סינון קטגוריה: ${categoryFilter === 'all' ? 'כל הקטגוריות' : categoryFilter}\n`
    
    return output
  }

  const generateShoppingFormat = () => {
    const pendingItems = items.filter(item => !item.isPurchased)
    const categories = [...new Set(pendingItems.map(item => item.category))]
    
    let output = '🛒 רשימת קניות לחנות\n'
    output += '===================\n\n'
    
    categories.forEach((category, index) => {
      const categoryItems = pendingItems.filter(item => item.category === category)
      if (categoryItems.length > 0) {
        output += `${index + 1}. ${category}:\n`
        categoryItems.forEach(item => {
          output += `   □ ${item.name}\n`
        })
        output += '\n'
      }
    })
    
    output += '-------------------\n'
    output += `סה"כ פריטים: ${pendingItems.length}\n`
    output += `נוצר בתאריך: ${formatDate(new Date())}\n`
    
    return output
  }

  const getExportData = () => {
    switch (exportFormat) {
      case 'simple':
        return generateSimpleList()
      case 'detailed':
        return generateDetailedReport()
      case 'shopping':
        return generateShoppingFormat()
      default:
        return generateSimpleList()
    }
  }

  const copyToClipboard = async () => {
    const data = getExportData()
    try {
      await navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }

  const downloadFile = () => {
    const data = getExportData()
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `רשימת-קניות-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const shareData = async () => {
    const data = getExportData()
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'רשימת קניות',
          text: data,
        })
      } catch (err) {
        logger.error('Error sharing:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  if (!isOpen) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mobile-text"
        >
          <Download size={16} />
          <span className="xs-hide">ייצוא נתונים</span>
        </button>
        
        <button
          onClick={() => setShowScheduler(true)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mobile-text"
          title="ייצוא מתוזמן"
        >
          <Clock size={16} />
          <span className="xs-hide">תזמון</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mobile-padding">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">ייצוא נתונים</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <FileText size={20} />
          </button>
        </div>

        {/* בחירת פורמט */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">סוג הייצוא:</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="simple"
                checked={exportFormat === 'simple'}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="ml-2"
              />
              <span className="text-sm">📝 רשימה פשוטה</span>
            </label>
            <label className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="shopping"
                checked={exportFormat === 'shopping'}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="ml-2"
              />
              <span className="text-sm">🛒 רשימה לחנות</span>
            </label>
            <label className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="detailed"
                checked={exportFormat === 'detailed'}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="ml-2"
              />
              <span className="text-sm">📊 דוח מפורט</span>
            </label>
            <label className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="ml-2"
              />
              <span className="text-sm">💾 JSON</span>
            </label>
            <label className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="ml-2"
              />
              <span className="text-sm">📋 CSV</span>
            </label>
            <label className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="excel"
                checked={exportFormat === 'excel'}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="ml-2"
              />
              <span className="text-sm">📊 Excel</span>
            </label>
          </div>
        </div>

        {/* מסננים מתקדמים */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">🔍 מסננים:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">טווח זמן:</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value="all">כל הזמן</option>
                <option value="week">שבוע אחרון</option>
                <option value="month">חודש אחרון</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">קטגוריה:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value="all">כל הקטגוריות</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* תצוגה מקדימה משופרת */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">תצוגה מקדימה:</label>
            <span className="text-xs text-gray-500">
              {exportFormat === 'json' ? 'JSON' : 
               exportFormat === 'csv' ? 'CSV' : 
               exportFormat === 'excel' ? 'Excel' : 'טקסט'}
            </span>
          </div>
          <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs max-h-48 overflow-y-auto font-mono">
            {exportFormat === 'json' ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(generateAdvancedData(), null, 2).slice(0, 500)}
                {JSON.stringify(generateAdvancedData()).length > 500 && '...'}
              </pre>
            ) : exportFormat === 'csv' ? (
              <div>
                <div className="text-yellow-400 mb-1">CSV Format:</div>
                <pre className="whitespace-pre-wrap">
                  {(() => {
                    const data = generateAdvancedData()
                    if (Array.isArray(data)) {
                      return generateCSV(data.slice(0, 3), '').slice(0, 300) + '...'
                    }
                    return 'נתונים לא זמינים במבנה CSV'
                  })()}
                </pre>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap leading-relaxed">
                {typeof generateAdvancedData() === 'string' 
                  ? generateAdvancedData().toString().slice(0, 400) + '...'
                  : JSON.stringify(generateAdvancedData(), null, 2).slice(0, 400) + '...'
                }
              </pre>
            )}
          </div>
        </div>

        {/* כפתורי פעולה מעודכנים */}
        <div className="space-y-3">
          {/* כפתורים עיקריים */}
          <div className="flex gap-2 mobile-compact">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1 justify-center mobile-text"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'הועתק!' : 'העתק'}
            </button>
            
            <button
              onClick={shareData}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-1 justify-center mobile-text"
            >
              <Share2 size={16} />
              שתף
            </button>
          </div>

          {/* כפתורי הורדה מתקדמים */}
          <div className="flex gap-2 mobile-compact">
            {['simple', 'detailed', 'shopping'].includes(exportFormat) ? (
              <button
                onClick={downloadFile}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center mobile-text"
              >
                <Download size={16} />
                הורד טקסט
              </button>
            ) : (
              <button
                onClick={handleAdvancedDownload}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center mobile-text"
              >
                <Download size={16} />
                {exportFormat === 'json' ? 'הורד JSON' :
                 exportFormat === 'csv' ? 'הורד CSV' :
                 exportFormat === 'excel' ? 'הורד Excel' : 'הורד קובץ'}
              </button>
            )}
          </div>

          {/* מידע נוסף על הייצוא */}
          <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
            <div className="flex items-center gap-1 mb-1">
              <span>📊</span>
              <span>מידע על הייצוא:</span>
            </div>
            <div>• פריטים: {getFilteredData().items.length}</div>
            <div>• קניות אחרונות: {getFilteredData().recent.length}</div>
            <div>• מסנן זמן: {dateFilter === 'all' ? 'כל הזמן' : dateFilter === 'week' ? 'שבוע אחרון' : 'חודש אחרון'}</div>
            <div>• קטגוריה: {categoryFilter === 'all' ? 'כל הקטגוריות' : categoryFilter}</div>
          </div>
        </div>
      </div>

      {/* Scheduled Export Modal */}
      <ScheduledExport
        isVisible={showScheduler}
        onClose={() => setShowScheduler(false)}
        onScheduleExport={(config) => {
          logger.info('Export scheduled:', config)
          // כאן ניתן להוסיף לוגיקה לתזמון הייצוא האמיתי
        }}
      />
    </div>
  )
}
