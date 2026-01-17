import { useEffect, useState } from "react";
import { UserPlus, Trophy, TrendingUp } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { WeeklyChallengeCard } from "@/components/WeeklyChallengeCard";
import { FamilyMemberCard } from "@/components/FamilyMemberCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  name: string;
  activity: string;
  timeAgo: string;
  calories: number;
  isLeader: boolean;
  avatarColor: string;
}

// Demo data for family members (will be replaced with real data once family is set up)
const demoFamilyMembers: FamilyMember[] = [
  {
    name: "You",
    activity: "Walking",
    timeAgo: "24 mins ago",
    calories: 1240,
    isLeader: true,
    avatarColor: "#10B981",
  },
];

const avatarColors = ["#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];

const Family = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(demoFamilyMembers);
  const [hasFamily, setHasFamily] = useState(false);
  const [displayName, setDisplayName] = useState("You");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setDisplayName(profileData.display_name || user.email?.split("@")[0] || "You");
      }

      // Fetch today's progress
      const today = new Date().toISOString().split("T")[0];
      const { data: progressData } = await supabase
        .from("daily_progress")
        .select("calories_burned")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      const userCalories = progressData?.calories_burned || 0;

      // Update current user in family members
      setFamilyMembers([
        {
          name: `${displayName} (You)`,
          activity: "Active today",
          timeAgo: "Just now",
          calories: userCalories,
          isLeader: true,
          avatarColor: avatarColors[0],
        },
      ]);

      // Check if user belongs to a family
      const { data: familyData } = await supabase
        .from("family_members")
        .select("family_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (familyData) {
        setHasFamily(true);
        // Fetch other family members would go here
      }
    };

    fetchData();
  }, [user, displayName]);

  const createFamily = async () => {
    if (!user) return;

    try {
      // Create a new family circle
      const { data: family, error: familyError } = await supabase
        .from("family_circles")
        .insert({
          name: `${displayName}'s Family`,
          created_by: user.id,
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from("family_members")
        .insert({
          family_id: family.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      setHasFamily(true);
      toast({
        title: "Family created!",
        description: `Share code: ${family.invite_code}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create family. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            participants={familyMembers.length}
          />
        </div>

        {/* Family Members */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Family Members</h2>
          <button className="text-sm font-medium text-primary">Today</button>
        </div>

        <div className="space-y-3">
          {familyMembers.map((member, index) => (
            <FamilyMemberCard
              key={member.name}
              name={member.name}
              activity={member.activity}
              timeAgo={member.timeAgo}
              calories={member.calories}
              isLeader={index === 0}
              avatarColor={member.avatarColor}
            />
          ))}
        </div>

        {/* Add Family Member */}
        <button 
          onClick={!hasFamily ? createFamily : undefined}
          className="w-full mt-4 py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <span className="text-lg">+</span>
          <span className="font-medium">
            {hasFamily ? "Add Family Member" : "Create Family Circle"}
          </span>
        </button>

        {/* Winner Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4">
            <Trophy className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Weekly Winner</p>
            <p className="text-lg font-bold text-foreground mt-1">{displayName}</p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded-2xl p-4">
            <TrendingUp className="w-6 h-6 text-sky-500 mb-2" />
            <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">Most Improved</p>
            <p className="text-lg font-bold text-foreground mt-1">—</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Family;
