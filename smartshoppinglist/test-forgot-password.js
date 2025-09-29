// Test forgot password functionality
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fevqgfwreahopisocuvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldnFnZndyZWFob3Bpc29jdXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTIzNjQsImV4cCI6MjA3MDU2ODM2NH0.M-fbnayD_QN4iV7v0Bgs1VuVClryjUj3g_KiFVD3Im4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testForgotPassword() {
  console.log('🔄 Testing forgot password functionality...')
  
  const testEmail = 'testuser235@gmail.com' // Use the email we created
  
  try {
    console.log('📧 Sending password reset email to:', testEmail)
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/reset-password'
    })
    
    if (error) {
      console.error('❌ Password reset failed:', error.message)
      return
    }
    
    console.log('✅ Password reset email sent successfully!')
    console.log('📧 Check the email for reset link')
    console.log('📍 Data:', data)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testForgotPassword()