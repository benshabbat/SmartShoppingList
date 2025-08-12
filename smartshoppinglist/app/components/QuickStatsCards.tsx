'use client'

import { ShoppingItem } from '../types'
import { Card } from './Card'

interface QuickStatsCardsProps {
  pending: ShoppingItem[]
  inCart: ShoppingItem[]
  purchased: ShoppingItem[]
}

export function QuickStatsCards({ pending, inCart, purchased }: QuickStatsCardsProps) {
  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 sm:p-4 text-center shadow-md text-white">
          <div className="text-lg sm:text-2xl font-bold">{pending.length}</div>
          <div className="text-xs sm:text-sm opacity-90">לקנות</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2 sm:p-4 text-center shadow-md text-white">
          <div className="text-lg sm:text-2xl font-bold">{inCart.length}</div>
          <div className="text-xs sm:text-sm opacity-90">בסל</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2 sm:p-4 text-center shadow-md text-white">
          <div className="text-lg sm:text-2xl font-bold">{purchased.length}</div>
          <div className="text-xs sm:text-sm opacity-90">נקנו</div>
        </div>
      </div>
    </Card>
  )
}
