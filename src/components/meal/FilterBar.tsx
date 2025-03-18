import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { X, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FilterBarProps {
  onFilterChange?: (filters: {
    dietaryRestrictions: string[];
    mealTypes: string[];
  }) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mealTypes, setMealTypes] = useState<string[]>([]);

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Carb",
    "Keto",
    "Paleo",
  ];

  const mealTypeOptions = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

  const handleDietaryChange = (value: string) => {
    setDietaryRestrictions((prev) => {
      const newFilters = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

      if (onFilterChange) {
        onFilterChange({
          dietaryRestrictions: newFilters,
          mealTypes,
        });
      }

      return newFilters;
    });
  };

  const handleMealTypeChange = (value: string) => {
    setMealTypes((prev) => {
      const newFilters = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

      if (onFilterChange) {
        onFilterChange({
          dietaryRestrictions,
          mealTypes: newFilters,
        });
      }

      return newFilters;
    });
  };

  const clearFilters = () => {
    setDietaryRestrictions([]);
    setMealTypes([]);

    if (onFilterChange) {
      onFilterChange({
        dietaryRestrictions: [],
        mealTypes: [],
      });
    }
  };

  const removeFilter = (type: "dietary" | "meal", value: string) => {
    if (type === "dietary") {
      handleDietaryChange(value);
    } else {
      handleMealTypeChange(value);
    }
  };

  return (
    <div className="w-full bg-white border-b p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Dietary Restrictions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {dietaryOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={dietaryRestrictions.includes(option)}
                  onCheckedChange={() => handleDietaryChange(option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Meal Type
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {mealTypeOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={mealTypes.includes(option)}
                  onCheckedChange={() => handleMealTypeChange(option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(dietaryRestrictions.length > 0 || mealTypes.length > 0) && (
            <Button variant="ghost" onClick={clearFilters} className="text-sm">
              Clear all
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {dietaryRestrictions.length + mealTypes.length > 0
            ? `${dietaryRestrictions.length + mealTypes.length} filters applied`
            : "No filters applied"}
        </div>
      </div>

      {(dietaryRestrictions.length > 0 || mealTypes.length > 0) && (
        <div className="mt-3">
          <Separator className="mb-3" />
          <div className="flex flex-wrap gap-2">
            {dietaryRestrictions.map((restriction) => (
              <Badge
                key={restriction}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {restriction}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter("dietary", restriction)}
                />
              </Badge>
            ))}
            {mealTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {type}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter("meal", type)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
