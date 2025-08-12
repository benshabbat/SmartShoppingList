import { GuestWelcomeMessage } from '../../GuestWelcomeMessage'
import { GuestExplanationBanner } from './GuestExplanationBanner'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'
import { useAuth } from '../../../hooks/useAuth'

/**
 * Guest Section Component - ZERO PROPS DRILLING
 * Single Responsibility: Handle all guest-related UI elements
 * Gets everything from context!
 */
export function GuestSection() {
  const { isGuest } = useAuth()
  const { shouldShowGuestExplanation, dismissGuestExplanation } = useGlobalShopping()

  if (!isGuest) {
    return null
  }

  return (
    <>
      <GuestWelcomeMessage />
      {shouldShowGuestExplanation && (
        <GuestExplanationBanner />
      )}
    </>
  )
}
