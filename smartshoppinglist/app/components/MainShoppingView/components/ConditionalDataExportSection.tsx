import React from 'react'
import { DataExportSection } from './DataExportSection'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'

/**
 * Conditional Data Export Section Component
 * Single Responsibility: Conditionally render DataExportSection
 */
export function ConditionalDataExportSection() {
  const { hasPurchaseHistory } = useGlobalShopping()

  if (!hasPurchaseHistory) {
    return null
  }

  return <DataExportSection />
}
