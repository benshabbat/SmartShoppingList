/**
 * AutoComplete Logic Hook - Moving Logic to Context Layer
 * All AutoComplete business logic centralized here
 */

'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { searchWithPopularity } from '../../../utils/data/suggestions/smartSuggestions'
import { useKeyboardNavigation } from '../../ui/useKeyboardNavigation'
import { useShoppingData, useFormOperations, useGlobalShopping } from '../../../contexts'

export const useAutoCompleteLogic = () => {
  // Context data
  const { purchaseHistory } = useShoppingData()
  const { itemName, category, selectItem } = useFormOperations()
  const { autoChangedCategory, smartSuggestions } = useGlobalShopping()

  // Local state
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Memoized filtered suggestions to prevent infinite loops
  const filteredSuggestions = useMemo(() => {
    // Show all suggestions when no text is entered
    if (!itemName.value.trim()) {
      return smartSuggestions.slice(0, 8) // Show first 8 suggestions
    }
    // Filter suggestions based on input
    return searchWithPopularity(itemName.value, smartSuggestions, purchaseHistory)
  }, [itemName.value, smartSuggestions, purchaseHistory])

  // Define callbacks with useCallback to prevent re-renders
  const handleSelect = useCallback((suggestion: string) => {
    selectItem(suggestion)
    setIsOpen(false)
  }, [selectItem])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    inputRef.current?.blur()
  }, [])

  const handleSelectByIndex = useCallback((index: number) => {
    if (filteredSuggestions[index]) {
      handleSelect(filteredSuggestions[index])
    }
  }, [filteredSuggestions, handleSelect])

  // Keyboard navigation
  const { selectedIndex } = useKeyboardNavigation({
    itemCount: filteredSuggestions.length,
    isOpen,
    onSelect: handleSelectByIndex,
    onClose: handleClose
  })

  // Effects
  useEffect(() => {
    // Don't automatically close when empty - let user see suggestions
    // Only close if there are no suggestions at all
    if (filteredSuggestions.length === 0) {
      setIsOpen(false)
    }
  }, [filteredSuggestions.length])

  // Event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    itemName.onChange(newValue)
    
    // Open dropdown when user starts typing or if there are suggestions
    if (filteredSuggestions.length > 0) {
      setIsOpen(true)
    }
  }, [itemName, filteredSuggestions.length])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // עיכוב קצר כדי לאפשר קליק על הצעה
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false)
      }
    }, 150)
  }, [])

  const handleFocus = useCallback(() => {
    if (filteredSuggestions.length > 0) {
      setIsOpen(true)
    }
  }, [filteredSuggestions.length])

  // Computed values
  const placeholder = `הוסף ${category}...`
  const inputClassName = 'pr-12 text-right flex-1'

  return {
    // State
    isOpen,
    filteredSuggestions,
    selectedIndex,
    autoChangedCategory,
    
    // Input data
    value: itemName.value,
    placeholder,
    inputClassName,
    
    // Refs
    inputRef,
    dropdownRef,
    
    // Event handlers
    handleInputChange,
    handleBlur,
    handleFocus,
    handleSelect,
    
    // Computed
    hasFilteredSuggestions: filteredSuggestions.length > 0
  }
}
