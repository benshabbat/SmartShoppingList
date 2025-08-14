
import { 
  GuestSection,
  AddItemSection,
  SuggestionsSection,
  ConditionalDataExportSection,
  ModalsContainer
} from './components'
import { ExpiryNotification } from '../ExpiryNotification'
import { QuickStatsCards } from '../QuickStatsCards'
import { QuickListCreator } from '../QuickListCreator'
import { QuickAddButtons } from '../QuickAddButtons'
import { ShoppingListSections } from '../ShoppingListSections'
import { ShoppingCartSection } from '../ShoppingCartSection'
import { MAIN_VIEW_STYLES } from './constants'

/**
 * Main Shopping View Component
 * Improved with Clean Code principles:
 * - Single Responsibility: Orchestrate the main shopping interface
 * - No Props Drilling: Uses context for state management
 * - Modular Structure: Broken into focused sub-components
 */
export function MainShoppingView() {
  return (
    <div className={MAIN_VIEW_STYLES.CONTAINER}>
      {/* Guest-specific UI - ZERO PROPS DRILLING */}
      <GuestSection />

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

      {/* Shopping Cart Section */}
      <ShoppingCartSection />

      {/* Expiry Notifications */}
      <ExpiryNotification />

      {/* Shopping List Sections */}
      <ShoppingListSections />

      {/* Data Export (conditional) */}
      <ConditionalDataExportSection />

      {/* Modals */}
      <ModalsContainer />
    </div>
  )
}
