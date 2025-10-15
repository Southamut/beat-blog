import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AdminPanel } from "../../components/AdminPanel"
import { useAuth } from "../../contexts/authentication"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function AdminProfile() {
    const { state, setState } = useAuth()
    const [formData, setFormData] = useState({
        name: state.user.name || "Thompson P.",
        username: "thompson",
        email: state.user.email || "thompson.p@gmail.com",
        bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.\nWhen i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes."
    })

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = () => {
        setState(prev => ({
            ...prev,
            user: {
                ...prev.user,
                name: formData.name,
                email: formData.email
            }
        }))
        // Here you would typically make an API call to save the profile
        console.log("Profile saved:", formData)
    }

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset className=" min-h-screen">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 " />
                        <h1 className="text-xl font-semibold ">Profile</h1>
                    </div>

                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={() => navigate("/admin/category-management/create")}
                    >
                        Save
                    </Button>
                </header>

                <div className="p-12">
                    {/* Profile Picture Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            <img
                                src="/src/assets/man_and_cat.jpg"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Button
                            className="bg-white text-black border border-brown-400 hover:bg-brown-200 rounded-full px-4 py-2"
                            onClick={() => console.log("Upload profile picture")}
                        >
                            Upload profile picture
                        </Button>
                    </div>

                    <div className="w-2/4">
                        <Separator className="bg-brown-300 mb-6" />
                    </div>

                    {/* User Information Form */}
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className=" text-sm font-medium text-brown-400">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-2/4 bg-white text-black border-brown-300 rounded-lg"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className=" text-sm font-medium text-brown-400">Username</label>
                            <Input
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className="w-2/4 bg-white text-black border-brown-300 rounded-lg"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className=" text-sm font-medium text-brown-400">Email</label>
                            <Input
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-2/4 bg-white text-black border-brown-300 rounded-lg"
                                placeholder="Enter your email"
                                type="email"
                            />
                        </div>

                        {/* Bio Field */}
                        <div className="space-y-2">
                            <label className=" text-sm font-medium text-brown-400">Bio (max 120 letters)</label>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="bg-white text-brown-400 border-brown-300 rounded-lg resize-none"
                                placeholder="Tell us about yourself..."
                                rows={4}
                                maxLength={120}
                            />
                            <div className="text-brown-400 text-xs text-right">
                                {formData.bio.length}/120 characters
                            </div>
                        </div>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}