-- Add constants tables to store app configuration in database

-- Create app_messages table for all UI messages
CREATE TABLE app_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_key TEXT UNIQUE NOT NULL,
  message_value TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('success', 'error', 'info', 'warning')),
  category TEXT NOT NULL, -- 'general', 'items', 'cart', 'purchase', etc.
  language TEXT NOT NULL DEFAULT 'he',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default messages
INSERT INTO app_messages (message_key, message_value, message_type, category) VALUES
  -- Success messages
  ('item_added', 'פריט נוסף בהצלחה', 'success', 'items'),
  ('item_removed', 'פריט הוסר מהרשימה', 'success', 'items'),
  ('item_moved_to_cart', 'פריט הועבר לעגלה', 'success', 'cart'),
  ('item_removed_from_cart', 'פריט הוסר מהעגלה', 'success', 'cart'),
  ('purchase_completed', 'רכישה הושלמה בהצלחה', 'success', 'purchase'),
  ('cart_cleared', 'העגלה נוקתה', 'success', 'cart'),
  ('purchased_items_cleared', 'פריטים שנקנו נמחקו', 'success', 'purchase'),
  ('list_created', 'רשימה נוצרה בהצלחה', 'success', 'lists'),
  ('receipt_processed', 'קבלה עובדה בהצלחה', 'success', 'receipt'),
  ('expiry_date_updated', 'תאריך תפוגה עודכן', 'success', 'items'),
  
  -- Error messages
  ('item_exists', 'הפריט כבר קיים ברשימה', 'error', 'items'),
  ('invalid_input', 'קלט לא תקין', 'error', 'general'),
  ('network_error', 'שגיאת רשת - נסה שוב', 'error', 'general'),
  ('storage_error', 'שגיאה בשמירת נתונים', 'error', 'general'),
  ('authentication_error', 'שגיאת אימות', 'error', 'auth'),
  ('receipt_scan_error', 'שגיאה בסריקת הקבלה', 'error', 'receipt'),
  ('camera_permission_error', 'אין הרשאה לגישה למצלמה', 'error', 'camera'),
  
  -- Info messages
  ('tutorial_welcome', 'ברוכים הבאים לרשימת הקניות החכמה!', 'info', 'tutorial'),
  ('cart_empty', 'העגלה ריקה', 'info', 'cart'),
  ('no_suggestions', 'אין הצעות כרגע', 'info', 'suggestions'),
  ('no_expiring_items', 'אין פריטים שפגים בקרוב', 'info', 'expiry'),
  ('offline_mode', 'עובד במצב לא מקוון', 'info', 'general'),
  
  -- Warning messages
  ('item_expiring_soon', 'פריט עומד לפוג בקרוב', 'warning', 'expiry'),
  ('storage_almost_full', 'האחסון כמעט מלא', 'warning', 'storage'),
  ('unsaved_changes', 'יש שינויים שלא נשמרו', 'warning', 'general');

-- Create app_settings table for application configuration
CREATE TABLE app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, category, description) VALUES
  -- Storage keys
  ('storage_key_items', 'shoppingItems', 'string', 'storage', 'Key for storing shopping items'),
  ('storage_key_purchase_history', 'purchaseHistory', 'string', 'storage', 'Key for storing purchase history'),
  ('storage_key_suggestions', 'suggestions', 'string', 'storage', 'Key for storing suggestions'),
  ('storage_key_pantry', 'pantryItems', 'string', 'storage', 'Key for storing pantry items'),
  ('storage_key_expiring', 'expiringItems', 'string', 'storage', 'Key for storing expiring items'),
  ('storage_key_sound', 'soundEnabled', 'string', 'storage', 'Key for sound preference'),
  ('storage_key_tutorial', 'tutorialCompleted', 'string', 'storage', 'Key for tutorial completion'),
  
  -- UI settings
  ('animation_duration', '300', 'number', 'ui', 'Animation duration in milliseconds'),
  ('items_per_page', '20', 'number', 'ui', 'Number of items per page'),
  ('auto_save_interval', '5000', 'number', 'ui', 'Auto save interval in milliseconds'),
  ('sound_enabled_default', 'true', 'boolean', 'ui', 'Default sound setting'),
  
  -- Business logic
  ('expiry_warning_days', '3', 'number', 'business', 'Days before expiry to show warning'),
  ('suggestion_threshold', '3', 'number', 'business', 'Minimum frequency for suggestions'),
  ('max_suggestions', '5', 'number', 'business', 'Maximum number of suggestions to show'),
  ('pantry_expiry_days', '30', 'number', 'business', 'Days to keep items in pantry'),
  
  -- Quick lists presets
  ('quick_list_breakfast', '["חלב", "לחם", "ביצים", "חמאה", "ריבה"]', 'json', 'quick_lists', 'Breakfast quick list'),
  ('quick_list_dinner', '["בשר", "ירקות", "אורז", "שמן זית"]', 'json', 'quick_lists', 'Dinner quick list'),
  ('quick_list_snacks', '["פרי", "אגוזים", "יוגורט", "עוגיות"]', 'json', 'quick_lists', 'Snacks quick list'),
  ('quick_list_cleaning', '["סבון כלים", "נייר טואלט", "חומר ניקוי", "שקיות זבל"]', 'json', 'quick_lists', 'Cleaning quick list');

-- Create popular_items table for smart suggestions
CREATE TABLE popular_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  popularity_score INTEGER DEFAULT 1,
  season TEXT, -- 'winter', 'spring', 'summer', 'autumn', 'all'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert popular items by categories
INSERT INTO popular_items (item_name, category, popularity_score, season) VALUES
  -- Fruits & Vegetables
  ('בננות', 'פירות וירקות', 10, 'all'),
  ('תפוחים', 'פירות וירקות', 9, 'all'),
  ('עגבניות', 'פירות וירקות', 8, 'all'),
  ('מלפפונים', 'פירות וירקות', 7, 'all'),
  ('גזר', 'פירות וירקות', 6, 'all'),
  ('פלפל', 'פירות וירקות', 6, 'all'),
  ('אבוקדו', 'פירות וירקות', 8, 'all'),
  ('לימונים', 'פירות וירקות', 5, 'all'),
  
  -- Dairy
  ('חלב', 'מוצרי חלב', 10, 'all'),
  ('ביצים', 'מוצרי חלב', 9, 'all'),
  ('גבינה צהובה', 'מוצרי חלב', 7, 'all'),
  ('יוגורט', 'מוצרי חלב', 6, 'all'),
  ('חמאה', 'מוצרי חלב', 5, 'all'),
  ('קוטג׳', 'מוצרי חלב', 4, 'all'),
  
  -- Meat & Fish
  ('עוף', 'בשר ודגים', 8, 'all'),
  ('בשר בקר', 'בשר ודגים', 6, 'all'),
  ('דג סלמון', 'בשר ודגים', 5, 'all'),
  ('טונה', 'בשר ודגים', 7, 'all'),
  
  -- Bread & Bakery
  ('לחם', 'לחם ומאפים', 10, 'all'),
  ('חלה', 'לחם ומאפים', 6, 'all'),
  ('פיתה', 'לחם ומאפים', 7, 'all'),
  ('לחמניות', 'לחם ומאפים', 5, 'all'),
  
  -- Beverages
  ('מים', 'משקאות', 10, 'all'),
  ('קפה', 'משקאות', 8, 'all'),
  ('תה', 'משקאות', 6, 'all'),
  ('מיץ תפוזים', 'משקאות', 5, 'all'),
  
  -- Cleaning
  ('סבון כלים', 'מוצרי ניקיון', 7, 'all'),
  ('נייר טואלט', 'מוצרי ניקיון', 8, 'all'),
  ('חומר ניקוי רצפות', 'מוצרי ניקיון', 5, 'all'),
  ('שקיות זבל', 'מוצרי ניקיון', 6, 'all'),
  
  -- Hygiene
  ('משחת שיניים', 'מוצרי היגיינה', 4, 'all'),
  ('סבון', 'מוצרי היגיינה', 6, 'all'),
  ('שמפו', 'מוצרי היגיינה', 3, 'all'),
  ('מברשת שיניים', 'מוצרי היגיינה', 2, 'all');

-- Create seasonal_items table for seasonal suggestions
CREATE TABLE seasonal_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  season TEXT NOT NULL CHECK (season IN ('winter', 'spring', 'summer', 'autumn')),
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert seasonal items
INSERT INTO seasonal_items (item_name, category, season, priority) VALUES
  -- Winter items
  ('תרד', 'פירות וירקות', 'winter', 5),
  ('כרוב', 'פירות וירקות', 'winter', 4),
  ('שורש פטרוזיליה', 'פירות וירקות', 'winter', 3),
  ('תפוחי אדמה', 'פירות וירקות', 'winter', 6),
  ('בטטה', 'פירות וירקות', 'winter', 4),
  
  -- Spring items
  ('ארטישוק', 'פירות וירקות', 'spring', 4),
  ('אפונה', 'פירות וירקות', 'spring', 5),
  ('תותים', 'פירות וירקות', 'spring', 6),
  ('כוסברה', 'פירות וירקות', 'spring', 3),
  
  -- Summer items
  ('אבטיח', 'פירות וירקות', 'summer', 8),
  ('מלון', 'פירות וירקות', 'summer', 7),
  ('אפרסקים', 'פירות וירקות', 'summer', 6),
  ('תירס', 'פירות וירקות', 'summer', 5),
  ('מלפפונים', 'פירות וירקות', 'summer', 7),
  
  -- Autumn items
  ('רימונים', 'פירות וירקות', 'autumn', 6),
  ('תמרים', 'פירות וירקות', 'autumn', 4),
  ('דלורית', 'פירות וירקות', 'autumn', 5),
  ('קישוא', 'פירות וירקות', 'autumn', 4);

-- Enable RLS on new tables
ALTER TABLE app_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since these are app constants)
CREATE POLICY "Anyone can read app messages" ON app_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read app settings" ON app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read popular items" ON popular_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read seasonal items" ON seasonal_items FOR SELECT TO authenticated USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_app_messages_updated_at BEFORE UPDATE ON app_messages
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_popular_items_updated_at BEFORE UPDATE ON popular_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
