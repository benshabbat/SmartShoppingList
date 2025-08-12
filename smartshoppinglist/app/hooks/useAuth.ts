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
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    // Check if user chose guest mode from localStorage
    const guestMode = localStorage.getItem('guest_mode')
    const hasSupabase = supabase !== null

    // Default to guest mode unless explicitly disabled
    if (guestMode !== 'false' && (guestMode === 'true' || !hasSupabase)) {
      setUser(GUEST_USER)
      setIsGuest(true)
      setLoading(false)
      return
    }

    // Get initial session only if guest mode is explicitly disabled
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          // Fallback to guest mode on error
          setUser(GUEST_USER)
          setIsGuest(true)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          // If no session and not explicitly in auth mode, go to guest
          if (!session?.user) {
            setUser(GUEST_USER)
            setIsGuest(true)
          }
        }
      } catch (error) {
        console.error('Supabase connection error:', error)
        // Fallback to guest mode if Supabase is not available
        setUser(GUEST_USER)
        setIsGuest(true)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth event:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setIsGuest(false)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInAsGuest = () => {
    localStorage.setItem('guest_mode', 'true')
    setUser(GUEST_USER)
    setIsGuest(true)
    setSession(null)
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      if (isGuest) {
        localStorage.removeItem('guest_mode')
        setUser(null)
        setIsGuest(false)
      } else if (supabase) {
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchToAuth = () => {
    localStorage.setItem('guest_mode', 'false')
    localStorage.removeItem('guest_notification_dismissed') // Reset notification
    setUser(null)
    setIsGuest(false)
    setSession(null)
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
