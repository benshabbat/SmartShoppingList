'use client'

import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { Card } from '../ui/Card'
import { gradientStyles } from '../../utils/ui/classNames'

export function QuickStatsCards() {
  // Get data from global context - NO PROPS!
  const { pendingItems, cartItems, purchasedItems } = useGlobalShopping()

  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className={`${gradientStyles.primary} rounded-xl p-2 sm:p-4 text-center shadow-md text-white`}>
          <div className="text-lg sm:text-2xl font-bold">{pendingItems.length}</div>
          <div className="text-xs sm:text-sm opacity-90">לקנות</div>
        </div>
        <div className={`${gradientStyles.warning} rounded-xl p-2 sm:p-4 text-center shadow-md text-white`}>
          <div className="text-lg sm:text-2xl font-bold">{cartItems.length}</div>
          <div className="text-xs sm:text-sm opacity-90">בסל</div>
        </div>
        <div className={`${gradientStyles.success} rounded-xl p-2 sm:p-4 text-center shadow-md text-white`}>
          <div className="text-lg sm:text-2xl font-bold">{purchasedItems.length}</div>
          <div className="text-xs sm:text-sm opacity-90">נקנו</div>
        </div>
      </div>
    </Card>
  )
}
