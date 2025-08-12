import React from 'react'
import { CSS_CLASSES, UI_TEXT, LAYOUT } from '../constants'

interface BrandHeaderProps {
  className?: string
}

/**
 * Brand Header Component
 * Single Responsibility: Display brand identity
 */
export function BrandHeader({ className = '' }: BrandHeaderProps) {
  return (
    <div className={`${LAYOUT.SPACING.TEXT_CENTER} ${LAYOUT.SPACING.SECTION} ${className}`}>
      {/* Logo */}
      <div className={`${CSS_CLASSES.GRADIENT.BRAND} rounded-full p-4 shadow-lg mx-auto mb-4 ${LAYOUT.LOGO_SIZE} flex items-center justify-center`}>
        <span className="text-white text-3xl">{UI_TEXT.BRAND.EMOJI}</span>
      </div>
      
      {/* Title and Subtitle */}
      <h1 className={`text-3xl font-bold ${CSS_CLASSES.GRADIENT.BRAND_TEXT} mb-2`}>
        {UI_TEXT.BRAND.TITLE}
      </h1>
      <p className="text-gray-600 text-sm">
        {UI_TEXT.BRAND.SUBTITLE}
      </p>
    </div>
  )
}
