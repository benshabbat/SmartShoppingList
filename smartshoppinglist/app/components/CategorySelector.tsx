import { Category } from '../types'
import { CATEGORY_EMOJIS } from '../constants'

export interface CategorySelectorProps {
  value: Category
  onChange: (category: Category) => void
  categories: Category[]
  className?: string
  isHighlighted?: boolean
  disabled?: boolean
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  categories,
  className = '',
  isHighlighted = false,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as Category)
  }

  const baseClasses = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-300'
  const highlightClasses = isHighlighted ? 'ring-2 ring-green-400 border-green-300 bg-green-50' : ''
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
        קטגוריה
      </label>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`${baseClasses} ${highlightClasses} ${disabledClasses} ${className}`}
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {CATEGORY_EMOJIS[category]} {category}
          </option>
        ))}
      </select>
    </div>
  )
}
