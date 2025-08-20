import {
  AddItemSection,
  ModalsContainer,
  GuestWelcomeMessage,
} from "./components";
import { ExpiryNotification } from "../../notifications/ExpiryNotification";
import { QuickStatsCards } from "../../statistics/QuickStatsCards";
import { QuickListCreator } from "../../shopping/actions/QuickListCreator";
import { QuickAddButtons } from "../../shopping/actions/QuickAddButtons";
import { ShoppingListSections } from "../../shopping/cart/ShoppingListSections";
import { ShoppingCartSection } from "../../shopping/cart/ShoppingCartSection";
import { MAIN_VIEW_STYLES } from "../../../constants";
import { DataExport } from "../../statistics/DataExport";
import { SmartSuggestions } from "../../shopping/suggestions/SmartSuggestions";

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
      <GuestWelcomeMessage />

      {/* Quick Stats */}
      <QuickStatsCards />

      {/* Quick List Creator */}
      <QuickListCreator />

      {/* Add Item Form */}
      <AddItemSection />

      {/* Smart Suggestions */}
      <SmartSuggestions />

      {/* Quick Add Buttons */}
      <QuickAddButtons />

      {/* Shopping Cart Section */}
      <ShoppingCartSection />

      {/* Expiry Notifications */}
      <ExpiryNotification />

      {/* Shopping List Sections */}
      <ShoppingListSections />

      {/* Data Export (conditional) */}
      <DataExport />
      {/* Modals */}
      <ModalsContainer />
    </div>
  );
}
