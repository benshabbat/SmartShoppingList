import React from 'react'
import { LeftActions, RightActions, BrandSection } from './components'
import { useHeaderLogic } from './useHeaderLogic'
import { HEADER_STYLES } from './constants'

/**
 * Header Component
 * Improved with SOLID, Clean Code, and DRY principles
 * Zero Props Drilling - gets everything from context
 */
export const Header = () => {
  const {
    // State
    soundEnabled,
    user,
    isGuest,
    isStatisticsPage,
    
    // Actions
    openTutorial,
    openReceiptScanner,
    toggleSound,
    handleSignOut,
    handleSwitchToAuth,
  } = useHeaderLogic()

  return (
    <div className={HEADER_STYLES.CONTAINER}>
      {/* Left Actions */}
      <LeftActions
        soundEnabled={soundEnabled}
        isStatisticsPage={isStatisticsPage}
        onOpenTutorial={openTutorial}
        onToggleSound={toggleSound}
        onOpenReceiptScanner={openReceiptScanner}
      />

      {/* Right Actions */}
      <RightActions
        user={user}
        isGuest={isGuest}
        isStatisticsPage={isStatisticsPage}
        onSwitchToAuth={handleSwitchToAuth}
        onSignOut={handleSignOut}
      />

      {/* Brand Section */}
      <BrandSection />
    </div>
  )
}
