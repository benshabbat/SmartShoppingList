'use client'

import { useState } from 'react'
import { Download, FileText, Share2, Copy, Check } from 'lucide-react'
import { ShoppingItem } from '../types'

interface DataExportProps {
  items: ShoppingItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
}

export const DataExport: React.FC<DataExportProps> = ({ items, purchaseHistory, pantryItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<'simple' | 'detailed' | 'shopping'>('simple')

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
    let output = '📊 דוח קניות מפורט\n'
    output += '==================\n\n'
    
    // סטטיסטיקות כלליות
    output += '📈 סטטיסטיקות:\n'
    output += `• פריטים ברשימה: ${items.length}\n`
    output += `• פריטים בעגלה: ${items.filter(item => item.isInCart).length}\n`
    output += `• פריטים שנקנו: ${items.filter(item => item.isPurchased).length}\n`
    output += `• היסטוריית קניות: ${purchaseHistory.length} פריטים\n`
    output += `• פריטים במזווה: ${pantryItems.length}\n\n`
    
    // פריטים לפי קטגוריות
    const categories = [...new Set(items.map(item => item.category))]
    output += '📂 פריטים לפי קטגוריות:\n'
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category)
      output += `\n${category} (${categoryItems.length} פריטים):\n`
      categoryItems.forEach(item => {
        let status = '⬜ ממתין'
        if (item.isPurchased) status = '✅ נקנה'
        else if (item.isInCart) status = '🛒 בעגלה'
        
        output += `  ${status} ${item.name}`
        if (item.addedAt) {
          output += ` (נוסף: ${new Date(item.addedAt).toLocaleDateString('he-IL')})`
        }
        output += '\n'
      })
    })
    
    // פריטים שפג תוקפם
    const expiredItems = pantryItems.filter(item => 
      item.expiryDate && new Date(item.expiryDate) < new Date()
    )
    if (expiredItems.length > 0) {
      output += '\n⚠️ פריטים שפג תוקפם:\n'
      expiredItems.forEach(item => {
        output += `• ${item.name} (פג ב-${new Date(item.expiryDate!).toLocaleDateString('he-IL')})\n`
      })
    }
    
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
    output += `נוצר בתאריך: ${new Date().toLocaleDateString('he-IL')}\n`
    
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
      console.error('Failed to copy:', err)
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
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mobile-text"
      >
        <Download size={16} />
        <span className="xs-hide">ייצוא נתונים</span>
      </button>
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
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="simple"
                checked={exportFormat === 'simple'}
                onChange={(e) => setExportFormat(e.target.value as 'simple' | 'detailed' | 'shopping')}
                className="ml-2"
              />
              רשימה פשוטה
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="shopping"
                checked={exportFormat === 'shopping'}
                onChange={(e) => setExportFormat(e.target.value as 'simple' | 'detailed' | 'shopping')}
                className="ml-2"
              />
              רשימה לחנות
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="detailed"
                checked={exportFormat === 'detailed'}
                onChange={(e) => setExportFormat(e.target.value as 'simple' | 'detailed' | 'shopping')}
                className="ml-2"
              />
              דוח מפורט
            </label>
          </div>
        </div>

        {/* תצוגה מקדימה */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">תצוגה מקדימה:</label>
          <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-40 overflow-y-auto font-mono mobile-text">
            <pre className="whitespace-pre-wrap">{getExportData()}</pre>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="flex gap-2 mobile-compact">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1 justify-center mobile-text"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'הועתק!' : 'העתק'}
          </button>
          
          <button
            onClick={downloadFile}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center mobile-text"
          >
            <Download size={16} />
            הורד
          </button>
          
          <button
            onClick={shareData}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-1 justify-center mobile-text"
          >
            <Share2 size={16} />
            שתף
          </button>
        </div>
      </div>
    </div>
  )
}
