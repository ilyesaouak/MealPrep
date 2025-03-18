import React from "react";
import CalendarView from "./CalendarView";
import { NavBar } from "../layout/NavBar";

const CalendarPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activePage="calendar" />
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              Meal Calendar
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
            Elegantly plan and organize your meals for the week
          </p>
        </div>
        <CalendarView />
      </div>
    </div>
  );
};

export default CalendarPage;
