import { RefreshCw } from "lucide-react";

interface MealCardProps {
  image: string;
  title: string;
  ingredients: string;
  calories: number;
  tag: string;
  onRefresh?: () => void;
}

export const MealCard = ({ image, title, ingredients, calories, tag, onRefresh }: MealCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex gap-4">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            <button
              onClick={onRefresh}
              className="p-1.5 hover:bg-muted/50 rounded-full transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{ingredients}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-primary">{calories} Kcal</span>
            <span className="px-2 py-0.5 bg-muted/30 rounded-full text-xs text-muted-foreground">
              {tag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
