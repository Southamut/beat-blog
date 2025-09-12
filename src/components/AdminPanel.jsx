import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    FileText,
    FolderOpen,
    User,
    Bell,
    KeyRound,
    Globe,
    LogOut
} from "lucide-react"
import { useLocation } from "react-router-dom"

// Menu items for main navigation
const navigationItems = [
    {
        title: "Article Management",
        url: "/admin/article-management",
        icon: FileText,
    },
    {
        title: "Category management",
        url: "/admin/category-management",
        icon: FolderOpen,
    },
    {
        title: "Profile",
        url: "/admin/profile",
        icon: User,
    },
    {
        title: "Notification",
        url: "/admin/notifications",
        icon: Bell,
    },
    {
        title: "Reset password",
        url: "/admin/reset-password",
        icon: KeyRound,
    },
]

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
]

export function AdminPanel() {
    
    const location = useLocation()

    return (
        <Sidebar className="bg-[#EFEEEB] border-none">
            <SidebarHeader className="flex flex-col justify-center border-b border-[#DAD6D1] h-50 p-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold text-gray-800">hh.</h1>
                    <p className="text-orange-400 font-medium">Admin panel</p>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-0">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0">
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`w-full justify-start px-6 py-7 rounded-none text-gray-600 hover:bg-[#DAD6D1] transition-colors ${location.pathname.startsWith(item.url) ? "bg-[#DAD6D1]" : ""}`}>
                                        <a href={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />
                                            <span className="text-sm">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-0 pb-4 mt-auto">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0">
                            {footerItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={`w-full justify-start px-6 py-7 rounded-none text-gray-600 hover:bg-[#DAD6D1] transition-colors`}>
                                        <a href={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />
                                            <span className="text-sm">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}

