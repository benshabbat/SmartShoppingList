/**
 * Quick Test Registration
 * Try to create a test user to debug auth issues
 */

import { supabase } from '../../lib/supabase'

export async function createTestUser() {
  const testEmail = 'test@example.com'
  const testPassword = 'test123456'
  
  try {
    console.log('🧪 Creating test user:', testEmail)
    
    // Try to sign up
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    })
    
    if (error) {
      console.error('❌ Test signup failed:', error.message)
      
      // Try to sign in instead
      console.log('🔄 Trying to sign in with existing account...')
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })
      
      if (loginError) {
        console.error('❌ Test login also failed:', loginError.message)
        return false
      }
      
      console.log('✅ Test login successful:', loginData.user?.email)
      return true
    }
    
    console.log('✅ Test signup successful:', data.user?.email)
    console.log('📧 Check email for verification link')
    return true
    
  } catch (error) {
    console.error('❌ Test user creation failed:', error)
    return false
  }
}

// Export for manual testing
if (typeof window !== 'undefined') {
  ;(window as typeof window & { createTestUser: typeof createTestUser }).createTestUser = createTestUser
  console.log('🧪 Test function available: window.createTestUser()')
}