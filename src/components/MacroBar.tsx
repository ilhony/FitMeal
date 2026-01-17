interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: "orange" | "purple" | "red";
}

const colorClasses = {
  orange: "bg-amber-500",
  purple: "bg-violet-500",
  red: "bg-red-500",
};

export const MacroBar = ({ label, current, target, color }: MacroBarProps) => {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="w-14 h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {current}/{target}g
      </span>
    </div>
  );
};
