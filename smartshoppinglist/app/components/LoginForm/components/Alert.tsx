
import { CSS_CLASSES } from '../../../constants'
import { AlertProps } from '../../../types'

/**
 * Alert Component
 * Single Responsibility: Display error and success messages
 */
export function Alert({ type, message, className = '' }: AlertProps) {
  const alertClass = type === 'error' ? CSS_CLASSES.ALERT.ERROR : CSS_CLASSES.ALERT.SUCCESS
  
  return (
    <div className={`${alertClass} ${className}`}>
      {message}
    </div>
  )
}
