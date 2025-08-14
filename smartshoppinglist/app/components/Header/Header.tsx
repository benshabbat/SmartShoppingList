import { LeftActions, RightActions, BrandSection } from './components'
import { useHeaderLogic } from './useHeaderLogic'
import { HEADER_STYLES } from '../../constants'

/**
 * Header Component
 * Improved with SOLID, Clean Code, and DRY principles
 * Zero Props Drilling - gets everything from context
 */
export const Header = () => {
  const {
    // State
    soundEnabled: _soundEnabled,
    user: _user,
    isGuest: _isGuest,
    isStatisticsPage: _isStatisticsPage,
    
    // Actions
    openTutorial: _openTutorial,
    openReceiptScanner: _openReceiptScanner,
    toggleSound: _toggleSound,
    handleSignOut: _handleSignOut,
    handleSwitchToAuth: _handleSwitchToAuth,
  } = useHeaderLogic()

  return (
    <div className={HEADER_STYLES.CONTAINER}>
      {/* Left Actions - ZERO PROPS DRILLING */}
      <LeftActions />

      {/* Right Actions - ZERO PROPS DRILLING */}
      <RightActions />

      {/* Brand Section */}
      <BrandSection />
    </div>
  )
}
