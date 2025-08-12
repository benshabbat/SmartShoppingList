// Zero Props Drilling Architecture - Everything via Global Context
'use client'

import { QueryProvider } from './providers'
import { GlobalShoppingProvider } from './contexts/GlobalShoppingContext'
import { MainAppContent } from './components/MainAppContent'

export default function ShoppingListApp() {
  return (
    <QueryProvider>
      <GlobalShoppingProvider>
        <MainAppContent />
      </GlobalShoppingProvider>
    </QueryProvider>
  )
}
