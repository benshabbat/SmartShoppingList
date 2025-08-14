/**
 * CSS class name utilities following DRY principles
 */

import { ButtonVariant, ContainerVariant, InputVariant, ItemVariant } from '../types'

export const buttonStyles: ButtonVariant = {
  base: 'px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  primary: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500 shadow-md hover:shadow-lg',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg',
  success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-md hover:shadow-lg',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-md hover:shadow-lg'
}

export const containerStyles: ContainerVariant = {
  base: 'rounded-xl border border-gray-200 shadow-sm',
  card: 'bg-white rounded-2xl shadow-lg p-6 border border-gray-100',
  section: 'bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100',
  modal: 'bg-white rounded-2xl shadow-2xl border border-gray-200'
}

export const inputStyles: InputVariant = {
  base: 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300',
  default: 'border-gray-300 focus:ring-indigo-500 bg-white shadow-sm',
  error: 'border-red-300 focus:ring-red-500 bg-red-50',
  success: 'border-green-300 focus:ring-green-500 bg-green-50',
  highlighted: 'ring-2 ring-green-400 border-green-300 bg-green-50'
}

export const itemContainerStyles: ItemVariant = {
  pending: 'bg-gray-50 hover:bg-gray-100 border border-gray-200',
  inCart: 'bg-blue-50 hover:bg-blue-100 border border-blue-200',
  purchased: 'bg-green-50 hover:bg-green-100 border border-green-200'
}

/**
 * Utility function to combine class names
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate button classes based on variant and size
 */
export const getButtonClasses = (
  variant: keyof ButtonVariant = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled = false
): string => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return cn(
    buttonStyles.base,
    variant !== 'base' ? buttonStyles[variant] : '',
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed'
  )
}

/**
 * Generate input classes based on state
 */
export const getInputClasses = (
  state: keyof InputVariant = 'default',
  className?: string
): string => {
  return cn(
    inputStyles.base,
    inputStyles[state],
    className
  )
}

/**
 * Common gradient styles to avoid duplication
 */
export const gradientStyles = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500',
  accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
}

export const gradientBackgrounds = {
  primary: 'bg-gradient-to-r from-indigo-50 to-purple-50',
  success: 'bg-gradient-to-r from-green-50 to-emerald-50',
  warning: 'bg-gradient-to-r from-amber-50 to-orange-50',
  danger: 'bg-gradient-to-r from-red-50 to-pink-50',
  accent: 'bg-gradient-to-r from-purple-50 to-pink-50',
  blue: 'bg-gradient-to-r from-blue-50 to-indigo-50',
}

/**
 * Common button combinations
 */
export const commonButtons = {
  successLarge: 'px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2',
  dangerLarge: 'px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105',
  accentMedium: 'px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105',
}
