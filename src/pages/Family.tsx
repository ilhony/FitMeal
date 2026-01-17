import { UserPlus, Trophy, TrendingUp } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { WeeklyChallengeCard } from "@/components/WeeklyChallengeCard";
import { FamilyMemberCard } from "@/components/FamilyMemberCard";

const familyMembers = [
  {
    name: "Alex (You)",
    activity: "Walking",
    timeAgo: "24 mins ago",
    calories: 1240,
    isLeader: true,
    avatarColor: "#10B981",
  },
  {
    name: "Sarah",
    activity: "Yoga",
    timeAgo: "1 hour ago",
    calories: 850,
    isLeader: false,
    avatarColor: "#8B5CF6",
  },
  {
    name: "Mike",
    activity: "Running",
    timeAgo: "3 hours ago",
    calories: 620,
    isLeader: false,
    avatarColor: "#F59E0B",
  },
];

const Family = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Family Circle</h1>
            <p className="text-muted-foreground text-sm">Keep your loved ones healthy</p>
          </div>
          <button className="p-2 hover:bg-muted/50 rounded-xl border border-border">
            <UserPlus className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Weekly Challenge */}
        <div className="mt-6">
          <WeeklyChallengeCard
            title="100k Steps Together"
            current={75430}
            target={100000}
            daysLeft={3}
            participants={5}
          />
        </div>

        {/* Family Members */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Family Members</h2>
          <button className="text-sm font-medium text-primary">Today</button>
        </div>

        <div className="space-y-3">
          {familyMembers.map((member) => (
            <FamilyMemberCard
              key={member.name}
              name={member.name}
              activity={member.activity}
              timeAgo={member.timeAgo}
              calories={member.calories}
              isLeader={member.isLeader}
              avatarColor={member.avatarColor}
            />
          ))}
        </div>

        {/* Add Family Member */}
        <button className="w-full mt-4 py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <span className="text-lg">+</span>
          <span className="font-medium">Add Family Member</span>
        </button>

        {/* Winner Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4">
            <Trophy className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Weekly Winner</p>
            <p className="text-lg font-bold text-foreground mt-1">Alex</p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded-2xl p-4">
            <TrendingUp className="w-6 h-6 text-sky-500 mb-2" />
            <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">Most Improved</p>
            <p className="text-lg font-bold text-foreground mt-1">Sarah</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Family;
