import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ProfilePage from "./components/profile/ProfilePage";
import SavedRecipesPage from "./components/saved/SavedRecipesPage";
import InventoryPage from "./components/inventory/InventoryPage";
import CalendarPage from "./components/calendar/CalendarPage";
import routes from "tempo-routes";
import { AuthProvider } from "./context/AuthContext";
import { MealProvider } from "./context/MealContext";

function App() {
  return (
    <AuthProvider>
      <MealProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <p className="text-xl">Loading...</p>
            </div>
          }
        >
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/saved" element={<SavedRecipesPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              {/* Add a catch-all route that redirects to home */}
              <Route path="*" element={<Home />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </Suspense>
      </MealProvider>
    </AuthProvider>
  );
}

export default App;
