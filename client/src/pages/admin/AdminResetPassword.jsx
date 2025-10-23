import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPanel } from "../../components/AdminPanel";
import { AlertDialog } from "../../components/AlertDialog";
import { AttentionAlert } from "../../components/AttentionAlert";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "@/config/api";
import { useAuth } from "@/contexts/authentication";

export function AdminResetPassword() {
  const { user, login } = useAuth();
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertState, setAlertState] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });

  // On mount, show any persisted alert (e.g., after silent re-login navigation)
  useEffect(() => {
    const persistedMsg = localStorage.getItem("password_reset_success");
    if (persistedMsg) {
      setAlertState({
        show: true,
        type: "success",
        title: "Password updated",
        message: persistedMsg
      });
      localStorage.removeItem("password_reset_success");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate first; if passes, open confirm dialog
    if (validateForm()) {
      setIsDialogOpen(true);
    }
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

      await axios.put(
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

      // Silently re-login with the new password to refresh the session
      if (user?.email) {
        try {
          // Stay on the same page after login
          localStorage.setItem("referrer_path", window.location.pathname);
          await login({ email: user.email, password: formData.newPassword });
          // Persist a success message across the navigation
          localStorage.setItem("password_reset_success", "Your password has been changed successfully.");
        } catch (reloginError) {
          // If re-login fails, show an error
          const msg = reloginError?.response?.data?.error || "Re-login failed. Please sign in again.";
          setErrors({ general: msg });
          setAlertState({
            show: true,
            type: "error",
            title: "Error",
            message: msg
          });
        }
      }

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setErrors({ success: "Password updated successfully!" });
      setAlertState({
        show: true,
        type: "success",
        title: "Password updated",
        message: "Your password has been changed successfully."
      });
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
        setAlertState({
          show: true,
          type: "error",
          title: "Error",
          message: error.response.data.error
        });
      } else if (error.response?.status === 401) {
        setErrors({ general: "Invalid current password. Please try again." });
        setAlertState({
          show: true,
          type: "error",
          title: "Error",
          message: "Invalid current password. Please try again."
        });
      } else {
        setErrors({ general: "Failed to update password. Please try again." });
        setAlertState({
          show: true,
          type: "error",
          title: "Error",
          message: "Failed to update password. Please try again."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleConfirmReset = async () => {
    if (!validateForm()) return;
    await handleResetPassword();
    setIsDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <AdminPanel />
      <SidebarInset className=" min-h-screen">
        <header className="flex bg-brown-100 h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 " />
            <h1 className="text-xl text-brown-600 font-semibold ">
              Reset Password
            </h1>
          </div>

          <Button
            type="submit"
            form="admin-reset-form"
            className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </header>

        {/* Controlled dialog rendered separately; no trigger so it opens only after validation */}
        <AlertDialog
          title="Reset password"
          message="Do you want to reset your password?"
          confirmText="Reset"
          onConfirm={handleConfirmReset}
          onCancel={handleCancel}
          onClose={handleClose}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />

         <div className="p-12 h-full bg-brown-100">
          <div className="h-full">
            <div className="h-full">
               <form id="admin-reset-form" onSubmit={handleSubmit} className="space-y-6 max-w-[550px]">
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
                      className={`pr-10 border-brown-300 h-12 bg-white ${
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
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Success/Error Alert */}
      <AttentionAlert
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        isVisible={alertState.show}
        onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
        autoHide={true}
        duration={4000}
      />
    </SidebarProvider>
  );
}
