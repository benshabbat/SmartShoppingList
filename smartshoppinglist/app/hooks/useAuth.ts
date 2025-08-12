import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../stores/core/authStore'
import { useUIStore } from '../stores/ui/uiStore'
import type { User } from '@supabase/supabase-js'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}

// Types
interface LoginCredentials {
  email: string
  password: string
}

interface SignUpCredentials {
  email: string
  password: string
  options?: {
    data?: {
      full_name?: string
    }
  }
}

// Hook to get current session
export function useSession() {
  const setUser = useAuthStore((state) => state.setUser)
  const setInitialized = useAuthStore((state) => state.setInitialized)

  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        throw new Error(`Session error: ${error.message}`)
      }

      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          isGuest: false,
        }
        setUser(user)
      } else {
        setUser(null)
      }

      setInitialized(true)
      return session
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Hook to get current user
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
      
      if (error) {
        throw new Error(`User fetch error: ${error.message}`)
      }

      if (supabaseUser) {
        const userData = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          isGuest: false,
        }
        setUser(userData)
        return userData
      }

      setUser(null)
      return null
    },
    enabled: !!user && !user.isGuest,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)
  const addToast = useUIStore((state) => state.addToast)

  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          isGuest: false,
        }
        setUser(user)
        
        // Invalidate auth queries
        queryClient.invalidateQueries({ queryKey: authKeys.all })
        
        addToast({
          message: 'Successfully logged in!',
          type: 'success',
          duration: 3000,
        })
      }
      setLoading(false)
    },
    onError: (error: Error) => {
      setLoading(false)
      addToast({
        message: error.message || 'Login failed',
        type: 'error',
        duration: 5000,
      })
    },
  })
}

// Sign up mutation
export function useSignUp() {
  const queryClient = useQueryClient()
  const setLoading = useAuthStore((state) => state.setLoading)
  const addToast = useUIStore((state) => state.addToast)

  return useMutation({
    mutationFn: async ({ email, password, options }: SignUpCredentials) => {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: (data) => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      
      addToast({
        message: 'Account created successfully! Please check your email for verification.',
        type: 'success',
        duration: 5000,
      })
      setLoading(false)
    },
    onError: (error: Error) => {
      setLoading(false)
      addToast({
        message: error.message || 'Sign up failed',
        type: 'error',
        duration: 5000,
      })
    },
  })
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)
  const addToast = useUIStore((state) => state.addToast)

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      logout()
      
      // Clear all queries
      queryClient.clear()
      
      addToast({
        message: 'Successfully logged out',
        type: 'success',
        duration: 3000,
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Logout failed',
        type: 'error',
        duration: 5000,
      })
    },
  })
}

// Guest mode hook
export function useGuestMode() {
  const switchToGuestMode = useAuthStore((state) => state.switchToGuestMode)
  const addToast = useUIStore((state) => state.addToast)
  const setShowGuestModeNotification = useUIStore((state) => state.setShowGuestModeNotification)

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve()
    },
    onSuccess: () => {
      switchToGuestMode()
      setShowGuestModeNotification(true)
      
      addToast({
        message: 'Switched to guest mode. Your data will be stored locally.',
        type: 'info',
        duration: 5000,
      })
    },
    onError: (error: Error) => {
      addToast({
        message: 'Failed to switch to guest mode',
        type: 'error',
        duration: 3000,
      })
    },
  })
}

// Legacy useAuth hook for backward compatibility (keeping the original structure)
export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const logout = useAuthStore((state) => state.logout)
  const switchToGuestMode = useAuthStore((state) => state.switchToGuestMode)

  const { data: session } = useSession()

  // Legacy functions for backward compatibility
  const signOut = async () => {
    logout()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_mode')
      localStorage.removeItem('guest_notification_dismissed')
      localStorage.removeItem('guest_explanation_seen')
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  const signInAsGuest = () => {
    switchToGuestMode()
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_mode', 'true')
    }
  }

  const switchToAuth = () => {
    logout()
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_mode', 'false')
      localStorage.removeItem('guest_notification_dismissed')
    }
  }

  return {
    user: user ? {
      id: user.id,
      email: user.email,
      user_metadata: { full_name: user.isGuest ? 'אורח' : '' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User : null,
    session,
    loading: isLoading,
    isGuest: user?.isGuest || false,
    isAuthenticated: !!user,
    signOut,
    signInAsGuest,
    switchToAuth,
  }
}
