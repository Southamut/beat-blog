import { User, KeyRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Menu items for user navigation
const navigationItems = [
  {
    title: "Profile",
    url: "/user/profile",
    icon: User,
  },
  {
    title: "Reset password",
    url: "/user/reset-password",
    icon: KeyRound,
  },
];

export default function MobileUserPanel() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <div className="md:hidden w-full bg-brown-100 px-4 py-3">
      <div className="flex items-center justify-center gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={() => handleNavigation(item.url)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                location.pathname.startsWith(item.url)
                  ? "text-brown-500"
                  : "text-brown-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
