/**
 * Direct Supabase Test
 * Test the connection and auth system directly
 */

import { createClient } from '@supabase/supabase-js'

async function testSupabaseDirectly() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔧 Direct Supabase Test Starting...')
  console.log('📍 URL:', supabaseUrl)
  console.log('🔑 Key exists:', !!supabaseKey)
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    return false
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection
    console.log('🔗 Testing database connection...')
    const { data, error } = await supabase.from('categories').select('*').limit(1)
    
    if (error) {
      console.error('❌ Database error:', error)
      return false
    }
    
    console.log('✅ Database connected successfully!')
    console.log('📊 Sample category:', data?.[0])
    
    // Test auth state
    console.log('🔐 Testing auth system...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Auth error:', sessionError)
      return false
    }
    
    console.log('✅ Auth system working!')
    console.log('👤 Current user:', sessionData.session?.user?.email || 'No user logged in')
    
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

export { testSupabaseDirectly }

// Auto-run test
if (typeof window !== 'undefined') {
  testSupabaseDirectly()
}