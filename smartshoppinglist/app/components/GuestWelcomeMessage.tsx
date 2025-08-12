'use client'

interface GuestWelcomeMessageProps {
  isGuest: boolean
}

export function GuestWelcomeMessage({ isGuest }: GuestWelcomeMessageProps) {
  if (!isGuest || typeof window === 'undefined' || localStorage.getItem('guest_explanation_seen')) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 border border-indigo-200">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 rounded-full p-2 mt-1">
          <span className="text-indigo-600">ℹ️</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-indigo-900 mb-2">
            🎉 ברוך הבא למצב אורח!
          </h3>
          <p className="text-sm text-indigo-700 mb-3 leading-relaxed">
            אתה כעת במצב אורח - כל הנתונים שלך נשמרים באופן מקומי במכשיר זה ולא נשלחים לשום שרת. 
            זה אומר פרטיות מלאה, אבל גם שהנתונים זמינים רק במכשיר הזה.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('guest_explanation_seen', 'true')
                  location.reload()
                }
              }}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors"
            >
              הבנתי
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
