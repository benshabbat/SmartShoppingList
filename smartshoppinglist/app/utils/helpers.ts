import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'

export const getExpiryColor = (daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return 'text-red-600 bg-red-50'
  if (daysUntilExpiry <= 1) return 'text-orange-600 bg-orange-50'
  return 'text-yellow-600 bg-yellow-50'
}

export const generateSuggestions = (
  history: ShoppingItem[], 
  currentItems: ShoppingItem[]
): ItemSuggestion[] => {
  const itemFrequency: Record<string, { count: number; lastBought: Date }> = {}
  
  history.forEach(item => {
    const itemName = item.name.toLowerCase()
    if (itemFrequency[itemName]) {
      itemFrequency[itemName].count++
      if (new Date(item.purchasedAt!) > itemFrequency[itemName].lastBought) {
        itemFrequency[itemName].lastBought = new Date(item.purchasedAt!)
      }
    } else {
      itemFrequency[itemName] = {
        count: 1,
        lastBought: new Date(item.purchasedAt!)
      }
    }
  })

  const now = new Date()
  return Object.entries(itemFrequency)
    .map(([name, data]) => {
      const daysSince = Math.floor((now.getTime() - data.lastBought.getTime()) / (1000 * 60 * 60 * 24))
      return {
        name,
        frequency: data.count,
        lastBought: data.lastBought,
        daysSinceLastBought: daysSince
      }
    })
    .filter(suggestion => {
      const isInCurrentList = currentItems.some(item => 
        item.name.toLowerCase() === suggestion.name && !item.isPurchased
      )
      return suggestion.frequency > 1 && !isInCurrentList && suggestion.daysSinceLastBought > 3
    })
    .sort((a, b) => {
      const scoreA = a.frequency * 10 - a.daysSinceLastBought * 0.1
      const scoreB = b.frequency * 10 - b.daysSinceLastBought * 0.1
      return scoreB - scoreA
    })
    .slice(0, 5)
}

export const checkExpiringItems = (pantry: ShoppingItem[]): ExpiringItem[] => {
  const now = new Date()
  const expiring: ExpiringItem[] = []

  pantry.forEach(item => {
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiry <= 3) {
        expiring.push({
          id: item.id,
          name: item.name,
          expiryDate,
          daysUntilExpiry
        })
      }
    }
  })

  return expiring
}

export const getItemsByCategory = (items: ShoppingItem[], categories: string[]) => {
  const itemsByCategory: Record<string, ShoppingItem[]> = {}
  
  categories.forEach(category => {
    itemsByCategory[category] = items.filter(item => item.category === category)
  })
  
  return itemsByCategory
}
