import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { NavBar } from "../../components/Homepage";
import { UserPanel } from "../../components/UserPanel";
import axios from "axios";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    profile_pic: "",
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        profile_pic: user.profile_pic || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // ตรวจสอบประเภทของไฟล์
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, WebP).");
      return;
    }

    // ตรวจสอบขนาดของไฟล์ (เช่น ขนาดไม่เกิน 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("The file is too large. Please upload an image smaller than 5MB.");
      return;
    }

    // เก็บข้อมูลไฟล์
    setProfilePicFile(file);

    // สร้าง preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        profile_pic: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Email validation removed since it's read-only
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("You must be logged in to update your profile.");
        return;
      }

      // สร้าง FormData สำหรับการส่งข้อมูลแบบ multipart/form-data
      const formDataToSend = new FormData();

      // เพิ่มข้อมูลทั้งหมดลงใน FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);

      // เพิ่มไฟล์รูปภาพถ้ามี
      if (profilePicFile) {
        formDataToSend.append("profilePicFile", profilePicFile);
      }

      // ส่งข้อมูลไปยัง Backend
      const response = await axios.put(
        "http://localhost:4001/upload/profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully!", response.data);

      // Update local context with the returned user data
      await updateUser(response.data.user);

      // Update formData with the new profile picture URL
      setFormData((prev) => ({
        ...prev,
        profile_pic: response.data.user.profile_pic,
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex">
        <div className="flex-1 min-h-screen bg-brown-100">
        {/* Header */}
        <div className="px-4 pt-8 pb-2 md:w-2/3 md:mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-15 h-15 rounded-full overflow-hidden bg-brown-400 flex items-center justify-center">
                {user.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-brown-100" />
                )}
              </div>
              <span className="text-brown-400 text-2xl font-medium">
                {user?.name} |
              </span>
              <span className="text-brown-600 text-2xl font-medium">
                Profile
              </span>
            </div>
          </div>
        </div>

        <div className="flex md:w-2/3 md:mx-auto">
        <UserPanel />
          {/* Main Content */}
          <div className="flex-1 p-4 w-full md:max-w-[550px]">
            <div className="w-full md:max-w-2xl">
              <div className="bg-brown-200 rounded-lg py-6 px-8">
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col md:flex-row items-center gap-6 border-b border-brown-300 pb-6">
                    <div className="flex-shrink-0">
                      <div className="w-30 h-30 rounded-full bg-brown-400 flex items-center justify-center overflow-hidden">
                        {formData.profile_pic ? (
                          <img
                            src={formData.profile_pic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-brown-100" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                        id="profile-pic-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("profile-pic-upload").click()
                        }
                        className="flex h-12 w-full lg:max-w-4/5 items-center rounded-full gap-2 bg-white border-brown-400 text-brown-600 hover:bg-brown-100"
                      >
                        Upload profile picture
                      </Button>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-brown-400 mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`bg-white border-brown-300 h-12 ${
                        errors.name ? "border-red-300" : ""
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Username Field */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-brown-400 mb-2"
                    >
                      Username
                    </label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`bg-white border-brown-300 h-12 ${
                        errors.username ? "border-red-300" : ""
                      }`}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Email Field - Read Only */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-brown-400 mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="h-12 text-brown-400 border-none bg-none shadow-none cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center h-12 w-30 rounded-full gap-2 bg-brown-600 hover:bg-brown-500 text-white"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
