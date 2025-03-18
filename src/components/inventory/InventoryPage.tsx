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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Package, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { NavBar } from "../layout/NavBar";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
}

const InventoryPage = () => {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activePage="inventory" />
      <div className="pt-24 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              My Ingredient Inventory
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
            Curate and manage your premium ingredients and pantry essentials
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : ingredients.length === 0 ? (
          <Card className="w-full p-12 text-center bg-gradient-to-br from-white to-emerald-50 border-0 shadow-xl rounded-2xl">
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Package className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Your Pantry Awaits
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your inventory is currently empty. Add your first ingredient to
                begin creating exquisite meals.
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Your First Ingredient
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {ingredients.map((ingredient) => (
              <Card
                key={ingredient.id}
                className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1"
              >
                <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {ingredient.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
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
                      <span className="w-10 text-center text-lg font-medium">
                        {ingredient.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() =>
                          handleUpdateQuantity(
                            ingredient.id,
                            ingredient.quantity + 1,
                          )
                        }
                      >
                        +
                      </Button>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                        {ingredient.unit}
                      </Badge>
                    </div>
                  </div>
                  {ingredient.expiryDate && (
                    <div className="flex items-center mt-3 text-sm text-gray-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      Expires:{" "}
                      {new Date(ingredient.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full rounded-lg"
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
    </div>
  );
};

export default InventoryPage;
