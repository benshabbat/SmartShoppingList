import { ShoppingCart, HelpCircle, Volume2, VolumeX, BarChart3, Receipt, LogOut, User } from 'lucide-react'
import { useAuthStore, useUIStore, useSoundEnabled } from '../stores'
import { useLogout, useGuestMode } from '../hooks/useAuthQueries'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Header = () => {
  // Get functions from global context - NO PROPS DRILLING!
  const { openTutorial, openReceiptScanner } = useGlobalShopping()
  
  const soundEnabled = useSoundEnabled()
  const toggleSound = useUIStore((state) => state.toggleSound)
  
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogout()
  const guestModeMutation = useGuestMode()
  
  const pathname = usePathname()
  const isStatisticsPage = pathname === '/statistics'
  
  const isAuthenticated = !!user
  const isGuest = user?.isGuest || false

  const handleSignOut = () => {
    logoutMutation.mutate()
  }

  const handleSwitchToAuth = () => {
    const confirmSwitch = confirm(
      '⚠️ הודעה חשובה!\n\n' +
      'כאשר תעבור למצב התחברות עם חשבון, הנתונים הנוכחיים שנשמרו במכשיר זה לא יימחקו, ' +
      'אבל הם גם לא יסונכרנו אוטומטית לחשבון החדש.\n\n' +
      'אם יש לך נתונים חשובים, וודא שאתה זוכר אותם או תעשה צילום מסך לפני המעבר.\n\n' +
      'האם אתה בטוח שברצונך להמשיך להתחברות?'
    )
    
    if (confirmSwitch) {
      // For switching from guest to auth, we'll need to implement this
      // For now, just logout
      logoutMutation.mutate()
    }
  }

  return (
    <div className="text-center mb-8 relative">
      <div className="absolute top-0 left-0 flex gap-2">
        <button
          onClick={openTutorial}
          className="p-2 hover:bg-purple-100 rounded-full transition-colors group"
          title="עזרה וטיפים"
        >
          <HelpCircle className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
        </button>
        
        <button
          onClick={toggleSound}
          className="p-2 hover:bg-purple-100 rounded-full transition-colors group"
          title={soundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>

        {!isStatisticsPage && (
          <button
            onClick={openReceiptScanner}
            className="p-2 hover:bg-green-100 rounded-full transition-colors group"
            title="סרוק קבלה"
          >
            <Receipt className="w-6 h-6 text-green-600 group-hover:text-green-700" />
          </button>
        )}
      </div>

      {/* Statistics Link and User Menu - positioned on the right */}
      <div className="absolute top-0 right-0 flex gap-2">
        {isAuthenticated && (
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              {isGuest ? 'אורח' : user?.email}
            </span>
            {isGuest && (
              <button
                onClick={handleSwitchToAuth}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
                title="התחבר עם חשבון"
              >
                התחבר
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
              title={isGuest ? 'צא ממצב אורח' : 'התנתק'}
            >
              <LogOut className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
        
        {!isStatisticsPage ? (
          <Link 
            href="/statistics"
            className="p-2 hover:bg-blue-100 rounded-full transition-colors group"
            title="סטטיסטיקות מתקדמות"
          >
            <BarChart3 className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
          </Link>
        ) : (
          <Link 
            href="/"
            className="p-2 hover:bg-green-100 rounded-full transition-colors group"
            title="חזרה לדף הבית"
          >
            <ShoppingCart className="w-6 h-6 text-green-600 group-hover:text-green-700" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 shadow-lg">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            רשימת קניות חכמה
          </h1>
          <p className="text-gray-600 text-sm">נהל את הקניות שלך בקלות ויעילות</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        ניהול קניות חכם ויעיל עם טכנולוגיה מתקדמת
      </div>
    </div>
  )
}