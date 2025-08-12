/**
 * Authentication Store
 * Handles user authentication state and operations
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Types
interface User {
  id: string
  email: string
  isGuest: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  logout: () => void
  switchToGuestMode: () => void
  isAuthenticated: () => boolean
  isGuestMode: () => boolean
}

type AuthStore = AuthState & AuthActions

// Store Implementation
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        user: null,
        isLoading: true,
        isInitialized: false,

        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user
            state.isLoading = false
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setInitialized: (initialized) =>
          set((state) => {
            state.isInitialized = initialized
          }),

        logout: () =>
          set((state) => {
            state.user = null
            state.isLoading = false
          }),

        switchToGuestMode: () =>
          set((state) => {
            state.user = {
              id: 'guest',
              email: 'guest@local',
              isGuest: true,
            }
            state.isLoading = false
          }),

        // Computed values
        isAuthenticated: () => {
          const { user } = get()
          return user !== null
        },

        isGuestMode: () => {
          const { user } = get()
          return user?.isGuest === true
        },
      })),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)

// Selectors for better performance
export const useAuthSelectors = {
  user: () => useAuthStore((state) => state.user),
  isLoading: () => useAuthStore((state) => state.isLoading),
  isInitialized: () => useAuthStore((state) => state.isInitialized),
  isAuthenticated: () => useAuthStore((state) => state.isAuthenticated()),
  isGuestMode: () => useAuthStore((state) => state.isGuestMode()),
}
