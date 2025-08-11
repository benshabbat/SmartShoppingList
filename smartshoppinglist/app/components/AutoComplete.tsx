import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Clock, TrendingUp } from 'lucide-react'
import { ShoppingItem } from '../types'
import { searchWithPopularity } from '../utils/smartSuggestions'

interface AutoCompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  suggestions: string[]
  purchaseHistory?: ShoppingItem[]
  placeholder?: string
  className?: string
  autoChangedCategory?: boolean // אפקט הדגשה כאשר הקטגוריה משתנה אוטומטית
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // חישוב תדירות מוצרים
  const getProductFrequency = (productName: string): number => {
    return purchaseHistory.filter(item => 
      item.name.toLowerCase() === productName.toLowerCase()
    ).length
  }

  useEffect(() => {
    if (value || isOpen) {
      const filtered = searchWithPopularity(value, suggestions, purchaseHistory)
      setFilteredSuggestions(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setIsOpen(false)
    }
    setHighlightedIndex(-1)
  }, [value, suggestions, purchaseHistory, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex])
        } else if (value.trim()) {
          onSelect(value.trim())
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // עיכוב קצר כדי לאפשר קליק על הצעה
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }, 150)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (value.trim() || suggestions.length > 0) {
              const filtered = searchWithPopularity(value, suggestions, purchaseHistory)
              setFilteredSuggestions(filtered)
              setIsOpen(filtered.length > 0)
            }
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right transition-all duration-300 ${
            autoChangedCategory 
              ? 'bg-green-50 border-green-400 ring-2 ring-green-200' 
              : ''
          } ${className}`}
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
          {filteredSuggestions.map((suggestion, index) => {
            const frequency = getProductFrequency(suggestion)
            const isPopular = frequency >= 2
            const isRecent = purchaseHistory
              .filter(item => item.name.toLowerCase() === suggestion.toLowerCase())
              .some(item => {
                if (!item.purchasedAt) return false
                const daysSince = Math.floor((Date.now() - new Date(item.purchasedAt).getTime()) / (1000 * 60 * 60 * 24))
                return daysSince <= 7
              })
            
            return (
              <button
                key={index}
                onClick={() => handleSelect(suggestion)}
                className={`w-full px-4 py-3 text-right hover:bg-indigo-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  index === highlightedIndex ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {isRecent && (
                      <div className="flex items-center gap-1 text-green-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">לאחרונה</span>
                      </div>
                    )}
                    {isPopular && (
                      <div className="flex items-center gap-1 text-blue-500">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs">{frequency}</span>
                      </div>
                    )}
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="font-medium">
                    {suggestion}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
