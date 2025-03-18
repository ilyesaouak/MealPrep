-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  ingredient_count INTEGER,
  servings INTEGER,
  dietary_tags TEXT[] DEFAULT '{}',
  ingredients JSONB DEFAULT '[]',
  instructions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;

-- Meals are readable by everyone
CREATE POLICY "Meals are viewable by everyone" ON meals
  FOR SELECT USING (true);

-- Saved meals are viewable by the user who saved them
CREATE POLICY "Users can view their saved meals" ON saved_meals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can save/unsave meals
CREATE POLICY "Users can save meals" ON saved_meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave meals" ON saved_meals
  FOR DELETE USING (auth.uid() = user_id);

-- Calendar entries are viewable by the user who created them
CREATE POLICY "Users can view their calendar entries" ON calendar_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add calendar entries
CREATE POLICY "Users can add calendar entries" ON calendar_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their calendar entries
CREATE POLICY "Users can update their calendar entries" ON calendar_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their calendar entries
CREATE POLICY "Users can delete their calendar entries" ON calendar_entries
  FOR DELETE USING (auth.uid() = user_id);