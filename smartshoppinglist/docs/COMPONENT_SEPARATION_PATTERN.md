# Component Separation Pattern Guide

This guide outlines the pattern for separating components into logic and UI following Clean Code and SOLID principles.

## 📁 Folder Structure

Each component should be organized in its own folder:

```
ComponentName/
├── index.tsx                    # Container component (exports the main component)
├── useComponentNameLogic.ts     # Custom hook with business logic
└── ComponentNameUI.tsx          # Pure UI component
```

## 🔧 Pattern Implementation

### 1. Custom Hook (Logic) - `useComponentNameLogic.ts`

**Purpose**: Contains all business logic, state management, and side effects.

**What it includes**:
- State management (`useState`, `useEffect`, etc.)
- API calls and mutations
- Event handlers
- Computed values
- Form validation
- Data transformations

**What it returns**:
- State values
- Event handlers  
- Computed values
- Loading states
- Error states

**Example Structure**:
```typescript
interface UseComponentLogicProps {
  // Input props
}

export const useComponentLogic = ({ ...props }: UseComponentLogicProps) => {
  // State management
  const [state, setState] = useState()
  
  // Event handlers
  const handleSomething = () => {
    // Business logic here
  }
  
  // Computed values
  const computedValue = useMemo(() => {
    // Calculations here
  }, [dependencies])
  
  return {
    // State
    state,
    
    // Event handlers
    handleSomething,
    
    // Computed values
    computedValue,
  }
}
```

### 2. UI Component - `ComponentNameUI.tsx`

**Purpose**: Pure presentation component with no business logic.

**What it includes**:
- JSX rendering
- CSS classes and styling
- Event binding (calling props)
- Conditional rendering based on props

**What it doesn't include**:
- State management
- API calls
- Business logic
- Direct mutations

**Props Interface**:
```typescript
interface ComponentUIProps {
  // Data props
  data: SomeType
  
  // State props
  isLoading: boolean
  error: string | null
  
  // Event handler props
  onSomething: () => void
  onChange: (value: string) => void
  
  // Computed props
  computedValue: string
}
```

### 3. Container Component - `index.tsx`

**Purpose**: Connects logic hook with UI component.

**What it includes**:
- Importing logic hook and UI component
- Passing props between them
- Main component export

**Pattern**:
```typescript
import { useComponentLogic } from './useComponentLogic'
import { ComponentUI } from './ComponentUI'

interface ComponentProps {
  // Public API props
}

export const Component = ({ ...props }: ComponentProps) => {
  const logic = useComponentLogic(props)

  return (
    <ComponentUI
      // Map logic return values to UI props
      {...logic}
      // Pass through any additional props needed by UI
    />
  )
}
```

## ✅ Benefits of This Pattern

### 1. **Single Responsibility Principle (SRP)**
- Logic hook: Handles business logic only
- UI component: Handles presentation only
- Container: Handles composition only

### 2. **Testability**
- Logic can be tested independently with custom hook testing
- UI can be tested with simple prop-based tests
- Clear separation makes mocking easier

### 3. **Reusability**
- Logic hook can be reused in different UI contexts
- UI component can be used with different logic implementations
- Easier to create variations

### 4. **Maintainability**
- Business logic changes don't affect UI
- UI changes don't affect business logic
- Clear boundaries between concerns

### 5. **Type Safety**
- Clear interfaces between layers
- Better TypeScript inference
- Compile-time error catching

## 🎯 When to Apply This Pattern

**Apply when component has**:
- Complex state management
- API interactions
- Multiple event handlers
- Form validation
- Computed values
- Business logic

**Don't apply for**:
- Simple presentational components
- Components with minimal logic
- Basic UI elements (buttons, inputs)

## 📝 Naming Conventions

- **Logic Hook**: `useComponentNameLogic`
- **UI Component**: `ComponentNameUI`
- **Container**: `ComponentName` (exported from index.tsx)
- **Props Interfaces**: 
  - `UseComponentNameLogicProps`
  - `ComponentNameUIProps`
  - `ComponentNameProps`

## 🔄 Migration Strategy

When refactoring existing components:

1. **Create the folder structure**
2. **Extract logic** to custom hook
3. **Create pure UI component**
4. **Create container component**
5. **Update imports** in other files
6. **Remove old component file**

## 💡 Examples in Codebase

✅ **Already Implemented**:
- `AddItemForm/`
- `ShoppingItemComponent/`  
- `LoginForm/`
- `ExpiryDateModal/`

🔄 **Next Candidates**:
- `AutoComplete`
- `CategorySelector`
- `DataImportModal`
- `ReceiptScanner`

This pattern ensures our components follow Clean Code principles and remain maintainable as the application grows.
