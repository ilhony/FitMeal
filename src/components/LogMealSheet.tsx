import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LogMealSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogMealSheet = ({ open, onOpenChange }: LogMealSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !mealName || !calories) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      
      // Get current progress
      const { data: currentProgress } = await supabase
        .from("daily_progress")
        .select("calories_consumed")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const currentCalories = currentProgress?.calories_consumed || 0;
      const newCalories = currentCalories + parseInt(calories);

      await supabase
        .from("daily_progress")
        .upsert({
          user_id: user.id,
          date: today,
          calories_consumed: newCalories,
        }, { onConflict: "user_id,date" });

      toast({
        title: "Meal logged!",
        description: `${mealName} - ${calories} kcal added to your diary.`,
      });

      setMealName("");
      setCalories("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
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
          <SheetTitle>Log Meal</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mealName">Meal Name</Label>
            <Input
              id="mealName"
              placeholder="e.g., Chicken Salad"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              placeholder="e.g., 450"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading || !mealName || !calories}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Add Meal
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
