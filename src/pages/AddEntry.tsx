import { useState } from "react";
import { Apple, Dumbbell, Droplets, Footprints } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { LogMealSheet } from "@/components/LogMealSheet";
import { LogWorkoutSheet } from "@/components/LogWorkoutSheet";
import { LogWaterSheet } from "@/components/LogWaterSheet";
import { LogStepsSheet } from "@/components/LogStepsSheet";

const quickActions = [
  {
    icon: Apple,
    label: "Log Meal",
    description: "Add food to your diary",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    action: "meal" as const,
  },
  {
    icon: Dumbbell,
    label: "Log Workout",
    description: "Record exercise activity",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    action: "workout" as const,
  },
  {
    icon: Droplets,
    label: "Log Water",
    description: "Track hydration",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    action: "water" as const,
  },
  {
    icon: Footprints,
    label: "Log Steps",
    description: "Manual step entry",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    action: "steps" as const,
  },
];

type SheetType = "meal" | "workout" | "water" | "steps" | null;

const AddEntry = () => {
  const [openSheet, setOpenSheet] = useState<SheetType>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Quick Add</h1>
          <p className="text-muted-foreground text-sm mt-1">Log your daily activities</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setOpenSheet(action.action)}
                className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow text-left"
              >
                <div className={`w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNavigation />

      {/* Sheets */}
      <LogMealSheet open={openSheet === "meal"} onOpenChange={(open) => setOpenSheet(open ? "meal" : null)} />
      <LogWorkoutSheet open={openSheet === "workout"} onOpenChange={(open) => setOpenSheet(open ? "workout" : null)} />
      <LogWaterSheet open={openSheet === "water"} onOpenChange={(open) => setOpenSheet(open ? "water" : null)} />
      <LogStepsSheet open={openSheet === "steps"} onOpenChange={(open) => setOpenSheet(open ? "steps" : null)} />
    </div>
  );
};

export default AddEntry;
