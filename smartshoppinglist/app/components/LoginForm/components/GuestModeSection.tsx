import { CSS_CLASSES, UI_TEXT } from '../constants'
import { GuestModeSectionProps } from '../../../types'

/**
 * Guest Mode Section Component
 * Single Responsibility: Handle guest mode functionality
 */
export function GuestModeSection({ onGuestLogin, className = '' }: GuestModeSectionProps) {
  return (
    <div className={`mb-6 p-4 ${CSS_CLASSES.GRADIENT.GUEST_SECTION} ${CSS_CLASSES.CARD.GUEST_SECTION} ${className}`}>
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">🚀</div>
        <h3 className="font-bold text-blue-900 mb-2">{UI_TEXT.GUEST_MODE.TITLE}</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          {UI_TEXT.GUEST_MODE.DESCRIPTION}
        </p>
      </div>
      
      <button
        type="button"
        onClick={onGuestLogin}
        className={`${CSS_CLASSES.GRADIENT.PRIMARY_BUTTON} ${CSS_CLASSES.BUTTON.PRIMARY}`}
      >
        <span className="text-xl">{UI_TEXT.BRAND.EMOJI}</span>
        {UI_TEXT.GUEST_MODE.CTA}
      </button>
      
      <div className="mt-3 text-xs text-blue-600 text-center space-y-1">
        {UI_TEXT.GUEST_MODE.BENEFITS.map((benefit, index) => (
          <div key={index}>✅ {benefit}</div>
        ))}
      </div>
    </div>
  )
}
