'use client'

import { ShoppingItem } from '../types'
import { ReceiptScanner } from './ReceiptScanner'
import { ExpiryDateModal } from './ExpiryDateModal'
import { DataImportModal } from './DataImportModal'

interface ModalsContainerProps {
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  checkoutItems: ShoppingItem[]
  hasGuestData: boolean
  onReceiptProcessed: (receiptItems: ShoppingItem[], storeName: string) => void
  onCloseReceiptScanner: () => void
  onExpiryModalSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  onExpiryModalClose: () => void
  onCloseDataImportModal: () => void
  onImportGuestData: () => Promise<void>
}

export function ModalsContainer({
  showReceiptScanner,
  showExpiryModal,
  showDataImportModal,
  checkoutItems,
  hasGuestData,
  onReceiptProcessed,
  onCloseReceiptScanner,
  onExpiryModalSubmit,
  onExpiryModalClose,
  onCloseDataImportModal,
  onImportGuestData
}: ModalsContainerProps) {
  return (
    <>
      {/* Receipt Scanner Modal */}
      {showReceiptScanner && (
        <ReceiptScanner
          onReceiptProcessed={onReceiptProcessed}
          onClose={onCloseReceiptScanner}
        />
      )}

      {/* Expiry Date Modal */}
      {showExpiryModal && (
        <ExpiryDateModal
          items={checkoutItems}
          isOpen={showExpiryModal}
          onClose={onExpiryModalClose}
          onSubmit={onExpiryModalSubmit}
        />
      )}

      {/* Data Import Modal */}
      {showDataImportModal && (
        <DataImportModal
          isOpen={showDataImportModal}
          onClose={onCloseDataImportModal}
          onImportGuestData={onImportGuestData}
          hasGuestData={hasGuestData}
        />
      )}
    </>
  )
}
