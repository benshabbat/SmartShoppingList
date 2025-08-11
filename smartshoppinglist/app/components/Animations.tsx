export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-purple-200 border-t-purple-600`} />
  )
}

export const FadeIn = ({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode
  delay?: number
  className?: string 
}) => {
  return (
    <div 
      className={`animate-fadeIn ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  )
}

export const SlideUp = ({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode
  delay?: number
  className?: string 
}) => {
  return (
    <div 
      className={`animate-slideUp ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  )
}

export const Pulse = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  )
}
