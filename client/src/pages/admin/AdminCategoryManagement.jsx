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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
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

    // Fetch categories data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const responseCategories = await axios.get(
                    "http://localhost:4001/categories"
                );
                setCategories(responseCategories.data);
            } catch (error) {
                console.error("Error fetching categories data:", error);
                toast.custom((t) => (
                    <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-lg mb-1">Failed to load categories</h2>
                            <p className="text-sm">
                                Something went wrong while trying to load categories. Please try again later.
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
                `http://localhost:4001/categories/${categoryId}`
            );
            toast.custom((t) => (
                <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">
                            Deleted Category successfully
                        </h2>
                        <p className="text-sm">The category has been removed.</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="text-white hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>
            ));
            setCategories(
                categories.filter((category) => category.id !== categoryId)
            );
        } catch {
            toast.custom((t) => (
                <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">
                            Failed to delete category
                        </h2>
                        <p className="text-sm">
                            Something went wrong. Please try again later.
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
            setIsLoading(false);
        }
    };

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl font-semibold">Category Management</h1>
                    </div>
                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={() => navigate("/admin/category-management/create")}
                    >
                        <Plus size={18} />
                        Create category
                    </Button>
                </header>

                <main className="flex-1 p-8 bg-white overflow-auto">
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
                        <div className="rounded-lg border border-[#DAD6D1] overflow-hidden">
                            <Table>
                                <TableHeader className="border-b border-[#DAD6D1]">
                                    <TableRow className="bg-[#F9F8F6] border-none hover:bg-gray-50">
                                        <TableHead className="font-medium text-[#43403B] py-4 border-none">Category</TableHead>
                                        <TableHead className="font-medium text-[#43403B] py-4 text-right w-24 border-none">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(3)
                                            .fill()
                                            .map((_, index) => (
                                                <TableRow key={index} className={`border-none ${index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-[#F9F8F6] hover:bg-gray-100"}`}>
                                                    <TableCell className="py-4 border-none">
                                                        <Skeleton className="h-6 w-[200px] bg-gray-200" />
                                                    </TableCell>
                                                    <TableCell className="text-right py-4 border-none">
                                                        <Skeleton className="h-6 w-[75px] bg-gray-200" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : filteredCategories.length > 0 ? (
                                        filteredCategories.map((category, index) => (
                                            <TableRow
                                                key={category.id}
                                                className={`border-none ${index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-[#F9F8F6] hover:bg-gray-100"}`}
                                            >
                                                <TableCell className="py-4 border-none">
                                                    <div className="font-medium text-[#43403B] text-sm leading-5">
                                                        {category.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-4 border-none">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                            onClick={() => {
                                                                navigate(
                                                                    `/admin/category-management/edit/${category.id}`
                                                                );
                                                            }}
                                                        >
                                                            <PenSquare className="h-4 w-4 text-[#43403B]" />
                                                        </button>
                                                        <button
                                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                        >
                                                            <DeleteCategoryDialog
                                                                onDelete={() => handleDelete(category.id)}
                                                            />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow className="border-none">
                                            <TableCell colSpan={2} className="h-24 text-center border-none">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-gray-500">No categories found</p>
                                                    <p className="text-sm text-gray-400">
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
        </SidebarProvider>
    );
}

function DeleteCategoryDialog({ onDelete }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button>
                    <Trash2 className="h-4 w-4 hover:text-muted-foreground text-[#43403B]" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
                <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
                    Delete Category
                </AlertDialogTitle>
                <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
                    Do you want to delete this category?
                </AlertDialogDescription>
                <div className="flex flex-row gap-4">
                    <AlertDialogCancel className="bg-background rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors w-28 h-12 flex items-center justify-center">
                        Cancel
                    </AlertDialogCancel>
                    <button
                        onClick={onDelete}
                        className="rounded-full text-white bg-black hover:bg-muted-foreground transition-colors w-28 h-12 flex items-center justify-center"
                    >
                        Delete
                    </button>
                </div>
                <AlertDialogCancel className="absolute right-4 top-2 sm:top-4 p-1 border-none">
                    <X className="h-6 w-6" />
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}