'use client'

import React from 'react'
import { CategorySectionProps } from '@/app/types'
import { ShoppingItem } from '@/app/types'
import { FadeIn, SlideUp } from '../ui/Animations'
import { ShoppingItemComponent } from './ShoppingItemComponent'
import { InteractiveEmoji } from '../ui/InteractiveEmoji'
import { useCategorySectionLogic } from '@/app/hooks/useCategorySectionLogic'
import { containerStyles } from '@/app/utils/ui/classNames'

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  variant = 'pending',
  headerColor = 'text-gray-700 dark:text-gray-300',
  showItemCount = true,
  emptyMessage
}) => {
  const {
    categoryEntries,
    sectionHeaderProps,
    shouldShowEmptyState,
    shouldShowContent,
    variant: componentVariant,
    headerColor: componentHeaderColor,
    isItemExpanded,
    toggleItemExpansion
  } = useCategorySectionLogic(items, title, variant, headerColor, showItemCount, emptyMessage)

  if (shouldShowEmptyState) {
    return <EmptyStateComponent message={emptyMessage!} />
  }

  if (!shouldShowContent) {
    return null
  }

  return (
    <div className={containerStyles.section}>
      <SectionHeaderComponent {...sectionHeaderProps} />

      <FadeIn>
        <div className="space-y-6">
          {categoryEntries.map(([category, categoryItems], categoryIndex) => (
            <SlideUp key={category} delay={categoryIndex * 100}>
              <div className="space-y-3">
                <CategoryHeaderComponent 
                  category={category}
                  count={categoryItems.length}
                  headerColor={componentHeaderColor}
                />
                
                <CategoryItemsComponent
                  categoryItems={categoryItems}
                  variant={componentVariant}
                  categoryIndex={categoryIndex}
                  isItemExpanded={isItemExpanded}
                  toggleItemExpansion={toggleItemExpansion}
                />
              </div>
            </SlideUp>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}

// Sub-components
const SectionHeaderComponent: React.FC<{
  title: string
  itemCount: number
  showItemCount: boolean
}> = ({ title, itemCount, showItemCount }) => (
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
    {title} {showItemCount && `(${itemCount})`}
  </h2>
)

const EmptyStateComponent: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
    {message}
  </div>
)

const CategoryHeaderComponent: React.FC<{
  category: string
  count: number
  headerColor: string
}> = ({ category, count, headerColor }) => (
  <h3 className={`text-lg font-medium ${headerColor} flex items-center gap-2`}>
    <InteractiveEmoji category={category} />
    {category} ({count})
  </h3>
)

const CategoryItemsComponent: React.FC<{
  categoryItems: ShoppingItem[]
  variant: 'pending' | 'inCart' | 'purchased'
  categoryIndex: number
  isItemExpanded: (itemId: string) => boolean
  toggleItemExpansion: (itemId: string) => void
}> = ({ categoryItems, variant, categoryIndex, isItemExpanded, toggleItemExpansion }) => (
  <div className="grid gap-3">
    {categoryItems.map((item, itemIndex) => {
      const uniqueKey = `${item.id}-${categoryIndex}-${itemIndex}`
      return (
        <SlideUp key={uniqueKey} delay={categoryIndex * 100 + itemIndex * 50}>
          <ShoppingItemComponent 
            item={item}
            variant={variant}
            isExpanded={isItemExpanded(item.id)}
            onToggleExpansion={() => toggleItemExpansion(item.id)}
          />
        </SlideUp>
      )
    })}
  </div>
)
