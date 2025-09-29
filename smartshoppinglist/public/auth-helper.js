// Test users and password reset helper
window.authHelper = {
  // Test users that were created

  async resetPassword(email) {
    console.log('🔄 Resetting password for:', email);
    
    try {
      const { supabase } = await import('/lib/supabase.js');
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/auth/callback'
      });
      
      if (error) {
        console.error('❌ Password reset failed:', error.message);
        alert('שגיאה באיפוס סיסמה: ' + error.message);
        return;
      }
      
      console.log('✅ Password reset email sent!');
      alert('✅ נשלח מייל לאיפוס סיסמה!');
      
    } catch (err) {
      console.error('❌ Reset failed:', err);
      alert('שגיאה: ' + err.message);
    }
  },

  async createNewUser() {
    const email = prompt('הכנס מייל:');
    const password = prompt('הכנס סיסמה (לפחות 6 תווים):');
    
    if (!email || !password) return;
    
    try {
      const { supabase } = await import('/lib/supabase.js');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'User'
          }
        }
      });
      
      if (error) {
        console.error('❌ Signup failed:', error.message);
        alert('שגיאה בהרשמה: ' + error.message);
        return;
      }
      
      console.log('✅ User created:', data.user?.email);
      alert('✅ משתמש נוצר: ' + email + '\nבדוק מייל לאימות!');
      
    } catch (err) {
      console.error('❌ Creation failed:', err);
      alert('שגיאה: ' + err.message);
    }
  },


  testGuestMode() {
    localStorage.setItem('guest_mode', 'true');
    location.reload();
  }
};

