import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserPreferencesProps {
  userId: string;
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

const UserPreferences: React.FC<UserPreferencesProps> = ({ userId }) => {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferencesId, setPreferencesId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching preferences:", error);
          return;
        }

        if (data) {
          setPreferencesId(data.id);
          setSelectedDietary(data.dietary_restrictions || []);
          setSelectedMeals(data.meal_preferences || []);
          setSelectedCuisines(data.cuisine_preferences || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

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

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let response;

      if (preferencesId) {
        // Update existing preferences
        response = await supabase
          .from("user_preferences")
          .update({
            dietary_restrictions: selectedDietary,
            meal_preferences: selectedMeals,
            cuisine_preferences: selectedCuisines,
            updated_at: new Date().toISOString(),
          })
          .eq("id", preferencesId);
      } else {
        // Insert new preferences
        response = await supabase.from("user_preferences").insert({
          user_id: userId,
          dietary_restrictions: selectedDietary,
          meal_preferences: selectedMeals,
          cuisine_preferences: selectedCuisines,
        });
      }

      if (response.error) {
        throw response.error;
      }

      setSuccess(true);

      // If this was a new insert, get the ID for future updates
      if (!preferencesId) {
        const { data } = await supabase
          .from("user_preferences")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (data) {
          setPreferencesId(data.id);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save preferences");
      console.error("Error saving preferences:", err);
    } finally {
      setSaving(false);

      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Preferences saved successfully!</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="font-medium mb-3 text-gray-900">Dietary Restrictions</h3>
        <div className="flex flex-wrap gap-2">
          {dietaryRestrictions.map((diet) => (
            <Button
              key={diet}
              type="button"
              variant={selectedDietary.includes(diet) ? "default" : "outline"}
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
        <h3 className="font-medium mb-3 text-gray-900">Cuisine Preferences</h3>
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
                toggleSelection(cuisine, selectedCuisines, setSelectedCuisines)
              }
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="bg-emerald-600 hover:bg-emerald-700"
        disabled={saving}
      >
        {saving ? (
          "Saving..."
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" /> Save Preferences
          </>
        )}
      </Button>
    </div>
  );
};

export default UserPreferences;
