/**
 * CategorySelector Logic Hook - Moving Logic to Context Layer
 * All CategorySelector business logic centralized here
 */

'use client'

import { useCallback } from 'react'
import { useFormOperations, useGlobalShopping } from '../contexts'
import { Category } from '../types'

export const useCategorySelectorLogic = () => {
  // Context data
  const { category, setCategory } = useFormOperations()
  const { autoChangedCategory } = useGlobalShopping()

  // Event handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
  }, [setCategory])

  // Computed values
  const baseClasses = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-300'
  const highlightClasses = autoChangedCategory ? 'ring-2 ring-green-400 border-green-300 bg-green-50' : ''
  const selectClassName = `${baseClasses} ${highlightClasses}`

  return {
    // State
    category,
    autoChangedCategory,
    
    // Event handlers
    handleChange,
    
    // Computed
    selectClassName
  }
}
