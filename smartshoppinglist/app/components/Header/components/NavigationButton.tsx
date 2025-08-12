import React from 'react'
import Link from 'next/link'
import { BarChart3, ShoppingCart } from 'lucide-react'
import { HEADER_STYLES, HEADER_TEXT, ROUTES } from '../constants'
import type { NavigationButtonProps } from '../types'

/**
 * Navigation Button Component
 * Single Responsibility: Handle navigation between main pages
 */
export function NavigationButton({ isStatisticsPage }: NavigationButtonProps) {
  if (!isStatisticsPage) {
    // Show Statistics button when on main page
    return (
      <Link 
        href={ROUTES.STATISTICS}
        className={`${HEADER_STYLES.BUTTON.BASE} ${HEADER_STYLES.BUTTON.STATISTICS}`}
        title={HEADER_TEXT.TOOLTIPS.STATISTICS}
      >
        <BarChart3 className={`${HEADER_STYLES.ICON.STANDARD} ${HEADER_STYLES.ICON.STATISTICS}`} />
      </Link>
    )
  }

  // Show Home button when on statistics page
  return (
    <Link 
      href={ROUTES.HOME}
      className={`${HEADER_STYLES.BUTTON.BASE} ${HEADER_STYLES.BUTTON.HOME}`}
      title={HEADER_TEXT.TOOLTIPS.HOME}
    >
      <ShoppingCart className={`${HEADER_STYLES.ICON.STANDARD} ${HEADER_STYLES.ICON.HOME}`} />
    </Link>
  )
}
