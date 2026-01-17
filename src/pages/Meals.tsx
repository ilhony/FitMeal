import { useState } from "react";
import { SlidersHorizontal, ChevronDown, RefreshCw } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MealCard } from "@/components/MealCard";
import oatmealBowl from "@/assets/oatmeal-bowl.jpg";
import chickenSalad from "@/assets/chicken-salad.jpg";
import salmonDinner from "@/assets/salmon-dinner.jpg";
import greenSmoothie from "@/assets/green-smoothie.jpg";

interface Meal {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  title: string;
  ingredients: string;
  calories: number;
  tag: string;
  image: string;
}

const initialMeals: Meal[] = [
  {
    id: "1",
    type: "breakfast",
    time: "08:30 AM",
    title: "Berry Oatmeal Bowl",
    ingredients: "Oats, Blueberries, Almonds",
    calories: 350,
    tag: "High Fiber",
    image: oatmealBowl,
  },
  {
    id: "2",
    type: "lunch",
    time: "12:30 PM",
    title: "Grilled Chicken Salad",
    ingredients: "Chicken, Lettuce, Tomato",
    calories: 550,
    tag: "High Protein",
    image: chickenSalad,
  },
  {
    id: "3",
    type: "dinner",
    time: "07:00 PM",
    title: "Salmon & Asparagus",
    ingredients: "Salmon, Asparagus, Lemon",
    calories: 600,
    tag: "Keto Friendly",
    image: salmonDinner,
  },
  {
    id: "4",
    type: "snack",
    time: "04:00 PM",
    title: "Green Detox Smoothie",
    ingredients: "Spinach, Apple, Ginger",
    calories: 180,
    tag: "Vegan",
    image: greenSmoothie,
  },
];

const alternativeMeals: Record<string, Omit<Meal, "id" | "type" | "time">> = {
  breakfast: {
    title: "Avocado Toast",
    ingredients: "Sourdough, Avocado, Eggs",
    calories: 420,
    tag: "High Protein",
    image: oatmealBowl,
  },
  lunch: {
    title: "Quinoa Buddha Bowl",
    ingredients: "Quinoa, Chickpeas, Veggies",
    calories: 480,
    tag: "Vegan",
    image: chickenSalad,
  },
  dinner: {
    title: "Grilled Steak & Broccoli",
    ingredients: "Ribeye, Broccoli, Garlic",
    calories: 650,
    tag: "High Protein",
    image: salmonDinner,
  },
  snack: {
    title: "Greek Yogurt Parfait",
    ingredients: "Yogurt, Granola, Honey",
    calories: 220,
    tag: "Low Fat",
    image: greenSmoothie,
  },
};

const Meals = () => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const handleRefresh = (mealId: string) => {
    setMeals((prev) =>
      prev.map((meal) => {
        if (meal.id === mealId) {
          const alt = alternativeMeals[meal.type];
          // Toggle between original and alternative
          if (meal.title === initialMeals.find((m) => m.id === mealId)?.title) {
            return { ...meal, ...alt };
          }
          const original = initialMeals.find((m) => m.id === mealId);
          if (original) {
            return { ...meal, title: original.title, ingredients: original.ingredients, calories: original.calories, tag: original.tag };
          }
        }
        return meal;
      })
    );
  };

  const handleRegenerate = () => {
    // Shuffle meals to simulate regeneration
    setMeals((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

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
                <span className="text-muted-foreground">/ 2000 Kcal</span>
              </div>
            </div>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Regenerate
            </button>
          </div>

          {/* Macro Bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-14">Protein</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: "85%" }} />
              </div>
              <span className="text-sm text-foreground w-12 text-right">120g</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-14">Carbs</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "72%" }} />
              </div>
              <span className="text-sm text-foreground w-12 text-right">145g</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-14">Fat</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "55%" }} />
              </div>
              <span className="text-sm text-foreground w-12 text-right">55g</span>
            </div>
          </div>
        </div>

        {/* Meal Sections */}
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => {
          const meal = mealsByType[type];
          if (!meal) return null;

          return (
            <div key={type} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground capitalize">{type}</h2>
                <span className="text-sm text-muted-foreground">{meal.time}</span>
              </div>
              <MealCard
                image={meal.image}
                title={meal.title}
                ingredients={meal.ingredients}
                calories={meal.calories}
                tag={meal.tag}
                onRefresh={() => handleRefresh(meal.id)}
              />
            </div>
          );
        })}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Meals;
