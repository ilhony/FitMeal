import { useEffect, useState } from "react";
import { SlidersHorizontal, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MealCard } from "@/components/MealCard";
import { useMealGeneration, GeneratedMeal } from "@/hooks/useMealGeneration";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Meals = () => {
  const { user } = useAuth();
  const { meals, isLoading, isRefreshing, generateMeals, refreshMeal } = useMealGeneration();
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  useEffect(() => {
    const fetchCalorieGoal = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("calorie_goal")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.calorie_goal) {
        setCalorieGoal(data.calorie_goal);
      }
    };
    fetchCalorieGoal();
  }, [user]);

  useEffect(() => {
    if (user && meals.length === 0 && !isLoading) {
      generateMeals();
    }
  }, [user, meals.length, isLoading, generateMeals]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

  const mealsByType = {
    breakfast: meals.find((m) => m.type === "breakfast"),
    lunch: meals.find((m) => m.type === "lunch"),
    dinner: meals.find((m) => m.type === "dinner"),
    snack: meals.find((m) => m.type === "snack"),
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meal Plan</h1>
            <button className="flex items-center gap-1 text-primary text-sm mt-1">
              Today, {formattedDate}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2 hover:bg-muted/50 rounded-xl border border-border">
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Daily Target Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Daily Target</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-foreground">{totalCalories.toLocaleString()}</span>
                <span className="text-muted-foreground">/ {calorieGoal.toLocaleString()} Kcal</span>
              </div>
            </div>
            <button
              onClick={generateMeals}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>

          {/* Macro Bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-14">Protein</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-violet-500 rounded-full transition-all" 
                  style={{ width: `${Math.min((totalProtein / 140) * 100, 100)}%` }} 
                />
              </div>
              <span className="text-sm text-foreground w-12 text-right">{totalProtein}g</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-14">Carbs</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all" 
                  style={{ width: `${Math.min((totalCarbs / 200) * 100, 100)}%` }} 
                />
              </div>
              <span className="text-sm text-foreground w-12 text-right">{totalCarbs}g</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-14">Fat</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all" 
                  style={{ width: `${Math.min((totalFat / 70) * 100, 100)}%` }} 
                />
              </div>
              <span className="text-sm text-foreground w-12 text-right">{totalFat}g</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && meals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Generating your personalized meal plan...</p>
            <p className="text-sm text-muted-foreground mt-1">Based on your goals and preferences</p>
          </div>
        )}

        {/* Meal Sections */}
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => {
          const meal = mealsByType[type];
          if (!meal && !isLoading) return null;

          return (
            <div key={type} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground capitalize">{type}</h2>
                {meal && <span className="text-sm text-muted-foreground">{meal.time}</span>}
              </div>
              {meal ? (
                <MealCard
                  title={meal.title}
                  ingredients={meal.ingredients}
                  calories={meal.calories}
                  tag={meal.tag}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fat={meal.fat}
                  onRefresh={() => refreshMeal(type)}
                  isRefreshing={isRefreshing === type}
                />
              ) : (
                <div className="bg-card rounded-2xl p-4 shadow-sm border border-border animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-muted/50" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted/50 rounded w-3/4" />
                      <div className="h-4 bg-muted/50 rounded w-1/2" />
                      <div className="h-4 bg-muted/50 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Meals;
