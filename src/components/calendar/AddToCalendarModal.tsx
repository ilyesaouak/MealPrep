import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddToCalendarModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddToCalendar?: (date: Date, mealType: string) => void;
  recipeName?: string;
}

const AddToCalendarModal = ({
  open = true,
  onOpenChange = () => {},
  onAddToCalendar = () => {},
  recipeName = "Delicious Recipe",
}: AddToCalendarModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mealType, setMealType] = useState("breakfast");

  const handleAddToCalendar = () => {
    if (date) {
      onAddToCalendar(date, mealType);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Schedule "{recipeName}" for your meal plan
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Meal Type</h3>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {date && (
            <div className="mt-2 rounded-md bg-slate-50 p-3">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Selected:</span>{" "}
                {format(date, "PPPP")} -{" "}
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddToCalendar} disabled={!date}>
            Add to Calendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCalendarModal;
