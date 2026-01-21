import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Minus, Plus, TrendingDown, TrendingUp, Scale } from "lucide-react";

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const FITNESS_GOALS = [
  { value: "lose", label: "Lose Weight", icon: TrendingDown, description: "Caloric deficit meals" },
  { value: "maintain", label: "Maintain", icon: Scale, description: "Balanced meals" },
  { value: "gain", label: "Gain Weight", icon: TrendingUp, description: "Caloric surplus meals" },
];

export const GoalsDialog = ({ open, onOpenChange, onSave }: GoalsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [fitnessGoal, setFitnessGoal] = useState("maintain");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !open) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("calorie_goal, fitness_goal, current_weight_kg, goal_weight_kg")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setCalorieGoal(data.calorie_goal || 2000);
        setFitnessGoal(data.fitness_goal || "maintain");
        setCurrentWeight(data.current_weight_kg?.toString() || "");
        setGoalWeight(data.goal_weight_kg?.toString() || "");
      }
    };
    
    fetchProfile();
  }, [user, open]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          calorie_goal: calorieGoal,
          fitness_goal: fitnessGoal,
          current_weight_kg: currentWeight ? parseFloat(currentWeight) : null,
          goal_weight_kg: goalWeight ? parseFloat(goalWeight) : null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Goals updated",
        description: `Your fitness goals have been saved.`,
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const adjustCalories = (amount: number) => {
    setCalorieGoal((prev) => Math.max(1000, Math.min(5000, prev + amount)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Goals</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Fitness Goal Selection */}
          <div>
            <Label className="mb-3 block">Fitness Goal</Label>
            <div className="grid grid-cols-3 gap-2">
              {FITNESS_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = fitnessGoal === goal.value;
                return (
                  <button
                    key={goal.value}
                    onClick={() => setFitnessGoal(goal.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {goal.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentWeight">Current Weight (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                step="0.1"
                placeholder="e.g., 75"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Calorie Goal */}
          <div>
            <Label>Daily Calorie Goal</Label>
            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustCalories(-100)}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="flex-1 text-center">
                <Input
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(parseInt(e.target.value) || 2000)}
                  className="text-center text-2xl font-bold h-14"
                  min={1000}
                  max={5000}
                />
                <p className="text-sm text-muted-foreground mt-1">kcal per day</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustCalories(100)}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1500, 2000, 2500].map((preset) => (
              <Button
                key={preset}
                variant={calorieGoal === preset ? "default" : "outline"}
                size="sm"
                onClick={() => setCalorieGoal(preset)}
              >
                {preset.toLocaleString()}
              </Button>
            ))}
          </div>

          {/* Helpful tip based on goal */}
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-sm text-muted-foreground">
              {fitnessGoal === "lose" && "💡 For weight loss, aim for a 300-500 calorie deficit. Your meals will prioritize high protein and fiber."}
              {fitnessGoal === "gain" && "💡 For weight gain, aim for a 300-500 calorie surplus. Your meals will include calorie-dense nutritious foods."}
              {fitnessGoal === "maintain" && "💡 For maintenance, your meals will be balanced to meet your daily calorie needs."}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
