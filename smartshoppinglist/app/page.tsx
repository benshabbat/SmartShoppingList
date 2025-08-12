// Enhanced main page with improved state management and separation of concerns
'use client'

import { QueryProvider, ShoppingListProvider } from './providers'
import { MainAppContent } from './components/MainAppContent'

export default function ShoppingListApp() {
  return (
    <QueryProvider>
      <ShoppingListProvider>
        <MainAppContent />
      </ShoppingListProvider>
    </QueryProvider>
  )
}
