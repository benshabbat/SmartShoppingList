/**
 * Central Type Definitions for Smart Shopping List Application
 * 
 * This file serves as the main entry point for all type definitions.
 * All types are now organized in separate files by category for better maintainability.
 * 
 * Design Principles Applied:
 * - DRY: Common patterns extracted to base types
 * - Composition: Complex interfaces built from smaller, focused interfaces
 * - Consistency: Unified naming conventions and type patterns
 * - Extensibility: Base types allow for easy extension and modification
 * - Single Responsibility: Each file handles one specific domain
 */

// === IMPORTS FROM ORGANIZED TYPE FILES ===
export * from './components'
export * from './context'
export * from './data'
export * from './hooks'
export * from './stores'
export * from './style'
export * from './supabase'
export * from './ui'
export * from './validation'
