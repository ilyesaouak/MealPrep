export interface Meal {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  cookTime: number;
  ingredientCount: number;
  servings: number;
  isSaved: boolean;
  dietaryTags: string[];
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
}

export interface CalendarEntry {
  id?: string;
  mealId: string;
  date: Date;
  mealType: string;
  title: string;
  userId?: string;
}

export interface MealFilters {
  dietaryRestrictions: string[];
  mealTypes: string[];
}

// Database schema types (matching Supabase tables)
export interface DBMeal {
  id: string;
  title: string;
  image: string;
  prep_time: number;
  cook_time: number;
  ingredient_count: number;
  servings: number;
  dietary_tags: string[];
  ingredients: string | { name: string; amount: string; unit: string }[];
  instructions: string[];
  created_at?: string;
}

export interface DBSavedMeal {
  id: string;
  user_id: string;
  meal_id: string;
  created_at?: string;
}

export interface DBCalendarEntry {
  id: string;
  user_id: string;
  meal_id: string;
  date: string;
  meal_type: string;
  title: string;
  created_at?: string;
}
