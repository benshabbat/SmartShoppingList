/**
 * Header Component Types
 * Centralized type definitions for better type safety
 * 
 * ZERO PROPS DRILLING ARCHITECTURE:
 * - Only data types (User, HeaderState, HeaderActions) remain
 * - All component prop interfaces removed - components use context!
 */

import { User, HeaderState, HeaderActions } from '../../types'

// Re-export all types for backward compatibility
export type {
  User,
  HeaderState,
  HeaderActions
}
