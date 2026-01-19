import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";

const DIETARY_OPTIONS = [
  { value: "none", label: "No Preference", description: "I eat everything" },
  { value: "vegetarian", label: "Vegetarian", description: "No meat or fish" },
  { value: "vegan", label: "Vegan", description: "No animal products" },
  { value: "keto", label: "Keto", description: "Low carb, high fat" },
  { value: "paleo", label: "Paleo", description: "Whole foods only" },
];

const ALLERGY_OPTIONS = [
  "Nuts",
  "Gluten",
  "Dairy",
  "Shellfish",
  "Eggs",
  "Soy",
  "Fish",
  "Sesame",
];

interface DietaryPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export const DietaryPreferencesDialog = ({
  open,
  onOpenChange,
  onSave,
}: DietaryPreferencesDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preference, setPreference] = useState("none");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user || !open) return;
      setIsLoading(true);

      const { data } = await supabase
        .from("dietary_preferences")
        .select("preference, allergies")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setPreference(data.preference || "none");
        setAllergies(data.allergies || []);
      }
      setIsLoading(false);
    };

    fetchPreferences();
  }, [user, open]);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("dietary_preferences")
      .update({
        preference,
        allergies,
      })
      .eq("user_id", user.id);

    setIsSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Preferences saved",
      description: "Your dietary preferences have been updated.",
    });
    onSave?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dietary Preferences</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Diet Type Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Diet Type</h3>
              <RadioGroup value={preference} onValueChange={setPreference}>
                <div className="space-y-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                        preference === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPreference(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium">{option.label}</span>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Allergies Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Allergies</h3>
              <p className="text-sm text-muted-foreground">
                Select any food allergies or intolerances
              </p>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map((allergy) => {
                  const isSelected = allergies.includes(allergy);
                  return (
                    <Badge
                      key={allergy}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                        isSelected
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleAllergy(allergy)}
                    >
                      {allergy}
                      {isSelected && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  );
                })}
              </div>

              {allergies.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Selected: {allergies.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
