import { useState, useEffect } from 'react'
import { ConstantsService } from '@/lib/services/constantsService'

export function useConstants() {
  const [messages, setMessages] = useState<Record<string, Record<string, string>>>({})
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [popularItems, setPopularItems] = useState<unknown[]>([])
  const [seasonalItems, setSeasonalItems] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConstants = async () => {
      try {
        setLoading(true)
        
        const [messagesData, settingsData, popularData, seasonalData] = await Promise.all([
          ConstantsService.getAppMessages(),
          ConstantsService.getAppSettings(),
          ConstantsService.getPopularItems(20),
          ConstantsService.getCurrentSeasonItems()
        ])
        
        setMessages(messagesData)
        setSettings(settingsData)
        setPopularItems(popularData)
        setSeasonalItems(seasonalData)
        
      } catch (err) {
        console.error('Error loading constants:', err)
        setError(err instanceof Error ? err.message : 'Failed to load constants')
        
        // Fallback to default values
        setMessages({
          items: {
            item_added: 'פריט נוסף בהצלחה',
            item_removed: 'פריט הוסר מהרשימה'
          },
          cart: {
            item_moved_to_cart: 'פריט הועבר לעגלה',
            cart_cleared: 'העגלה נוקתה'
          }
        })
        
        setSettings({
          expiry_warning_days: 3,
          max_suggestions: 5,
          animation_duration: 300
        })
        
      } finally {
        setLoading(false)
      }
    }

    loadConstants()
  }, [])

  // Helper functions
  const getMessage = (category: string, key: string, fallback?: string) => {
    return messages[category]?.[key] || fallback || key
  }

  const getSetting = (key: string, fallback?: unknown) => {
    return settings[key] !== undefined ? settings[key] : fallback
  }

  return {
    messages,
    settings,
    popularItems,
    seasonalItems,
    loading,
    error,
    getMessage,
    getSetting
  }
}
