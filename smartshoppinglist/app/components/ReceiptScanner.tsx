'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, X, Check, ShoppingBag } from 'lucide-react'
import { Card, CardHeader } from './Card'
import { ActionButton } from './ActionButton'
import { ReceiptData, ShoppingItem } from '../types'
import { categorizeItem } from '../utils/smartSuggestions'
import { ReceiptProcessor } from '../utils/receiptProcessor'

interface ReceiptScannerProps {
  onReceiptProcessed: (items: ShoppingItem[], storeName: string) => void
  onClose: () => void
}

export function ReceiptScanner({ onReceiptProcessed, onClose }: ReceiptScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [showManualEntry, setShowManualEntry] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      // בדיקת גודל קובץ
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('הקובץ גדול מדי. אנא בחר קובץ קטן מ-10MB.')
      }

      // בדיקת סוג קובץ
      if (!file.type.startsWith('image/')) {
        throw new Error('אנא בחר קובץ תמונה בלבד.')
      }

      console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      // עיבוד אמיתי עם OCR
      const receiptData = await ReceiptProcessor.processReceiptImage(file)
      
      if (receiptData.items.length === 0) {
        const shouldTryManual = confirm('לא נמצאו פריטים בקבלה.\n\nהאם תרצה לנסות הכנסה ידנית של הפריטים?')
        if (shouldTryManual) {
          setShowManualEntry(true)
          return
        } else {
          alert('לא נמצאו פריטים בקבלה. אנא נסה:\n• לוודא שהתמונה ברורה וחדה\n• שהתאורה טובה\n• שהקבלה מצולמת ישר\n• להעלות תמונה באיכות גבוהה יותר')
        }
      } else {
        console.log('Successfully processed receipt with', receiptData.items.length, 'items')
      }
      
      setReceiptData(receiptData)
      // בברירת מחדל, בחר את כל הפריטים
      setSelectedItems(new Set(receiptData.items.map((_, index) => index)))
    } catch (error) {
      console.error('Error processing receipt:', error)
      const errorMessage = error instanceof Error ? error.message : 'שגיאה לא צפויה'
      alert(`שגיאה בעיבוד הקבלה: ${errorMessage}\n\nטיפים:\n• וודא שהתמונה ברורה וחדה\n• נסה תמונה עם תאורה טובה יותר\n• צלם ישר מול הקבלה\n• נסה לחתוך את התמונה לחלק הרלוונטי`)
    } finally {
      setIsProcessing(false)
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

  const handleManualEntry = () => {
    const manualItems = []
    let addMore = true
    
    while (addMore) {
      const itemName = prompt('שם הפריט:')
      if (!itemName) break
      
      const priceStr = prompt('מחיר הפריט:')
      const price = parseFloat(priceStr || '0')
      
      if (price > 0) {
        manualItems.push({
          name: itemName.trim(),
          price,
          quantity: 1,
          category: categorizeItem(itemName.trim())
        })
      }
      
      addMore = confirm('האם תרצה להוסיף פריט נוסף?')
    }
    
    if (manualItems.length > 0) {
      const manualReceiptData: ReceiptData = {
        items: manualItems,
        storeName: 'הכנסה ידנית',
        totalAmount: manualItems.reduce((sum, item) => sum + item.price, 0),
        date: new Date()
      }
      
      setReceiptData(manualReceiptData)
      setSelectedItems(new Set(manualItems.map((_, index) => index)))
      setShowManualEntry(false)
    }
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

    onReceiptProcessed(shoppingItems, receiptData.storeName)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader
          title="סריקת קבלה"
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          action={
            <ActionButton
              onClick={onClose}
              variant="secondary"
              size="sm"
              icon={X}
            >
              סגור
            </ActionButton>
          }
        />

        <div className="p-6 space-y-6">
          {showManualEntry && (
            <div className="text-center space-y-4">
              <div className="border-2 border-blue-300 rounded-lg p-8 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">הכנסה ידנית של פריטים</h3>
                <p className="text-blue-700 mb-6">
                  הזיהוי האוטומטי לא עבד כצפוי. תוכל להכניס את הפריטים באופן ידני.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <ActionButton
                    onClick={handleManualEntry}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    icon={Upload}
                  >
                    התחל הכנסה ידנית
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => {
                      setShowManualEntry(false)
                      setReceiptData(null)
                    }}
                    variant="secondary"
                    icon={X}
                  >
                    חזור לסריקה
                  </ActionButton>
                </div>
              </div>
            </div>
          )}

          {!receiptData && !isProcessing && !showManualEntry && (
            <div className="text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  העלה תמונה של קבלה לזיהוי אוטומטי של הפריטים
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  התמונה תעובד באמצעות זיהוי טקסט מתקדם (OCR)
                </p>
                
                <div className="flex gap-4 justify-center">
                  <ActionButton
                    onClick={() => fileInputRef.current?.click()}
                    icon={Upload}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    בחר תמונת קבלה
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => {
                      // כאן נוסיף בעתיד תמיכה בצילום ישיר
                      fileInputRef.current?.click()
                    }}
                    icon={Camera}
                    variant="secondary"
                  >
                    צלם קבלה
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => setShowManualEntry(true)}
                    variant="secondary"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                    icon={Upload}
                  >
                    הכנסה ידנית
                  </ActionButton>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p className="font-medium">💡 טיפים לתוצאות טובות יותר:</p>
                  <ul className="text-right mt-2 space-y-1">
                    <li>• וודא שהקבלה מוארת היטב ללא צללים</li>
                    <li>• צלם ישר ובמקביל לקבלה (לא באלכסון)</li>
                    <li>• הקפד שכל הטקסט יהיה ברור וחד</li>
                    <li>• נסה לחתוך את התמונה לחלק הרלוונטי בלבד</li>
                    <li>• השתמש ברזולוציה גבוהה (לא לדחוס את התמונה)</li>
                  </ul>
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                    <p className="font-medium">⚠️ שימו לב:</p>
                    <p>זיהוי הטקסט עובד הכי טוב עם קבלות בעברית ואנגלית מחנויות ישראליות מוכרות</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">מעבד את הקבלה באמצעות זיהוי טקסט...</p>
              <p className="text-sm text-gray-500 mt-2">
                זה עלול לקחת עד דקה בהתאם לאיכות התמונה
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                💡 בזמן ההמתנה: הקפד שהדפדפן לא נסגר כדי שהעיבוד יסתיים בהצלחה
              </div>
            </div>
          )}

          {receiptData && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{receiptData.storeName}</h3>
                <p className="text-gray-600">
                  תאריך: {receiptData.date.toLocaleDateString('he-IL')}
                </p>
                <p className="text-gray-600">
                  סה&quot;כ: ₪{receiptData.totalAmount.toFixed(2)}
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
                        <p className="font-medium">{item.name}</p>
                        {item.quantity && (
                          <p className="text-sm text-gray-600">כמות: {item.quantity}</p>
                        )}
                      </div>
                      
                      <p className="font-semibold">₪{item.price.toFixed(2)}</p>
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
                
                <ActionButton
                  onClick={onClose}
                  variant="secondary"
                  icon={X}
                >
                  ביטול
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
