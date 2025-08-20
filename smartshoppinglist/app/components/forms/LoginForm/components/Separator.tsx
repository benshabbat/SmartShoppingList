import React from 'react'
import { UI_TEXT } from '../constants'
import { SeparatorProps } from '../../../../types'

/**
 * Separator Component
 * Single Responsibility: Visual separator with optional text
 */
export function Separator({ text = UI_TEXT.SEPARATOR, className = '' }: SeparatorProps) {
  return (
    <div className={`relative mb-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-white text-gray-500">{text}</span>
      </div>
    </div>
  )
}
