import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Minus, Plus } from "lucide-react";

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export const GoalsDialog = ({ open, onOpenChange, onSave }: GoalsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !open) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("calorie_goal")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setCalorieGoal(data.calorie_goal || 2000);
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
        .update({ calorie_goal: calorieGoal })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Goals updated",
        description: `Daily calorie goal set to ${calorieGoal.toLocaleString()} kcal.`,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My Goals</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
