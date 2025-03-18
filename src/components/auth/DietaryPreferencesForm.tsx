import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface DietaryPreferencesFormProps {
  userId: string;
  onComplete: () => void;
  onSkip?: () => void;
}

const dietaryRestrictions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "Keto",
  "Paleo",
  "Nut-Free",
];

const mealPreferences = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Drinks",
  "Quick Meals",
  "Batch Cooking",
];

const cuisinePreferences = [
  "Italian",
  "Mexican",
  "Asian",
  "Mediterranean",
  "Indian",
  "American",
  "French",
  "Middle Eastern",
];

const DietaryPreferencesForm: React.FC<DietaryPreferencesFormProps> = ({
  userId,
  onComplete,
  onSkip = () => {},
}) => {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("user_preferences").insert({
        user_id: userId,
        dietary_restrictions: selectedDietary,
        meal_preferences: selectedMeals,
        cuisine_preferences: selectedCuisines,
      });

      if (error) {
        throw error;
      }

      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save preferences");
      console.error("Error saving preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Dietary Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-medium mb-3 text-gray-900">
              Dietary Restrictions
            </h3>
            <div className="flex flex-wrap gap-2">
              {dietaryRestrictions.map((diet) => (
                <Button
                  key={diet}
                  type="button"
                  variant={
                    selectedDietary.includes(diet) ? "default" : "outline"
                  }
                  size="sm"
                  className={`rounded-full ${selectedDietary.includes(diet) ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  onClick={() =>
                    toggleSelection(diet, selectedDietary, setSelectedDietary)
                  }
                >
                  {diet}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-gray-900">Meal Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {mealPreferences.map((meal) => (
                <Button
                  key={meal}
                  type="button"
                  variant={selectedMeals.includes(meal) ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${selectedMeals.includes(meal) ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  onClick={() =>
                    toggleSelection(meal, selectedMeals, setSelectedMeals)
                  }
                >
                  {meal}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-gray-900">
              Cuisine Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {cuisinePreferences.map((cuisine) => (
                <Button
                  key={cuisine}
                  type="button"
                  variant={
                    selectedCuisines.includes(cuisine) ? "default" : "outline"
                  }
                  size="sm"
                  className={`rounded-full ${selectedCuisines.includes(cuisine) ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  onClick={() =>
                    toggleSelection(
                      cuisine,
                      selectedCuisines,
                      setSelectedCuisines,
                    )
                  }
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Preferences
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={onSkip} className="text-gray-500">
          Skip for now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DietaryPreferencesForm;
