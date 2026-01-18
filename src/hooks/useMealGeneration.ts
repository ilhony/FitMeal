import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedMeal {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  title: string;
  ingredients: string;
  calories: number;
  tag: string;
  protein: number;
  carbs: number;
  fat: number;
}

export const useMealGeneration = () => {
  const [meals, setMeals] = useState<GeneratedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-meals", {
        body: {},
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const mealsWithIds = data.meals.map((meal: Omit<GeneratedMeal, "id">, index: number) => ({
        ...meal,
        id: `meal-${index}-${Date.now()}`,
      }));

      setMeals(mealsWithIds);
      toast({
        title: "Meals generated!",
        description: "Your personalized meal plan is ready.",
      });
    } catch (error) {
      console.error("Error generating meals:", error);
      toast({
        title: "Failed to generate meals",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshMeal = useCallback(async (mealType: string) => {
    setIsRefreshing(mealType);
    try {
      const { data, error } = await supabase.functions.invoke("generate-meals", {
        body: { mealType },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const newMeal = data.meals[0];
      if (newMeal) {
        setMeals((prev) =>
          prev.map((meal) =>
            meal.type === mealType
              ? { ...newMeal, id: `meal-${mealType}-${Date.now()}` }
              : meal
          )
        );
        toast({
          title: "Meal refreshed!",
          description: `New ${mealType} suggestion ready.`,
        });
      }
    } catch (error) {
      console.error("Error refreshing meal:", error);
      toast({
        title: "Failed to refresh meal",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(null);
    }
  }, [toast]);

  return {
    meals,
    isLoading,
    isRefreshing,
    generateMeals,
    refreshMeal,
    setMeals,
  };
};
