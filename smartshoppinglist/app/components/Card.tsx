/**
 * Unified Card component following DRY principles
 */

import React from 'react'
import { containerStyles, CSS_CONSTANTS, cn } from '../utils'

interface CardProps {
  children: React.ReactNode
  variant?: 'card' | 'section' | 'modal'
  className?: string
  padding?: 'small' | 'medium' | 'large' | 'extra-large'
  shadow?: 'small' | 'medium' | 'large' | 'extra-large' | 'extra-extra-large'
  rounded?: 'small' | 'medium' | 'large'
  onClick?: () => void
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'card',
  className = '',
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium',
  onClick,
  hoverable = false,
}) => {
  const paddingMap = {
    small: CSS_CONSTANTS.SPACING.SMALL,
    medium: CSS_CONSTANTS.SPACING.MEDIUM,
    large: CSS_CONSTANTS.SPACING.LARGE,
    'extra-large': CSS_CONSTANTS.SPACING.EXTRA_LARGE,
  }

  const shadowMap = {
    small: CSS_CONSTANTS.SHADOW.SMALL,
    medium: CSS_CONSTANTS.SHADOW.MEDIUM,
    large: CSS_CONSTANTS.SHADOW.LARGE,
    'extra-large': CSS_CONSTANTS.SHADOW.EXTRA_LARGE,
    'extra-extra-large': CSS_CONSTANTS.SHADOW.EXTRA_EXTRA_LARGE,
  }

  const roundedMap = {
    small: CSS_CONSTANTS.BORDER_RADIUS.SMALL,
    medium: CSS_CONSTANTS.BORDER_RADIUS.MEDIUM,
    large: CSS_CONSTANTS.BORDER_RADIUS.LARGE,
  }

  const baseClasses = cn(
    containerStyles[variant],
    paddingMap[padding],
    shadowMap[shadow],
    roundedMap[rounded],
    hoverable && 'transition-all duration-200 hover:shadow-lg',
    onClick && 'cursor-pointer',
    className
  )

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-bold text-xl text-gray-800">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={cn('flex-1', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  )
}
