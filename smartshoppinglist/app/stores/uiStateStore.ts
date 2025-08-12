/**
 * UI State Store - Context Layer
 * Handles only UI state and display logic
 * No database operations
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ShoppingItem } from '../types'

interface UIState {
  // Modal State
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  checkoutItems: ShoppingItem[]
  
  // Guest State
  hasShownGuestExplanation: boolean
  
  // Loading States (for UI feedback)
  isAddingItem: boolean
  isUpdatingItem: boolean
  isDeletingItem: boolean
  
  // Modal Actions
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  
  // Guest Actions
  shouldShowGuestExplanation: () => boolean
  dismissGuestExplanation: () => void
  
  // Loading Actions
  setAddingItem: (loading: boolean) => void
  setUpdatingItem: (loading: boolean) => void
  setDeletingItem: (loading: boolean) => void
  
  // Checkout Actions
  setCheckoutItems: (items: ShoppingItem[]) => void
  clearCheckoutItems: () => void
  
  // Reset
  resetUIState: () => void
}

const GUEST_EXPLANATION_KEY = 'hasShownGuestExplanation'

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial State
      showReceiptScanner: false,
      showExpiryModal: false,
      showDataImportModal: false,
      showTutorial: false,
      checkoutItems: [],
      hasShownGuestExplanation: false,
      isAddingItem: false,
      isUpdatingItem: false,
      isDeletingItem: false,
      
      // Modal Actions
      openReceiptScanner: () => set({ showReceiptScanner: true }),
      closeReceiptScanner: () => set({ showReceiptScanner: false }),
      
      openExpiryModal: (items) => set({ 
        showExpiryModal: true, 
        checkoutItems: items 
      }),
      closeExpiryModal: () => set({ 
        showExpiryModal: false, 
        checkoutItems: [] 
      }),
      
      openDataImportModal: () => set({ showDataImportModal: true }),
      closeDataImportModal: () => set({ showDataImportModal: false }),
      
      openTutorial: () => set({ showTutorial: true }),
      closeTutorial: () => set({ showTutorial: false }),
      
      // Guest Actions
      shouldShowGuestExplanation: () => {
        const { hasShownGuestExplanation } = get()
        const stored = localStorage.getItem(GUEST_EXPLANATION_KEY)
        return !hasShownGuestExplanation && !stored
      },
      
      dismissGuestExplanation: () => {
        set({ hasShownGuestExplanation: true })
        localStorage.setItem(GUEST_EXPLANATION_KEY, 'true')
      },
      
      // Loading Actions
      setAddingItem: (loading) => set({ isAddingItem: loading }),
      setUpdatingItem: (loading) => set({ isUpdatingItem: loading }),
      setDeletingItem: (loading) => set({ isDeletingItem: loading }),
      
      // Checkout Actions
      setCheckoutItems: (items) => set({ checkoutItems: items }),
      clearCheckoutItems: () => set({ checkoutItems: [] }),
      
      // Reset
      resetUIState: () => set({
        showReceiptScanner: false,
        showExpiryModal: false,
        showDataImportModal: false,
        showTutorial: false,
        checkoutItems: [],
        hasShownGuestExplanation: false,
        isAddingItem: false,
        isUpdatingItem: false,
        isDeletingItem: false,
      }),
    }),
    {
      name: 'ui-store',
    }
  )
)
