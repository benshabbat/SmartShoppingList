import { useState, useEffect } from 'react'
import { ConstantsService } from '@/lib/services/constantsService'

interface ConstantsData {
  messages: Record<string, Record<string, string>>
  settings: Record<string, unknown>
  popularItems: unknown[]
  seasonalItems: unknown[]
}

const DEFAULT_CONSTANTS: ConstantsData = {
  messages: {
    items: {
      item_added: 'פריט נוסף בהצלחה',
      item_removed: 'פריט הוסר מהרשימה'
    },
    cart: {
      item_moved_to_cart: 'פריט הועבר לעגלה',
      cart_cleared: 'העגלה נוקתה'
    }
  },
  settings: {
    expiry_warning_days: 3,
    max_suggestions: 5,
    animation_duration: 300
  },
  popularItems: [],
  seasonalItems: []
}

/**
 * Hook for managing application constants and settings
 * Loads data from ConstantsService with fallback to defaults
 */
export function useConstants() {
  const [constants, setConstants] = useState<ConstantsData>(DEFAULT_CONSTANTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConstants = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [messagesData, settingsData, popularData, seasonalData] = await Promise.all([
          ConstantsService.getAppMessages(),
          ConstantsService.getAppSettings(),
          ConstantsService.getPopularItems(20),
          ConstantsService.getCurrentSeasonItems()
        ])
        
        setConstants({
          messages: messagesData,
          settings: settingsData,
          popularItems: popularData,
          seasonalItems: seasonalData
        })
        
      } catch (err) {
        console.error('Error loading constants:', err)
        setError(err instanceof Error ? err.message : 'Failed to load constants')
        setConstants(DEFAULT_CONSTANTS) // Fallback to defaults
        
      } finally {
        setLoading(false)
      }
    }

    loadConstants()
  }, [])

  // Helper functions
  const getMessage = (category: string, key: string, fallback?: string) => {
    return constants.messages[category]?.[key] || fallback || key
  }

  const getSetting = (key: string, fallback?: unknown) => {
    return constants.settings[key] !== undefined ? constants.settings[key] : fallback
  }

  return {
    ...constants,
    loading,
    error,
    getMessage,
    getSetting
  }
}
