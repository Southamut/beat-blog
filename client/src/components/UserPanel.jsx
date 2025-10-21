import { User, KeyRound, Globe, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";

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

// Footer items
const footerItems = [
  {
    title: "hh. website",
    url: "/",
    icon: Globe,
  },
  {
    title: "Log out",
    url: "/logout",
    icon: LogOut,
  },
];

export function UserPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (url) => {
    if (url === "/logout") {
      handleLogout();
    } else {
      navigate(url);
    }
  };

  return (
    <div className="hidden md:block w-64 min-h-screen bg-gray-800">
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.url)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  location.pathname.startsWith(item.url)
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Footer items */}
        <div className="mt-auto pt-8">
          <nav className="space-y-2">
            {footerItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.url)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
