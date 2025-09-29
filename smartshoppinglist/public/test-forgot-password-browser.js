// Test forgot password in the browser
console.log('Testing forgot password functionality...')

// Add a test button to the page
function addTestButton() {
  const button = document.createElement('button')
  button.innerText = 'Test Forgot Password'
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: red;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `
  
  button.onclick = async () => {
    console.log('🔄 Testing forgot password...')
    
    // Test email
    const testEmail = 'testuser235@gmail.com'
    
    try {
      // Import supabase
      const { supabase } = await import('/lib/supabase.js')
      
      console.log('📧 Sending reset email to:', testEmail)
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('❌ Error:', error)
        alert('שגיאה: ' + error.message)
      } else {
        console.log('✅ Success! Data:', data)
        alert('✅ מייל נשלח בהצלחה!')
      }
    } catch (err) {
      console.error('❌ Test failed:', err)
      alert('שגיאה בטסט: ' + err.message)
    }
  }
  
  document.body.appendChild(button)
}

// Add button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addTestButton)
} else {
  addTestButton()
}