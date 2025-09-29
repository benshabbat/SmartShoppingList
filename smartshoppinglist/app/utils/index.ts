// Utils exports - organized by category

// Core utilities
export * from './core'

// Data processing utilities
export * from './data'

// UI utilities (excluding getAllCategories to avoid conflict)
export * from './ui/classNames'
export * from './ui/soundManager'

// Validation utilities
export * from './validation'

// Re-export existing utilities (consolidated)
export { 
  CATEGORY_EMOJIS, 
  STORAGE_KEYS, 
  COMMON_PRODUCTS,
  CATEGORIES,
  ENV_CONSTANTS,
  TIME_CONSTANTS,
  UI_CONSTANTS,
  CSS_CONSTANTS,
  COLOR_SCHEMES,
  MESSAGES
} from '../constants'

// Type exports - now imported from centralized types
export type { 
  ValidationResult,
  Validator,
  ErrorType,
  AppError,
  ErrorHandlerOptions,
  ButtonVariant,
  ContainerVariant,
  InputVariant,
  ItemVariant,
  PresetList,
  CategoryType,
  Category
} from '../types'

// Specific utility exports
export { logger, calculations } from './core/helpers'
