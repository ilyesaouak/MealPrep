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
  ChefHat,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

interface NavBarProps {
  activePage?: "home" | "calendar" | "inventory" | "saved" | "profile";
}

export const NavBar = ({ activePage = "home" }: NavBarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  // Remove Profile from default nav items
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Saved Recipes", path: "/saved", icon: BookMarked },
  ];

  return (
    <header className="w-full h-16 sm:h-20 bg-gradient-to-r from-emerald-600 to-teal-500 fixed top-0 left-0 z-50 shadow-lg">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center group scale-90 sm:scale-100"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-md transition-transform group-hover:scale-110">
              <ChefHat className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                MealPrep
              </h1>
              <span className="text-xs text-emerald-100 font-light">
                Luxury Meal Planning
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activePage === item.name.toLowerCase();
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-white text-emerald-600 font-medium shadow-md"
                    : "text-white hover:bg-emerald-500/50 hover:shadow-md",
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Show Profile link only when user is logged in */}
          {user && (
            <Link
              to="/profile"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
                activePage === "profile"
                  ? "bg-white text-emerald-600 font-medium shadow-md"
                  : "text-white hover:bg-emerald-500/50 hover:shadow-md",
              )}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          )}

          {/* Show Login/Sign Up button only when user is not logged in */}
          {!user && (
            <Button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 bg-white text-emerald-600 font-medium shadow-md hover:bg-emerald-50"
            >
              <LogIn size={18} />
              <span>Login / Sign Up</span>
            </Button>
          )}
        </nav>

        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-white hover:bg-emerald-500/50"
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
        <div className="md:hidden absolute top-16 sm:top-20 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-xl rounded-b-xl overflow-hidden backdrop-blur-lg bg-white/90">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.name.toLowerCase();
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full",
                    isActive
                      ? "bg-emerald-50 text-emerald-600 font-medium shadow-sm"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Show Profile link in mobile menu only when user is logged in */}
            {user && (
              <Link
                to="/profile"
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full",
                  activePage === "profile"
                    ? "bg-emerald-50 text-emerald-600 font-medium shadow-sm"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span className="font-medium">Profile</span>
              </Link>
            )}

            {/* Show Login/Sign Up button in mobile menu only when user is not logged in */}
            {!user && (
              <Button
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full bg-emerald-50 text-emerald-600 font-medium shadow-sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
              >
                <LogIn size={20} />
                <span className="font-medium">Login / Sign Up</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};
