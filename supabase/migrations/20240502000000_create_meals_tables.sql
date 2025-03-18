-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  ingredient_count INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
  ingredients JSONB NOT NULL,
  instructions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_meals table to track which meals users have saved
CREATE TABLE IF NOT EXISTS saved_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- Create calendar_entries table
CREATE TABLE IF NOT EXISTS calendar_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  meal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;

-- Meals are readable by everyone
CREATE POLICY "Meals are viewable by everyone" ON meals
  FOR SELECT USING (true);

-- Saved meals are only viewable by the user who saved them
CREATE POLICY "Users can view their own saved meals" ON saved_meals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can save and unsave meals
CREATE POLICY "Users can save meals" ON saved_meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave meals" ON saved_meals
  FOR DELETE USING (auth.uid() = user_id);

-- Calendar entries are only viewable by the user who created them
CREATE POLICY "Users can view their own calendar entries" ON calendar_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add and remove calendar entries
CREATE POLICY "Users can add calendar entries" ON calendar_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove calendar entries" ON calendar_entries
  FOR DELETE USING (auth.uid() = user_id);