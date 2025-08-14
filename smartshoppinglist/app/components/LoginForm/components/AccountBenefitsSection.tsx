import React from 'react'
import { CSS_CLASSES, UI_TEXT } from '../../../constants'
import { AccountBenefitsSectionProps } from '../../../types'

/**
 * Account Benefits Section Component
 * Single Responsibility: Display account benefits information
 */
export function AccountBenefitsSection({ className = '' }: AccountBenefitsSectionProps) {
  return (
    <div className={`mt-4 ${CSS_CLASSES.CARD.BENEFITS_SECTION} ${className}`}>
      <p className="text-xs text-green-700 text-center leading-relaxed">
        <strong>{UI_TEXT.ACCOUNT_BENEFITS.TITLE}</strong> {UI_TEXT.ACCOUNT_BENEFITS.DESCRIPTION}
      </p>
    </div>
  )
}
