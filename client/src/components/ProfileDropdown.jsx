// src/components/ProfileDropdown.jsx

import {
  LogOut,
  User,
  Settings,
  ChevronDown,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

// Component ProfileDropdown
export function ProfileDropdown({ user, handleLogout }) {
  // เราใช้ useNavigate ที่นี่ เพราะ Dropdown เป็นตัวควบคุมการนำทาง
  const navigate = useNavigate();
  const isAdmin = user.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* desktop */}
        <div className="hidden md:flex items-center gap-2 cursor-pointer focus:outline-none">
          {user.profile_pic ? (
            <img
              src={user.profile_pic}
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brown-400 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <span className="text-brown-500 font-medium hidden sm:inline">
            {user.name}
          </span>
          <ChevronDown className="w-4 h-4 text-brown-500" />
        </div>
        {/* mobile */}
        <div className="flex md:hidden items-center justify-center">
          <Menu className="w-5 h-5 text-brown-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-screen md:w-56 border-none bg-brown-100 md:rounded-lg shadow-lg mt-2"
      >
        {/* Mobile Profile Section */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center gap-3">
            {user.profile_pic ? (
              <img
                src={user.profile_pic}
                alt="User Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-brown-400 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <p className="font-medium text-brown-500">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-4 py-2 text-brown-500 hover:bg-brown-200 transition-colors"
          onClick={
            isAdmin
              ? () => navigate("/admin/profile")
              : () => navigate("/user/profile")
          }
        >
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>

        {/* Reset Password */}
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-4 py-2 text-brown-500 hover:bg-brown-200 transition-colors"
          onClick={
            isAdmin
              ? () => navigate("/admin/reset-password")
              : () => navigate("/user/reset-password")
          }
        >
          <Settings className="w-4 h-4" />
          Reset password
        </DropdownMenuItem>

        {/* Admin Panel - แสดงผลตาม Role */}
        {isAdmin && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer px-4 py-2 text-brown-500 hover:bg-brown-200 transition-colors"
            onClick={() => navigate("/admin/article-management")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin panel
          </DropdownMenuItem>
        )}

        <div className="border-t border-brown-300 my-1"></div>

        {/* Log out */}
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-4 py-2 text-brown-500 hover:bg-brown-200 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
