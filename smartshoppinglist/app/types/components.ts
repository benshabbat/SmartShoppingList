/**
 * Component Types - React Component Props and Interfaces
 * Contains all types related to React components, their props, and component-specific logic
 */

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import type { Toast } from './ui'
import type { ShoppingItem } from './data'

// === BASE TYPES ===

// Common UI types
export type AlertType = 'success' | 'error' | 'info' | 'warning'
export type ComponentSize = 'sm' | 'md' | 'lg'
export type Position = 'top' | 'bottom' | 'left' | 'right'
export type ComponentVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type ItemStatus = 'pending' | 'inCart' | 'purchased'

// === BASE COMPONENT TYPES ===

export interface BaseComponentProps {
  className?: string
  disabled?: boolean
}

export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
}

// === PROVIDER COMPONENT TYPES ===

export interface QueryProviderProps {
  children: React.ReactNode
}

// === TOAST TYPES ===

export interface SimpleToastProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
  onClose?: () => void
}

export interface ToastProps {
  toast: Toast
  onToggle: () => void
  onRemove?: (id: string) => void
}

// === STAT CARD TYPES ===

export interface StatCard {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'stable'
  icon?: ReactNode
}

export interface EnhancedStatCard {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  textColor: string
  subtext?: string
  isText?: boolean
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
}

// === CATEGORY TYPES ===

export interface CategoryHeaderProps {
  category: string
  count: number
  isExpanded: boolean
  onToggle: () => void
}

export interface CategoryDisplayProps {
  category: string
  count: number
  headerColor?: string
}

export interface CategorySectionProps {
  title: string
  items: ShoppingItem[]
  variant?: 'pending' | 'inCart' | 'purchased'
  headerColor?: string
  showItemCount?: boolean
  emptyMessage?: string
}

// === CARD TYPES ===

export interface CardProps {
  children: ReactNode
  variant?: 'card' | 'section' | 'modal'
  className?: string
  padding?: 'small' | 'medium' | 'large' | 'extra-large'
  shadow?: 'small' | 'medium' | 'large' | 'extra-large' | 'extra-extra-large'
  rounded?: 'small' | 'medium' | 'large'
  onClick?: () => void
  hoverable?: boolean
}

export interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export interface CardBodyProps {
  children: ReactNode
  className?: string
}

export interface CardFooterProps {
  children: ReactNode
  className?: string
}

// === BUTTON TYPES ===

export interface ActionButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: ComponentVariant
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
  icon?: LucideIcon
  className?: string
  iconSize?: number
}


// === INPUT TYPES ===
// Note: AutoCompleteProps removed - component now uses context!

// === OTHER COMPONENT TYPES ===

export interface RenderProps<T = unknown> {
  data: T
  render: (data: T) => ReactNode
}

// === SHOPPING ITEM COMPONENT TYPES ===

export interface ShoppingItemComponentProps {
  item: ShoppingItem
  variant?: 'pending' | 'inCart' | 'purchased'
  showActions?: boolean
  isExpanded?: boolean
  onToggleExpansion?: () => void
}

export interface ShoppingItemUIProps {
  item: ShoppingItem
  variant: 'pending' | 'inCart' | 'purchased'
  isExpanded?: boolean
  onToggleExpansion?: () => void
}

export interface UseShoppingItemLogicProps {
  item: ShoppingItem
  variant?: 'pending' | 'inCart' | 'purchased'
}

// === SUGGESTION TYPES ===

export interface SuggestionItemProps {
  suggestion: string
  onAccept?: (suggestion: string) => void
  onDismiss?: (id: string) => void
  isHighlighted?: boolean
  onClick?: () => void
}

// === TUTORIAL TYPES ===

export interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

// === ADDITIONAL COMPONENT TYPES ===

export interface InteractiveEmojiProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export interface CategorySelectorProps {
  categories: string[]
  selectedCategory: string | null
  value?: string
  onChange?: (category: string) => void
  onCategorySelect: (category: string | null) => void
  showAll?: boolean
  isHighlighted?: boolean
  className?: string
  disabled?: boolean
}

export interface ItemActionType {
  id: string
  label: string
  icon: ReactNode
  action: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

export interface ItemActionsProps {
  item: ShoppingItem
  actions: ItemActionType[]
  variant?: 'pending' | 'inCart' | 'purchased'
}

export interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  variant?: 'default' | 'minimal'
}

export interface NotificationBannerProps {
  type: 'suggestion' | 'expiry' | 'info' | 'warning' | 'auto-change'
  message: string
  category?: string
  productName?: string
  onDismiss?: () => void
  onAccept?: () => void
  isVisible?: boolean
  actions?: Array<{
    label: string
    action: () => void
  }>
}

export interface ExpiryDateModalUIProps {
  items: ShoppingItem[]
  isOpen: boolean
  expiryDates: Record<string, Date | null>
  skippedItems: Set<string>
  today: string
  quickDateOptions: Array<{ label: string; value: string; days: number }>
  hasAnyDates: boolean
  allItemsProcessed: boolean
  onClose: () => void
  onExpiryDateChange: (itemId: string, date: Date | null) => void
  onSkipItem: (itemId: string) => void
  onSubmit: () => void
  onSkip: () => void
  onQuickDateSet?: (days: number) => void
  onSetAllDates?: (date: Date) => void
}

export interface UseExpiryDateModalLogicProps {
  items: ShoppingItem[]
  onSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  onClose?: () => void
}
