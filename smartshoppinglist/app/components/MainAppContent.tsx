// Main app content with clean architecture and reduced props drilling
'use client'

import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { useAuthContext } from '../hooks'

// UI Components
import { Header } from './Header'
import { LoginForm } from './LoginForm'
import { MainShoppingView } from './MainShoppingView'
import { ToastContainer } from './Toast'
import { Tutorial } from './Tutorial'
import { LoadingOverlay } from './LoadingOverlay'
import { GuestModeNotification } from './GuestModeNotification'

export function MainAppContent() {
  const { loading, isAuthenticated, isGuest } = useAuthContext()
  const {
    showTutorial,
    openDataImportModal,
    showSuccess
  } = useGlobalShopping()
  
  // Temporary simple implementations
  const hasGuestData = () => false // TODO: Implement guest data detection
  const handleGuestDataImport = () => {
    showSuccess('יתווסף בעתיד')
  }
  const handleLoginSuccess = () => {
    // Check if there's guest data to import after successful login
    if (hasGuestData()) {
      openDataImportModal()
    }
  }
  
  // Show loading state
  if (loading) {
    return <LoadingOverlay message="טוען..." />
  }

  // Show login form if not authenticated and not guest
  if (!isAuthenticated && !isGuest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header />

      {/* Guest Mode Notification */}
      {isGuest && hasGuestData() && (
        <GuestModeNotification
          onDismiss={handleGuestDataImport}
        />
      )}

      {/* Main Content */}
      <MainShoppingView />

      {/* Tutorial */}
      <Tutorial />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}
