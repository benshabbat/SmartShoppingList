'use client'

import { useState } from 'react'

// Components
import { LoginForm } from './components/LoginForm'
import { MainShoppingView } from './components/MainShoppingView'
import { DataImportModal } from './components/DataImportModal'

// Hooks
import { 
  useAuthContext,
  useShoppingList
} from './hooks'
import { useToasts } from './components/Toast'

export default function ShoppingListApp() {
  const { loading, isAuthenticated } = useAuthContext()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showDataImportModal, setShowDataImportModal] = useState(false)
  
  const { importGuestData, hasGuestData } = useShoppingList()
  const { showSuccess } = useToasts()

  // Debug log
  console.log('🚀 App render:', { loading, isAuthenticated, showLoginForm })

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    )
  }

  // Show login form if user is not authenticated 
  if (!isAuthenticated) {
    return (
      <LoginForm 
        onSuccess={() => {
          console.log('LoginForm onSuccess called')
          setShowLoginForm(false)
          // Check if there's guest data to import after successful login
          if (hasGuestData()) {
            setShowDataImportModal(true)
          }
        }} 
      />
    )
  }

  return (
    <>
      <MainShoppingView />
      
      {/* Data Import Modal for post-login guest data import */}
      {showDataImportModal && (
        <DataImportModal
          isOpen={showDataImportModal}
          onClose={() => setShowDataImportModal(false)}
          onImportGuestData={async () => {
            await importGuestData()
            showSuccess('נתונים יובאו בהצלחה!', 'הנתונים ממצב האורח נוספו לחשבון שלך')
            setShowDataImportModal(false)
          }}
          hasGuestData={hasGuestData()}
        />
      )}
    </>
  )
}
