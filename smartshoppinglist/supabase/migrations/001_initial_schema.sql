-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_hebrew TEXT NOT NULL,
  emoji TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, name_hebrew, emoji) VALUES
  ('fruits_vegetables', 'פירות וירקות', '🥕'),
  ('dairy', 'מוצרי חלב', '🥛'),
  ('meat_fish', 'בשר ודגים', '🥩'),
  ('bread_bakery', 'לחם ומאפים', '🍞'),
  ('beverages', 'משקאות', '🥤'),
  ('snacks_sweets', 'חטיפים ומתוקים', '🍪'),
  ('cleaning', 'מוצרי ניקיון', '🧽'),
  ('hygiene', 'מוצרי היגיינה', '🧴'),
  ('dry_goods', 'מזון יבש', '🌾'),
  ('frozen', 'קפואים', '🧊'),
  ('canned_prepared', 'שימורים ומוכנים', '🥫'),
  ('spices_sauces', 'תבלינים ורטבים', '🧂'),
  ('health', 'מוצרי בריאות', '💊'),
  ('alcohol', 'אלכוהול', '🍷'),
  ('baby_products', 'מוצרי תינוקות', '🍼'),
  ('pet_products', 'מוצרי חיות מחמד', '🐕'),
  ('other', 'אחר', '📦');

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on shopping_lists
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping_lists
CREATE POLICY "Users can view own shopping lists" ON shopping_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own shopping lists" ON shopping_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shopping lists" ON shopping_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shopping lists" ON shopping_lists FOR DELETE USING (auth.uid() = user_id);

-- Create shopping_items table
CREATE TABLE shopping_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_in_cart BOOLEAN DEFAULT false,
  is_purchased BOOLEAN DEFAULT false,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  purchased_at TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  purchase_location TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on shopping_items
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping_items
CREATE POLICY "Users can view own shopping items" ON shopping_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own shopping items" ON shopping_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shopping items" ON shopping_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shopping items" ON shopping_items FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shopping_items_updated_at BEFORE UPDATE ON shopping_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
