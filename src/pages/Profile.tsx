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
import { useState } from "react";

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [healthSync, setHealthSync] = useState(false);

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
              A
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-muted rounded-full flex items-center justify-center border border-border">
              <Camera className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">Alex Thompson</h2>
            <p className="text-sm text-muted-foreground">alex.t@example.com</p>
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
                value="Vegan"
                iconBg="bg-primary/10"
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Target className="w-5 h-5 text-sky-500" />}
                label="My Goals"
                value="2,000 Kcal"
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
        <button className="w-full py-4 bg-destructive/10 rounded-2xl flex items-center justify-center gap-2 text-destructive font-medium hover:bg-destructive/20 transition-colors">
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
