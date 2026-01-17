import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  progress?: number;
  progressColor?: string;
  action?: ReactNode;
}

export const StatCard = ({ icon, value, label, progress, progressColor, action }: StatCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-2">
        {icon}
        {action}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: progressColor }}
          />
        </div>
      )}
    </div>
  );
};
