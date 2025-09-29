// Add this to browser console to test authentication
window.testAuth = {
  async createUser() {
    const testEmail = `testuser${Math.floor(Math.random() * 1000)}@gmail.com`;
    const testPassword = 'TestPassword123!';
    
    console.log('🔐 Creating test user:', testEmail);
    
    try {
      // Import supabase client
      const { supabase } = await import('/lib/supabase.js');
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });
      
      if (error) {
        console.error('❌ Signup failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ User created:', data.user?.email);
      return { success: true, email: testEmail, password: testPassword };
      
    } catch (err) {
      console.error('❌ Test failed:', err);
      return { success: false, error: err.message };
    }
  },
  
  async loginUser(email, password) {
    console.log('🔐 Logging in:', email);
    
    try {
      const { supabase } = await import('/lib/supabase.js');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ Login failed:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Login successful:', data.user?.email);
      return { success: true, user: data.user };
      
    } catch (err) {
      console.error('❌ Login test failed:', err);
      return { success: false, error: err.message };
    }
  },
  
  async testGuestMode() {
    console.log('🚀 Testing guest mode');
    localStorage.setItem('guest_mode', 'true');
    window.location.reload();
  }
};

console.log('🔧 Test tools available:');
console.log('- window.testAuth.createUser() // Create a new test user');
console.log('- window.testAuth.loginUser(email, password) // Login with credentials');
console.log('- window.testAuth.testGuestMode() // Switch to guest mode');