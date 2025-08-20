import { CSS_CLASSES } from '../constants'
import { FormFieldProps } from '../../../../types'

/**
 * Form Field Component
 * Single Responsibility: Reusable form input field
 */
export function FormField({
  label,
  type,
  value,
  onChange,
  required = false,
  minLength,
  className = ''
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className={CSS_CLASSES.INPUT.LABEL}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={CSS_CLASSES.INPUT.FIELD}
        required={required}
        minLength={minLength}
      />
    </div>
  )
}
