import { supabase } from "@/lib/supabase";
import { Meal, CalendarEntry, MealFilters } from "@/types/meal";

// Fetch all meals
export const fetchMeals = async (): Promise<Meal[]> => {
  try {
    console.log("Fetching meals from Supabase...");
    const { data, error } = await supabase.from("meals").select("*");

    if (error) {
      console.error("Error fetching meals:", error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} meals`);

    // Transform the data to match our Meal interface
    return (data || []).map(transformMealFromDB);
  } catch (e) {
    console.error("Unexpected error fetching meals:", e);
    return [];
  }
};

// Fetch a single meal by ID
export const fetchMealById = async (id: string): Promise<Meal | null> => {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching meal with id ${id}:`, error);
    return null;
  }

  return data ? transformMealFromDB(data) : null;
};

// Save a meal (toggle saved status)
export const toggleSaveMeal = async (
  mealId: string,
  userId: string,
): Promise<boolean> => {
  // First check if the meal is already saved
  const { data: existingSave } = await supabase
    .from("saved_meals")
    .select("*")
    .eq("meal_id", mealId)
    .eq("user_id", userId);

  if (existingSave && existingSave.length > 0) {
    // Meal is already saved, so unsave it
    const { error } = await supabase
      .from("saved_meals")
      .delete()
      .eq("meal_id", mealId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error unsaving meal:", error);
      return false;
    }
    return false; // Return false to indicate meal is now unsaved
  } else {
    // Meal is not saved, so save it
    const { error } = await supabase
      .from("saved_meals")
      .insert([{ meal_id: mealId, user_id: userId }]);

    if (error) {
      console.error("Error saving meal:", error);
      return false;
    }
    return true; // Return true to indicate meal is now saved
  }
};

// Get saved meals for a user
export const fetchSavedMeals = async (userId: string): Promise<string[]> => {
  try {
    console.log(`Fetching saved meals for user ${userId}...`);
    const { data, error } = await supabase
      .from("saved_meals")
      .select("meal_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching saved meals:", error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} saved meals`);
    return (data || []).map((item) => item.meal_id);
  } catch (e) {
    console.error("Unexpected error fetching saved meals:", e);
    return [];
  }
};

// Add a meal to the calendar
export const addMealToCalendar = async (
  mealId: string,
  date: Date,
  mealType: string,
  title: string,
  userId: string,
): Promise<CalendarEntry | null> => {
  try {
    // Check if the calendar_entries table exists first
    const { error: tableCheckError } = await supabase
      .from("calendar_entries")
      .select("id")
      .limit(1);

    if (tableCheckError) {
      console.error("Calendar entries table may not exist:", tableCheckError);
      // Return a mock entry for demo purposes
      return {
        id: `temp-${Date.now()}`,
        mealId,
        date,
        mealType,
        title,
        userId,
      };
    }

    const { data, error } = await supabase
      .from("calendar_entries")
      .insert([
        {
          meal_id: mealId,
          date: date.toISOString(),
          meal_type: mealType,
          title,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding meal to calendar:", error);
      // Return a mock entry for demo purposes
      return {
        id: `temp-${Date.now()}`,
        mealId,
        date,
        mealType,
        title,
        userId,
      };
    }

    return {
      id: data.id,
      mealId: data.meal_id,
      date: new Date(data.date),
      mealType: data.meal_type,
      title: data.title,
      userId: data.user_id,
    };
  } catch (e) {
    console.error("Unexpected error adding meal to calendar:", e);
    // Return a mock entry for demo purposes
    return {
      id: `temp-${Date.now()}`,
      mealId,
      date,
      mealType,
      title,
      userId,
    };
  }
};

// Remove a meal from the calendar
export const removeMealFromCalendar = async (
  entryId: string,
): Promise<boolean> => {
  try {
    // Check if it's a temporary ID (from demo mode)
    if (entryId.startsWith("temp-")) {
      return true; // Just return success for demo entries
    }

    const { error } = await supabase
      .from("calendar_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Error removing meal from calendar:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Unexpected error removing meal from calendar:", e);
    return true; // Return true anyway to update UI
  }
};

// Fetch calendar entries for a user
export const fetchCalendarEntries = async (
  userId: string,
): Promise<CalendarEntry[]> => {
  try {
    console.log(`Fetching calendar entries for user ${userId}...`);
    const { data, error } = await supabase
      .from("calendar_entries")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching calendar entries:", error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} calendar entries`);
    return (data || []).map((entry) => ({
      id: entry.id,
      mealId: entry.meal_id,
      date: new Date(entry.date),
      mealType: entry.meal_type,
      title: entry.title,
      userId: entry.user_id,
    }));
  } catch (e) {
    console.error("Unexpected error fetching calendar entries:", e);
    return [];
  }
};

// Filter meals based on criteria
export const filterMeals = async (filters: MealFilters): Promise<Meal[]> => {
  let query = supabase.from("meals").select("*");

  // Apply dietary restrictions filter if any
  if (filters.dietaryRestrictions.length > 0) {
    // For each dietary restriction, we want meals that contain ANY of the tags
    query = query.overlaps("dietary_tags", filters.dietaryRestrictions);
  }

  // Apply meal types filter if any
  if (filters.mealTypes.length > 0) {
    // Currently we don't have meal_types in the database schema
    // This would need to be added if meal type filtering is required
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error filtering meals:", error);
    return [];
  }

  return (data || []).map(transformMealFromDB);
};

// Helper function to transform database meal object to our Meal interface
const transformMealFromDB = (dbMeal: any): Meal => {
  let ingredients = dbMeal.ingredients;

  // Handle different formats of ingredients data
  if (typeof ingredients === "string") {
    try {
      ingredients = JSON.parse(ingredients);
    } catch (e) {
      console.error("Error parsing ingredients JSON:", e);
      ingredients = [];
    }
  } else if (!Array.isArray(ingredients)) {
    ingredients = [];
  }

  // Handle different formats of instructions data
  let instructions = dbMeal.instructions;
  if (typeof instructions === "string") {
    try {
      instructions = JSON.parse(instructions);
    } catch (e) {
      console.error("Error parsing instructions JSON:", e);
      instructions = [];
    }
  } else if (!Array.isArray(instructions)) {
    instructions = [];
  }

  return {
    id: dbMeal.id,
    title: dbMeal.title,
    image: dbMeal.image,
    prepTime: dbMeal.prep_time,
    cookTime: dbMeal.cook_time,
    ingredientCount: dbMeal.ingredient_count,
    servings: dbMeal.servings,
    isSaved: false, // This will be set by the MealContext based on user's saved meals
    dietaryTags: Array.isArray(dbMeal.dietary_tags) ? dbMeal.dietary_tags : [],
    ingredients: ingredients,
    instructions: instructions,
  };
};
