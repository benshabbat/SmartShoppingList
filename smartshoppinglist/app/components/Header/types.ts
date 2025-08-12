/**
 * Header Component Types
 * Centralized type definitions for better type safety
 */

export interface User {
  email?: string
  id?: string
  name?: string
}

export interface HeaderState {
  soundEnabled: boolean
  user: User | null
  isGuest: boolean
  isStatisticsPage: boolean
  isAuthenticated: boolean
}

export interface HeaderActions {
  openTutorial: () => void
  openReceiptScanner: () => void
  toggleSound: () => void
  handleSignOut: () => void
  handleSwitchToAuth: () => void
}

export interface LeftActionsProps {
  soundEnabled: boolean
  isStatisticsPage: boolean
  onOpenTutorial: () => void
  onToggleSound: () => void
  onOpenReceiptScanner: () => void
}

export interface RightActionsProps {
  user: User | null
  isGuest: boolean
  isStatisticsPage: boolean
  onSwitchToAuth: () => void
  onSignOut: () => void
}

export interface UserMenuProps {
  user: User | null
  isGuest: boolean
  onSwitchToAuth: () => void
  onSignOut: () => void
}

export interface NavigationButtonProps {
  isStatisticsPage: boolean
}

export interface BrandSectionProps {
  className?: string
}
