'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Home } from 'lucide-react'
import { EnhancedStatistics } from '../components/EnhancedStatistics'
import { Header } from '../components/Header'
import { ToastContainer } from '../components/Toast'
import { ShoppingItem, ItemSuggestion } from '../types'

export default function StatisticsPage() {
  const [purchaseHistory, setPurchaseHistory] = useState<ShoppingItem[]>([])
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([])
  const [pantryItems, setPantryItems] = useState<ShoppingItem[]>([])

  // טעינת נתונים מ-localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedPurchaseHistory = localStorage.getItem('purchaseHistory')
        if (storedPurchaseHistory) {
          setPurchaseHistory(JSON.parse(storedPurchaseHistory))
        }

        const storedSuggestions = localStorage.getItem('suggestions')
        if (storedSuggestions) {
          setSuggestions(JSON.parse(storedSuggestions))
        }

        const storedPantryItems = localStorage.getItem('pantryItems')
        if (storedPantryItems) {
          setPantryItems(JSON.parse(storedPantryItems))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <Header
          onOpenTutorial={() => {}}
        />

        {/* Breadcrumb Navigation */}
        <nav className="mb-6 mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link 
              href="/" 
              className="flex items-center hover:text-blue-600 transition-colors duration-200"
            >
              <Home className="w-4 h-4 ml-1" />
              <span>דף הבית</span>
            </Link>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">סטטיסטיקות מתקדמות</span>
          </div>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 סטטיסטיקות מתקדמות
          </h1>
          <p className="text-lg text-gray-600">
            צפה בנתונים מפורטים על הרגלי הקנייה שלך ונהל את המלאי בצורה חכמה
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-1 inline-flex">
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium transition-all duration-200">
              📈 כל הסטטיסטיקות
            </button>
          </div>
        </div>

        {/* Statistics Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <EnhancedStatistics 
            purchaseHistory={purchaseHistory}
            pantryItems={pantryItems}
          />
        </div>

        {/* Additional Information Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💡 מידע נוסף על הסטטיסטיקות
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">📈 מגמות קנייה</h3>
                <p className="text-sm text-gray-600">
                  עקוב אחר שינויים בהרגלי הקנייה שלך לאורך זמן
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">🏷️ ניתוח קטגוריות</h3>
                <p className="text-sm text-gray-600">
                  ראה באילו קטגוריות אתה קונה הכי הרבה ובאילו הכי פחות
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">⏰ תוקף מוצרים</h3>
                <p className="text-sm text-gray-600">
                  נהל את המלאי בבית ומנע בזבוז מזון
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 ml-2" />
            <span>חזרה לדף הבית</span>
          </Link>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  )
}
