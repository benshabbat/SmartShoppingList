'use client'

import { useState, useEffect } from 'react'
import { Clock, Cloud, Calendar, Settings, Bell } from 'lucide-react'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { formatDate, logger } from '../../utils'

interface ScheduledExportProps {
  onScheduleExport: (config: ExportScheduleConfig) => void
  isVisible: boolean
  onClose: () => void
}

interface ExportScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly'
  format: 'json' | 'csv' | 'detailed'
  enabled: boolean
  lastExport?: Date
  nextExport?: Date
  cloudSync: boolean
  emailNotifications: boolean
  categories: string[]
}

export const ScheduledExport: React.FC<ScheduledExportProps> = ({
  onScheduleExport,
  isVisible,
  onClose
}) => {
  const { items, recentPurchases } = useGlobalShopping()
  
  const [config, setConfig] = useState<ExportScheduleConfig>({
    frequency: 'weekly',
    format: 'detailed',
    enabled: false,
    cloudSync: false,
    emailNotifications: false,
    categories: ['all']
  })

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('exportScheduleConfig')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        logger.error('Failed to load export schedule config:', error)
      }
    }
  }, [])

  // Save configuration to localStorage
  const saveConfig = (newConfig: ExportScheduleConfig) => {
    try {
      localStorage.setItem('exportScheduleConfig', JSON.stringify(newConfig))
      setConfig(newConfig)
      onScheduleExport(newConfig)
    } catch (error) {
      logger.error('Failed to save export schedule config:', error)
    }
  }

  // Calculate next export date
  const calculateNextExport = (frequency: typeof config.frequency): Date => {
    const now = new Date()
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case 'monthly':
        const nextMonth = new Date(now)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        return nextMonth
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
  }

  // Get unique categories
  const allCategories = [...new Set([
    ...items.map(item => item.category),
    ...recentPurchases.map(item => item.category)
  ])].filter(Boolean)

  const handleFrequencyChange = (frequency: typeof config.frequency) => {
    const newConfig = {
      ...config,
      frequency,
      nextExport: calculateNextExport(frequency)
    }
    setConfig(newConfig)
  }

  const handleSave = () => {
    const finalConfig = {
      ...config,
      nextExport: config.enabled ? calculateNextExport(config.frequency) : undefined
    }
    saveConfig(finalConfig)
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            <h3 className="text-xl font-semibold">ייצוא מתוזמן</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>

        {/* הפעלה/כיבוי */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5"
            />
            <div>
              <span className="font-medium">הפעל ייצוא אוטומטי</span>
              <p className="text-sm text-gray-600">
                יצא נתונים באופן אוטומטי לפי התזמון שתבחר
              </p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            {/* תדירות */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">תדירות הייצוא:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'daily', label: '🗓️ יומי', desc: 'כל יום' },
                  { value: 'weekly', label: '📅 שבועי', desc: 'כל שבוע' },
                  { value: 'monthly', label: '📆 חודשי', desc: 'כל חודש' }
                ].map(option => (
                  <label
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                      config.frequency === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={config.frequency === option.value}
                      onChange={(e) => handleFrequencyChange(e.target.value as typeof config.frequency)}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* פורמט */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">פורמט הייצוא:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'detailed', label: '📊 מפורט', desc: 'דוח מלא' },
                  { value: 'json', label: '💾 JSON', desc: 'נתונים גולמיים' },
                  { value: 'csv', label: '📋 CSV', desc: 'טבלה' }
                ].map(option => (
                  <label
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                      config.format === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={config.format === option.value}
                      onChange={(e) => setConfig({ ...config, format: e.target.value as typeof config.format })}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* קטגוריות */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">קטגוריות לייצוא:</label>
              <div className="max-h-32 overflow-y-auto border rounded-lg p-3">
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.categories.includes('all')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setConfig({ ...config, categories: ['all'] })
                      } else {
                        setConfig({ ...config, categories: [] })
                      }
                    }}
                  />
                  <span className="font-medium">כל הקטגוריות</span>
                </label>
                {!config.categories.includes('all') && allCategories.map(category => (
                  <label key={category} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig({
                            ...config,
                            categories: [...config.categories.filter(c => c !== 'all'), category]
                          })
                        } else {
                          setConfig({
                            ...config,
                            categories: config.categories.filter(c => c !== category)
                          })
                        }
                      }}
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* אפשרויות מתקדמות */}
            <div className="mb-6 space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Settings size={16} />
                אפשרויות מתקדמות
              </h4>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={config.cloudSync}
                  onChange={(e) => setConfig({ ...config, cloudSync: e.target.checked })}
                />
                <Cloud size={20} className="text-blue-500" />
                <div>
                  <span className="font-medium">שמירה בענן</span>
                  <p className="text-sm text-gray-600">שמור קבצים ב-Google Drive או Dropbox</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={config.emailNotifications}
                  onChange={(e) => setConfig({ ...config, emailNotifications: e.target.checked })}
                />
                <Bell size={20} className="text-green-500" />
                <div>
                  <span className="font-medium">התראות אימייל</span>
                  <p className="text-sm text-gray-600">קבל התראה כשהייצוא מתבצע</p>
                </div>
              </label>
            </div>

            {/* מידע על הייצוא הבא */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar size={16} />
                מידע על התזמון
              </h4>
              <div className="text-sm space-y-1">
                <div>⏰ ייצוא הבא: {formatDate(calculateNextExport(config.frequency))}</div>
                <div>📊 פורמט: {config.format}</div>
                <div>📁 קטגוריות: {config.categories.includes('all') ? 'כל הקטגוריות' : `${config.categories.length} קטגוריות נבחרו`}</div>
              </div>
            </div>
          </>
        )}

        {/* כפתורי פעולה */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            שמור הגדרות
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  )
}