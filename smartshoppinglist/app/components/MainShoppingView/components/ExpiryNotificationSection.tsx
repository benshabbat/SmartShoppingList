import React from 'react'
import { ExpiryNotification } from '../../ExpiryNotification'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'

/**
 * Expiry Notification Section Component
 * Single Responsibility: Conditionally render ExpiryNotification
 */
export function ExpiryNotificationSection() {
  const { hasExpiringItems, expiringItems } = useGlobalShopping()

  if (!hasExpiringItems || expiringItems.length === 0) {
    return null
  }

  return <ExpiryNotification />
}
