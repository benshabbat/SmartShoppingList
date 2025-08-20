/**
 * Specialized Category Sections - Zero Props Drilling
 * Each component gets its data from context instead of props
 */

'use client'

import { useShoppingComputed } from '../../../contexts'
import { CategorySection } from './CategorySection'

/**
 * Pending Items Section - Gets data from context
 */
export const PendingItemsSection = () => {
  const { pendingItems } = useShoppingComputed()
  
  if (pendingItems.length === 0) return null
  
  return (
    <CategorySection
      title="רשימת קניות"
      items={pendingItems}
    />
  )
}

/**
 * Cart Items Section - Gets data from context
 */
export const CartItemsSection = () => {
  const { cartItems } = useShoppingComputed()
  
  if (cartItems.length === 0) return null
  
  return (
    <CategorySection
      title=""
      items={cartItems}
      variant="inCart"
    />
  )
}

/**
 * Purchased Items Section - Gets data from context
 */
export const PurchasedItemsSection = () => {
  const { purchasedItems } = useShoppingComputed()
  
  if (purchasedItems.length === 0) return null
  
  return (
    <CategorySection
      title="רכישות שהושלמו"
      items={purchasedItems}
      variant="purchased"
      headerColor="bg-green-100 text-green-700"
    />
  )
}
