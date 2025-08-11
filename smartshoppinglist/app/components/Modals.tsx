import { useState } from 'react'
import { ShoppingBag, AlertTriangle, X } from 'lucide-react'
import { ShoppingItem, ExpiringItem } from '../types'
import { getExpiryColor } from '../utils/helpers'

interface CheckoutModalProps {
  isOpen: boolean
  items: ShoppingItem[]
  currentIndex: number
  onNext: (expiryDate?: Date) => void
  onClose: () => void
}

export const CheckoutModal = ({ 
  isOpen, 
  items, 
  currentIndex, 
  onNext, 
  onClose 
}: CheckoutModalProps) => {
  const [expiryDate, setExpiryDate] = useState('')

  if (!isOpen || !items[currentIndex]) return null

  const currentItem = items[currentIndex]
  const progress = ((currentIndex + 1) / items.length) * 100

  const handleNext = () => {
    onNext(expiryDate ? new Date(expiryDate) : undefined)
    setExpiryDate('')
  }

  const handleSkip = () => {
    onNext()
    setExpiryDate('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">סיום קניות</h3>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500 font-medium">
              {currentIndex + 1} מתוך {items.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-3 mx-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">קנית:</p>
            <p className="font-bold text-2xl text-gray-800 mb-4">{currentItem.name}</p>
            <p className="text-gray-600">יש תוקף למוצר הזה?</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                תאריך תפוגה (אופציונלי)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            אין תוקף
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg"
          >
            {currentIndex < items.length - 1 ? 'הבא' : 'סיום'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ExpiryModalProps {
  isOpen: boolean
  expiringItems: ExpiringItem[]
  onAddToList: (itemName: string) => void
  onRemoveFromPantry: (itemName: string) => void
  onClose: () => void
}

export const ExpiryModal = ({ 
  isOpen, 
  expiringItems, 
  onAddToList, 
  onRemoveFromPantry, 
  onClose 
}: ExpiryModalProps) => {
  if (!isOpen || expiringItems.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500 rounded-full">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">מוצרים שעומדים לפוג</h3>
        </div>
        
        <p className="text-gray-600 mb-6 text-right">
          נמצאו מוצרים שעומדים לפוג או פגו. האם תרצה להוסיף משהו לרשימה?
        </p>
        
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {expiringItems.map((item, index) => (
            <div key={index} className={`p-4 rounded-xl border-2 ${getExpiryColor(item.daysUntilExpiry)}`}>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToList(item.name)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors font-medium"
                  >
                    הוסף לרשימה
                  </button>
                  <button
                    onClick={() => onRemoveFromPantry(item.name)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors font-medium"
                  >
                    הושלך
                  </button>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{item.name}</div>
                  <div className="text-sm">
                    {item.daysUntilExpiry < 0 
                      ? `פג לפני ${Math.abs(item.daysUntilExpiry)} ימים`
                      : item.daysUntilExpiry === 0 
                      ? 'פג היום!'
                      : `פג בעוד ${item.daysUntilExpiry} ימים`
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
        >
          סגור
        </button>
      </div>
    </div>
  )
}
