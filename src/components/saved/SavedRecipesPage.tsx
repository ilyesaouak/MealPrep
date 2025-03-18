import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMealContext } from "@/context/MealContext";
import { useAuth } from "@/context/AuthContext";
import MealGrid from "../meal/MealGrid";
import RecipeDetailModal from "../meal/RecipeDetailModal";
import AddToCalendarModal from "../calendar/AddToCalendarModal";
import AuthModal from "../auth/AuthModal";
import { Meal } from "@/types/meal";
import { fetchMealById } from "@/services/mealService";
import { NavBar } from "../layout/NavBar";
import { Heart } from "lucide-react";

const SavedRecipesPage = () => {
  const { user } = useAuth();
  const { meals, savedMeals, toggleSaveMeal, addToCalendar } = useMealContext();
  const [savedMealsList, setSavedMealsList] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const [selectedMealForCalendar, setSelectedMealForCalendar] = useState<
    string | null
  >(null);

  // Default recipe data for fallback
  const defaultRecipe = {
    id: "1",
    title: "Vegetable Stir Fry with Tofu",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    ingredientCount: 9,
    isSaved: true,
    dietaryTags: ["Vegan", "Gluten-Free"],
    ingredients: [
      { name: "Firm Tofu", amount: "14", unit: "oz" },
      { name: "Broccoli", amount: "2", unit: "cups" },
      { name: "Bell Peppers", amount: "2", unit: "medium" },
      { name: "Carrots", amount: "2", unit: "medium" },
      { name: "Soy Sauce", amount: "3", unit: "tbsp" },
      { name: "Sesame Oil", amount: "1", unit: "tbsp" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "tbsp" },
      { name: "Rice", amount: "2", unit: "cups" },
    ],
    instructions: [
      "Press tofu to remove excess water, then cut into 1-inch cubes.",
      "Chop all vegetables into bite-sized pieces.",
      "Heat sesame oil in a large wok or skillet over medium-high heat.",
      "Add garlic and ginger, sauté for 30 seconds until fragrant.",
      "Add tofu and cook until golden brown on all sides, about 5 minutes.",
      "Add vegetables and stir-fry for 5-7 minutes until crisp-tender.",
      "Pour in soy sauce and any other seasonings, toss to coat.",
      "Serve hot over cooked rice.",
    ],
  };

  useEffect(() => {
    const loadSavedMeals = async () => {
      setLoading(true);
      try {
        // Filter meals to only include saved ones and ensure isSaved is true
        const savedMealsData = meals
          .filter((meal) => savedMeals.includes(meal.id))
          .map((meal) => ({ ...meal, isSaved: true }));
        setSavedMealsList(savedMealsData);
      } catch (error) {
        console.error("Error loading saved meals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedMeals();
  }, [meals, savedMeals]);

  const handleMealClick = async (id: string) => {
    try {
      if (user) {
        const mealDetails = await fetchMealById(id);
        if (mealDetails) {
          setSelectedRecipe(mealDetails);
        } else {
          // If not found, use a meal from the current list or default
          const foundMeal = savedMealsList.find((meal) => meal.id === id);
          setSelectedRecipe(foundMeal || defaultRecipe);
        }
      } else {
        // In demo mode, use a meal from the current list or default
        const foundMeal = savedMealsList.find((meal) => meal.id === id);
        setSelectedRecipe(foundMeal || defaultRecipe);
      }
      setShowRecipeModal(true);
    } catch (error) {
      console.error("Error fetching meal details:", error);
      const foundMeal = savedMealsList.find((meal) => meal.id === id);
      setSelectedRecipe(foundMeal || defaultRecipe);
      setShowRecipeModal(true);
    }
  };

  const handleSaveMeal = async (id: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await toggleSaveMeal(id);
  };

  const handleAddToCalendar = (id: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedMealForCalendar(id);
    setShowCalendarModal(true);
  };

  const handleAddToCalendarConfirm = async (date: Date, mealType: string) => {
    if (selectedMealForCalendar) {
      const selectedMeal = savedMealsList.find(
        (meal) => meal.id === selectedMealForCalendar,
      );
      if (selectedMeal) {
        await addToCalendar(
          selectedMealForCalendar,
          date,
          mealType,
          selectedMeal.title,
        );
      }
    }
    setShowCalendarModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activePage="saved" />
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              My Saved Recipes
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
            Your curated collection of exquisite culinary inspirations
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : savedMealsList.length === 0 ? (
          <div className="text-center p-12 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-emerald-50 shadow-xl max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <Heart className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Your Collection Awaits
            </h3>
            <p className="mt-2 text-gray-600 mb-6 max-w-md mx-auto">
              {user
                ? "You haven't saved any recipes yet. Explore our curated selection and save your favorites by clicking the heart icon."
                : "Sign in to create your personal collection of gourmet recipes and culinary inspirations."}
            </p>
            <Button
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => (window.location.href = "/")}
            >
              Discover Recipes
            </Button>
          </div>
        ) : (
          <MealGrid
            meals={savedMealsList}
            onMealClick={handleMealClick}
            onSaveMeal={handleSaveMeal}
            onAddToCalendar={handleAddToCalendar}
          />
        )}

        {/* Recipe Detail Modal */}
        {showRecipeModal && selectedRecipe && (
          <RecipeDetailModal
            isOpen={showRecipeModal}
            onClose={() => setShowRecipeModal(false)}
            recipe={selectedRecipe}
          />
        )}

        {/* Add to Calendar Modal */}
        {showCalendarModal && (
          <AddToCalendarModal
            open={showCalendarModal}
            onOpenChange={setShowCalendarModal}
            onAddToCalendar={handleAddToCalendarConfirm}
            recipeName={selectedRecipe?.title || "Selected Recipe"}
          />
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
};

export default SavedRecipesPage;
