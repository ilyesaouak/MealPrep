import React, { createContext, useContext, useState, useEffect } from "react";
import { Meal, CalendarEntry, MealFilters } from "@/types/meal";
import { useAuth } from "./AuthContext";
import {
  fetchMeals,
  fetchSavedMeals,
  toggleSaveMeal as apiToggleSaveMeal,
  fetchCalendarEntries,
  addMealToCalendar,
  removeMealFromCalendar,
  filterMeals,
} from "@/services/mealService";

// Helper function to get demo meals
const getDemoMeals = (): Meal[] => {
  return [
    {
      id: "meal-1",
      title: "Quinoa Bowl with Roasted Vegetables",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
      prepTime: 25,
      cookTime: 20,
      ingredientCount: 8,
      servings: 4,
      isSaved: false,
      dietaryTags: ["Vegetarian", "Gluten-Free"],
      ingredients: [
        { name: "Quinoa", amount: "1", unit: "cup" },
        { name: "Bell Peppers", amount: "2", unit: "whole" },
        { name: "Zucchini", amount: "1", unit: "whole" },
        { name: "Red Onion", amount: "1", unit: "whole" },
        { name: "Olive Oil", amount: "2", unit: "tbsp" },
        { name: "Lemon Juice", amount: "1", unit: "tbsp" },
        { name: "Salt", amount: "to taste", unit: "" },
        { name: "Pepper", amount: "to taste", unit: "" },
      ],
      instructions: [
        "Rinse quinoa under cold water",
        "Cook quinoa according to package instructions",
        "Chop vegetables into bite-sized pieces",
        "Toss vegetables with olive oil, salt, and pepper",
        "Roast vegetables at 425°F for 20 minutes",
        "Mix cooked quinoa with roasted vegetables",
        "Drizzle with lemon juice and serve",
      ],
    },
    {
      id: "meal-2",
      title: "Avocado Toast with Poached Eggs",
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80",
      prepTime: 15,
      cookTime: 10,
      ingredientCount: 5,
      servings: 2,
      isSaved: true,
      dietaryTags: ["Vegetarian"],
      ingredients: [
        { name: "Whole Grain Bread", amount: "2", unit: "slices" },
        { name: "Avocado", amount: "1", unit: "whole" },
        { name: "Eggs", amount: "2", unit: "whole" },
        { name: "Salt", amount: "to taste", unit: "" },
        { name: "Pepper", amount: "to taste", unit: "" },
      ],
      instructions: [
        "Toast bread until golden brown",
        "Mash avocado and spread on toast",
        "Bring water to a simmer in a small pot",
        "Crack eggs into simmering water and cook for 3-4 minutes",
        "Remove eggs with a slotted spoon and place on avocado toast",
        "Season with salt and pepper",
      ],
    },
    {
      id: "meal-3",
      title: "Chicken and Vegetable Stir Fry",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80",
      prepTime: 20,
      cookTime: 15,
      ingredientCount: 10,
      servings: 4,
      isSaved: false,
      dietaryTags: ["High-Protein"],
      ingredients: [
        { name: "Chicken Breast", amount: "1", unit: "lb" },
        { name: "Broccoli", amount: "2", unit: "cups" },
        { name: "Carrots", amount: "2", unit: "whole" },
        { name: "Bell Peppers", amount: "1", unit: "whole" },
        { name: "Soy Sauce", amount: "3", unit: "tbsp" },
        { name: "Garlic", amount: "3", unit: "cloves" },
        { name: "Ginger", amount: "1", unit: "tbsp" },
        { name: "Vegetable Oil", amount: "2", unit: "tbsp" },
        { name: "Cornstarch", amount: "1", unit: "tsp" },
        { name: "Rice", amount: "2", unit: "cups" },
      ],
      instructions: [
        "Cut chicken into bite-sized pieces",
        "Chop all vegetables",
        "Mix soy sauce, minced garlic, ginger, and cornstarch",
        "Heat oil in a wok or large pan",
        "Cook chicken until no longer pink",
        "Add vegetables and stir-fry until tender-crisp",
        "Pour sauce over and cook until thickened",
        "Serve over cooked rice",
      ],
    },
  ];
};

interface MealContextType {
  meals: Meal[];
  savedMeals: string[];
  calendarEntries: CalendarEntry[];
  loading: boolean;
  toggleSaveMeal: (id: string) => Promise<void>;
  addToCalendar: (
    mealId: string,
    date: Date,
    mealType: string,
    title: string,
  ) => Promise<void>;
  removeFromCalendar: (entryId: string) => Promise<void>;
  getFilteredMeals: (filters: MealFilters) => Promise<Meal[]>;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const useMealContext = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealContext must be used within a MealProvider");
  }
  return context;
};

interface MealProviderProps {
  children: React.ReactNode;
}

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [savedMeals, setSavedMeals] = useState<string[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data when user is authenticated
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Always fetch meals from the database first
        const mealsData = await fetchMeals();
        let mealsToUse = mealsData;

        // If no meals returned, use demo data
        if (!mealsData || mealsData.length === 0) {
          mealsToUse = getDemoMeals();
        }

        if (user) {
          // Fetch saved meals for the logged-in user
          const savedMealsData = await fetchSavedMeals(user.id);

          // Update the saved meals state
          if (savedMealsData && savedMealsData.length > 0) {
            setSavedMeals(savedMealsData);
          } else {
            // If no saved meals, use demo saved meal only if using demo meals
            setSavedMeals(mealsData.length === 0 ? ["meal-2"] : []);
          }

          // Mark meals as saved based on the user's saved meals
          const updatedMeals = mealsToUse.map((meal) => ({
            ...meal,
            isSaved: savedMealsData.includes(meal.id),
          }));

          setMeals(updatedMeals);

          // Fetch calendar entries
          const calendarData = await fetchCalendarEntries(user.id);
          setCalendarEntries(calendarData || []);
        } else {
          // If no user, use demo data for saved meals
          setMeals(
            mealsToUse.map((meal) => ({
              ...meal,
              isSaved: meal.id === "meal-2", // Only for demo data
            })),
          );
          setSavedMeals(mealsData.length === 0 ? ["meal-2"] : []);
          setCalendarEntries([]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        // On error, still show demo data instead of infinite loading
        const demoMeals = getDemoMeals();
        setMeals(demoMeals);
        setSavedMeals(["meal-2"]);
        setCalendarEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Toggle save/unsave a meal
  const toggleSaveMeal = async (id: string) => {
    if (user) {
      try {
        // Call the API to toggle the saved status
        const isSaved = await apiToggleSaveMeal(id, user.id);
        console.log(`Meal ${id} is now ${isSaved ? "saved" : "unsaved"}`);

        // Update local state
        setMeals((prevMeals) =>
          prevMeals.map((meal) =>
            meal.id === id ? { ...meal, isSaved } : meal,
          ),
        );

        setSavedMeals((prevSaved) => {
          if (isSaved && !prevSaved.includes(id)) {
            return [...prevSaved, id];
          } else if (!isSaved && prevSaved.includes(id)) {
            return prevSaved.filter((mealId) => mealId !== id);
          }
          return prevSaved;
        });
      } catch (error) {
        console.error("Error toggling save meal:", error);
      }
    } else {
      // Demo mode - just update local state
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === id ? { ...meal, isSaved: !meal.isSaved } : meal,
        ),
      );

      setSavedMeals((prevSaved) => {
        if (prevSaved.includes(id)) {
          return prevSaved.filter((mealId) => mealId !== id);
        } else {
          return [...prevSaved, id];
        }
      });
    }
  };

  // Add a meal to the calendar
  const addToCalendar = async (
    mealId: string,
    date: Date,
    mealType: string,
    title: string,
  ) => {
    if (user) {
      try {
        const newEntry = await addMealToCalendar(
          mealId,
          date,
          mealType,
          title,
          user.id,
        );
        if (newEntry) {
          setCalendarEntries((prev) => [...prev, newEntry]);
        }
      } catch (error) {
        console.error("Error adding to calendar:", error);
      }
    } else {
      // Demo mode - just update local state
      const newEntry: CalendarEntry = {
        id: `temp-${Date.now()}`,
        mealId,
        date,
        mealType,
        title,
      };
      setCalendarEntries((prev) => [...prev, newEntry]);
    }
  };

  // Remove a meal from the calendar
  const removeFromCalendar = async (entryId: string) => {
    if (user) {
      try {
        const success = await removeMealFromCalendar(entryId);
        if (success) {
          setCalendarEntries((prev) =>
            prev.filter((entry) => entry.id !== entryId),
          );
        }
      } catch (error) {
        console.error("Error removing from calendar:", error);
        // Still update UI even if backend fails
        setCalendarEntries((prev) =>
          prev.filter((entry) => entry.id !== entryId),
        );
      }
    } else {
      // Demo mode - just update local state
      setCalendarEntries((prev) =>
        prev.filter((entry) => entry.id !== entryId),
      );
    }
  };

  // Filter meals based on criteria
  const getFilteredMeals = async (filters: MealFilters) => {
    if (user) {
      try {
        return await filterMeals(filters);
      } catch (error) {
        console.error("Error filtering meals:", error);
        return [];
      }
    } else {
      // Demo mode - just filter local state
      if (
        filters.dietaryRestrictions.length === 0 &&
        filters.mealTypes.length === 0
      ) {
        return meals;
      }

      // For demo purposes, just return a subset of meals when filters are applied
      return meals.filter((meal) => {
        // Check if meal has any of the requested dietary restrictions
        const matchesDiet =
          filters.dietaryRestrictions.length === 0 ||
          meal.dietaryTags.some((tag) =>
            filters.dietaryRestrictions.includes(tag),
          );

        // In a real app, you'd check meal types here too
        return matchesDiet;
      });
    }
  };

  const value = {
    meals,
    savedMeals,
    calendarEntries,
    loading,
    toggleSaveMeal,
    addToCalendar,
    removeFromCalendar,
    getFilteredMeals,
  };

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
};
