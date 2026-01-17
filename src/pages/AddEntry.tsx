import { X, Apple, Dumbbell, Droplets, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    icon: Apple,
    label: "Log Meal",
    description: "Add food to your diary",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Dumbbell,
    label: "Log Workout",
    description: "Record exercise activity",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: Droplets,
    label: "Log Water",
    description: "Track hydration",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: Footprints,
    label: "Log Steps",
    description: "Manual step entry",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const AddEntry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Quick Add</h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted/50 rounded-full"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow text-left"
              >
                <div className={`w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddEntry;
