import { ShoppingItem } from '../types'
import { ShoppingItemComponent } from './ShoppingItemComponent'
import { CATEGORIES, CATEGORY_EMOJIS } from '../utils/constants'
import { getItemsByCategory } from '../utils/helpers'
import { FadeIn, SlideUp } from './Animations'

interface CategorySectionProps {
  title: string
  items: ShoppingItem[]
  onToggleCart: (id: string) => void
  onRemove: (id: string) => void
  variant?: 'pending' | 'inCart' | 'purchased'
  headerColor?: string
  showItemCount?: boolean
  emptyMessage?: string
}

export const CategorySection = ({
  title,
  items,
  onToggleCart,
  onRemove,
  variant = 'pending',
  headerColor = 'bg-gray-100 text-gray-700',
  showItemCount = true,
  emptyMessage
}: CategorySectionProps) => {
  const itemsByCategory = getItemsByCategory(items, CATEGORIES)

  if (items.length === 0) {
    return emptyMessage ? (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    ) : null
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {showItemCount && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {items.length}
            </span>
          )}
        </div>
        <h3 className="font-bold text-xl text-gray-800 text-right">{title}</h3>
      </div>

      <FadeIn>
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => 
            categoryItems.length > 0 && (
              <SlideUp key={category} delay={categoryIndex * 100}>
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${headerColor} hover:shadow-md transition-shadow duration-200`}>
                    <span className="text-2xl animate-bounce-gentle">{CATEGORY_EMOJIS[category as keyof typeof CATEGORY_EMOJIS]}</span>
                    <h4 className="font-semibold text-right flex-1 text-lg">{category}</h4>
                    <span className="text-sm bg-white bg-opacity-70 px-3 py-1 rounded-full font-medium shadow-sm">
                      {categoryItems.length}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mr-6">
                    {categoryItems.map((item, itemIndex) => (
                      <FadeIn key={item.id} delay={(categoryIndex * 100) + (itemIndex * 50)}>
                        <ShoppingItemComponent
                          item={item}
                          onToggleCart={onToggleCart}
                          onRemove={onRemove}
                          variant={variant}
                        />
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </SlideUp>
            )
          )}
        </div>
      </FadeIn>
    </div>
  )
}
