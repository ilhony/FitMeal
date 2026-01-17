import { ChevronRight } from "lucide-react";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  action?: React.ReactNode;
  iconBg?: string;
}

export const SettingsItem = ({ icon, label, value, onClick, action, iconBg = "bg-muted/30" }: SettingsItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 hover:bg-muted/20 transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="flex-1 text-left font-medium text-foreground">{label}</span>
      {value && <span className="text-muted-foreground">{value}</span>}
      {action || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
};
