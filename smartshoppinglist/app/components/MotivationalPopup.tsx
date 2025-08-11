import { useState } from 'react'
import { Trophy, Star, Zap, Heart, Target } from 'lucide-react'
import { FadeIn } from './Animations'

const motivationalMessages = [
  {
    icon: Trophy,
    title: "כל הכבוד!",
    message: "סיימת את הקניות בהצלחה! 🎉",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Star,
    title: "מדהים!",
    message: "עוד יום פרודוקטיבי במזווה שלך! ⭐",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Zap,
    title: "יש לך כוח!",
    message: "המזווה שלך מלא ואתה מוכן לשבוע! 💪",
    color: "from-blue-400 to-indigo-500"
  },
  {
    icon: Heart,
    title: "מושלם!",
    message: "אוכל טוב + תכנון חכם = בית מאושר! ❤️",
    color: "from-red-400 to-pink-500"
  },
  {
    icon: Target,
    title: "מטרה הושגה!",
    message: "עוד משימה הושלמה בהצלחה! 🎯",
    color: "from-green-400 to-emerald-500"
  }
]

interface MotivationalPopupProps {
  isOpen: boolean
  onClose: () => void
  itemCount: number
}

export const MotivationalPopup = ({ isOpen, onClose, itemCount }: MotivationalPopupProps) => {
  const [currentMessage] = useState(() => 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  )

  if (!isOpen) return null

  const IconComponent = currentMessage.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <FadeIn>
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 text-6xl">🎉</div>
            <div className="absolute bottom-4 left-4 text-4xl">✨</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-30">🏆</div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className={`w-20 h-20 bg-gradient-to-r ${currentMessage.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-gentle`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {currentMessage.title}
            </h2>

            <p className="text-gray-600 text-lg mb-2">
              {currentMessage.message}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {itemCount}
              </div>
              <div className="text-sm text-gray-600">
                מוצרים נקנו היום
              </div>
            </div>

            <button
              onClick={onClose}
              className={`w-full px-6 py-3 bg-gradient-to-r ${currentMessage.color} text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              המשך לסטטיסטיקות
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

// Hook to manage motivational popup
export const useMotivationalPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  const showMotivation = (count: number) => {
    setItemCount(count)
    setShowPopup(true)
  }

  const hideMotivation = () => {
    setShowPopup(false)
  }

  return {
    showPopup,
    itemCount,
    showMotivation,
    hideMotivation
  }
}
