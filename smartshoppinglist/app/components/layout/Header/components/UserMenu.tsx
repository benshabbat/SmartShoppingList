import { User, LogOut } from 'lucide-react'
import { HEADER_STYLES, HEADER_TEXT } from '../constants'
import { UserActionsHandler } from '../utils'
import { useHeaderLogic } from '../useHeaderLogic'

/**
 * User Menu Component - ZERO PROPS DRILLING
 * Single Responsibility: Handle user authentication display and actions
 * Gets everything from context!
 */
export function UserMenu() {
  const {
    user,
    isGuest,
    handleSwitchToAuth,
    handleSignOut,
  } = useHeaderLogic()

  if (!user) return null

  const displayName = UserActionsHandler.getUserDisplayName(user, isGuest)
  const logoutTooltip = UserActionsHandler.getLogoutTooltip(isGuest)

  return (
    <div className={HEADER_STYLES.USER_MENU.CONTAINER}>
      {/* User Icon */}
      <User className={`${HEADER_STYLES.ICON.SMALL} ${HEADER_STYLES.ICON.USER}`} />
      
      {/* User Display Name */}
      <span className={HEADER_STYLES.USER_MENU.EMAIL}>
        {displayName}
      </span>
      
      {/* Guest Login Button */}
      {isGuest && (
        <button
          onClick={handleSwitchToAuth}
          className={HEADER_STYLES.USER_MENU.LOGIN_BUTTON}
          title={HEADER_TEXT.TOOLTIPS.LOGIN}
        >
          {HEADER_TEXT.USER.LOGIN_CTA}
        </button>
      )}
      
      {/* Logout Button */}
      <button
        onClick={handleSignOut}
        className={HEADER_STYLES.BUTTON.LOGOUT}
        title={logoutTooltip}
      >
        <LogOut className={`${HEADER_STYLES.ICON.SMALL} ${HEADER_STYLES.ICON.LOGOUT}`} />
      </button>
    </div>
  )
}
