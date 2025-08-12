# הגדרת Supabase לפרויקט Smart Shopping List

## שלב 1: יצירת פרויקט Supabase

1. היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. צור פרויקט חדש
3. שמור את ה-URL וה-API Key (anon public)

## שלב 2: הגדרת משתני הסביבה

עדכן את קובץ `.env.local` עם הפרטים שלך:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## שלב 3: יצירת מסד הנתונים

1. פתח את ה-SQL Editor ב-Supabase Dashboard
2. העתק והדבק את התוכן של קובץ `supabase/migrations/001_initial_schema.sql`
3. הרץ את הסקריפט

## שלב 4: הגדרת Authentication

1. בתפריט Authentication > Settings
2. הפעל Email authentication
3. הגדר את ה-Site URL ל-`http://localhost:3000` (לפיתוח)
4. הגדר את ה-Redirect URLs לכתובות הנדרשות

## שלב 5: הגדרת Row Level Security (RLS)

ה-RLS כבר מוגדר בסקריפט SQL. זה מבטיח שכל משתמש יכול לראות רק את הנתונים שלו.

## שלב 6: טיפוסי נתונים

הפרויקט כולל:
- `database.types.ts` - טיפוסי TypeScript שנוצרו אוטומטית
- `supabase.ts` - טיפוסי עזר לעבודה עם Supabase

## שלב 7: שירותים

נוצרו שירותים לניהול:
- `ShoppingItemService` - ניהול פריטי קניות
- `ShoppingListService` - ניהול רשימות קניות
- `UserService` - ניהול משתמשים ו-authentication

## שלב 8: Hooks

- `useAuth` - hook לניהול authentication

## מבנה הטבלאות

### user_profiles
- id (UUID, primary key)
- email (text)
- full_name (text, optional)
- avatar_url (text, optional)
- created_at, updated_at (timestamps)

### categories
- id (UUID, primary key)  
- name (text) - English name
- name_hebrew (text) - Hebrew name
- emoji (text, optional)
- created_at (timestamp)

### shopping_lists
- id (UUID, primary key)
- user_id (UUID, foreign key)
- name (text)
- description (text, optional)
- is_active (boolean)
- created_at, updated_at (timestamps)

### shopping_items
- id (UUID, primary key)
- user_id (UUID, foreign key)
- shopping_list_id (UUID, foreign key, optional)
- name (text)
- category (text)
- is_in_cart (boolean)
- is_purchased (boolean)
- added_at (timestamp)
- purchased_at (timestamp, optional)
- expiry_date (timestamp, optional)
- purchase_location (text, optional)
- price (decimal, optional)
- created_at, updated_at (timestamps)

## אבטחה

- Row Level Security (RLS) מופעל על כל הטבלאות
- משתמשים יכולים לגשת רק לנתונים שלהם
- Authentication מבוסס על Supabase Auth
