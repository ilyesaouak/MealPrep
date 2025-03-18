import React, { useState } from "react";
import MealCard from "./MealCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Meal {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  ingredientCount: number;
  isSaved: boolean;
}

interface MealGridProps {
  meals?: Meal[];
  onMealClick?: (id: string) => void;
  onSaveMeal?: (id: string) => void;
  onAddToCalendar?: (id: string) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
}

const MealGrid = ({
  meals = [
    {
      id: "meal-1",
      title: "Quinoa Bowl with Roasted Vegetables",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
      prepTime: 25,
      ingredientCount: 8,
      isSaved: false,
    },
    {
      id: "meal-2",
      title: "Avocado Toast with Poached Eggs",
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80",
      prepTime: 15,
      ingredientCount: 5,
      isSaved: true,
    },
    {
      id: "meal-3",
      title: "Mediterranean Chickpea Salad",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80",
      prepTime: 20,
      ingredientCount: 10,
      isSaved: false,
    },
    {
      id: "meal-4",
      title: "Grilled Salmon with Asparagus",
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80",
      prepTime: 30,
      ingredientCount: 7,
      isSaved: false,
    },
    {
      id: "meal-5",
      title: "Vegetable Stir Fry with Tofu",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80",
      prepTime: 25,
      ingredientCount: 12,
      isSaved: false,
    },
    {
      id: "meal-6",
      title: "Berry Smoothie Bowl",
      image:
        "https://images.unsplash.com/photo-1490323948693-4b5f7e54b888?w=500&q=80",
      prepTime: 10,
      ingredientCount: 6,
      isSaved: true,
    },
    {
      id: "meal-7",
      title: "Lentil Soup with Fresh Herbs",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80",
      prepTime: 40,
      ingredientCount: 9,
      isSaved: false,
    },
    {
      id: "meal-8",
      title: "Sweet Potato and Black Bean Tacos",
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80",
      prepTime: 35,
      ingredientCount: 10,
      isSaved: false,
    },
    {
      id: "meal-9",
      title: "Greek Yogurt Parfait",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80",
      prepTime: 10,
      ingredientCount: 5,
      isSaved: true,
    },
  ],
  onMealClick = () => {},
  onSaveMeal = () => {},
  onAddToCalendar = () => {},
  isLoading = false,
  itemsPerPage = 6,
}: MealGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(meals.length / itemsPerPage);

  // Get current meals
  const indexOfLastMeal = currentPage * itemsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - itemsPerPage;
  const currentMeals = meals.slice(indexOfFirstMeal, indexOfLastMeal);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 p-3 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {currentMeals.map((meal) => (
          <MealCard
            key={meal.id}
            id={meal.id}
            title={meal.title}
            image={meal.image}
            prepTime={meal.prepTime}
            ingredientCount={meal.ingredientCount}
            isSaved={meal.isSaved}
            onClick={onMealClick}
            onSave={onSaveMeal}
            onAddToCalendar={onAddToCalendar}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealGrid;
