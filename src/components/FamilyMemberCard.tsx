import { Crown } from "lucide-react";

interface FamilyMemberCardProps {
  name: string;
  activity: string;
  timeAgo: string;
  calories: number;
  isLeader?: boolean;
  avatarColor: string;
}

export const FamilyMemberCard = ({
  name,
  activity,
  timeAgo,
  calories,
  isLeader,
  avatarColor,
}: FamilyMemberCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
      <div className="relative">
        <div
          className="absolute -left-1 top-0 bottom-0 w-1 rounded-full"
          style={{ backgroundColor: avatarColor }}
        />
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ml-2"
          style={{ backgroundColor: `${avatarColor}20`, color: avatarColor }}
        >
          {name.charAt(0)}
        </div>
        {isLeader && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Crown className="w-3.5 h-3.5 text-amber-900" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {activity} • {timeAgo}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-foreground">{calories.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground uppercase">KCAL BURNED</p>
      </div>
    </div>
  );
};
