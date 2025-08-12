import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { ShoppingItem } from '../types'
import { searchWithPopularity } from '../utils/smartSuggestions'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { getInputClasses } from '../utils/classNames'
import { SuggestionItem } from './SuggestionItem'

interface AutoCompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  suggestions: string[]
  purchaseHistory?: ShoppingItem[]
  placeholder?: string
  className?: string
  autoChangedCategory?: boolean
}

export const AutoComplete = ({
  value,
  onChange,
  onSelect,
  suggestions,
  purchaseHistory = [],
  placeholder = "הוסף מוצר...",
  className = "",
  autoChangedCategory = false
}: AutoCompleteProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Memoize purchase history length to prevent unnecessary recalculations
  const purchaseHistoryLength = useMemo(() => purchaseHistory.length, [purchaseHistory.length])
  
  // Memoize filtered suggestions to prevent infinite loops
  const filteredSuggestions = useMemo(() => {
    // Show all suggestions when no text is entered
    if (!value.trim()) {
      return suggestions.slice(0, 8) // Show first 8 suggestions
    }
    // Filter suggestions based on input
    return searchWithPopularity(value, suggestions, purchaseHistory)
  }, [value, suggestions, purchaseHistory, purchaseHistoryLength])

  // Define callbacks with useCallback to prevent re-renders
  const handleSelect = useCallback((suggestion: string) => {
    onSelect(suggestion)
    setIsOpen(false)
  }, [onSelect])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    inputRef.current?.blur()
  }, [])

  const handleSelectByIndex = useCallback((index: number) => {
    if (filteredSuggestions[index]) {
      handleSelect(filteredSuggestions[index])
    }
  }, [filteredSuggestions, handleSelect])

  const { selectedIndex } = useKeyboardNavigation({
    itemCount: filteredSuggestions.length,
    isOpen,
    onSelect: handleSelectByIndex,
    onClose: handleClose
  })

  // Separate effect for managing isOpen state
  useEffect(() => {
    // Don't automatically close when empty - let user see suggestions
    // Only close if there are no suggestions at all
    if (filteredSuggestions.length === 0) {
      setIsOpen(false)
    }
  }, [filteredSuggestions.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Open dropdown when user starts typing or if there are suggestions
    if (filteredSuggestions.length > 0) {
      setIsOpen(true)
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // עיכוב קצר כדי לאפשר קליק על הצעה
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false)
      }
    }, 150)
  }

  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={getInputClasses(
            autoChangedCategory ? 'highlighted' : 'default',
            `pr-12 text-right ${className}`
          )}
          dir="rtl"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          {filteredSuggestions.length > 0 && (
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              suggestion={suggestion}
              isHighlighted={index === selectedIndex}
              onClick={() => handleSelect(suggestion)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
