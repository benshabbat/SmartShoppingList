import { useState, useCallback } from 'react'

export interface FormField<T> {
  value: T
  error?: string
  isValid: boolean
}

export interface UseFormStateOptions<T> {
  initialValue: T
  validator?: (value: T) => string | undefined
}

export const useFormField = <T>({ initialValue, validator }: UseFormStateOptions<T>) => {
  const [field, setField] = useState<FormField<T>>({
    value: initialValue,
    isValid: !validator || !validator(initialValue)
  })

  const setValue = useCallback((newValue: T) => {
    const error = validator?.(newValue)
    setField({
      value: newValue,
      error,
      isValid: !error
    })
  }, [validator])

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue, setValue])

  return {
    ...field,
    setValue,
    reset
  }
}

export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState)
  
  const updateField = useCallback(<K extends keyof T>(
    field: K, 
    value: T[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const reset = useCallback(() => {
    setFormData(initialState)
  }, [initialState])

  const isValid = useCallback((validators: Partial<Record<keyof T, (value: T[keyof T]) => boolean>>) => {
    return Object.entries(validators).every(([key, validator]) => {
      const value = formData[key as keyof T]
      return validator!(value)
    })
  }, [formData])

  return {
    formData,
    updateField,
    reset,
    isValid
  }
}
