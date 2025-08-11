import { useState, useEffect, useCallback } from 'react'

export interface UseKeyboardNavigationOptions {
  itemCount: number
  isOpen: boolean
  onSelect: (index: number) => void
  onClose: () => void
}

export const useKeyboardNavigation = ({
  itemCount,
  isOpen,
  onSelect,
  onClose
}: UseKeyboardNavigationOptions) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < itemCount - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : itemCount - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          onSelect(selectedIndex)
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }, [isOpen, itemCount, selectedIndex, onSelect, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(-1)
    }
  }, [isOpen])

  return {
    selectedIndex,
    setSelectedIndex
  }
}
