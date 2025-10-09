import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPanel } from "@/components/AdminPanel";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import axios from "axios";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryCreate() {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSave = async () => {
        if (!categoryName.trim()) {
            setErrorMessage("Category name is required.");
            return;
        }
        setErrorMessage("");

        setIsSaving(true);

        try {
            await axios.post(
                "http://localhost:4001/categories",
                {
                    name: categoryName.trim(),
                }
            );

            toast.custom((t) => (
                <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">
                            Created category successfully
                        </h2>
                        <p className="text-sm">
                            Your category has been successfully created.
                        </p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="text-white hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>
            ));

            setCategoryName("");
            navigate("/admin/category-management");
        } catch (error) {
            console.error("Error creating category:", error);
            toast.custom((t) => (
                <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">
                            Failed to create category
                        </h2>
                        <p className="text-sm">
                            Something went wrong while creating the category. Please try again
                            later.
                        </p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="text-white hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>
            ));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl font-semibold">Create Category</h1>
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
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Category Name
                            </label>
                            <Input
                                id="category-name"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Category name"
                                className={`mt-1 py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-500 ${errorMessage ? "border-red-500" : ""
                                    }`}
                            />
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                            )}
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
