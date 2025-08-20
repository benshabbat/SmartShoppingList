'use client'

import { useState, useCallback } from 'react'
import { FormField, UseFormFieldOptions } from '../../types'

/**
 * Hook for managing individual form field state with validation
 */
export const useFormField = <T>({ initialValue, validator }: UseFormFieldOptions<T>) => {
  const [field, setField] = useState<FormField<T>>({
    value: initialValue,
    error: validator?.(initialValue),
    isValid: !validator || !validator(initialValue),
    isDirty: false,
    isTouched: false
  })

  const setValue = useCallback((newValue: T) => {
    const error = validator?.(newValue)
    setField({
      value: newValue,
      error,
      isValid: !error,
      isDirty: true,
      isTouched: true
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

/**
 * Hook for managing form state with multiple fields
 */
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
