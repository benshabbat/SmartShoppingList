import { HEADER_TEXT } from '../constants'
import type { User } from '../../../types'

/**
 * User Actions Handler
 * Single Responsibility: Handle user-related actions and confirmations
 */
export class UserActionsHandler {
  /**
   * Handle switching from guest mode to authenticated mode
   * @param onSignOut - Function to call for signing out
   */
  static handleSwitchToAuth(onSignOut: () => void): void {
    const confirmSwitch = confirm(HEADER_TEXT.CONFIRM_MESSAGES.GUEST_TO_AUTH)
    
    if (confirmSwitch) {
      // For switching from guest to auth, we'll need to implement this
      // For now, just logout
      onSignOut()
    }
  }

  /**
   * Get appropriate logout tooltip based on user type
   * @param isGuest - Whether user is in guest mode
   * @returns Appropriate tooltip text
   */
  static getLogoutTooltip(isGuest: boolean): string {
    return isGuest ? HEADER_TEXT.TOOLTIPS.LOGOUT_GUEST : HEADER_TEXT.TOOLTIPS.LOGOUT_USER
  }

  /**
   * Get user display name
   * @param user - User object
   * @param isGuest - Whether user is in guest mode
   * @returns Display name for the user
   */
  static getUserDisplayName(user: User | null, isGuest: boolean): string {
    return isGuest ? HEADER_TEXT.USER.GUEST : (user?.email || '')
  }
}
