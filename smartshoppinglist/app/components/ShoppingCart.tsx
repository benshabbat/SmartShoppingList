import { ShoppingBag } from 'lucide-react'
import { ShoppingItem } from '../types'
import { CategorySection } from './CategorySection'

interface ShoppingCartProps {
  items: ShoppingItem[]
  onToggleCart: (id: string) => void
  onRemove: (id: string) => void
  onStartCheckout: () => void
}

export const ShoppingCart = ({ 
  items, 
  onToggleCart, 
  onRemove, 
  onStartCheckout 
}: ShoppingCartProps) => {
  if (items.length === 0) return null

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg z-10">
        {items.length}
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 mb-6 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onStartCheckout}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            סיימתי קניות ({items.length})
          </button>
          
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-xl text-gray-800 text-right">בסל הקניות</h3>
            <div className="text-3xl">🛒</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          <CategorySection
            title=""
            items={items}
            onToggleCart={onToggleCart}
            onRemove={onRemove}
            variant="inCart"
            headerColor="bg-blue-100 text-blue-700"
            showItemCount={false}
          />
        </div>
      </div>
    </div>
  )
}
