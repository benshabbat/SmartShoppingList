import { Category } from '../types'
import { CATEGORY_EMOJIS, CATEGORIES } from '../constants'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'

/**
 * CategorySelector - Pure component using global context
 */
export const CategorySelector = () => {
  const {
    newItemCategory,
    setNewItemCategory,
    autoChangedCategory
  } = useGlobalShopping()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewItemCategory(e.target.value)
  }

  const baseClasses = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-300'
  const highlightClasses = autoChangedCategory ? 'ring-2 ring-green-400 border-green-300 bg-green-50' : ''

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
        קטגוריה
      </label>
      <select
        value={newItemCategory}
        onChange={handleChange}
        className={`${baseClasses} ${highlightClasses}`}
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
