import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
}

interface InventoryTabContentProps {
  user: User | null;
  onLoginRequired: () => void;
}

const InventoryTabContent: React.FC<InventoryTabContentProps> = ({
  user,
  onLoginRequired,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: 1,
    unit: "item",
    expiryDate: "",
  });

  useEffect(() => {
    if (user) {
      fetchIngredients();
    } else {
      // Demo data for non-logged in users
      setIngredients([
        {
          id: "1",
          name: "Quinoa",
          quantity: 2,
          unit: "cups",
        },
        {
          id: "2",
          name: "Bell Peppers",
          quantity: 3,
          unit: "whole",
        },
        {
          id: "3",
          name: "Chicken Breast",
          quantity: 1,
          unit: "lb",
          expiryDate: "2023-05-30",
        },
      ]);
      setLoading(false);
    }
  }, [user]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      if (!user) return;

      // Check if the ingredients table exists first
      const { error: tableCheckError } = await supabase
        .from("ingredients")
        .select("id")
        .limit(1);

      if (tableCheckError) {
        console.error("Ingredients table may not exist:", tableCheckError);
        throw tableCheckError;
      }

      const { data, error } = await supabase
        .from("ingredients")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform data to match our Ingredient interface
      const formattedData = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expiryDate: item.expiry_date,
      }));

      setIngredients(formattedData);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      // Set demo data on error
      setIngredients([
        {
          id: "1",
          name: "Quinoa",
          quantity: 2,
          unit: "cups",
        },
        {
          id: "2",
          name: "Bell Peppers",
          quantity: 3,
          unit: "whole",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredient.name) return;

    try {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("ingredients")
            .insert([
              {
                name: newIngredient.name,
                quantity: newIngredient.quantity,
                unit: newIngredient.unit,
                expiry_date: newIngredient.expiryDate || null,
                user_id: user.id,
              },
            ])
            .select();

          if (error) throw error;

          if (data && data.length > 0) {
            const newIngredientData: Ingredient = {
              id: data[0].id,
              name: data[0].name,
              quantity: data[0].quantity,
              unit: data[0].unit,
              expiryDate: data[0].expiry_date,
            };
            setIngredients([...ingredients, newIngredientData]);
          }
        } catch (dbError) {
          console.error("Database error adding ingredient:", dbError);
          // Fall back to demo mode if database operation fails
          const demoIngredient: Ingredient = {
            id: `temp-${Date.now()}`,
            name: newIngredient.name,
            quantity: newIngredient.quantity,
            unit: newIngredient.unit,
            expiryDate: newIngredient.expiryDate,
          };
          setIngredients([...ingredients, demoIngredient]);
        }
      } else {
        // Demo mode - just add to local state
        const demoIngredient: Ingredient = {
          id: `temp-${Date.now()}`,
          name: newIngredient.name,
          quantity: newIngredient.quantity,
          unit: newIngredient.unit,
          expiryDate: newIngredient.expiryDate,
        };
        setIngredients([...ingredients, demoIngredient]);
      }

      // Reset form
      setNewIngredient({
        name: "",
        quantity: 1,
        unit: "item",
        expiryDate: "",
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const handleRemoveIngredient = async (id: string) => {
    try {
      if (user) {
        try {
          const { error } = await supabase
            .from("ingredients")
            .delete()
            .eq("id", id);

          if (error) throw error;
        } catch (dbError) {
          console.error("Database error removing ingredient:", dbError);
          // Continue with UI update even if database operation fails
        }
      }

      // Update local state regardless of backend success
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    } catch (error) {
      console.error("Error removing ingredient:", error);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      if (user) {
        try {
          const { error } = await supabase
            .from("ingredients")
            .update({ quantity: newQuantity })
            .eq("id", id);

          if (error) throw error;
        } catch (dbError) {
          console.error(
            "Database error updating ingredient quantity:",
            dbError,
          );
          // Continue with UI update even if database operation fails
        }
      }

      // Update local state regardless of backend success
      setIngredients(
        ingredients.map((ing) =>
          ing.id === id ? { ...ing, quantity: newQuantity } : ing,
        ),
      );
    } catch (error) {
      console.error("Error updating ingredient quantity:", error);
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="p-12 border-2 border-dashed rounded-lg text-center">
        <h3 className="text-xl font-medium text-gray-500">
          Ingredient Inventory
        </h3>
        <p className="mt-2 text-gray-400">
          Log in to manage your ingredient inventory
        </p>
        <Button className="mt-4" onClick={onLoginRequired}>
          Log In to Manage Ingredients
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Ingredient Inventory</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Ingredient
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : ingredients.length === 0 ? (
        <Card className="w-full p-10 text-center">
          <CardContent>
            <p className="text-gray-500 mb-4">
              Your inventory is empty. Add ingredients to get started!
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Ingredient
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ingredient) => (
            <Card key={ingredient.id} className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ingredient.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(
                          ingredient.id,
                          ingredient.quantity - 1,
                        )
                      }
                      disabled={ingredient.quantity <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {ingredient.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(
                          ingredient.id,
                          ingredient.quantity + 1,
                        )
                      }
                    >
                      +
                    </Button>
                    <span className="text-gray-500">{ingredient.unit}</span>
                  </div>
                </div>
                {ingredient.expiryDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Expires:{" "}
                    {new Date(ingredient.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Ingredient Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Ingredient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Ingredient Name</Label>
              <Input
                id="name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Quinoa"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newIngredient.quantity}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newIngredient.unit}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      unit: e.target.value,
                    })
                  }
                  placeholder="e.g. cups"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newIngredient.expiryDate}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    expiryDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIngredient}>Add Ingredient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryTabContent;
