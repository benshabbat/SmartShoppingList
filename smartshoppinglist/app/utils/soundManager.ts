// Sound effects utility with user control
class SoundManager {
  private enabled: boolean = true
  private context: AudioContext | null = null

  constructor() {
    // Load sound preference from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('soundEnabled') !== 'false'
    }
    
    // Initialize audio context on user interaction
    this.initAudioContext()
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      try {
        this.context = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      } catch {
        logger.info('Audio not supported')
      }
    }
  }

  private playTone(frequency: number, duration: number = 200, volume: number = 0.1) {
    if (!this.enabled || !this.context) return

    try {
      const oscillator = this.context.createOscillator()
      const gainNode = this.context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.context.destination)

      oscillator.frequency.setValueAtTime(frequency, this.context.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, this.context.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + duration / 1000)

      oscillator.start(this.context.currentTime)
      oscillator.stop(this.context.currentTime + duration / 1000)
    } catch {
      // Silently fail if audio isn't available
    }
  }

  addToCart() {
    this.playTone(800, 150, 0.05) // High pitch, short duration
  }

  removeFromCart() {
    this.playTone(400, 200, 0.05) // Lower pitch
  }

  purchase() {
    // Success chord
    this.playTone(523, 100, 0.05) // C
    setTimeout(() => this.playTone(659, 100, 0.05), 100) // E
    setTimeout(() => this.playTone(784, 150, 0.05), 200) // G
  }

  delete() {
    this.playTone(200, 300, 0.03) // Low pitch for negative action
  }

  notification() {
    this.playTone(1000, 100, 0.04)
    setTimeout(() => this.playTone(1200, 100, 0.04), 150)
  }

  toggle() {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEnabled', this.enabled.toString())
    }
    
    if (this.enabled) {
      this.notification() // Play test sound when enabling
    }
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundManager = new SoundManager()

// React hook for sound controls
import { useState, useEffect } from 'react'
import { logger } from './helpers'

export const useSoundManager = () => {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled())

  const toggleSound = () => {
    soundManager.toggle()
    setSoundEnabled(soundManager.isEnabled())
  }

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled())
  }, [])

  return {
    soundEnabled,
    toggleSound,
    playAddToCart: () => soundManager.addToCart(),
    playRemoveFromCart: () => soundManager.removeFromCart(),
    playPurchase: () => soundManager.purchase(),
    playDelete: () => soundManager.delete(),
    playNotification: () => soundManager.notification()
  }
}
