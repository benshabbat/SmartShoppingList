# 🚀 Zero Props Drilling Architecture

האפליקציה מיישמת ארכיטקטורה של **Zero Props Drilling** כדי לשמור על קוד נקי וגמיש.

## 🎯 מטרות הארכיטקטורה

- **מניעת העברת פונקציות בין קומפוננטים** - כל הפעולות זמינות דרך הקונטקסט הגלובלי
- **קוד נקי וקריא** - קומפוננטים מקבלים רק data props
- **גמישות מירבית** - שינויים בלוגיקה לא דורשים עדכון של כל הקומפוננטים
- **ביצועים טובים** - מניעת re-renders מיותרים

## 🏗️ מבנה הקונטקסט

### קונטקסט ראשי
```tsx
// GlobalShoppingContext.tsx
export const useGlobalShopping = () => {
  // מחזיר את כל הנתונים והפעולות
}
```

### Hooks מתמחים
```tsx
// קומפוננטים יכולים לבחור מה הם צריכים
export const useShoppingData = () => { /* נתונים בלבד */ }
export const useShoppingActions = () => { /* פעולות בלבד */ }
export const useShoppingUI = () => { /* מצב UI בלבד */ }
export const useShoppingComputed = () => { /* ערכים מחושבים */ }
```

## ✅ דוגמאות לקומפוננטים נקיים

### ShoppingItemComponent
```tsx
export const ShoppingItemComponent = ({ 
  item, 
  variant = 'pending' 
}: ShoppingItemComponentProps) => {
  return (
    <ShoppingItemUI
      item={item}
      variant={variant}
    />
  )
}
```

### ShoppingItemUI
```tsx
export const ShoppingItemUI = ({ item, variant }: ShoppingItemUIProps) => {
  // קבלת הכל מהקונטקסט - ללא props drilling!
  const {
    textStyle,
    showExpiryDate,
    handleToggleCart,
    handleRemove
  } = useShoppingItemLogic({ item, variant })

  return (
    <div>
      <ItemActions
        variant={variant}
        onToggleCart={handleToggleCart}
        onRemove={handleRemove}
      />
      {/* שאר התוכן */}
    </div>
  )
}
```

### SmartSuggestions
```tsx
export const SmartSuggestions = () => {
  // קבלת הכל מהקונטקסט - ללא props!
  const { suggestions, addItem, showSuccess, showError } = useGlobalShopping()
  
  const handleAddSuggestion = async (name: string) => {
    await addItem(name, 'כלל')
    showSuccess(`נוסף בהצלחה: ${name}`)
  }

  return (
    // UI logic
  )
}
```

## 🔧 תבנית לקומפוננטים חדשים

כשיוצרים קומפוננט חדש, עקבו אחר התבנית הזו:

```tsx
// ❌ אל תעשו כך - Props Drilling
export const MyComponent = ({ 
  data, 
  onUpdate, 
  onDelete, 
  onToggle 
}: Props) => {
  // העברת פונקציות כ-props
}

// ✅ עשו כך - Zero Props Drilling
export const MyComponent = ({ data }: CleanProps) => {
  // קבלת פעולות מהקונטקסט
  const { updateItem, deleteItem, toggleItem } = useGlobalShopping()
  
  return (
    // UI logic
  )
}
```

## 📋 יתרונות הארכיטקטורה

1. **קוד נקי** - קומפוננטים פשוטים יותר
2. **גמישות** - קל לשנות לוגיקה בלי לפגוע בקומפוננטים
3. **תחזוקה** - פחות באגים הקשורים להעברת props
4. **ביצועים** - פחות re-renders מיותרים
5. **בדיקות** - קל יותר לבדוק קומפוננטים

## 🎨 Best Practices

- **השתמשו ב-hooks מתמחים** במקום להביא את כל הקונטקסט
- **שמו פונקציות ברמה הגלובלית** במקום להעביר אותן כ-props
- **הפרידו בין data ו-actions** לביצועים טובים יותר
- **השתמשו ב-useCallback** לפונקציות שצריכות אופטימיזציה

---

✨ **זכרו**: כל קומפוננט חדש צריך להיות "נקי" מ-props drilling!
