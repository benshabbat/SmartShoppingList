import { useState, useEffect } from 'react'
import { ShoppingCart, Check, Zap } from 'lucide-react'

interface AddToCartButtonProps {
  isInCart: boolean
  onToggle: () => void
  disabled?: boolean
}

export const AddToCartButton = ({ isInCart, onToggle, disabled = false }: AddToCartButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleClick = () => {
    if (disabled) return
    
    setIsAnimating(true)
    onToggle()
    
    if (!isInCart) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1000)
    }
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative overflow-hidden transition-all duration-300 transform
          ${isInCart 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-blue-500 shadow-lg scale-105' 
            : 'bg-white border-2 border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50'
          }
          ${isAnimating ? 'scale-110' : 'hover:scale-105'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          px-4 py-2 rounded-xl font-medium flex items-center gap-2 min-w-[120px] justify-center
        `}
      >
        {/* Background pulse effect */}
        {isAnimating && (
          <div className="absolute inset-0 bg-blue-400 opacity-30 animate-ping rounded-xl" />
        )}
        
        {/* Icon */}
        <div className={`transition-transform duration-300 ${isAnimating ? 'rotate-12' : ''}`}>
          {isInCart ? (
            <ShoppingCart className="w-5 h-5" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
        </div>
        
        {/* Text */}
        <span className="relative z-10">
          {isInCart ? 'בסל' : 'הוסף לסל'}
        </span>
        
        {/* Success indicator */}
        {showSuccess && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            <Check className="w-3 h-3" />
          </div>
        )}
      </button>
      
      {/* Sparkle effects */}
      {showSuccess && (
        <div className="absolute inset-0 pointer-events-none">
          <Zap className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-pulse" />
          <Zap className="absolute -bottom-2 -left-2 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
    </div>
  )
}
