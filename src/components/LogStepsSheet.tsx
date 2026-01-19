import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LogStepsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogStepsSheet = ({ open, onOpenChange }: LogStepsSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [steps, setSteps] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !steps) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const { data: currentProgress } = await supabase
        .from("daily_progress")
        .select("steps")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const currentSteps = currentProgress?.steps || 0;
      const newSteps = currentSteps + parseInt(steps);

      await supabase
        .from("daily_progress")
        .upsert({
          user_id: user.id,
          date: today,
          steps: newSteps,
        }, { onConflict: "user_id,date" });

      toast({
        title: "Steps logged!",
        description: `Added ${parseInt(steps).toLocaleString()} steps. Total today: ${newSteps.toLocaleString()}`,
      });

      setSteps("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log steps. Please try again.",
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
          <SheetTitle>Log Steps</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="steps">Number of Steps</Label>
            <Input
              id="steps"
              type="number"
              placeholder="e.g., 1000"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading || !steps}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Add Steps
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
