import { MoreVertical, Droplets, Footprints, ChevronRight, Plus } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CalorieRing } from "@/components/CalorieRing";
import { MacroBar } from "@/components/MacroBar";
import { WorkoutCard } from "@/components/WorkoutCard";
import { StatCard } from "@/components/StatCard";
import oatmealBowl from "@/assets/oatmeal-bowl.jpg";

const Home = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <h1 className="text-2xl font-bold text-foreground">Good Morning, Alex</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
            A
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
            <CalorieRing current={760} total={2000} />
          </div>

          <div className="flex justify-center gap-8">
            <MacroBar label="Carbs" current={45} target={120} color="orange" />
            <MacroBar label="Protein" current={85} target={140} color="purple" />
            <MacroBar label="Fat" current={18} target={60} color="red" />
          </div>
        </div>

        {/* Daily Workout */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Daily Workout</h2>
          <button className="text-sm font-medium text-primary">See All</button>
        </div>

        <WorkoutCard
          title="Running"
          progress="6.5 km / 8.0 km"
          calories={450}
          percentage={75}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <StatCard
            icon={<Footprints className="w-6 h-6 text-primary" />}
            value="7,540"
            label="Steps"
            progress={75}
            progressColor="hsl(var(--destructive))"
          />
          <StatCard
            icon={<Droplets className="w-6 h-6 text-sky-500" />}
            value="1,200"
            label="ml Water"
            action={
              <button className="p-1 hover:bg-muted/50 rounded-full">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            }
          />
        </div>

        {/* Today's Meals */}
        <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">Today's Meals</h2>
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
    </div>
  );
};

export default Home;
