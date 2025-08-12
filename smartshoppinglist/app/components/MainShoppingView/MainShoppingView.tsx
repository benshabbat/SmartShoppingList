'use client'

import React from 'react'
import { useMainShoppingViewLogic } from './useMainShoppingViewLogic'
import { 
  GuestSection,
  AddItemSection,
  SuggestionsSection,
  ExpiryNotificationSection,
  ConditionalDataExportSection,
  ModalsContainer
} from './components'
import { QuickStatsCards } from '../QuickStatsCards'
import { QuickListCreator } from '../QuickListCreator'
import { QuickAddButtons } from '../QuickAddButtons'
import { ShoppingListSections } from '../ShoppingListSections'
import { MAIN_VIEW_STYLES } from './constants'

/**
 * Main Shopping View Component
 * Improved with Clean Code principles:
 * - Single Responsibility: Orchestrate the main shopping interface
 * - No Props Drilling: Uses context for state management
 * - Modular Structure: Broken into focused sub-components
 */
export function MainShoppingView() {
  const { isGuest } = useMainShoppingViewLogic()

  return (
    <div className={MAIN_VIEW_STYLES.CONTAINER}>
      {/* Guest-specific UI */}
      <GuestSection isGuest={isGuest} />

      {/* Quick Stats */}
      <QuickStatsCards />

      {/* Quick List Creator */}
      <QuickListCreator />

      {/* Add Item Form */}
      <AddItemSection />

      {/* Smart Suggestions */}
      <SuggestionsSection />

      {/* Quick Add Buttons */}
      <QuickAddButtons />

      {/* Expiry Notifications */}
      <ExpiryNotificationSection />

      {/* Shopping List Sections */}
      <ShoppingListSections />

      {/* Data Export (conditional) */}
      <ConditionalDataExportSection />

      {/* Modals */}
      <ModalsContainer />
    </div>
  )
}
