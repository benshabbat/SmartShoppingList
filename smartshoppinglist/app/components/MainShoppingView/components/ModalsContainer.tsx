import React from 'react'
import { ReceiptScanner } from '../../ReceiptScanner'
import { ExpiryDateModal } from '../../ExpiryDateModal'
import { DataImportModal } from '../../DataImportModal'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'

/**
 * Modals Container Component
 * Single Responsibility: Render all modals based on state
 */
export function ModalsContainer() {
  const {
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
  } = useGlobalShopping()

  return (
    <>
      {showReceiptScanner && <ReceiptScanner />}
      {showExpiryModal && <ExpiryDateModal />}
      {showDataImportModal && <DataImportModal />}
    </>
  )
}
