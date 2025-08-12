# 🏗️ State Management Architecture

## 📁 Structure Overview

```
app/stores/
├── index.ts              # Main exports with combined hooks
├── exports.ts            # Clean exports for easy importing
├── core/
│   └── authStore.ts      # Authentication state management
├── ui/
│   └── uiStore.ts        # UI state (modals, toasts, theme, etc.)
└── data/
    ├── shoppingDataStore.ts   # Shopping items and operations
    └── analyticsStore.ts      # Analytics and smart suggestions

app/contexts/
└── GlobalAppContext.tsx  # Unified context provider

app/providers/
├── QueryProvider.tsx     # React Query provider (kept)
└── [OLD FILES]          # Will be removed gradually
```

## 🔄 Migration Strategy

### ✅ What's New

1. **Unified Store Architecture**
   - `authStore.ts` - Authentication
   - `uiStore.ts` - All UI state (replaces old uiStore + uiStateStore)
   - `shoppingDataStore.ts` - Combined shopping data (replaces shoppingListStore + shoppingItemsStore)
   - `analyticsStore.ts` - Analytics and suggestions

2. **Global Context**
   - `GlobalAppContext.tsx` - Single context for the entire app
   - No more props drilling
   - Sound effects integrated
   - Automatic data loading and analytics refresh

3. **Smart Hooks**
   - `useGlobalApp()` - Access everything
   - `useAppData()` - Just data
   - `useAppActions()` - Just actions
   - `useAppUI()` - Just UI state
   - `useAppAuth()` - Just auth

### 🔄 How to Use

#### For New Components:
```tsx
import { useGlobalApp } from '@/app/contexts/GlobalAppContext'

function MyComponent() {
  const {
    items,
    addItem,
    showSuccess,
    isLoading
  } = useGlobalApp()
  
  // Use directly - no props needed!
}
```

#### For Performance-Critical Components:
```tsx
import { useAppData, useAppActions } from '@/app/contexts/GlobalAppContext'

function MyComponent() {
  const { items, isLoading } = useAppData()     // Only re-renders when data changes
  const { addItem } = useAppActions()           // Actions never change
}
```

#### For Direct Store Access:
```tsx
import { useShoppingDataStore, useUIStore } from '@/app/stores'

function MyComponent() {
  const items = useShoppingDataStore(state => state.items)
  const showSuccess = useUIStore(state => state.showSuccess)
}
```

### 📦 Combined Hooks Benefits

The new `index.ts` provides powerful combined hooks:

```tsx
// Get everything shopping-related in one hook
const shopping = useShoppingData()
// Contains: items, analytics, suggestions, loading states, and all actions

// Get everything UI-related in one hook  
const ui = useUI()
// Contains: theme, toasts, modals, loading states, and all UI actions

// Get auth with computed values
const auth = useAppAuth()
// Contains: user, isAuthenticated, isGuestMode, and all auth actions
```

### 🎵 Sound Integration

Sound effects are now built into the context:

```tsx
const { addItem, playAddToCart } = useGlobalApp()

// Sound plays automatically when using context actions
await addItem("Milk", "Dairy") // ✨ Sound plays automatically

// Or play manually
playAddToCart()
```

### 🔄 Migration Path

1. **Phase 1** ✅ - New stores created
2. **Phase 2** 🟡 - Update Layout to use new context
3. **Phase 3** 🔄 - Gradually update components
4. **Phase 4** ⏳ - Remove old stores and contexts

### 📋 Component Update Checklist

When updating a component:

- [ ] Remove old imports (`useShoppingListContext`, `useUIStore`, etc.)
- [ ] Add `import { useGlobalApp } from '@/app/contexts/GlobalAppContext'`
- [ ] Remove props drilling (delete props that are now available via context)
- [ ] Update parent components to stop passing props
- [ ] Test that everything works
- [ ] Remove unused old hooks/providers

### 🗑️ Files to Remove Later

After migration is complete:

```
app/contexts/GlobalShoppingContext.tsx     ❌
app/providers/ShoppingListProvider.tsx     ❌  
app/providers/ShoppingListDisplayProvider.tsx ❌
app/stores/uiStateStore.ts                 ❌
app/stores/shoppingListStore.ts            ❌
app/stores/shoppingItemsStore.ts           ❌
app/stores/authStore.ts (old)              ❌
app/stores/uiStore.ts (old)                ❌
app/stores/analyticsStore.ts (old)         ❌
```

### 🎯 Key Benefits

1. **No Props Drilling** - Access any data from any component
2. **Better Performance** - Selective subscriptions with zustand
3. **Type Safety** - Full TypeScript support
4. **Sound Integration** - Built-in sound effects
5. **Auto Analytics** - Automatic refresh when data changes
6. **Cleaner Code** - Less boilerplate, more functionality
7. **Better Organization** - Clear separation of concerns

### 🚀 Quick Start

1. **For the main app page:**
```tsx
import { useGlobalApp } from '@/app/contexts/GlobalAppContext'

export default function ShoppingApp() {
  const { 
    items, 
    addItem, 
    showSuccess,
    isLoading,
    hasItemsInCart 
  } = useGlobalApp()
  
  // Everything you need, no props!
}
```

2. **For smaller components:**
```tsx
import { useAppData } from '@/app/contexts/GlobalAppContext'

export function ItemsList() {
  const { items, isLoading } = useAppData()
  
  // Only data, optimized for performance
}
```

3. **For action-heavy components:**
```tsx
import { useAppActions } from '@/app/contexts/GlobalAppContext'

export function AddItemForm() {
  const { addItem, showSuccess } = useAppActions()
  
  // Only actions, never re-renders
}
```

---

This new architecture eliminates the chaos of multiple stores and contexts while providing a clean, performant, and maintainable solution! 🎉
