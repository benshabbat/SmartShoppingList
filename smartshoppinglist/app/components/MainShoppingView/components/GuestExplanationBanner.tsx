import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'
import { Button } from '@/app/components/ActionButton'
import { MAIN_VIEW_TEXT, MAIN_VIEW_STYLES } from '../../../constants'

/**
 * Guest Explanation Banner Component - ZERO PROPS DRILLING
 * Single Responsibility: Display first-time guest explanation
 * Gets everything from context!
 */
export function GuestExplanationBanner() {
  const { dismissGuestExplanation } = useGlobalShopping()

  const handleDismiss = () => {
    dismissGuestExplanation()
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
