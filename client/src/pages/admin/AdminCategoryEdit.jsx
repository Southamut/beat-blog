import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPanel } from "@/components/AdminPanel";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import axios from "axios";
import { toast } from "sonner";
import { X, PenSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoryEdit() {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `http://localhost:4001/categories/${categoryId}`
                );
                setCategoryName(response.data.name);
            } catch (error) {
                console.error("Error fetching category data:", error);
                toast.custom((t) => (
                    <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-lg mb-1">Failed to load category</h2>
                            <p className="text-sm">
                                Something went wrong while trying to load the category. Please try again later.
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
                navigate("/admin/category-management");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId, navigate]);

    const handleSave = async () => {
        if (!categoryName.trim()) {
            setErrorMessage("Category name is required.");
            return;
        }
        setErrorMessage("");

        setIsSaving(true);

        try {
            await axios.put(
                `http://localhost:4001/categories/${categoryId}`,
                {
                    name: categoryName.trim(),
                }
            );

            toast.custom((t) => (
                <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">
                            Updated category successfully
                        </h2>
                        <p className="text-sm">
                            Your category has been successfully updated.
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

            navigate("/admin/category-management");
        } catch (error) {
            console.error("Error updating category:", error);
            toast.custom((t) => (
                <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">
                            Failed to update category
                        </h2>
                        <p className="text-sm">
                            Something went wrong while updating the category. Please try again
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
                        <h1 className="text-xl font-semibold">Edit Category</h1>
                    </div>
                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                    >
                        <PenSquare size={18} className="mr-2" />
                        Save Changes
                    </Button>
                </header>

                {isLoading ? (
                    <SkeletonLoading />
                ) : (
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
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}

function SkeletonLoading() {
    return (
        <main className="flex-1 p-8 bg-white overflow-auto">
            <div className="space-y-7 max-w-md">
                <div>
                    <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 w-full bg-gray-200" />
                </div>
            </div>
        </main>
    );
}
