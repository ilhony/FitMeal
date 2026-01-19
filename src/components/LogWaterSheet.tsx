import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Droplets } from "lucide-react";

interface LogWaterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WATER_AMOUNTS = [
  { label: "Small Glass", amount: 150 },
  { label: "Regular Glass", amount: 250 },
  { label: "Large Glass", amount: 350 },
  { label: "Water Bottle", amount: 500 },
];

export const LogWaterSheet = ({ open, onOpenChange }: LogWaterSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWater = async (amount: number) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const { data: currentProgress } = await supabase
        .from("daily_progress")
        .select("water_ml")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const currentWater = currentProgress?.water_ml || 0;
      const newWater = currentWater + amount;

      await supabase
        .from("daily_progress")
        .upsert({
          user_id: user.id,
          date: today,
          water_ml: newWater,
        }, { onConflict: "user_id,date" });

      toast({
        title: "Water logged!",
        description: `Added ${amount}ml. Total today: ${newWater}ml`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log water. Please try again.",
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
          <SheetTitle>Log Water</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3">
          {WATER_AMOUNTS.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              className="h-20 flex flex-col gap-1"
              onClick={() => handleAddWater(item.amount)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Droplets className="w-5 h-5 text-sky-500" />
              )}
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.amount}ml</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
