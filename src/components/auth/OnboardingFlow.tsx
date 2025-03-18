import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import DietaryPreferencesForm from "./DietaryPreferencesForm";
import { supabase } from "@/lib/supabase";

const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const checkPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking preferences:", error);
        }

        setHasPreferences(!!data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkPreferences();
  }, [user, navigate]);

  const handleComplete = () => {
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (hasPreferences) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Meal Prep App
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's set up your preferences to personalize your experience
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {step === 1 && (
          <DietaryPreferencesForm
            userId={user.id}
            onComplete={handleComplete}
            onSkip={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
