/**
 * Props Drilling Comparison
 * מציג השוואה בין אדריכלות עם ובלי props drilling
 */

'use client'

import { useState } from 'react'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'

// === BEFORE: עם Props Drilling ❌ ===
interface BadComponentProps {
  items: any[]
  addItem: (name: string, category: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
  totalItems: number
  completionRate: number
  hasItemsInCart: boolean
  categoryStats: Record<string, number>
  cartItems: any[]
  pendingItems: any[]
}

const BadComponent = (props: BadComponentProps) => {
  return (
    <div className="border-2 border-red-300 bg-red-50 p-4 rounded-lg">
      <h3 className="text-red-700 font-bold mb-2">❌ עם Props Drilling</h3>
      <p className="text-red-600 text-sm mb-3">
        הרכיב הזה מקבל {Object.keys(props).length} props שונים!
      </p>
      <BadSubComponent {...props} />
    </div>
  )
}

const BadSubComponent = (props: BadComponentProps) => {
  return (
    <div className="border border-red-400 bg-red-100 p-3 rounded">
      <p className="text-red-600 text-xs mb-2">
        SubComponent גם מקבל את כל ה-{Object.keys(props).length} props
      </p>
      <BadDeepComponent {...props} />
    </div>
  )
}

const BadDeepComponent = ({ totalItems, completionRate, showSuccess }: BadComponentProps) => {
  return (
    <div className="border border-red-500 bg-red-200 p-2 rounded text-center">
      <p className="text-red-700 text-xs mb-1">DeepComponent</p>
      <p className="text-red-800 text-xs">
        סך הכל: {totalItems} | השלמה: {completionRate}%
      </p>
      <button 
        onClick={() => showSuccess('Props drilling is bad!')}
        className="text-xs bg-red-600 text-white px-2 py-1 rounded mt-1"
      >
        Click me
      </button>
    </div>
  )
}

// === AFTER: בלי Props Drilling ✅ ===
const GoodComponent = () => {
  return (
    <div className="border-2 border-green-300 bg-green-50 p-4 rounded-lg">
      <h3 className="text-green-700 font-bold mb-2">✅ ללא Props Drilling</h3>
      <p className="text-green-600 text-sm mb-3">
        הרכיב הזה לא מקבל שום props! הכל מהקונטקסט
      </p>
      <GoodSubComponent />
    </div>
  )
}

const GoodSubComponent = () => {
  return (
    <div className="border border-green-400 bg-green-100 p-3 rounded">
      <p className="text-green-600 text-xs mb-2">
        SubComponent גם לא מקבל props - הכל מהקונטקסט!
      </p>
      <GoodDeepComponent />
    </div>
  )
}

const GoodDeepComponent = () => {
  // Zero props! הכל מהקונטקסט
  const { totalItems, completionRate, showSuccess } = useGlobalShopping()
  
  return (
    <div className="border border-green-500 bg-green-200 p-2 rounded text-center">
      <p className="text-green-700 text-xs mb-1">DeepComponent</p>
      <p className="text-green-800 text-xs">
        סך הכל: {totalItems} | השלמה: {completionRate}%
      </p>
      <button 
        onClick={() => showSuccess('Zero props drilling is amazing!')}
        className="text-xs bg-green-600 text-white px-2 py-1 rounded mt-1"
      >
        Click me
      </button>
    </div>
  )
}

export const PropsDrillingComparison = () => {
  const [showBad, setShowBad] = useState(true)
  
  // הכל מהקונטקסט - NO PROPS!
  const contextData = useGlobalShopping()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📊 השוואה: Props Drilling vs Zero Props Drilling
        </h2>
        
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowBad(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showBad 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ❌ עם Props Drilling
          </button>
          
          <button
            onClick={() => setShowBad(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showBad 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✅ ללא Props Drilling
          </button>
        </div>
      </div>

      {showBad ? (
        <div>
          <BadComponent 
            items={contextData.items}
            addItem={contextData.addItem}
            removeItem={contextData.removeItem}
            toggleItem={contextData.toggleItemInCart}
            showSuccess={contextData.showSuccess}
            showError={contextData.showError}
            totalItems={contextData.totalItems}
            completionRate={contextData.completionRate}
            hasItemsInCart={contextData.hasItemsInCart}
            categoryStats={contextData.categoryStats}
            cartItems={contextData.cartItems}
            pendingItems={contextData.pendingItems}
          />
          
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-700 mb-2">❌ בעיות עם Props Drilling:</h4>
            <ul className="text-red-600 text-sm space-y-1">
              <li>• צריך להעביר 12+ props דרך כל רכיב</li>
              <li>• רכיבים ביניים מקבלים props שהם לא משתמשים בהם</li>
              <li>• קשה לתחזוקה ולשינויים</li>
              <li>• הרבה קוד חוזר</li>
              <li>• שגיאות TypeScript מורכבות</li>
              <li>• קשה לעקוב אחרי זרימת הנתונים</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <GoodComponent />
          
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-700 mb-2">✅ יתרונות Zero Props Drilling:</h4>
            <ul className="text-green-600 text-sm space-y-1">
              <li>• אין צורך להעביר props בכלל</li>
              <li>• כל רכיב מקבל בדיוק מה שהוא צריך</li>
              <li>• קל לתחזוקה ולשינויים</li>
              <li>• קוד נקי וקריא</li>
              <li>• TypeScript פשוט ונקי</li>
              <li>• זרימת נתונים ברורה וישירה</li>
              <li>• ביצועים טובים יותר</li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-700 mb-2">🚀 המסקנה:</h4>
        <p className="text-blue-600 text-sm">
          הארכיטקטורה שלך עם Global Context ו-Zero Props Drilling 
          היא הרבה יותר נקייה, יעילה וקלה לתחזוקה מאשר העברת props ידנית.
        </p>
      </div>
    </div>
  )
}
