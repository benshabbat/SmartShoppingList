import { HelpCircle, Volume2, VolumeX, Receipt } from 'lucide-react'
import { useHeaderLogic } from '../useHeaderLogic'
import { HEADER_STYLES, HEADER_TEXT } from '../constants'

/**
 * Left Actions Component - ZERO PROPS DRILLING
 * Single Responsibility: Handle left side action buttons
 * Gets everything from context!
 */
export function LeftActions() {
  const {
    soundEnabled,
    isStatisticsPage,
    openTutorial,
    toggleSound,
    openReceiptScanner,
  } = useHeaderLogic()

  return (
    <div className={HEADER_STYLES.LEFT_ACTIONS}>
      {/* Help Button */}
      <button
        onClick={openTutorial}
        className={`${HEADER_STYLES.BUTTON.BASE} ${HEADER_STYLES.BUTTON.HELP}`}
        title={HEADER_TEXT.TOOLTIPS.HELP}
      >
        <HelpCircle className={`${HEADER_STYLES.ICON.STANDARD} ${HEADER_STYLES.ICON.HELP}`} />
      </button>
      
      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className={`${HEADER_STYLES.BUTTON.BASE} ${HEADER_STYLES.BUTTON.SOUND}`}
        title={soundEnabled ? HEADER_TEXT.TOOLTIPS.SOUND_ON : HEADER_TEXT.TOOLTIPS.SOUND_OFF}
      >
        {soundEnabled ? (
          <Volume2 className={`${HEADER_STYLES.ICON.STANDARD} ${HEADER_STYLES.ICON.SOUND_ON}`} />
        ) : (
          <VolumeX className={`${HEADER_STYLES.ICON.STANDARD} ${HEADER_STYLES.ICON.SOUND_OFF}`} />
        )}
      </button>

      {/* Receipt Scanner Button - Only on main page */}
      {!isStatisticsPage && (
        <button
          onClick={openReceiptScanner}
          className={`${HEADER_STYLES.BUTTON.BASE} ${HEADER_STYLES.BUTTON.RECEIPT}`}
          title={HEADER_TEXT.TOOLTIPS.RECEIPT_SCANNER}
        >
          <Receipt className={`${HEADER_STYLES.ICON.STANDARD} ${HEADER_STYLES.ICON.RECEIPT}`} />
        </button>
      )}
    </div>
  )
}
