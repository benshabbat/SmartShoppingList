-- Create purchase_history table for storing completed purchases
CREATE TABLE purchase_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2),
  purchase_location TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_item_id UUID, -- Reference to the original shopping item
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_purchase_history_user_id ON purchase_history(user_id);
CREATE INDEX idx_purchase_history_purchased_at ON purchase_history(purchased_at);
CREATE INDEX idx_purchase_history_category ON purchase_history(category);
CREATE INDEX idx_purchase_history_name ON purchase_history(name);

-- Add RLS (Row Level Security) policies
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own purchase history
CREATE POLICY "Users can view own purchase history" ON purchase_history
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own purchase history
CREATE POLICY "Users can insert own purchase history" ON purchase_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own purchase history
CREATE POLICY "Users can update own purchase history" ON purchase_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own purchase history
CREATE POLICY "Users can delete own purchase history" ON purchase_history
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_purchase_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER purchase_history_updated_at
    BEFORE UPDATE ON purchase_history
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_history_updated_at();