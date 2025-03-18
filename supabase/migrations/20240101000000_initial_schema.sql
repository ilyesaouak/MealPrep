-- Create tables for the meal prep application

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token-with-at-least-32-characters-long';
ALTER DATABASE postgres SET "app.jwt_exp" TO 3600;

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  ingredient_count INTEGER NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
  meal_types TEXT[] DEFAULT '{}',
  ingredients JSONB DEFAULT '[]',
  instructions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create saved_meals table
CREATE TABLE IF NOT EXISTS public.saved_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, meal_id)
);

-- Create calendar_entries table
CREATE TABLE IF NOT EXISTS public.calendar_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_ingredients table (inventory)
CREATE TABLE IF NOT EXISTS public.user_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL,
  unit TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, ingredient_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Meals: anyone can read meals, only admins can create/update/delete
CREATE POLICY "Anyone can view meals" 
  ON public.meals FOR SELECT 
  TO authenticated
  USING (true);

-- Saved meals: users can only manage their own saved meals
CREATE POLICY "Users can view their own saved meals" 
  ON public.saved_meals FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved meals" 
  ON public.saved_meals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved meals" 
  ON public.saved_meals FOR DELETE 
  USING (auth.uid() = user_id);

-- Calendar entries: users can only manage their own calendar entries
CREATE POLICY "Users can view their own calendar entries" 
  ON public.calendar_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar entries" 
  ON public.calendar_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar entries" 
  ON public.calendar_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar entries" 
  ON public.calendar_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Ingredients: anyone can view ingredients
CREATE POLICY "Anyone can view ingredients" 
  ON public.ingredients FOR SELECT 
  TO authenticated
  USING (true);

-- User ingredients: users can only manage their own ingredients
CREATE POLICY "Users can view their own ingredients" 
  ON public.user_ingredients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" 
  ON public.user_ingredients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" 
  ON public.user_ingredients FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" 
  ON public.user_ingredients FOR DELETE 
  USING (auth.uid() = user_id);

-- Create sample data
INSERT INTO public.meals (title, image, prep_time, cook_time, servings, ingredient_count, dietary_tags, meal_types, ingredients, instructions)
VALUES
  ('Vegetable Stir Fry with Tofu', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', 15, 20, 4, 9, '{"Vegan", "Gluten-Free"}', '{"Dinner", "Lunch"}', 
   '[{"name":"Firm Tofu","amount":"14","unit":"oz"},{"name":"Broccoli","amount":"2","unit":"cups"},{"name":"Bell Peppers","amount":"2","unit":"medium"},{"name":"Carrots","amount":"2","unit":"medium"},{"name":"Soy Sauce","amount":"3","unit":"tbsp"},{"name":"Sesame Oil","amount":"1","unit":"tbsp"},{"name":"Garlic","amount":"3","unit":"cloves"},{"name":"Ginger","amount":"1","unit":"tbsp"},{"name":"Rice","amount":"2","unit":"cups"}]',
   '{"Press tofu to remove excess water, then cut into 1-inch cubes.","Chop all vegetables into bite-sized pieces.","Heat sesame oil in a large wok or skillet over medium-high heat.","Add garlic and ginger, sauté for 30 seconds until fragrant.","Add tofu and cook until golden brown on all sides, about 5 minutes.","Add vegetables and stir-fry for 5-7 minutes until crisp-tender.","Pour in soy sauce and any other seasonings, toss to coat.","Serve hot over cooked rice."}'),
  
  ('Quinoa Bowl with Roasted Vegetables', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', 25, 30, 4, 8, '{"Vegetarian", "Gluten-Free"}', '{"Lunch", "Dinner"}',
   '[{"name":"Quinoa","amount":"1","unit":"cup"},{"name":"Sweet Potato","amount":"1","unit":"large"},{"name":"Broccoli","amount":"1","unit":"head"},{"name":"Red Onion","amount":"1","unit":"medium"},{"name":"Olive Oil","amount":"2","unit":"tbsp"},{"name":"Lemon","amount":"1","unit":"medium"},{"name":"Tahini","amount":"2","unit":"tbsp"},{"name":"Garlic","amount":"2","unit":"cloves"}]',
   '{"Preheat oven to 425°F (220°C).","Rinse quinoa and cook according to package instructions.","Chop sweet potato, broccoli, and red onion into bite-sized pieces.","Toss vegetables with olive oil, salt, and pepper.","Roast vegetables for 25-30 minutes until tender and caramelized.","Make tahini sauce by mixing tahini, lemon juice, minced garlic, and water.","Assemble bowls with quinoa, roasted vegetables, and drizzle with tahini sauce."}'),
  
  ('Avocado Toast with Poached Eggs', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80', 15, 10, 2, 5, '{"Vegetarian"}', '{"Breakfast"}',
   '[{"name":"Whole Grain Bread","amount":"2","unit":"slices"},{"name":"Avocado","amount":"1","unit":"ripe"},{"name":"Eggs","amount":"2","unit":"large"},{"name":"Lemon","amount":"1/2","unit":"medium"},{"name":"Red Pepper Flakes","amount":"1/4","unit":"tsp"}]',
   '{"Toast bread until golden and crisp.","Mash avocado with lemon juice, salt, and pepper.","Bring a pot of water to a gentle simmer for poaching eggs.","Add a splash of vinegar to the water and create a vortex with a spoon.","Crack eggs into the vortex and poach for 3-4 minutes.","Spread mashed avocado on toast and top with poached eggs.","Sprinkle with red pepper flakes and serve immediately."}')
;

-- Create ingredients
INSERT INTO public.ingredients (name, category)
VALUES
  ('Firm Tofu', 'Protein'),
  ('Broccoli', 'Vegetable'),
  ('Bell Peppers', 'Vegetable'),
  ('Carrots', 'Vegetable'),
  ('Soy Sauce', 'Condiment'),
  ('Sesame Oil', 'Oil'),
  ('Garlic', 'Vegetable'),
  ('Ginger', 'Vegetable'),
  ('Rice', 'Grain'),
  ('Quinoa', 'Grain'),
  ('Sweet Potato', 'Vegetable'),
  ('Red Onion', 'Vegetable'),
  ('Olive Oil', 'Oil'),
  ('Lemon', 'Fruit'),
  ('Tahini', 'Condiment'),
  ('Whole Grain Bread', 'Grain'),
  ('Avocado', 'Fruit'),
  ('Eggs', 'Protein'),
  ('Red Pepper Flakes', 'Spice')
;
