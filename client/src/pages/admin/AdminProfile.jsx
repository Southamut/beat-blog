import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AdminPanel } from "../../components/AdminPanel"
import { useAuth } from "../../contexts/authentication"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import API_URL from "@/config/api"

export function AdminProfile() {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        profile_pic: "",
        bio: ""
    })
    
    const [profilePicFile, setProfilePicFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                profile_pic: user.profile_pic || "",
                bio: user.bio || "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.\nWhen i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes."
            })
        }
    }, [user])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfilePicFile(file)
            // Preview the image
            const reader = new FileReader()
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    profile_pic: e.target.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        try {
            setIsLoading(true)
            setErrors({})

            const token = localStorage.getItem("access_token")
            if (!token) {
                alert("Please log in to update your profile")
                return
            }

            // Create FormData for file upload
            const formDataToSend = new FormData()
            formDataToSend.append("name", formData.name)
            formDataToSend.append("email", formData.email)
            formDataToSend.append("username", formData.username)
            formDataToSend.append("bio", formData.bio)

            // Add profile picture file if selected
            if (profilePicFile) {
                formDataToSend.append("profilePicFile", profilePicFile)
            }

            // Send to backend
            const response = await axios.put(
                `${API_URL}/upload/profile`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            console.log("Profile updated successfully!", response.data)

            // Update local context
            await updateUser(response.data.user)

            // Update formData with new profile picture URL
            setFormData(prev => ({
                ...prev,
                profile_pic: response.data.user.profile_pic,
            }))

            alert("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating profile:", error)
            
            if (error.response?.data?.error) {
                alert(error.response.data.error)
            } else {
                alert("Failed to update profile. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
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
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </header>

                <div className="p-12">
                    {/* Profile Picture Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {formData.profile_pic ? (
                                <img
                                    src={formData.profile_pic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-brown-200 flex items-center justify-center text-brown-600 font-bold">
                                    {formData.name ? formData.name.charAt(0).toUpperCase() : "A"}
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="profile-pic-upload"
                            />
                            <Button
                                className="bg-white text-black border border-brown-400 hover:bg-brown-200 rounded-full px-4 py-2"
                                onClick={() => document.getElementById('profile-pic-upload').click()}
                            >
                                Upload profile picture
                            </Button>
                        </div>
                    </div>

                    <div className="w-2/4">
                        <Separator className="bg-brown-300 mb-6" />
                    </div>

                    {/* User Information Form */}
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brown-400">Name</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-2/4 bg-white text-black border-brown-300 rounded-lg"
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brown-400">Username</label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-2/4 bg-white text-black border-brown-300 rounded-lg"
                                placeholder="Enter your username"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brown-400">Email</label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-2/4 bg-white text-black border-brown-300 rounded-lg"
                                placeholder="Enter your email"
                                type="email"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Bio Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brown-400">Bio (max 120 letters)</label>
                            <Textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="bg-white text-brown-400 border-brown-300 rounded-lg resize-none"
                                placeholder="Tell us about yourself..."
                                rows={4}
                                maxLength={120}
                            />
                            <div className="text-brown-400 text-xs text-right">
                                {formData.bio.length}/120 characters
                            </div>
                            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                        </div>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}