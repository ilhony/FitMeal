import { RefreshCw, Loader2 } from "lucide-react";

interface MealCardProps {
  image?: string;
  title: string;
  ingredients: string;
  calories: number;
  tag: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const MealCard = ({ 
  image, 
  title, 
  ingredients, 
  calories, 
  tag, 
  protein,
  carbs,
  fat,
  onRefresh,
  isRefreshing 
}: MealCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex gap-4">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-20 h-20 rounded-xl object-cover"
          />
        )}
        {!image && (
          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground truncate pr-2">{title}</h3>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 hover:bg-muted/50 rounded-full transition-colors disabled:opacity-50"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{ingredients}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-sm font-semibold text-primary">{calories} Kcal</span>
            <span className="px-2 py-0.5 bg-muted/30 rounded-full text-xs text-muted-foreground">
              {tag}
            </span>
          </div>
          {(protein !== undefined || carbs !== undefined || fat !== undefined) && (
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
              {protein !== undefined && <span>P: {protein}g</span>}
              {carbs !== undefined && <span>C: {carbs}g</span>}
              {fat !== undefined && <span>F: {fat}g</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
