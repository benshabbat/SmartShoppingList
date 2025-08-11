import { useState, useRef, useEffect } from 'react'
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
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { selectedIndex } = useKeyboardNavigation({
    itemCount: filteredSuggestions.length,
    isOpen,
    onSelect: (index) => handleSelect(filteredSuggestions[index]),
    onClose: () => {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  })

  useEffect(() => {
    if (value || isOpen) {
      const filtered = searchWithPopularity(value, suggestions, purchaseHistory)
      setFilteredSuggestions(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setIsOpen(false)
    }
  }, [value, suggestions, purchaseHistory, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion)
    setIsOpen(false)
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
    if (value.trim() || suggestions.length > 0) {
      const filtered = searchWithPopularity(value, suggestions, purchaseHistory)
      setFilteredSuggestions(filtered)
      setIsOpen(filtered.length > 0)
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
              purchaseHistory={purchaseHistory}
              onClick={() => handleSelect(suggestion)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
