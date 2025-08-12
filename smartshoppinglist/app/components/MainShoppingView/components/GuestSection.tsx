import React from 'react'
import { GuestWelcomeMessage } from '../../GuestWelcomeMessage'
import { GuestExplanationBanner } from './GuestExplanationBanner'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'

interface GuestSectionProps {
  isGuest: boolean
}

/**
 * Guest Section Component
 * Single Responsibility: Handle all guest-related UI elements
 */
export function GuestSection({ isGuest }: GuestSectionProps) {
  const { shouldShowGuestExplanation, dismissGuestExplanation } = useGlobalShopping()

  if (!isGuest) {
    return null
  }

  return (
    <>
      <GuestWelcomeMessage isGuest={isGuest} />
      {shouldShowGuestExplanation && (
        <GuestExplanationBanner onDismiss={dismissGuestExplanation} />
      )}
    </>
  )
}
