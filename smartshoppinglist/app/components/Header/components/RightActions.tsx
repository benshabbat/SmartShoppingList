import React from 'react'
import { UserMenu, NavigationButton } from './'
import type { RightActionsProps } from '../types'

/**
 * Right Actions Component
 * Single Responsibility: Handle right side actions (user menu and navigation)
 */
export function RightActions({
  user,
  isGuest,
  isStatisticsPage,
  onSwitchToAuth,
  onSignOut,
}: RightActionsProps) {
  const isAuthenticated = !!user

  return (
    <div className="absolute top-0 right-0 flex gap-2">
      {/* User Menu - Only for authenticated users */}
      {isAuthenticated && (
        <UserMenu
          user={user}
          isGuest={isGuest}
          onSwitchToAuth={onSwitchToAuth}
          onSignOut={onSignOut}
        />
      )}
      
      {/* Navigation Button */}
      <NavigationButton isStatisticsPage={isStatisticsPage} />
    </div>
  )
}
