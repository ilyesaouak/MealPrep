import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealContext } from "@/context/MealContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Clock,
  Users,
  BookOpen,
  Heart,
  Calendar,
  Plus,
  Minus,
} from "lucide-react";

interface RecipeDetailModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  recipe?: {
    id: string;
    title: string;
    image: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    ingredients: { name: string; amount: string; unit: string }[];
    instructions: string[];
    dietaryTags: string[];
  };
}

const RecipeDetailModal = ({
  isOpen = true,
  onClose = () => {},
  recipe = {
    id: "1",
    title: "Vegetable Stir Fry with Tofu",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
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
  },
}: RecipeDetailModalProps) => {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState("ingredients");

  const handleIncreaseServings = () => {
    setServings((prev) => prev + 1);
  };

  const handleDecreaseServings = () => {
    if (servings > 1) {
      setServings((prev) => prev - 1);
    }
  };

  // Calculate adjusted ingredient amounts based on servings
  const getAdjustedAmount = (amount: string) => {
    const originalAmount = parseFloat(amount);
    const ratio = servings / recipe.servings;
    return (originalAmount * ratio).toFixed(1).replace(/\.0$/, "");
  };

  const { user } = useAuth();
  const { toggleSaveMeal, savedMeals } = useMealContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSaveRecipe = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      await toggleSaveMeal(recipe.id);
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsAddingToCalendar(true);
    // Use the global function to open the calendar modal
    if (window.openAddToCalendarModal) {
      onClose(); // Close the recipe modal first
      window.openAddToCalendarModal(recipe.id, recipe.title);
    }
    setIsAddingToCalendar(false);
  };

  const isSaved = savedMeals.includes(recipe.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-100 -m-6 mb-4 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {recipe.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipe.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm mt-1">
                      Prep: {recipe.prepTime} min
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <span className="text-sm mt-1">
                      Cook: {recipe.cookTime} min
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-sm mt-1">Serves: {servings}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant={isSaved ? "default" : "outline"}
                  className="flex-1"
                  onClick={handleSaveRecipe}
                  disabled={isSaving}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                  />
                  {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Recipe"}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddToCalendar}
                  disabled={isAddingToCalendar}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isAddingToCalendar ? "Adding..." : "Add to Calendar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="ingredients"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="space-y-4">
            <div className="flex items-center justify-between mt-4">
              <h3 className="font-medium">Adjust Servings</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecreaseServings}
                  disabled={servings <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{servings}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncreaseServings}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{ingredient.name}</span>
                    <span className="text-gray-600">
                      {getAdjustedAmount(ingredient.amount)} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Step by Step Instructions</h3>
              <ol className="space-y-4 list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="pl-2">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6">
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => {}}>Print Recipe</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
