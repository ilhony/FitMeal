import { useEffect, useState } from "react";
import { 
  User, 
  Utensils, 
  Target, 
  Bell, 
  Heart, 
  Globe, 
  LogOut, 
  ChevronRight,
  Camera,
  Crown
} from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SettingsItem } from "@/components/SettingsItem";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  display_name: string;
  email: string | null;
  calorie_goal: number;
}

interface DietaryPreferences {
  preference: string;
  allergies: string[];
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(true);
  const [healthSync, setHealthSync] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<DietaryPreferences | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, email, calorie_goal")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: prefData } = await supabase
        .from("dietary_preferences")
        .select("preference, allergies")
        .eq("user_id", user.id)
        .maybeSingle();

      if (prefData) {
        setPreferences(prefData);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const email = profile?.email || user?.email || "";
  const dietaryPref = preferences?.preference || "none";
  const calorieGoal = profile?.calorie_goal || 2000;

  const formatPreference = (pref: string) => {
    if (pref === "none") return "None";
    return pref.charAt(0).toUpperCase() + pref.slice(1);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <button className="text-primary font-medium">Save</button>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-muted rounded-full flex items-center justify-center border border-border">
              <Camera className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Pro Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-600 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold">Fitmeal Pro</span>
            </div>
            <p className="text-slate-300 text-sm">Manage your subscription plan</p>
          </div>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        {/* Account & Goals Section */}
        <div className="mb-6">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Account & Goals
          </h3>
          <div className="bg-card rounded-2xl shadow-sm border border-border divide-y divide-border">
            <div className="px-4">
              <SettingsItem
                icon={<User className="w-5 h-5 text-muted-foreground" />}
                label="Personal Data"
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Utensils className="w-5 h-5 text-primary" />}
                label="Dietary Preferences"
                value={formatPreference(dietaryPref)}
                iconBg="bg-primary/10"
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Target className="w-5 h-5 text-sky-500" />}
                label="My Goals"
                value={`${calorieGoal.toLocaleString()} Kcal`}
                iconBg="bg-sky-500/10"
              />
            </div>
          </div>
        </div>

        {/* App Settings Section */}
        <div className="mb-6">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
            App Settings
          </h3>
          <div className="bg-card rounded-2xl shadow-sm border border-border divide-y divide-border">
            <div className="px-4">
              <SettingsItem
                icon={<Bell className="w-5 h-5 text-muted-foreground" />}
                label="Notifications"
                action={
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                }
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Heart className="w-5 h-5 text-pink-500" />}
                label="Health Sync"
                iconBg="bg-pink-500/10"
                action={
                  <Switch
                    checked={healthSync}
                    onCheckedChange={setHealthSync}
                  />
                }
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Globe className="w-5 h-5 text-muted-foreground" />}
                label="Language"
                value="English"
              />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-destructive/10 rounded-2xl flex items-center justify-center gap-2 text-destructive font-medium hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Fitmeal v2.4.0 (Build 124)
        </p>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
