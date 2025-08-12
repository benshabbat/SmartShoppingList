import React from 'react'
import { SmartSuggestions } from '../../SmartSuggestions'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'

/**
 * Suggestions Section Component
 * Single Responsibility: Conditionally render SmartSuggestions
 */
export function SuggestionsSection() {
  const { suggestions } = useGlobalShopping()

  if (suggestions.length === 0) {
    return null
  }

  return <SmartSuggestions />
}
