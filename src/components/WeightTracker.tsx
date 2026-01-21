import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Scale, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeightLog {
  id: string;
  weight_kg: number;
  logged_at: string;
}

interface WeightGoal {
  current_weight_kg: number | null;
  goal_weight_kg: number | null;
  fitness_goal: string | null;
}

export const WeightTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [goal, setGoal] = useState<WeightGoal>({ current_weight_kg: null, goal_weight_kg: null, fitness_goal: null });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [{ data: logsData }, { data: profileData }] = await Promise.all([
      supabase
        .from("weight_logs")
        .select("id, weight_kg, logged_at")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(7),
      supabase
        .from("profiles")
        .select("current_weight_kg, goal_weight_kg, fitness_goal")
        .eq("user_id", user.id)
        .maybeSingle()
    ]);

    if (logsData) setLogs(logsData);
    if (profileData) setGoal(profileData);
  };

  const handleLogWeight = async () => {
    if (!user || !weight) return;

    setIsLoading(true);
    try {
      const weightNum = parseFloat(weight);
      
      await supabase.from("weight_logs").insert({
        user_id: user.id,
        weight_kg: weightNum,
      });

      await supabase
        .from("profiles")
        .update({ current_weight_kg: weightNum })
        .eq("user_id", user.id);

      toast({ title: "Weight logged!", description: `${weightNum} kg recorded.` });
      setWeight("");
      setSheetOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to log weight.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const latestWeight = logs[0]?.weight_kg || goal.current_weight_kg;
  const previousWeight = logs[1]?.weight_kg;
  const weightDiff = latestWeight && previousWeight ? latestWeight - previousWeight : 0;
  const isGaining = weightDiff > 0;
  const goalDiff = latestWeight && goal.goal_weight_kg ? goal.goal_weight_kg - latestWeight : null;

  return (
    <>
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Weight</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {latestWeight ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{latestWeight}</span>
              <span className="text-muted-foreground">kg</span>
              {weightDiff !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${isGaining ? "text-orange-500" : "text-green-500"}`}>
                  {isGaining ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(weightDiff).toFixed(1)} kg
                </div>
              )}
            </div>
            {goal.goal_weight_kg && goalDiff !== null && (
              <p className="text-sm text-muted-foreground">
                {goalDiff > 0 ? `${goalDiff.toFixed(1)} kg to gain` : goalDiff < 0 ? `${Math.abs(goalDiff).toFixed(1)} kg to lose` : "Goal reached! 🎉"}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No weight logged yet</p>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Log Weight</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 75.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleLogWeight} className="w-full" disabled={isLoading || !weight}>
              Log Weight
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
