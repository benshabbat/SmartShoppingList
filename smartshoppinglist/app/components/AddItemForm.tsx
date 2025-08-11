import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CATEGORIES, CATEGORY_EMOJIS } from '../utils/constants'
import { Category } from '../types'

interface AddItemFormProps {
  onAddItem: (name: string, category: string) => void
}

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState<Category>('פירות וירקות')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName.trim()) {
      onAddItem(newItemName, newItemCategory)
      setNewItemName('')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              קטגוריה
            </label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as Category)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {CATEGORY_EMOJIS[category]} {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="הוסף מוצר לרשימה..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right shadow-sm transition-all"
            dir="rtl"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
