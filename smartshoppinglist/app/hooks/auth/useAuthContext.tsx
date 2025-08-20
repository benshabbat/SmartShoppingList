'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './useAuth'
import { AuthContextType } from '../../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication context provider
 * Provides auth state and methods to all child components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}
