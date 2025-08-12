'use client'

import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { ReceiptScanner } from './ReceiptScanner'
import { ExpiryDateModal } from './ExpiryDateModal'
import { DataImportModal } from './DataImportModal'

/**
 * ModalsContainer - Zero Props Drilling
 * כל המידע מגיע מה-context
 */
export function ModalsContainer() {
  // Get only the UI state we need from context - no props needed!
  const {
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
  } = useGlobalShopping()
  return (
    <>
      {/* Receipt Scanner Modal - מקבל הכל מה-context */}
      {showReceiptScanner && <ReceiptScanner />}

      {/* Expiry Date Modal - מקבל הכל מה-context */}
      {showExpiryModal && <ExpiryDateModal />}

      {/* Data Import Modal - מקבל הכל מה-context */}
      {showDataImportModal && <DataImportModal />}
    </>
  )
}
