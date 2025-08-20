import { useState } from 'react'
import { CATEGORY_EMOJIS } from '../../constants'
import { InteractiveEmojiProps, CategoryDisplayProps } from '../../types'

export const InteractiveEmoji = ({ 
  category, 
  size = 'md', 
  interactive = true 
}: InteractiveEmojiProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const emoji = CATEGORY_EMOJIS[category as keyof typeof CATEGORY_EMOJIS] || '📦'
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  const handleClick = () => {
    if (!interactive) return
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
  }

  return (
    <span
      className={`
        ${sizeClasses[size]}
        ${interactive ? 'cursor-pointer select-none' : ''}
        inline-block transition-all duration-300
        ${isHovered && interactive ? 'transform scale-125 drop-shadow-lg' : ''}
        ${isClicked ? 'transform scale-150 rotate-12' : ''}
        ${interactive ? 'hover:brightness-110' : ''}
      `}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={handleClick}
      title={category}
    >
      {emoji}
    </span>
  )
}

// Component for category headers with enhanced emojis
export const CategoryHeader = ({ 
  category, 
  count, 
  headerColor = "bg-gray-100 text-gray-700" 
}: CategoryDisplayProps) => {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${headerColor} hover:shadow-md transition-all duration-200 group`}>
      <div className="relative">
        <InteractiveEmoji category={category} size="lg" />
        {/* Floating count indicator */}
        <div className="absolute -top-1 -right-1 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-gray-700 shadow-md group-hover:scale-110 transition-transform">
          {count}
        </div>
      </div>
      <h4 className="font-semibold text-right flex-1 text-lg group-hover:text-gray-900 transition-colors">
        {category}
      </h4>
    </div>
  )
}
