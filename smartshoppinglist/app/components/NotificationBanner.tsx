import React from 'react'
import { Lightbulb } from 'lucide-react'
import { Category } from '../types'
import { CATEGORY_EMOJIS } from '../utils/constants'

export interface NotificationBannerProps {
  type: 'auto-change' | 'suggestion'
  message: string
  category?: Category
  productName?: string
  onAccept?: () => void
  onDismiss?: () => void
  isVisible: boolean
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  message,
  category,
  productName,
  onAccept,
  onDismiss,
  isVisible
}) => {
  if (!isVisible) return null

  const getStyles = () => {
    switch (type) {
      case 'auto-change':
        return {
          container: 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200',
          text: 'text-green-700',
          icon: 'text-green-500'
        }
      case 'suggestion':
        return {
          container: 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200',
          text: 'text-gray-600',
          icon: 'text-amber-500'
        }
    }
  }

  const styles = getStyles()

  const renderContent = () => {
    if (type === 'auto-change' && category && productName) {
      return (
        <div className="flex items-center gap-2 text-right">
          <span className={`text-sm ${styles.text}`}>
            הקטגוריה שונתה אוטומטית ל
            <span className="font-semibold text-green-800 mr-1">
              {CATEGORY_EMOJIS[category]} {category}
            </span>
            עבור &quot;{productName}&quot;
          </span>
          <Lightbulb className={`w-4 h-4 ${styles.icon}`} />
        </div>
      )
    }

    if (type === 'suggestion' && category && productName) {
      return (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {onAccept && (
              <button
                onClick={onAccept}
                className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors"
              >
                החלף
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                התעלם
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className={`text-sm ${styles.text}`}>
              אולי &quot;{productName}&quot; שייך ל
              <span className="font-semibold text-amber-700">
                {CATEGORY_EMOJIS[category]} {category}
              </span>
              ?
            </span>
            <Lightbulb className={`w-4 h-4 ${styles.icon}`} />
          </div>
        </div>
      )
    }

    return <span className={`text-sm ${styles.text}`}>{message}</span>
  }

  return (
    <div className={`mb-4 p-3 rounded-xl ${styles.container}`}>
      {renderContent()}
    </div>
  )
}
