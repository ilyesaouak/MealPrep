import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  Package,
  BookMarked,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activePage?: "home" | "calendar" | "inventory" | "saved" | "profile";
}

const Header = ({ activePage = "home" }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Saved Recipes", path: "/saved", icon: BookMarked },
  ];

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-emerald-600">MealPrep</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = activePage === item.name.toLowerCase();
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-medium"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50",
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Profile link */}
          <Link
            to="/profile"
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
              activePage === "profile"
                ? "bg-emerald-50 text-emerald-600 font-medium"
                : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50",
            )}
          >
            <User size={18} />
            <span>Profile</span>
          </Link>
        </nav>

        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.name.toLowerCase();
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-md transition-colors w-full",
                    isActive
                      ? "bg-emerald-50 text-emerald-600 font-medium"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Profile link for mobile */}
            <Link
              to="/profile"
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-md transition-colors w-full",
                activePage === "profile"
                  ? "bg-emerald-50 text-emerald-600 font-medium"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
