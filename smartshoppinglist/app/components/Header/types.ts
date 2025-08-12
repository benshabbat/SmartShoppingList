/**
 * Header Component Types
 * Centralized type definitions for better type safety
 * 
 * ZERO PROPS DRILLING ARCHITECTURE:
 * - Only data types (User, HeaderState, HeaderActions) remain
 * - All component prop interfaces removed - components use context!
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
