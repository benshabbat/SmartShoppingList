import { supabase } from '@/lib/supabase'

export class ConstantsService {
  // Get all app messages
  static async getAppMessages() {
    const { data, error } = await supabase
      .from('app_messages')
      .select('*')
    
    if (error) throw error
    
    // Convert to key-value object for easy access
    return data.reduce((acc, message) => {
      if (!acc[message.category]) acc[message.category] = {}
      acc[message.category][message.message_key] = message.message_value
      return acc
    }, {} as Record<string, Record<string, string>>)
  }

  // Get specific message
  static async getMessage(messageKey: string) {
    const { data, error } = await supabase
      .from('app_messages')
      .select('message_value')
      .eq('message_key', messageKey)
      .single()
    
    if (error) throw error
    return data.message_value
  }

  // Get app settings
  static async getAppSettings() {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
    
    if (error) throw error
    
    // Convert to key-value object
    return data.reduce((acc, setting) => {
      let value = setting.setting_value
      
      // Parse based on type
      switch (setting.setting_type) {
        case 'number':
          value = parseInt(value)
          break
        case 'boolean':
          value = value === 'true'
          break
        case 'json':
          value = JSON.parse(value)
          break
      }
      
      acc[setting.setting_key] = value
      return acc
    }, {} as Record<string, any>)
  }

  // Get specific setting
  static async getSetting(settingKey: string) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('setting_key', settingKey)
      .single()
    
    if (error) throw error
    
    let value = data.setting_value
    
    // Parse based on type
    switch (data.setting_type) {
      case 'number':
        value = parseInt(value)
        break
      case 'boolean':
        value = value === 'true'
        break
      case 'json':
        value = JSON.parse(value)
        break
    }
    
    return value
  }

  // Get popular items
  static async getPopularItems(limit?: number) {
    let query = supabase
      .from('popular_items')
      .select('*')
      .order('popularity_score', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Get popular items by category
  static async getPopularItemsByCategory(category: string, limit?: number) {
    let query = supabase
      .from('popular_items')
      .select('*')
      .eq('category', category)
      .order('popularity_score', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Get seasonal items
  static async getSeasonalItems(season: string) {
    const { data, error } = await supabase
      .from('seasonal_items')
      .select('*')
      .eq('season', season)
      .order('priority', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Get current season items
  static async getCurrentSeasonItems() {
    const currentMonth = new Date().getMonth() + 1
    let season = 'spring'
    
    if (currentMonth >= 12 || currentMonth <= 2) season = 'winter'
    else if (currentMonth >= 3 && currentMonth <= 5) season = 'spring'
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'summer'
    else if (currentMonth >= 9 && currentMonth <= 11) season = 'autumn'
    
    return this.getSeasonalItems(season)
  }

  // Update popular item score (for ML-like learning)
  static async updatePopularItemScore(itemName: string, category: string) {
    // Check if item exists
    const { data: existing, error: fetchError } = await supabase
      .from('popular_items')
      .select('*')
      .eq('item_name', itemName)
      .eq('category', category)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }
    
    if (existing) {
      // Increment score
      const { error } = await supabase
        .from('popular_items')
        .update({ 
          popularity_score: existing.popularity_score + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
      
      if (error) throw error
    } else {
      // Create new item
      const { error } = await supabase
        .from('popular_items')
        .insert({
          item_name: itemName,
          category: category,
          popularity_score: 1,
          season: 'all'
        })
      
      if (error) throw error
    }
  }
}
