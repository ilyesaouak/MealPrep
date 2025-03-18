import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FilterBar from "./meal/FilterBar";
import MealGrid from "./meal/MealGrid";
import RecipeDetailModal from "./meal/RecipeDetailModal";
import AddToCalendarModal from "./calendar/AddToCalendarModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, LogIn } from "lucide-react";
import { useMealContext } from "@/context/MealContext";
import { useAuth } from "@/context/AuthContext";
import CalendarView from "./calendar/CalendarView";
import AuthModal from "./auth/AuthModal";
import { fetchMealById } from "@/services/mealService";
import { Meal } from "@/types/meal";
import InventoryTabContent from "./inventory/InventoryTabContent";
import { NavBar } from "./layout/NavBar";

interface HomeProps {
  // Props can be added here if needed
}

const Home: React.FC<HomeProps> = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    meals,
    savedMeals,
    toggleSaveMeal,
    addToCalendar,
    getFilteredMeals,
    loading,
  } = useMealContext();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedMealForCalendar, setSelectedMealForCalendar] = useState<
    string | null
  >(null);
  const [activeFilters, setActiveFilters] = useState({
    dietaryRestrictions: [] as string[],
    mealTypes: [] as string[],
  });
  const [filteredMeals, setFilteredMeals] = useState(meals);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);

  // Default recipe data
  const defaultRecipe = {
    id: "1",
    title: "Vegetable Stir Fry with Tofu",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    ingredientCount: 9,
    isSaved: false,
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

  // Handler for meal card clicks
  const handleMealClick = async (id: string) => {
    setSelectedRecipeId(id);

    // Try to fetch the meal details from the backend
    if (user) {
      try {
        const mealDetails = await fetchMealById(id);
        if (mealDetails) {
          setSelectedRecipe(mealDetails);
        } else {
          // If not found, use the default recipe
          setSelectedRecipe(defaultRecipe);
        }
      } catch (error) {
        console.error("Error fetching meal details:", error);
        setSelectedRecipe(defaultRecipe);
      }
    } else {
      // In demo mode, use the default recipe
      setSelectedRecipe(defaultRecipe);
    }

    setShowRecipeModal(true);
  };

  // Update filtered meals when filters change
  useEffect(() => {
    const applyFilters = async () => {
      const filtered = await getFilteredMeals(activeFilters);
      setFilteredMeals(filtered);
    };
    applyFilters();
  }, [activeFilters, getFilteredMeals]);

  // Update filtered meals when meals change
  useEffect(() => {
    setFilteredMeals(meals);
  }, [meals]);

  // Handler for saving meals
  const handleSaveMeal = async (id: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await toggleSaveMeal(id);
  };

  // Handler for adding meals to calendar
  const handleAddToCalendar = (id: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedMealForCalendar(id);
    setShowCalendarModal(true);
  };

  // Handler for filter changes
  const handleFilterChange = (filters: {
    dietaryRestrictions: string[];
    mealTypes: string[];
  }) => {
    setActiveFilters(filters);
  };

  // Handler for adding to calendar from modal
  const handleAddToCalendarConfirm = async (date: Date, mealType: string) => {
    if (selectedMealForCalendar) {
      const selectedMeal = meals.find(
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

  // Add a global function to open the calendar modal from anywhere
  React.useEffect(() => {
    window.openAddToCalendarModal = (mealId: string, recipeName: string) => {
      setSelectedMealForCalendar(mealId);
      setSelectedRecipe(meals.find((meal) => meal.id === mealId) || null);
      setShowCalendarModal(true);
    };

    return () => {
      // Clean up when component unmounts
      delete window.openAddToCalendarModal;
    };
  }, [meals]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activePage="home" />

      <div className="pt-24 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              Meal Prep Suggestions
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
            Discover exquisite recipes tailored to your preferences and dietary
            needs
          </p>
        </div>

        <main>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsContent value="suggestions" className="space-y-6">
                <FilterBar onFilterChange={handleFilterChange} />
                <MealGrid
                  meals={filteredMeals}
                  onMealClick={handleMealClick}
                  onSaveMeal={handleSaveMeal}
                  onAddToCalendar={handleAddToCalendar}
                />
              </TabsContent>

              <TabsContent value="calendar" className="p-4">
                <div className="text-center p-4">
                  <Button onClick={() => navigate("/calendar")}>
                    Go to Calendar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="p-4">
                <div className="text-center p-4">
                  <Button onClick={() => navigate("/inventory")}>
                    Go to Inventory
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="saved" className="p-4">
                <div className="text-center p-4">
                  <Button onClick={() => navigate("/saved")}>
                    Go to Saved Recipes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>

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
          recipeName={
            selectedRecipe?.title ||
            (selectedMealForCalendar
              ? meals.find((m) => m.id === selectedMealForCalendar)?.title
              : defaultRecipe.title)
          }
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Home;
