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
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize guest state on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const guestMode = localStorage.getItem('guest_mode')
    if (guestMode === 'true') {
      setUser(GUEST_USER)
      setIsGuest(true)
      setLoading(false)
      setIsInitialized(true)
      return
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    
    const guestMode = localStorage.getItem('guest_mode')
    const hasSupabase = supabase !== null

    // If already in guest mode, don't proceed with Supabase auth
    if (guestMode === 'true') {
      return
    }

    // If Supabase is not available and no explicit choice made, show login form
    if (!hasSupabase && guestMode !== 'false') {
      setLoading(false)
      return
    }

    // Get initial session only if guest mode is not explicitly chosen
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          // Don't fallback to guest mode automatically - let user choose
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Supabase connection error:', error)
        // Don't fallback to guest mode automatically - let user choose
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth event:', event)
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
  }, [isInitialized])

  const signInAsGuest = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_mode', 'true')
    }
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
