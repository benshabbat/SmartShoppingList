/**
 * Common validation utilities for shopping items and forms
 */

import { ShoppingItem } from '../types'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateItemName = (name: string): ValidationResult => {
  const trimmedName = name.trim()
  
  if (!trimmedName) {
    return { isValid: false, error: 'שם המוצר חובה' }
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'שם המוצר חייב להכיל לפחות 2 תווים' }
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'שם המוצר לא יכול להכיל יותר מ-50 תווים' }
  }
  
  return { isValid: true }
}

export const validateCategory = (category: string): ValidationResult => {
  if (!category.trim()) {
    return { isValid: false, error: 'קטגוריה חובה' }
  }
  
  return { isValid: true }
}

export const validateShoppingItem = (item: Partial<ShoppingItem>): ValidationResult => {
  if (item.name) {
    const nameValidation = validateItemName(item.name)
    if (!nameValidation.isValid) {
      return nameValidation
    }
  }
  
  if (item.category) {
    const categoryValidation = validateCategory(item.category)
    if (!categoryValidation.isValid) {
      return categoryValidation
    }
  }
  
  if (item.price && item.price < 0) {
    return { isValid: false, error: 'מחיר לא יכול להיות שלילי' }
  }
  
  return { isValid: true }
}

export const checkDuplicateItem = (
  newItemName: string,
  existingItems: ShoppingItem[]
): boolean => {
  return existingItems.some(item => 
    item.name.toLowerCase().trim() === newItemName.toLowerCase().trim()
  )
}
