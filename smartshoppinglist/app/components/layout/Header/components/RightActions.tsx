import { UserMenu, NavigationButton } from './'
import { useHeaderLogic } from '../useHeaderLogic'

/**
 * Right Actions Component - ZERO PROPS DRILLING
 * Single Responsibility: Handle right side actions (user menu and navigation)
 * Gets everything from context!
 */
export function RightActions() {
  const {
    user,
    isGuest: _isGuest,
    isStatisticsPage: _isStatisticsPage,
    handleSwitchToAuth: _handleSwitchToAuth,
    handleSignOut: _handleSignOut,
  } = useHeaderLogic()

  const isAuthenticated = !!user

  return (
    <div className="absolute top-0 right-0 flex gap-2">
      {/* User Menu - Only for authenticated users */}
      {isAuthenticated && (
        <UserMenu />
      )}
      
      {/* Navigation Button */}
      <NavigationButton />
    </div>
  )
}
