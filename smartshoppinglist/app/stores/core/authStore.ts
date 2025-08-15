/**
 * Authentication Store
 * Handles user authentication state and operations
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { AuthStore } from '../../types'

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

// Selectors for better performance - These ARE React hooks
export const useAuthSelectors = {
  useUser: () => useAuthStore((state) => state.user),
  useIsLoading: () => useAuthStore((state) => state.isLoading),
  useIsInitialized: () => useAuthStore((state) => state.isInitialized),
  useIsAuthenticated: () => useAuthStore((state) => state.isAuthenticated()),
  useIsGuestMode: () => useAuthStore((state) => state.isGuestMode()),
}
