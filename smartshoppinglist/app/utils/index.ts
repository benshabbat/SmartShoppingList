// Enhanced utility exports following DRY and Clean Code principles
export * from './classNames'
export * from './validation'
export * from './errorHandling'
export * from './dateUtils'
export * from './mathUtils'
export * from './helpers'

// Re-export existing utilities (consolidated)
export * from './categories'
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
export * from './presetLists'
export * from './smartSuggestions'
export * from './soundManager'
export * from './receiptProcessor'

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
export { logger, calculations } from './helpers'
