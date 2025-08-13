/**
 * Common message constants to avoid repetition throughout the app
 */

export const MESSAGES = {
  SUCCESS: {
    ITEM_ADDED: (itemName: string) => `הפריט "${itemName}" נוסף לרשימה`,
    ITEM_ADDED_TO_CART: (itemName: string) => `הפריט "${itemName}" נוסף ישירות לסל`,
    ITEM_REMOVED: (itemName: string) => `הפריט "${itemName}" הוסר מהרשימה`,
    ITEM_UPDATED: (itemName: string) => `הפריט "${itemName}" עודכן`,
    ADDED_TO_CART: (itemName: string) => `${itemName} נוסף לסל`,
    REMOVED_FROM_CART: (itemName: string) => `${itemName} הוסר מהסל`,
    PURCHASE_COMPLETED: () => 'הקנייה הושלמה בהצלחה!',
    ITEMS_CLEARED: (count: number, type: string) => `${count} פריטים ${type} נמחקו`,
    BULK_ADDED: (count: number) => `נוספו ${count} פריטים לרשימה`,
    BULK_ADDED_TO_CART: (count: number) => `נוספו ${count} פריטים לעגלה`,
    RECEIPT_SCANNED: (count: number, storeName: string) => `נסרקו ${count} פריטים מ-${storeName}`,
    CART_CLEARED: (count: number) => `${count} פריטים הוחזרו לרשימת הקניות`,
  },

  ERROR: {
    ITEM_NAME_REQUIRED: () => 'שם הפריט חובה',
    ITEM_NAME_TOO_SHORT: () => 'שם הפריט חייב להכיל לפחות 2 תווים',
    ITEM_NAME_TOO_LONG: () => 'שם הפריט לא יכול להכיל יותר מ-50 תווים',
    CATEGORY_REQUIRED: () => 'קטגוריה חובה',
    DUPLICATE_ITEM: (itemName: string) => `הפריט "${itemName}" כבר קיים ברשימה`,
    ITEM_NOT_FOUND: () => 'הפריט לא נמצא',
    ADD_ITEM_FAILED: () => 'שגיאה בהוספת הפריט',
    UPDATE_ITEM_FAILED: () => 'שגיאה בעדכון הפריט',
    DELETE_ITEM_FAILED: () => 'שגיאה במחיקת הפריט',
    CLEAR_ITEMS_FAILED: () => 'שגיאה במחיקת הפריטים',
    CLEAR_CART_FAILED: () => 'שגיאה בניקוי הסל',
    PURCHASE_FAILED: () => 'שגיאה בהשלמת הקנייה',
    BULK_ADD_FAILED: () => 'שגיאה ביצירת רשימה מהירה',
    BULK_CART_FAILED: () => 'שגיאה בהוספת פריטים לעגלה',
    NETWORK_ERROR: () => 'בעיית רשת - נסה שוב',
    GENERIC_ERROR: () => 'אירעה שגיאה - נסה שוב',
    NO_ITEMS_IN_CART: () => 'אין פריטים בסל הקניות',
    NO_PURCHASED_ITEMS: () => 'אין פריטים שנקנו למחיקה',
    NO_CART_ITEMS: () => 'אין פריטים בסל הקניות',
  },

  INFO: {
    EMPTY_LIST: () => 'הרשימה ריקה',
    EXPIRY_NOTICE: (count: number) => `יש ${count} פריטים ללא תאריך תפוגה`,
    GUEST_MODE: () => 'אתה במצב אורח - השינויים לא יישמרו',
    LOADING: () => 'טוען...',
    SAVING: () => 'שומר...',
  },

  CONFIRMATION: {
    DELETE_ITEM: (itemName: string) => `האם אתה בטוח שברצונך למחוק את "${itemName}"?`,
    CLEAR_PURCHASED: () => 'האם אתה בטוח שברצונך למחוק את כל הפריטים שנקנו?',
    CLEAR_CART: () => 'האם אתה בטוח שברצונך לנקות את הסל?',
    COMPLETE_PURCHASE: () => 'האם אתה בטוח שברצונך להשלים את הקנייה?',
  },
} as const

export type MessageCategory = keyof typeof MESSAGES
export type MessageType<T extends MessageCategory> = keyof typeof MESSAGES[T]
