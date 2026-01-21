import { useEffect, useState } from "react";
import { MoreVertical, Droplets, Footprints, ChevronRight, Plus } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CalorieRing } from "@/components/CalorieRing";
import { MacroBar } from "@/components/MacroBar";
import { WorkoutPlanCard } from "@/components/WorkoutPlanCard";
import { WeightTracker } from "@/components/WeightTracker";
import { StatCard } from "@/components/StatCard";
import { LogWaterSheet } from "@/components/LogWaterSheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import oatmealBowl from "@/assets/oatmeal-bowl.jpg";

interface Profile {
  display_name: string;
  calorie_goal: number;
  avatar_url: string | null;
}

interface DailyProgress {
  calories_consumed: number;
  calories_burned: number;
  steps: number;
  water_ml: number;
}

const Home = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<DailyProgress>({
    calories_consumed: 0,
    calories_burned: 0,
    steps: 0,
    water_ml: 0,
  });
  const [waterSheetOpen, setWaterSheetOpen] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("display_name, calorie_goal, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    };

    const fetchProgress = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("daily_progress")
        .select("calories_consumed, calories_burned, steps, water_ml")
        .eq("user_id", user.id)
        .eq("date", today.toISOString().split("T")[0])
        .maybeSingle();

      if (data) {
        setProgress(data);
      }
    };

    fetchProfile();
    fetchProgress();
  }, [user]);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const calorieGoal = profile?.calorie_goal || 2000;
  const firstName = displayName.split(" ")[0];

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const refetchProgress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("daily_progress")
      .select("calories_consumed, calories_burned, steps, water_ml")
      .eq("user_id", user.id)
      .eq("date", today.toISOString().split("T")[0])
      .maybeSingle();
    if (data) {
      setProgress(data);
    }
  };

  const handleWaterSheetClose = (open: boolean) => {
    setWaterSheetOpen(open);
    if (!open) {
      refetchProgress();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, {firstName}</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
            {firstName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Calorie Card */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Calories Remaining</h2>
            <button className="p-1 hover:bg-muted/50 rounded-full">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <CalorieRing current={progress.calories_consumed} total={calorieGoal} />
          </div>

          <div className="flex justify-center gap-8">
            <MacroBar label="Carbs" current={45} target={120} color="orange" />
            <MacroBar label="Protein" current={85} target={140} color="purple" />
            <MacroBar label="Fat" current={18} target={60} color="red" />
          </div>
        </div>

        {/* Daily Workout Plan */}
        <div className="mb-6">
          <WorkoutPlanCard />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Footprints className="w-6 h-6 text-primary" />}
            value={progress.steps.toLocaleString()}
            label="Steps"
            progress={(progress.steps / 10000) * 100}
            progressColor="hsl(var(--destructive))"
          />
          <StatCard
            icon={<Droplets className="w-6 h-6 text-sky-500" />}
            value={progress.water_ml.toLocaleString()}
            label="ml Water"
            action={
              <button onClick={() => setWaterSheetOpen(true)} className="p-1 hover:bg-muted/50 rounded-full">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            }
          />
        </div>

        {/* Weight Tracker */}
        <div className="mt-6 mb-6">
          <WeightTracker />
        </div>

        {/* Today's Meals */}
        <h2 className="text-lg font-semibold text-foreground mb-3">Today's Meals</h2>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
          <img
            src={oatmealBowl}
            alt="Oatmeal"
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Oatmeal & Berries</h3>
            <p className="text-sm text-muted-foreground">Breakfast</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">350 kcal</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <BottomNavigation />
      
      <LogWaterSheet open={waterSheetOpen} onOpenChange={handleWaterSheetClose} />
    </div>
  );
};

export default Home;
