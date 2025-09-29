// Test users and password reset helper
window.authHelper = {
  // Test users that were created
  testUsers: [
    { email: 'testuser961@gmail.com', password: 'TestPassword123!' },
    { email: 'testuser930@gmail.com', password: 'TestPassword123!' },
    { email: 'testuser235@gmail.com', password: 'TestPassword123!' }
  ],

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

  showHelp() {
    const help = `
🔧 עזרה לאימות:

📊 משתמשי טסט קיימים:
${this.testUsers.map(u => `• ${u.email} | סיסמה: ${u.password}`).join('\n')}

🔄 פקודות זמינות:
• authHelper.resetPassword('email@example.com') - איפוס סיסמה
• authHelper.createNewUser() - יצירת משתמש חדש
• authHelper.testGuestMode() - מעבר למצב אורח

💡 טיפים:
1. אם שכחת סיסמה - השתמש ב-resetPassword
2. אם אין לך חשבון - השתמש ב-createNewUser
3. לבדיקה מהירה - השתמש במצב אורח
    `;
    
    console.log(help);
    alert(help);
  },

  testGuestMode() {
    localStorage.setItem('guest_mode', 'true');
    location.reload();
  }
};

// Auto-show help
authHelper.showHelp();

console.log('🔧 Auth Helper loaded!');
console.log('Type authHelper.showHelp() for commands');