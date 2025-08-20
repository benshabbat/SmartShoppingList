/**
 * SmartSuggestions Logic Hook - Moving Logic to Context Layer
 * All SmartSuggestions business logic centralized here
 */

'use client'

import { useCallback } from 'react'
import { useShoppingData, useItemActions, useNotifications } from '../../contexts'
import { createAsyncHandler, MESSAGES } from '../../utils'

export const useSmartSuggestionsLogic = () => {
  // Context data
  const { suggestions } = useShoppingData()
  const { addItem } = useItemActions()
  const { success, error } = useNotifications()

  // Async handler for consistent error handling
  const asyncHandler = createAsyncHandler('SmartSuggestions', error)

  // Event handlers
  const handleAddSuggestion = useCallback(async (name: string) => {
    await asyncHandler(async () => {
      await addItem(name, 'כלל') // Default category
      success(MESSAGES.SUCCESS.ITEM_ADDED(name))
    }, MESSAGES.ERROR.ADD_ITEM_FAILED())
  }, [asyncHandler, addItem, success])

  return {
    // State
    suggestions,
    
    // Event handlers
    handleAddSuggestion,
    
    // Computed
    hasSuggestions: suggestions.length > 0
  }
}
