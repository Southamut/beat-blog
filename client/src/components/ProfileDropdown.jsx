// src/components/ProfileDropdown.jsx

import { LogOut, User, Settings, ChevronDown, Bell, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

// Component ProfileDropdown
export function ProfileDropdown({ user, handleLogout }) {
    
    // เราใช้ useNavigate ที่นี่ เพราะ Dropdown เป็นตัวควบคุมการนำทาง
    const navigate = useNavigate(); 
    const isAdmin = user.role === 'admin';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer focus:outline-none">
                <Bell className="w-6 h-6 text-gray-800" />
                <img
                    src={user.profile_pic || 'https://via.placeholder.com/150'}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-800" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-[#DAD6D1] rounded-lg shadow-lg mt-2">
                
                {/* Profile */}
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4" />
                    Profile
                </DropdownMenuItem>

                {/* Reset Password */}
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate("/reset-password")}>
                    <Settings className="w-4 h-4" />
                    Reset password
                </DropdownMenuItem>
                
                {/* Admin Panel - แสดงผลตาม Role */}
                {isAdmin && (
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => navigate("/admin/article-management")}>
                        <LayoutDashboard className="w-4 h-4" />
                        Admin panel
                    </DropdownMenuItem>
                )}

                <div className="border-t border-[#DAD6D1] my-1"></div>

                {/* Log out */}
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}