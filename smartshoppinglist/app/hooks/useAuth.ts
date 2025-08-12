import { useState, useEffect } from 'react'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Guest user object
const GUEST_USER = {
  id: 'guest-user',
  email: 'guest@smartshopping.local',
  user_metadata: { full_name: 'אורח' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
} as User

export function useAuth() {
  // Initialize state from localStorage to prevent hydration mismatch
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  // Main initialization effect
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for guest mode first
        if (typeof window !== 'undefined') {
          const guestMode = localStorage.getItem('guest_mode')
          if (guestMode === 'true') {
            setUser(GUEST_USER)
            setIsGuest(true)
            setLoading(false)
            return
          }
        }

        // Try to get Supabase session
        if (supabase) {
          try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (!error && session) {
              setSession(session)
              setUser(session.user)
            }
          } catch (error) {
            console.error('Supabase auth error:', error)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes if Supabase is available
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          // Clear guest mode when successfully authenticated
          if (session?.user && typeof window !== 'undefined') {
            localStorage.removeItem('guest_mode')
          }
          setSession(session)
          setUser(session?.user ?? null)
          setIsGuest(false)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signInAsGuest = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_mode', 'true')
    }
    
    // Update state synchronously
    setUser(GUEST_USER)
    setIsGuest(true)
    setSession(null)
    setLoading(false)
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      if (isGuest) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guest_mode')
          localStorage.removeItem('guest_notification_dismissed')
          localStorage.removeItem('guest_explanation_seen')
        }
        setUser(null)
        setIsGuest(false)
      } else if (supabase) {
        await supabase.auth.signOut()
        setSession(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchToAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_mode', 'false')
      localStorage.removeItem('guest_notification_dismissed') // Reset notification
    }
    setUser(null)
    setIsGuest(false)
    setSession(null)
    setLoading(false) // Ensure loading is false to show login form
  }

  return {
    user,
    session,
    loading,
    isGuest,
    signOut,
    signInAsGuest,
    switchToAuth,
    isAuthenticated: !!user
  }
}
