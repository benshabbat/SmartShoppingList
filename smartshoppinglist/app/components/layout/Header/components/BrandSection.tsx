import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { HEADER_STYLES, HEADER_TEXT } from '../constants'

/**
 * Brand Section Component
 * Single Responsibility: Display brand identity (logo, title, subtitle, description)
 */
export function BrandSection() {
  return (
    <>
      {/* Brand Logo and Title */}
      <div className={HEADER_STYLES.BRAND_SECTION}>
        <div className={HEADER_STYLES.BRAND.LOGO_CONTAINER}>
          <ShoppingCart className={`${HEADER_STYLES.ICON.LARGE} ${HEADER_STYLES.ICON.BRAND}`} />
        </div>
        <div>
          <h1 className={HEADER_STYLES.BRAND.TITLE}>
            {HEADER_TEXT.BRAND.TITLE}
          </h1>
          <p className={HEADER_STYLES.BRAND.SUBTITLE}>
            {HEADER_TEXT.BRAND.SUBTITLE}
          </p>
        </div>
      </div>

      {/* Brand Description */}
      <div className={HEADER_STYLES.DESCRIPTION}>
        {HEADER_TEXT.BRAND.DESCRIPTION}
      </div>
    </>
  )
}
