import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPanel } from "@/components/AdminPanel";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AttentionAlert } from "@/components/AttentionAlert";
import axios from "axios";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_URL from "@/config/api";

export default function AdminCategoryCreate() {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertState, setAlertState] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

    const handleSave = async () => {
        if (!categoryName.trim()) {
            setErrorMessage("Category name is required.");
            return;
        }
        setErrorMessage("");

        setIsSaving(true);

        try {
            await axios.post(
                `${API_URL}/categories`,
                {
                    name: categoryName.trim(),
                }
            );

            // Show success alert
            setAlertState({
                show: true,
                type: "success",
                title: "Create category",
                message: "Category has been successfully created."
            });

            setCategoryName("");

            // Navigate to category management after a short delay
            setTimeout(() => {
                navigate("/admin/category-management");
            }, 2000);
        } catch (error) {
            console.error("Error creating category:", error);

            // Show error alert
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to create category",
                message: "Something went wrong while creating the category. Please try again later."
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAlertClose = () => {
        setAlertState(prev => ({ ...prev, show: false }));
    };

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>
                <header className="flex bg-brown-100 h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl text-brown-600 font-semibold">Create Category</h1>
                    </div>
                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Plus size={18} className="mr-2" />
                        Save Category
                    </Button>
                </header>

                <main className="flex-1 p-8 bg-white overflow-auto">
                    <div className="space-y-7 max-w-md">
                        <div className="relative space-y-1">
                            <label
                                htmlFor="category-name"
                                className="block text-brown-400 font-medium mb-2"
                            >
                                Category Name
                            </label>
                            <Input
                                id="category-name"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Category name"
                                className={`mt-1 py-3 px-4 rounded-md font-medium bg-white border-brown-300 text-brown-500 placeholder:text-brown-400 ${errorMessage ? "border-red" : ""
                                    }`}
                            />
                            {errorMessage && (
                                <p className="text-red text-sm mt-1">{errorMessage}</p>
                            )}
                        </div>
                    </div>
                </main>
            </SidebarInset>

            {/* Attention Alert */}
            <AttentionAlert
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
                isVisible={alertState.show}
                onClose={handleAlertClose}
                autoHide={true}
                duration={3000}
            />
        </SidebarProvider>
    );
}
