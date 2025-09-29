/**
 * Supabase Connection Test
 * Test basic connection and auth functionality
 */

import { supabase } from '../../lib/supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test 1: Basic connection
    const { data: _data, error } = await supabase.from('categories').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error)
      return false
    }
    
    console.log('✅ Database connection successful')
    
    // Test 2: Auth session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Auth session check failed:', sessionError)
      return false
    }
    
    console.log('✅ Auth system working, current session:', sessionData.session?.user?.email || 'no user')
    
    // Test 3: Test signup (without actually creating account)
    console.log('🔐 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔐 Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}

// Run test immediately when imported
if (typeof window !== 'undefined') {
  testSupabaseConnection()
}