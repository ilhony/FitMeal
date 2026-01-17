import { Home, Utensils, Users, User, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Utensils, label: "Meals", path: "/meals" },
  { icon: null, label: "Add", path: "/add" },
  { icon: Users, label: "Family", path: "/family" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 pb-6 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.label === "Add") {
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg -mt-6 transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-7 h-7 text-primary-foreground" />
              </button>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="w-6 h-6" />}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
