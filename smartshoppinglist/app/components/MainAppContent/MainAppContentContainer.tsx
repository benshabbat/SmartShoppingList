/**
 * Main App Content Container
 * Zero Props Drilling - UI components get everything from context
 */


import { MainAppUI } from './MainAppUI'

export const MainAppContent = () => {
  // App initialization is now handled in the GlobalShoppingContext
  // No need for useEffect here - context handles everything!
  
  // No props passed to UI - everything from context!
  return <MainAppUI />
}
