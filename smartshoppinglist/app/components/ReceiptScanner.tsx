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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      // עיבוד אמיתי עם OCR
      const receiptData = await ReceiptProcessor.processReceiptImage(file)
      
      setReceiptData(receiptData)
      // בברירת מחדל, בחר את כל הפריטים
      setSelectedItems(new Set(receiptData.items.map((_, index) => index)))
    } catch (error) {
      console.error('Error processing receipt:', error)
      alert('שגיאה בעיבוד הקבלה. אנא נסה שוב או בדוק שהתמונה ברורה.')
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
          {!receiptData && !isProcessing && (
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
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>💡 טיפים לתוצאות טובות יותר:</p>
                  <ul className="text-right mt-2 space-y-1">
                    <li>• וודא שהקבלה מוארת היטב</li>
                    <li>• צלם ישר ובמקביל לקבלה</li>
                    <li>• הקפד שכל הטקסט יהיה ברור וחד</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">מעבד את הקבלה באמצעות זיהוי טקסט...</p>
              <p className="text-sm text-gray-500 mt-2">
                זה עלול לקחת עד דקה בהתאם לאיכות התמונה
              </p>
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
