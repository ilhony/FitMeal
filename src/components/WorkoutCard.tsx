import { Flame } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  progress: string;
  calories: number;
  percentage: number;
}

export const WorkoutCard = ({ title, progress, calories, percentage }: WorkoutCardProps) => {
  return (
    <div className="relative bg-accent rounded-2xl p-4 overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-lg">🏃</span>
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{progress}</p>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground">{calories} kcal</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card border-2 border-primary">
          <span className="text-sm font-bold text-primary">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};
