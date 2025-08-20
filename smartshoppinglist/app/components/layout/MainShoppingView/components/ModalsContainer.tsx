import { ReceiptScanner } from '../../../ui/ReceiptScanner'
import { ExpiryDateModal } from '../../../shopping/ExpiryDateModal'
import { DataImportModal } from '../../../statistics/DataImportModal'
import { useGlobalShopping } from '../../../../contexts/GlobalShoppingContext'

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
