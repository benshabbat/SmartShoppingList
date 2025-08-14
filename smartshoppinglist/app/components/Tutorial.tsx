'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react'
import { FadeIn } from './Animations'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { gradientStyles } from '../utils/classNames'
import { TutorialStep } from '../types'

const tutorialSteps: TutorialStep[] = [
  {
    title: 'ברוכים הבאים!',
    description: 'זו רשימת הקניות החכמה שלך. בואו נלמד איך להשתמש בה',
  },
  {
    title: 'הוספת מוצרים',
    description: 'השתמש בשדה הטקסט כדי להוסיף מוצרים חדשים. הטקסט יציע לך השלמות חכמות!',
  },
  {
    title: 'הוספה מהירה',
    description: 'הכפתורים הסגולים מציגים את המוצרים הפופולריים שלך לגישה מהירה',
  },
  {
    title: 'קטגוריות',
    description: 'המוצרים מסודרים לפי קטגוריות כדי לעזור לך בקניות',
  },
  {
    title: 'סטטיסטיקות',
    description: 'עקוב אחר הרגלי הקנייה שלך ותקבל תובנות מעניינות',
  }
]

export const Tutorial = () => {
  // Get tutorial state from global context - NO PROPS DRILLING!
  const { showTutorial, closeTutorial } = useGlobalShopping()
  
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      closeTutorial()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipTutorial = () => {
    closeTutorial()
  }

  if (!showTutorial) return null

  const currentTutorialStep = tutorialSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <FadeIn>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          <button
            onClick={closeTutorial}
            className="absolute top-4 left-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-6">
            <div className={`w-16 h-16 ${gradientStyles.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {currentTutorialStep.title}
            </h2>
            <p className="text-gray-600 text-right leading-relaxed">
              {currentTutorialStep.description}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={skipTutorial}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              דלג
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span>הקודם</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={nextStep}
                className={`flex items-center gap-1 px-4 py-2 ${gradientStyles.accent} text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all`}
              >
                {currentStep < tutorialSteps.length - 1 && (
                  <ChevronLeft className="w-4 h-4" />
                )}
                <span>{currentStep === tutorialSteps.length - 1 ? 'סיום' : 'הבא'}</span>
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // בדוק אם המשתמש כבר ראה את הטוטוריאל
    if (typeof window !== 'undefined') {
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
      if (!hasSeenTutorial) {
        setShowTutorial(true)
      }
    }
  }, [])

  const closeTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenTutorial', 'true')
    }
  }

  const openTutorial = () => {
    setShowTutorial(true)
  }

  return {
    showTutorial,
    closeTutorial,
    openTutorial
  }
}
