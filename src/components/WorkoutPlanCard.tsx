import { useState, useEffect } from "react";
import { Dumbbell, Plus, Check, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight_kg: number | null;
  completed: boolean;
  order_index: number;
}

export const WorkoutPlanCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({ name: "", sets: "3", reps: "10", weight: "" });
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchExercises();
  }, [user]);

  const fetchExercises = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("workout_exercises")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("order_index", { ascending: true });

    if (data) setExercises(data);
  };

  const handleAddExercise = async () => {
    if (!user || !newExercise.name) return;

    setIsLoading(true);
    try {
      await supabase.from("workout_exercises").insert({
        user_id: user.id,
        date: today,
        exercise_name: newExercise.name,
        sets: parseInt(newExercise.sets) || 3,
        reps: parseInt(newExercise.reps) || 10,
        weight_kg: newExercise.weight ? parseFloat(newExercise.weight) : null,
        order_index: exercises.length,
      });

      toast({ title: "Exercise added!" });
      setNewExercise({ name: "", sets: "3", reps: "10", weight: "" });
      setSheetOpen(false);
      fetchExercises();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add exercise.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (exercise: Exercise) => {
    await supabase
      .from("workout_exercises")
      .update({ completed: !exercise.completed })
      .eq("id", exercise.id);

    setExercises(exercises.map(e => 
      e.id === exercise.id ? { ...e, completed: !e.completed } : e
    ));
  };

  const deleteExercise = async (id: string) => {
    await supabase.from("workout_exercises").delete().eq("id", id);
    setExercises(exercises.filter(e => e.id !== id));
    toast({ title: "Exercise removed" });
  };

  const completedCount = exercises.filter(e => e.completed).length;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  return (
    <>
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Today's Workout</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount}/{exercises.length} exercises done
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-violet-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Exercise list */}
        {exercises.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {exercises.map((exercise) => (
              <div 
                key={exercise.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  exercise.completed ? "bg-muted/50" : "bg-muted/30"
                }`}
              >
                <Checkbox
                  checked={exercise.completed}
                  onCheckedChange={() => toggleComplete(exercise)}
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${exercise.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {exercise.exercise_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exercise.sets} × {exercise.reps}
                    {exercise.weight_kg && ` @ ${exercise.weight_kg}kg`}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteExercise(exercise.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No exercises planned. Add your first one!
          </p>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Add Exercise</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exerciseName">Exercise Name</Label>
              <Input
                id="exerciseName"
                placeholder="e.g., Bench Press"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.5"
                  placeholder="Optional"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={handleAddExercise} className="w-full" disabled={isLoading || !newExercise.name}>
              Add Exercise
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
