import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { NavBar } from "../../components/Homepage";
import { UserPanel } from "../../components/UserPanel";
import { AlertDialog } from "../../components/AlertDialog";
import MobileUserPanel from "../../components/MobileUserPanel";
import axios from "axios";
import API_URL from "@/config/api";

export default function ResetPasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Don't submit directly, let the dialog handle it
  };

  const handleResetPassword = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setErrors({
          general: "You must be logged in to change your password.",
        });
        return;
      }

      const response = await axios.put(
        `${API_URL}/auth/reset-password`,
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Password updated successfully!");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success message
      setErrors({ success: "Password updated successfully!" });
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else if (error.response?.status === 401) {
        setErrors({ general: "Invalid current password. Please try again." });
      } else {
        setErrors({ general: "Failed to update password. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear any existing errors when canceling
    setErrors({});
  };

  const handleClose = () => {
    // Clear any existing errors when closing
    setErrors({});
  };

  return (
    <>
      <NavBar />
      <MobileUserPanel />
      <div className="flex">
        <div className="flex-1 min-h-screen bg-brown-100">
          {/* Header */}
          <div className="px-4 md:pt-8 pb-2 md:w-2/3 md:mx-auto">
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
                  Reset Password
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:w-2/3 md:mx-auto">
            <UserPanel />
            <div className="flex-1 p-4 max-w-[550px]">
              <div className="max-w-2xl">
                <div className="bg-brown-200 rounded-lg p-6">
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {errors.general}
                    </div>
                  )}

                  {errors.success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      {errors.success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-brown-400 mb-2"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={`pr-10 border-brown-300 h-12 bg-white ${
                            errors.currentPassword ? "border-red-300" : ""
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-400 hover:text-brown-500"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-brown-400 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`pr-10 border-brown-300 h-12 bg-white ${
                            errors.newPassword ? "border-red-300" : ""
                          }`}
                          placeholder="Enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-400 hover:text-brown-500"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-brown-400 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`pr-10 border-brown-300 h-12  bg-white ${
                            errors.confirmPassword ? "border-red-300" : ""
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-400 hover:text-brown-500"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Submit Button with Confirmation Dialog */}
                    <div className="pt-4">
                      <AlertDialog
                        title="Reset password"
                        message="Do you want to reset your password?"
                        confirmText="Reset"
                        onConfirm={handleResetPassword}
                        onCancel={handleCancel}
                        onClose={handleClose}
                        triggerStyle="custom"
                      >
                        <Button
                          type="button"
                          disabled={isLoading}
                          className="flex items-center rounded-full h-12 px-8 gap-2 bg-brown-600 hover:bg-brown-500 text-white"
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </AlertDialog>
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
