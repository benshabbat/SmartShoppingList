'use client'

import { useMemo, useState } from 'react'
import { groupItemsByCategory } from '../../utils/helpers'
import type { ShoppingItem } from '../../types'

export const useCategorySectionLogic = (
  items: ShoppingItem[],
  title: string,
  variant: 'pending' | 'inCart' | 'purchased' = 'pending',
  headerColor: string = 'bg-gray-100 text-gray-700',
  showItemCount: boolean = true,
  emptyMessage?: string
) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Group items by category with memoization for performance
  const itemsByCategory = useMemo(() => {
    return groupItemsByCategory(items)
  }, [items])

  // Check if we should show empty state
  const shouldShowEmptyState = items.length === 0 && emptyMessage
  const shouldShowContent = items.length > 0

  // Get category entries for rendering
  const categoryEntries = useMemo(() => {
    return Object.entries(itemsByCategory).filter(([_, categoryItems]) => categoryItems.length > 0)
  }, [itemsByCategory])

  const isItemExpanded = (itemId: string) => expandedItems.has(itemId)
  
  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  return {
    // Data
    itemsByCategory,
    categoryEntries,
    itemCount: items.length,
    
    // Props for sub-components
    sectionHeaderProps: {
      title,
      itemCount: items.length,
      showItemCount
    },
    
    // State flags
    shouldShowEmptyState,
    shouldShowContent,
    
    // Computed values
    hasCategories: categoryEntries.length > 0,
    
    // Props to pass down
    variant,
    headerColor,
    emptyMessage,
    
    // Item expansion functions
    isItemExpanded,
    toggleItemExpansion
  }
}
