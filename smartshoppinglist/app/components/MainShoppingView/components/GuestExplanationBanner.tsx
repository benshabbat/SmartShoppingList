import React from 'react'
import { MAIN_VIEW_TEXT, MAIN_VIEW_STYLES } from '../constants'

interface GuestExplanationBannerProps {
  onDismiss: () => void
}

/**
 * Guest Explanation Banner Component
 * Single Responsibility: Display first-time guest explanation
 */
export function GuestExplanationBanner({ onDismiss }: GuestExplanationBannerProps) {
  const handleDismiss = () => {
    onDismiss()
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.CONTAINER}>
      <div className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.CONTENT}>
        <div className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.ICON_CONTAINER}>
          <span className="text-indigo-600">{MAIN_VIEW_TEXT.GUEST_EXPLANATION.ICON}</span>
        </div>
        <div className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.TEXT_CONTAINER}>
          <h3 className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.TITLE}>
            {MAIN_VIEW_TEXT.GUEST_EXPLANATION.TITLE}
          </h3>
          <p className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.DESCRIPTION}>
            {MAIN_VIEW_TEXT.GUEST_EXPLANATION.DESCRIPTION}
          </p>
          <div className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.BUTTON_CONTAINER}>
            <button
              onClick={handleDismiss}
              className={MAIN_VIEW_STYLES.GUEST_EXPLANATION.BUTTON}
            >
              {MAIN_VIEW_TEXT.GUEST_EXPLANATION.BUTTON_TEXT}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
