import { ChevronDown, Search } from 'lucide-react'
import { getInputClasses } from '../../utils/ui/classNames'
import { SuggestionItem } from '../shopping/SuggestionItem'
import { useAutoCompleteLogic } from '../../hooks'

/**
 * AutoComplete Component - PURE UI COMPONENT!
 * All logic moved to useAutoCompleteLogic hook in context layer
 * This component is now just a presentation layer with ZERO business logic
 */
export const AutoComplete = () => {
  // Get ALL logic from the hook - ZERO business logic in component!
  const {
    // State
    isOpen,
    filteredSuggestions,
    selectedIndex,
    autoChangedCategory,
    
    // Input data
    value,
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
    hasFilteredSuggestions
  } = useAutoCompleteLogic()

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
            inputClassName
          )}
          dir="rtl"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          {hasFilteredSuggestions && (
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </div>

      {isOpen && hasFilteredSuggestions && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion: string, index: number) => (
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