import { ShoppingItem } from '../types'
import { ShoppingItemComponent } from './ShoppingItemComponent'
import { CATEGORIES } from '../utils/constants'
import { getItemsByCategory } from '../utils/helpers'
import { FadeIn, SlideUp } from './Animations'
import { CategoryHeader } from './InteractiveEmoji'
import { containerStyles } from '../utils/classNames'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'

interface CategorySectionProps {
  title: string
  items: ShoppingItem[]
  variant?: 'pending' | 'inCart' | 'purchased'
  headerColor?: string
  showItemCount?: boolean
  emptyMessage?: string
}

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center text-gray-500 py-8">
    <p className="text-lg">{message}</p>
  </div>
)

const SectionHeader: React.FC<{ title: string; itemCount: number; showItemCount: boolean }> = ({ 
  title, 
  itemCount, 
  showItemCount 
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      {showItemCount && (
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          {itemCount}
        </span>
      )}
    </div>
    <h3 className="font-bold text-xl text-gray-800 text-right">{title}</h3>
  </div>
)

const CategoryItems: React.FC<{
  categoryItems: ShoppingItem[]
  variant: 'pending' | 'inCart' | 'purchased'
  categoryIndex: number
}> = ({ categoryItems, variant, categoryIndex }) => {
  // ZERO PROPS DRILLING - Get actions from context!
  const { toggleItemInCart: _toggleItemInCart, removeItem: _removeItem } = useGlobalShopping()
  
  return (
    <div className="space-y-2 mr-6">
      {categoryItems.map((item, itemIndex) => (
        <FadeIn key={item.id} delay={(categoryIndex * 100) + (itemIndex * 50)}>
          <ShoppingItemComponent
            item={item}
            variant={variant}
          />
        </FadeIn>
      ))}
    </div>
  )
}

export const CategorySection = ({
  title,
  items,
  variant = 'pending',
  headerColor = 'bg-gray-100 text-gray-700',
  showItemCount = true,
  emptyMessage
}: CategorySectionProps) => {
  const itemsByCategory = getItemsByCategory(items, CATEGORIES)

  if (items.length === 0) {
    return emptyMessage ? <EmptyState message={emptyMessage} /> : null
  }

  return (
    <div className={containerStyles.section}>
      <SectionHeader 
        title={title}
        itemCount={items.length}
        showItemCount={showItemCount}
      />

      <FadeIn>
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => 
            categoryItems.length > 0 && (
              <SlideUp key={category} delay={categoryIndex * 100}>
                <div className="space-y-3">
                  <CategoryHeader 
                    category={category}
                    count={categoryItems.length}
                    headerColor={headerColor}
                  />
                  
                  <CategoryItems
                    categoryItems={categoryItems}
                    variant={variant}
                    categoryIndex={categoryIndex}
                  />
                </div>
              </SlideUp>
            )
          )}
        </div>
      </FadeIn>
    </div>
  )
}
