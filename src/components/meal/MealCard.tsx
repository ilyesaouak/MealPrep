import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Heart, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMealContext } from "@/context/MealContext";

interface MealCardProps {
  id?: string;
  title?: string;
  image?: string;
  prepTime?: number;
  ingredientCount?: number;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onAddToCalendar?: (id: string) => void;
  onClick?: (id: string) => void;
}

const MealCard = ({
  id = "meal-1",
  title = "Quinoa Bowl with Roasted Vegetables",
  image = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  prepTime = 25,
  ingredientCount = 8,
  isSaved = false,
  onSave = () => {},
  onAddToCalendar = () => {},
  onClick = () => {},
}: MealCardProps) => {
  const { toggleSaveMeal, savedMeals } = useMealContext();
  // Ensure isSaved is always in sync with the context
  const isActuallySaved = savedMeals.includes(id);
  return (
    <Card className="w-full max-w-[350px] h-[380px] overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">
      <div
        className="relative h-48 w-full cursor-pointer"
        onClick={() => onClick(id)}
      >
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90",
            isActuallySaved ? "text-red-500" : "text-gray-500",
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveMeal(id);
            onSave(id);
          }}
        >
          <Heart
            className={cn("h-5 w-5", isActuallySaved ? "fill-current" : "")}
          />
        </Button>
      </div>

      <CardHeader className="p-4 pb-0">
        <CardTitle
          className="text-lg font-bold line-clamp-2 cursor-pointer"
          onClick={() => onClick(id)}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{prepTime} min</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{ingredientCount} ingredients</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 mr-2"
          onClick={() => onClick(id)}
        >
          View Recipe
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCalendar(id);
          }}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Add to Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealCard;
