import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LogWorkoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogWorkoutSheet = ({ open, onOpenChange }: LogWorkoutSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workoutName, setWorkoutName] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !workoutName || !caloriesBurned) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const { data: currentProgress } = await supabase
        .from("daily_progress")
        .select("calories_burned")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const currentBurned = currentProgress?.calories_burned || 0;
      const newBurned = currentBurned + parseInt(caloriesBurned);

      await supabase
        .from("daily_progress")
        .upsert({
          user_id: user.id,
          date: today,
          calories_burned: newBurned,
        }, { onConflict: "user_id,date" });

      toast({
        title: "Workout logged!",
        description: `${workoutName} - ${caloriesBurned} kcal burned.`,
      });

      setWorkoutName("");
      setCaloriesBurned("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Log Workout</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="workoutName">Workout Type</Label>
            <Input
              id="workoutName"
              placeholder="e.g., Running, Weight Training"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="caloriesBurned">Calories Burned</Label>
            <Input
              id="caloriesBurned"
              type="number"
              placeholder="e.g., 300"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading || !workoutName || !caloriesBurned}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Add Workout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
