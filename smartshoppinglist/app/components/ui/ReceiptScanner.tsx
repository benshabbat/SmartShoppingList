'use client'

import { useState, useRef } from 'react'
import { Upload, X, Check, ShoppingBag, FileText } from 'lucide-react'
import { Card, CardHeader } from './Card'
import { ActionButton } from './ActionButton'
import { ReceiptData, ShoppingItem } from '../../types'
import { ReceiptOCR } from '../../utils/data/processing/receiptOCR'
import { categorizeItem } from '../../utils/data/suggestions/smartSuggestions'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { formatDate } from '../../utils/data/helpers/dateUtils'
import { logger } from '../../utils/core/helpers'

export function ReceiptScanner() {
  // Get functions from global context - NO PROPS DRILLING!
  const { showReceiptScanner, closeReceiptScanner, processReceipt } = useGlobalShopping()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [showRawText, setShowRawText] = useState(false)
  const [rawOcrText, setRawOcrText] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Don't render if not open
  if (!showReceiptScanner) return null

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    
    try {
      logger.info('📤 מעלה קובץ:', file.name)
      
      // סימולציה של התקדמות
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)
      
      // עיבוד הקבלה
      const receiptData = await ReceiptOCR.processReceiptImage(file)
      
      // שמירת טקסט גולמי לדיבוג
      try {
        const rawText = await ReceiptOCR.extractRawText(file)
        setRawOcrText(rawText)
      } catch (error) {
        logger.warn('⚠️ לא ניתן לחלץ טקסט גולמי:', error)
      }
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (receiptData.items.length === 0) {
        alert('❌ לא נמצאו פריטים בקבלה.\n\n💡 טיפים:\n• וודא שהתמונה ברורה וחדה\n• צלם ישר מול הקבלה\n• השתמש בתאורה טובה\n• נסה לחתוך את התמונה לחלק הרלוונטי')
      } else {
        logger.success(`✅ עיבוד הושלם בהצלחה: ${receiptData.items.length} פריטים`)
      }
      
      setReceiptData(receiptData)
      setSelectedItems(new Set(receiptData.items.map((_, index) => index)))
      
    } catch (error) {
      logger.error('❌ שגיאה בעיבוד:', error)
      const errorMessage = error instanceof Error ? error.message : 'שגיאה לא צפויה'
      alert(`❌ שגיאה בעיבוד הקבלה:\n${errorMessage}\n\n💡 נסה:\n• תמונה איכותית יותר\n• תאורה טובה יותר\n• צילום ישר מול הקבלה`)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const toggleItemSelection = (index: number) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedItems(newSelection)
  }

  const handleDemoReceipt = () => {
    const demoReceiptData: ReceiptData = {
      items: [
        { name: 'חלב 3%', price: 5.90, quantity: 1, category: 'מוצרי חלב' },
        { name: 'לחם פרוס', price: 4.50, quantity: 1, category: 'לחם ומאפים' },
        { name: 'בננות', price: 12.90, quantity: 1, category: 'פירות וירקות' },
        { name: 'יוגורט טבעי', price: 3.80, quantity: 2, category: 'מוצרי חלב' },
        { name: 'עגבניות שרי', price: 8.50, quantity: 1, category: 'פירות וירקות' }
      ],
      storeName: 'דוגמה - רמי לוי',
      totalAmount: 35.60,
      date: new Date()
    }
    
    setReceiptData(demoReceiptData)
    setSelectedItems(new Set(demoReceiptData.items.map((_, index) => index)))
    setRawOcrText('דוגמה של טקסט OCR:\nרמי לוי\nחלב 3% 5.90\nלחם פרוס 4.50\nבננות 12.90\nיוגורט טבעי 3.80 x2\nעגבניות שרי 8.50\nסה"כ: 35.60')
  }

  const handleConfirmSelection = () => {
    if (!receiptData) return

    const selectedReceiptItems = receiptData.items.filter((_, index) => 
      selectedItems.has(index)
    )

    const shoppingItems: ShoppingItem[] = selectedReceiptItems.map((item, index) => ({
      id: `receipt-${Date.now()}-${index}`,
      name: item.name,
      category: categorizeItem(item.name),
      isInCart: false,
      isPurchased: true,
      addedAt: new Date(),
      purchasedAt: receiptData.date,
      purchaseLocation: receiptData.storeName,
      price: item.price
    }))

    processReceipt(shoppingItems, receiptData.storeName)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader
          title="סריקת קבלה"
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          action={
            <ActionButton
              onClick={closeReceiptScanner}
              variant="secondary"
              size="sm"
              icon={X}
            >
              סגור
            </ActionButton>
          }
        />

        <div className="p-6 space-y-6">
          {!receiptData && !isProcessing && (
            <div className="text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  העלה תמונת קבלה
                </h3>
                <p className="text-gray-600 mb-4">
                  מותאם במיוחד לקבלות בעברית מחנויות ישראליות
                </p>
                
                <div className="flex gap-4 justify-center flex-wrap">
                  <ActionButton
                    onClick={() => fileInputRef.current?.click()}
                    icon={Upload}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    בחר תמונה
                  </ActionButton>
                  
                  <ActionButton
                    onClick={handleDemoReceipt}
                    icon={FileText}
                    variant="secondary"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    נסה דוגמה
                  </ActionButton>
                </div>
                
                <div className="mt-6 text-xs text-gray-500 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 טיפים לתוצאות מיטביות:</h4>
                  <ul className="text-right space-y-1">
                    <li>📸 צלם ישר מול הקבלה (לא באלכסון)</li>
                    <li>💡 השתמש בתאורה טובה ללא צללים</li>
                    <li>🔍 וודא שכל הטקסט ברור וחד</li>
                    <li>✂️ חתוך את התמונה לחלק הרלוונטי</li>
                    <li>📱 השתמש ברזולוציה גבוהה</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{progress}%</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                מעבד קבלה עם OCR מתקדם...
              </h3>
              <p className="text-gray-600 mb-4">
                זיהוי טקסט בעברית ואנגלית, חילוץ פריטים ומחירים
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                💡 העיבוד עלול לקחת עד דקה בהתאם לאיכות התמונה
              </div>
            </div>
          )}

          {receiptData && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">📍 {receiptData.storeName}</h3>
                <p className="text-gray-600">
                  📅 תאריך: {formatDate(receiptData.date)}
                </p>
                <p className="text-gray-600 font-semibold">
                  💰 סה&quot;כ: ₪{receiptData.totalAmount.toFixed(2)}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">פריטים שזוהו:</h4>
                  <p className="text-sm text-gray-600">
                    {selectedItems.size} מתוך {receiptData.items.length} נבחרו
                  </p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {receiptData.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItems.has(index)
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleItemSelection(index)}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedItems.has(index)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedItems.has(index) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">🛒 {item.name}</p>
                      </div>
                      
                      <p className="font-semibold text-lg">₪{item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <ActionButton
                  onClick={handleConfirmSelection}
                  disabled={selectedItems.size === 0}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  icon={Check}
                >
                  הוסף לרשימת הקניות ({selectedItems.size})
                </ActionButton>
                
                {rawOcrText && (
                  <ActionButton
                    onClick={() => setShowRawText(!showRawText)}
                    variant="secondary"
                    className="text-xs"
                    icon={showRawText ? X : Upload}
                  >
                    {showRawText ? 'הסתר' : 'הצג'} טקסט גולמי
                  </ActionButton>
                )}
                
                <ActionButton
                  onClick={closeReceiptScanner}
                  variant="secondary"
                  icon={X}
                >
                  ביטול
                </ActionButton>
              </div>

              {showRawText && rawOcrText && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
                  <h5 className="font-semibold mb-2">טקסט גולמי שזוהה על ידי OCR:</h5>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {rawOcrText}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    הטקסט הזה מראה מה ה-OCR זיהה בפועל. אם הוא לא מדויק, נסה תמונה איכותית יותר.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
