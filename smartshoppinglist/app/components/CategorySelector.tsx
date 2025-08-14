import { Category } from '../types'
import { CATEGORY_EMOJIS, CATEGORIES } from '../constants'
import { useCategorySelectorLogic } from '../hooks'

/**
 * CategorySelector - PURE UI COMPONENT!
 * All logic moved to useCategorySelectorLogic hook in context layer
 */
export const CategorySelector = () => {
  // Get ALL logic from the hook - ZERO business logic in component!
  const {
    category,
    handleChange,
    selectClassName
  } = useCategorySelectorLogic()

  const baseClasses = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-300'

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
        קטגוריה
      </label>
      <select
        value={category}
        onChange={handleChange}
        className={selectClassName}
      >
        {CATEGORIES.map(category => (
          <option key={category} value={category}>
            {CATEGORY_EMOJIS[category as Category] || ''} {category}
          </option>
        ))}
      </select>
    </div>
  )
}
