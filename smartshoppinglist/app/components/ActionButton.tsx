/**
 * Centralized action buttons component following DRY principles
 */


import { LucideIcon } from 'lucide-react'
import { getButtonClasses, CSS_CONSTANTS } from '../utils'

interface ActionButtonProps {
  onClick: () => void
  icon: LucideIcon
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  iconSize?: number
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  iconSize = 16,
}) => {
  const buttonClass = getButtonClasses(variant, size, disabled || loading)
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${buttonClass} ${className} flex items-center ${CSS_CONSTANTS.GAP.SMALL}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      ) : (
        <Icon size={iconSize} />
      )}
      {children}
    </button>
  )
}

interface ActionButtonGroupProps {
  children: React.ReactNode
  className?: string
  spacing?: 'small' | 'medium' | 'large'
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  children,
  className = '',
  spacing = 'medium'
}) => {
  const spacingMap = {
    small: CSS_CONSTANTS.GAP.SMALL,
    medium: CSS_CONSTANTS.GAP.MEDIUM,
    large: CSS_CONSTANTS.GAP.LARGE,
  }

  return (
    <div className={`flex items-center ${spacingMap[spacing]} ${className}`}>
      {children}
    </div>
  )
}
