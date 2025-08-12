# State Management Architecture with TanStack Query + Zustand

This document outlines the complete state management setup for the Smart Shopping List application using TanStack Query and Zustand with Supabase integration.

## 📁 Architecture Overview

```
app/
├── providers/
│   └── QueryProvider.tsx          # TanStack Query configuration
├── stores/
│   ├── index.ts                   # Store exports
│   ├── authStore.ts              # Authentication state
│   ├── shoppingListStore.ts      # Shopping list state  
│   └── uiStore.ts                # UI state (toasts, modals, etc.)
├── hooks/
│   ├── useAuthQueries.ts         # Auth-related queries/mutations
│   ├── useShoppingItems.ts       # Shopping items queries/mutations
│   └── index.ts                  # Hook exports
└── types/
    └── index.ts                  # TypeScript types
```

## 🏪 Stores (Zustand)

### 1. Auth Store (`authStore.ts`)
Manages user authentication state with persistence.

**State:**
```typescript
interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
}
```

**Actions:**
- `setUser(user)` - Set current user
- `setLoading(loading)` - Set loading state
- `logout()` - Clear user data
- `switchToGuestMode()` - Switch to guest mode

**Features:**
- ✅ Persisted to localStorage
- ✅ Guest mode support
- ✅ Loading states
- ✅ TypeScript support

### 2. Shopping List Store (`shoppingListStore.ts`)
Manages shopping list items and filtering state.

**State:**
```typescript
interface ShoppingListState {
  items: ShoppingItem[]
  selectedListId: string | null
  isLoading: boolean
  error: string | null
  filters: {
    category: string | null
    showPurchased: boolean
    sortBy: 'name' | 'category' | 'addedAt' | 'expiryDate'
    sortOrder: 'asc' | 'desc'
  }
  searchQuery: string
}
```

**Actions:**
- `setItems(items)` - Set shopping items
- `addItem(item)` - Add new item
- `updateItem(id, updates)` - Update existing item
- `removeItem(id)` - Remove item
- `toggleItemInCart(id)` - Toggle in cart status
- `setFilter(key, value)` - Set filter option
- `markAllAsPurchased()` - Bulk purchase action
- `clearPurchasedItems()` - Remove purchased items

**Features:**
- ✅ Optimistic updates
- ✅ Advanced filtering
- ✅ Bulk operations
- ✅ Selector hooks for performance

### 3. UI Store (`uiStore.ts`)
Manages global UI state and user preferences.

**State:**
```typescript
interface UIState {
  theme: 'light' | 'dark' | 'system'
  toasts: Toast[]
  activeModal: Modal | null
  globalLoading: boolean
  showTutorial: boolean
  completedTutorialSteps: string[]
  sidebarOpen: boolean
  quickAddSuggestions: string[]
  soundEnabled: boolean
  showGuestModeNotification: boolean
}
```

**Actions:**
- `addToast(toast)` - Show notification
- `openModal(modal)` - Open modal
- `setTheme(theme)` - Change theme
- `toggleSound()` - Toggle sound preferences

## 🔄 Query Hooks (TanStack Query)

### 1. Auth Queries (`useAuthQueries.ts`)

**Queries:**
```typescript
// Get current session
const { data: session } = useSession()

// Get current user
const { data: user } = useCurrentUser()
```

**Mutations:**
```typescript
// Login
const loginMutation = useLogin()
await loginMutation.mutateAsync({ email, password })

// Sign up
const signUpMutation = useSignUp()
await signUpMutation.mutateAsync({ email, password })

// Logout
const logoutMutation = useLogout()
await logoutMutation.mutateAsync()

// Guest mode
const guestMutation = useGuestMode()
await guestMutation.mutateAsync()
```

### 2. Shopping Items Queries (`useShoppingItems.ts`)

**Queries:**
```typescript
// Get all items
const { data: items, isLoading } = useShoppingItems()

// Get items for specific list
const { data: items } = useShoppingItems(listId)

// Get single item
const { data: item } = useShoppingItem(itemId)
```

**Mutations:**
```typescript
// Add item
const addMutation = useAddShoppingItem()
await addMutation.mutateAsync({
  name: 'Milk',
  category: 'Dairy',
  isInCart: false,
  isPurchased: false
})

// Update item
const updateMutation = useUpdateShoppingItem()
await updateMutation.mutateAsync({
  id: 'item-id',
  updates: { isPurchased: true }
})

// Delete item
const deleteMutation = useDeleteShoppingItem()
await deleteMutation.mutateAsync('item-id')
```

## 🎯 Usage Examples

### Basic Component with Stores
```typescript
import { useShoppingListStore, useUIStore } from '@/app/stores'

function ShoppingList() {
  // Using store selectors for optimal re-renders
  const items = useShoppingListStore(state => state.items)
  const addItem = useShoppingListStore(state => state.addItem)
  const addToast = useUIStore(state => state.addToast)

  const handleAddItem = (itemData) => {
    addItem(itemData)
    addToast({
      message: 'Item added successfully!',
      type: 'success'
    })
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Using Query Hooks with Supabase
```typescript
import { useShoppingItems, useAddShoppingItem } from '@/app/hooks'

function ShoppingListWithQuery() {
  // Automatically syncs with Supabase
  const { data: items, isLoading, error } = useShoppingItems()
  const addItemMutation = useAddShoppingItem()

  const handleAddItem = async (itemData) => {
    try {
      await addItemMutation.mutateAsync(itemData)
      // TanStack Query automatically refetches and updates the UI
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {items?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Advanced Filtering with Selectors
```typescript
import { useShoppingListStore } from '@/app/stores'

function FilteredShoppingList() {
  // Using selectors to subscribe only to relevant state changes
  const {
    filteredItems,
    searchQuery,
    filters
  } = useShoppingListStore(state => ({
    filteredItems: state.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      const matchesCategory = !state.filters.category || item.category === state.filters.category
      const matchesPurchased = state.filters.showPurchased || !item.isPurchased
      
      return matchesSearch && matchesCategory && matchesPurchased
    }),
    searchQuery: state.searchQuery,
    filters: state.filters
  }))

  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search items..."
      />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## 🔧 Configuration Features

### TanStack Query Setup
- ✅ Custom retry logic for 4xx errors
- ✅ Intelligent caching (1min stale, 5min cache)
- ✅ Development tools integration
- ✅ Optimistic updates
- ✅ Background refetching disabled by default

### Zustand Setup
- ✅ Redux DevTools integration
- ✅ Persistence with localStorage
- ✅ Immer integration for immutable updates
- ✅ Partitioned persistence (only important data)

### Guest Mode Support
- ✅ Automatic fallback to local storage
- ✅ Seamless transition between guest/auth modes
- ✅ Data preservation during mode switches

## 🚀 Benefits

1. **Performance**: Minimal re-renders with selector hooks
2. **Developer Experience**: Redux DevTools + React Query DevTools
3. **Type Safety**: Full TypeScript support throughout
4. **Caching**: Intelligent data caching and synchronization
5. **Offline Support**: Local storage fallback for guest mode
6. **Error Handling**: Centralized error management with toasts
7. **Optimistic Updates**: Immediate UI feedback with server sync

## 📝 Best Practices

1. **Use Selectors**: Always use selector functions to prevent unnecessary re-renders
2. **Separate Concerns**: Use Zustand for client state, TanStack Query for server state
3. **Error Boundaries**: Implement error boundaries for query errors
4. **Optimistic Updates**: Use mutations with optimistic updates for better UX
5. **Invalidation**: Properly invalidate queries after mutations
6. **Keys**: Use consistent and hierarchical query keys

This architecture provides a robust, scalable, and performant state management solution that works seamlessly with Supabase and supports both authenticated and guest users.
