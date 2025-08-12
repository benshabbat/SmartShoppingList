import { ShoppingCart, HelpCircle, Volume2, VolumeX, BarChart3, Receipt, LogOut, User } from 'lucide-react'
import { useSoundManager } from '../utils/soundManager'
import { useAuth } from '../hooks/useAuth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  onOpenTutorial?: () => void
  onOpenReceiptScanner?: () => void
}

export const Header = ({ onOpenTutorial, onOpenReceiptScanner }: HeaderProps) => {
  const { soundEnabled, toggleSound } = useSoundManager()
  const { user, signOut, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isStatisticsPage = pathname === '/statistics'

  return (
    <div className="text-center mb-8 relative">
      <div className="absolute top-0 left-0 flex gap-2">
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className="p-2 hover:bg-purple-100 rounded-full transition-colors group"
            title="עזרה וטיפים"
          >
            <HelpCircle className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
          </button>
        )}
        
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

        {onOpenReceiptScanner && !isStatisticsPage && (
          <button
            onClick={onOpenReceiptScanner}
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
            <span className="text-sm text-gray-700">{user?.email}</span>
            <button
              onClick={signOut}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
              title="התנתק"
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
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg animate-bounce-gentle">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          רשימת קניות חכמה
        </h1>
      </div>
      <p className="text-gray-600 text-lg">הוסף לסל ◀ קנה ◀ תוקף</p>
      <div className="mt-4 flex justify-center">
        <div className="bg-white rounded-full px-4 py-2 shadow-md border hover:shadow-lg transition-shadow">
          <span className="text-sm text-gray-500">מותאם אישית עבורך</span>
        </div>
      </div>
    </div>
  )
}
