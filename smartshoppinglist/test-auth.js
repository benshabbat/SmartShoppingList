// Test script to verify Supabase authentication
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fevqgfwreahopisocuvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnFnZndyZWFob3Bpc29jdXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTIzNjQsImV4cCI6MjA3MDU2ODM2NH0.M-fbnayD_QN4iV7v0Bgs1VuVClryjUj3g_KiFVD3Im4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log('🔗 Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('❌ Session check failed:', error.message)
      return
    }
    console.log('✅ Supabase connection successful')
    
    // Test 2: Try to sign up a test user with auto-confirm
    const testEmail = `testuser${Math.floor(Math.random() * 1000)}@gmail.com`
    const testPassword = 'TestPassword123!'
    
    console.log('📝 Attempting signup with auto-confirm:', testEmail)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        },
        emailRedirectTo: undefined // Disable email confirmation for testing
      }
    })
    
    if (signUpError) {
      console.error('❌ Signup failed:', signUpError.message)
      
      // Try with a simpler approach - let's try to login with existing user
      console.log('🔄 Trying to login with existing confirmed user...')
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com', // Known test user
        password: 'TestPassword123!'
      })
      
      if (loginError) {
        console.error('❌ Login also failed:', loginError.message)
        console.log('💡 Try using guest mode instead!')
      } else {
        console.log('✅ Login successful with existing user:', loginData.user?.email)
      }
      return
    }
    
    console.log('✅ Signup successful:', signUpData.user?.email)
    console.log('🎯 User created with credentials:', { email: testEmail, password: testPassword })
    
    // Try to login immediately (might work if email confirmation is disabled)
    console.log('� Testing immediate login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (loginError) {
      console.error('❌ Immediate login failed:', loginError.message)
      console.log('📧 Email confirmation required - check your email')
    } else {
      console.log('✅ Immediate login successful:', loginData.user?.email)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAuth()