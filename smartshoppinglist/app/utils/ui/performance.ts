/**
 * Performance Monitoring Utilities
 * Provides tools for monitoring React component performance and render cycles
 */

import React, { useEffect, useRef, useState } from 'react'

// Type definitions for browser APIs
interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string
  }
}

// Hook to measure component render time
export const useRenderTimer = (componentName: string, enabled = process.env.NODE_ENV === 'development') => {
  const renderStart = useRef<number>(0)
  const renderCount = useRef<number>(0)
  
  if (enabled) {
    renderStart.current = performance.now()
  }

  useEffect(() => {
    if (enabled) {
      const renderTime = performance.now() - renderStart.current
      renderCount.current += 1
      
      if (renderTime > 16) { // Flag renders taking more than one frame (16ms)
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`)
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms (render #${renderCount.current})`)
      }
    }
  })
}

// Hook to detect unnecessary re-renders
export const useWhyDidYouUpdate = (name: string, props: Record<string, unknown>) => {
  const previousProps = useRef<Record<string, unknown> | undefined>(undefined)

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: unknown; to: unknown }> = {}

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          }
        }
      })

      if (Object.keys(changedProps).length) {
        console.log('🔄 [why-did-you-update]', name, changedProps)
      }
    }

    previousProps.current = props
  })
}

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
    slowRenders: 0
  })

  const startTime = useRef<number>(0)
  const renderTimes = useRef<number[]>([])

  const startRender = () => {
    startTime.current = performance.now()
  }

  const endRender = () => {
    const renderTime = performance.now() - startTime.current
    renderTimes.current.push(renderTime)

    // Keep only last 10 render times
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift()
    }

    const avgTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length

    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      avgRenderTime: avgTime,
      slowRenders: prev.slowRenders + (renderTime > 16 ? 1 : 0)
    }))
  }

  useEffect(() => {
    startRender()
    return () => endRender()
  })

  return metrics
}

// Memory usage monitoring
export const useMemoryMonitor = (intervalMs = 5000) => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number
    totalJSHeapSize?: number
    jsHeapSizeLimit?: number
  }>({})

  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return
    }

    const updateMemoryInfo = () => {
      const memory = (performance as PerformanceWithMemory).memory
      if (memory) {
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])

  return memoryInfo
}

// Component render profiler
export const withPerformanceProfile = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    useRenderTimer(componentName || Component.displayName || Component.name || 'Unknown')
    return React.createElement(Component, props)
  }

  WrappedComponent.displayName = `withPerformanceProfile(${componentName || Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Bundle size analyzer helper
export const logBundleSize = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.group('📦 Bundle Analysis')
    console.log('User Agent:', navigator.userAgent)
    console.log('Screen Resolution:', `${screen.width}x${screen.height}`)
    console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`)
    console.log('Connection:', (navigator as NavigatorWithConnection).connection?.effectiveType || 'unknown')
    console.groupEnd()
  }
}