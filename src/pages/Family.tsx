import { useEffect, useState, useCallback } from "react";
import { UserPlus, Trophy, TrendingUp } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { WeeklyChallengeCard } from "@/components/WeeklyChallengeCard";
import { FamilyMemberCard } from "@/components/FamilyMemberCard";
import { CreateFamilyDialog } from "@/components/CreateFamilyDialog";
import { JoinFamilyDialog } from "@/components/JoinFamilyDialog";
import { FamilyOptionsSheet } from "@/components/FamilyOptionsSheet";
import { ShareInviteDialog } from "@/components/ShareInviteDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FamilyMember {
  userId: string;
  name: string;
  activity: string;
  timeAgo: string;
  calories: number;
  steps: number;
  isCurrentUser: boolean;
  avatarColor: string;
}

interface FamilyCircle {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
}

interface WeeklyChallenge {
  id: string;
  title: string;
  current: number;
  target: number;
  start_date: string;
  end_date: string;
}

const avatarColors = ["#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4", "#EF4444"];

const Family = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [family, setFamily] = useState<FamilyCircle | null>(null);
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [displayName, setDisplayName] = useState("You");

  // Dialog states
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const fetchFamilyData = useCallback(async () => {
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

    // Check if user belongs to a family
    const { data: memberData } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!memberData) {
      // User has no family - show their own stats
      const today = new Date().toISOString().split("T")[0];
      const { data: progressData } = await supabase
        .from("daily_progress")
        .select("calories_burned, steps")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      setFamilyMembers([{
        userId: user.id,
        name: profileData?.display_name || "You",
        activity: "Active today",
        timeAgo: "Just now",
        calories: progressData?.calories_burned || 0,
        steps: progressData?.steps || 0,
        isCurrentUser: true,
        avatarColor: avatarColors[0],
      }]);
      return;
    }

    // Fetch family details
    const { data: familyData } = await supabase
      .from("family_circles")
      .select("id, name, invite_code, created_by")
      .eq("id", memberData.family_id)
      .single();

    if (familyData) {
      setFamily(familyData);
    }

    // Fetch all family members
    const { data: allMembers } = await supabase
      .from("family_members")
      .select("user_id, joined_at")
      .eq("family_id", memberData.family_id);

    if (!allMembers) return;

    // Fetch profiles for all members
    const memberIds = allMembers.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", memberIds);

    // Fetch today's progress for all members
    const today = new Date().toISOString().split("T")[0];
    const { data: progressList } = await supabase
      .from("daily_progress")
      .select("user_id, calories_burned, steps, updated_at")
      .eq("date", today)
      .in("user_id", memberIds);

    // Build family members list
    const members: FamilyMember[] = allMembers.map((member, index) => {
      const profile = profiles?.find(p => p.user_id === member.user_id);
      const progress = progressList?.find(p => p.user_id === member.user_id);
      const isCurrentUser = member.user_id === user.id;

      let timeAgo = "No activity today";
      if (progress?.updated_at) {
        const updatedAt = new Date(progress.updated_at);
        const now = new Date();
        const diffMins = Math.floor((now.getTime() - updatedAt.getTime()) / 60000);
        if (diffMins < 1) timeAgo = "Just now";
        else if (diffMins < 60) timeAgo = `${diffMins} mins ago`;
        else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)} hours ago`;
        else timeAgo = "Yesterday";
      }

      return {
        userId: member.user_id,
        name: isCurrentUser ? `${profile?.display_name || "You"} (You)` : (profile?.display_name || "Member"),
        activity: progress?.steps ? `${progress.steps.toLocaleString()} steps` : "No steps logged",
        timeAgo,
        calories: progress?.calories_burned || 0,
        steps: progress?.steps || 0,
        isCurrentUser,
        avatarColor: avatarColors[index % avatarColors.length],
      };
    });

    // Sort by calories (leader first)
    members.sort((a, b) => b.calories - a.calories);
    setFamilyMembers(members);

    // Fetch weekly challenge
    const { data: challengeData } = await supabase
      .from("weekly_challenges")
      .select("*")
      .eq("family_id", memberData.family_id)
      .gte("end_date", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (challengeData) {
      // Calculate total steps from all members
      const totalSteps = members.reduce((sum, m) => sum + m.steps, 0);
      setChallenge({
        ...challengeData,
        current: totalSteps,
      });
    }
  }, [user]);

  useEffect(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  const handleAddMember = () => {
    if (family) {
      setShareOpen(true);
    } else {
      setOptionsOpen(true);
    }
  };

  const weeklyWinner = familyMembers.length > 0 ? familyMembers[0] : null;
  const daysLeft = challenge ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 3;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {family ? family.name : "Family Circle"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {family ? `${familyMembers.length} member${familyMembers.length !== 1 ? 's' : ''}` : "Keep your loved ones healthy"}
            </p>
          </div>
          <button 
            onClick={handleAddMember}
            className="p-2 hover:bg-muted/50 rounded-xl border border-border"
          >
            <UserPlus className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Weekly Challenge */}
        <div className="mt-6">
          <WeeklyChallengeCard
            title={challenge?.title || "100k Steps Together"}
            current={challenge?.current || familyMembers.reduce((sum, m) => sum + m.steps, 0)}
            target={challenge?.target || 100000}
            daysLeft={daysLeft}
            participants={familyMembers.length}
          />
        </div>

        {/* Family Members */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Family Members</h2>
          <span className="text-sm font-medium text-muted-foreground">Today</span>
        </div>

        <div className="space-y-3">
          {familyMembers.map((member, index) => (
            <FamilyMemberCard
              key={member.userId}
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
          onClick={handleAddMember}
          className="w-full mt-4 py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <span className="text-lg">+</span>
          <span className="font-medium">
            {family ? "Invite Member" : "Create or Join Family"}
          </span>
        </button>

        {/* Winner Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4">
            <Trophy className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Weekly Winner</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {weeklyWinner?.name.replace(" (You)", "") || "—"}
            </p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded-2xl p-4">
            <TrendingUp className="w-6 h-6 text-sky-500 mb-2" />
            <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">Total Steps</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {familyMembers.reduce((sum, m) => sum + m.steps, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Dialogs */}
      <FamilyOptionsSheet
        open={optionsOpen}
        onOpenChange={setOptionsOpen}
        onCreateFamily={() => setCreateOpen(true)}
        onJoinFamily={() => setJoinOpen(true)}
      />
      <CreateFamilyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchFamilyData}
      />
      <JoinFamilyDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
        onSuccess={fetchFamilyData}
      />
      {family && (
        <ShareInviteDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          inviteCode={family.invite_code}
          familyName={family.name}
        />
      )}
    </div>
  );
};

export default Family;
