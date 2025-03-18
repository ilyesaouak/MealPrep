import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  UtensilsCrossed,
} from "lucide-react";
import { useMealContext } from "@/context/MealContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "../auth/AuthModal";
import AddToCalendarModal from "./AddToCalendarModal";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CalendarViewProps {
  onAddMeal?: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  onAddMeal = () => {},
}) => {
  const { user } = useAuth();
  const { calendarEntries, removeFromCalendar } = useMealContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>("");

  // Get the start of the week (Monday)
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate the days of the week
  const weekDays = [...Array(7)].map((_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return {
      date: day,
      dayName: format(day, "EEE"),
      dayNumber: format(day, "d"),
    };
  });

  // Group entries by day and meal type
  const getEntriesForDay = (date: Date) => {
    return calendarEntries.filter((entry) =>
      isSameDay(new Date(entry.date), date),
    );
  };

  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleRemoveEntry = async (entryId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await removeFromCalendar(entryId);
  };

  const handleAddToCalendar = async (date: Date, mealType: string) => {
    // This is a placeholder - in a real app, you'd select a meal first
    // For now, we'll just close the modal
    setShowAddModal(false);
  };

  const openAddModal = (date: Date, mealType: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowAddModal(true);
  };

  // Get placeholder image based on meal type
  const getMealTypeImage = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6a4?w=300&q=80";
      case "lunch":
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80";
      case "dinner":
        return "https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&q=80";
      case "snack":
        return "https://images.unsplash.com/photo-1616645258469-ec681c17f3ee?w=300&q=80";
      default:
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80";
    }
  };

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 bg-white rounded-lg shadow-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Meal Calendar</h2>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 items-center bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousWeek}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="py-1 px-3 font-medium text-sm">
              {format(startOfCurrentWeek, "MMM d")} -{" "}
              {format(addDays(startOfCurrentWeek, 6), "MMM d, yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextWeek}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-4 sm:mb-6 min-w-[640px]">
        {weekDays.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`text-center p-1 sm:p-2 rounded-lg font-medium text-xs sm:text-sm ${
              isSameDay(day.date, new Date())
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50"
            }`}
          >
            <div>{day.dayName}</div>
            <div className="text-lg">{day.dayNumber}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-3 min-w-[640px]">
        {weekDays.map((day) => (
          <div
            key={`content-${day.date.toISOString()}`}
            className="space-y-2 sm:space-y-3 bg-muted/20 rounded-lg p-1 sm:p-2"
          >
            {mealTypes.map((mealType) => {
              const entries = getEntriesForDay(day.date).filter(
                (entry) => entry.mealType.toLowerCase() === mealType,
              );

              return (
                <div
                  key={`${day.date.toISOString()}-${mealType}`}
                  className="relative"
                >
                  <div className="text-xs font-medium text-gray-500 mb-1 flex justify-between items-center">
                    <span>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={() => openAddModal(day.date, mealType)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <Card
                        key={entry.id}
                        className="mb-2 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <AspectRatio ratio={16 / 9} className="bg-muted">
                          <img
                            src={entry.imageUrl || getMealTypeImage(mealType)}
                            alt={entry.title}
                            className="object-cover w-full h-full rounded-t-md"
                          />
                        </AspectRatio>
                        <CardContent className="p-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-xs truncate">
                              {entry.title}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveEntry(entry.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 text-gray-400">
                      <UtensilsCrossed className="h-4 w-4 mb-1 opacity-50" />
                      <span className="text-xs italic">No meals</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Add to Calendar Modal */}
      <AddToCalendarModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddToCalendar={handleAddToCalendar}
        recipeName="Select a meal"
      />
    </div>
  );
};

export default CalendarView;
