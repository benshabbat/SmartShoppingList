import { ShoppingCart, HelpCircle, Volume2, VolumeX } from 'lucide-react'
import { useSoundManager } from '../utils/soundManager'

interface HeaderProps {
  onOpenTutorial?: () => void
}

export const Header = ({ onOpenTutorial }: HeaderProps) => {
  const { soundEnabled, toggleSound } = useSoundManager()

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
