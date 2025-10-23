import { PenSquare, Trash2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AdminPanel } from "../../components/AdminPanel";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AttentionAlert } from "@/components/AttentionAlert";
import { DeletePostDialog } from "@/components/DeletePostDialog";
import API_URL from "@/config/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdminCategoryManagement() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [alertState, setAlertState] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

    // Fetch categories data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const responseCategories = await axios.get(
                    `${API_URL}/categories`
                );
                setCategories(responseCategories.data);
            } catch (error) {
                console.error("Error fetching categories data:", error);
                setAlertState({
                    show: true,
                    type: "error",
                    title: "Failed to load categories",
                    message: "Something went wrong while trying to load categories. Please try again later."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [categories, searchKeyword]);

    const handleDelete = async (categoryId) => {
        try {
            setIsLoading(true);
            await axios.delete(
                `${API_URL}/categories/${categoryId}`
            );
            setAlertState({
                show: true,
                type: "success",
                title: "Deleted Category successfully",
                message: "The category has been removed."
            });
            setCategories(
                categories.filter((category) => category.id !== categoryId)
            );
        } catch {
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to delete category",
                message: "Something went wrong. Please try again later."
            });
        } finally {
            setIsLoading(false);
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
                        <h1 className="text-xl text-brown-600 font-semibold">Category Management</h1>
                    </div>
                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={() => navigate("/admin/category-management/create")}
                    >
                        <Plus size={18} />
                        Create category
                    </Button>
                </header>

                <main className="flex-1 p-8 bg-brown-100 overflow-auto">
                    <div className="space-y-6">
                        {/* Search Section */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full max-w-md py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-500"
                            />
                        </div>

                        {/* Table Section */}
                        <div className="rounded-lg border border-brown-300 overflow-hidden">
                            <Table>
                                <TableHeader className="border-b border-brown-300">
                                    <TableRow className="bg-brown-100 border-none">
                                        <TableHead className="font-medium text-brown-400 py-4 border-none">Category</TableHead>
                                        <TableHead className="font-medium text-brown-400 py-4 text-center w-24 border-none">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(3)
                                            .fill()
                                            .map((_, index) => (
                                                <TableRow key={index} className={`border-none ${index % 2 === 0 ? "bg-brown-100" : "bg-brown-200"}`}>
                                                    <TableCell className="py-4 border-none">
                                                        <Skeleton className="h-6 w-[200px] bg-brown-200" />
                                                    </TableCell>
                                                    <TableCell className="text-right py-4 border-none">
                                                        <Skeleton className="h-6 w-[75px] bg-brown-200" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : filteredCategories.length > 0 ? (
                                        filteredCategories.map((category, index) => (
                                            <TableRow
                                                key={category.id}
                                                className={`border-none ${index % 2 === 0 ? "bg-brown-100" : "bg-brown-200"}`}
                                            >
                                                <TableCell className="py-4 border-none">
                                                    <div className="font-medium text-brown-500 text-sm leading-5">
                                                        {category.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-4 border-none">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            className="p-2 text-brown-400 hover:text-brown-500 rounded transition-colors"
                                                            onClick={() => {
                                                                navigate(
                                                                    `/admin/category-management/edit/${category.id}`
                                                                );
                                                            }}
                                                        >
                                                            <PenSquare className="h-4 w-4" />
                                                        </button>
                                                        <DeletePostDialog
                                                            onDelete={() => handleDelete(category.id)}
                                                            triggerStyle="icon"
                                                            title="Delete Category"
                                                            message="Do you want to delete this category?"
                                                            confirmText="Delete"
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow className="border-none">
                                            <TableCell colSpan={2} className="h-24 text-center border-none">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-brown-500">No categories found</p>
                                                    <p className="text-sm text-brown-400">
                                                        Try adjusting your search criteria
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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