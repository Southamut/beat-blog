import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdminPanel } from "@/components/AdminPanel";
import { Textarea } from "@/components/ui/textarea";
import { AttentionAlert } from "@/components/AttentionAlert";
import { DeletePostDialog } from "@/components/DeletePostDialog";
import { useAuth } from "@/contexts/authentication";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminArticleCreate() {
    const { state } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState({
        image: "",
        category_id: null,
        title: "",
        description: "",
        date: null,
        content: "",
        status_id: null,
    });
    const [isLoading, setIsLoading] = useState(null);
    const [isSaving, setIsSaving] = useState(null);
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState({});
    const [alertState, setAlertState] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

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
                navigate("*");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategoryChange = (value) => {
        const selectedCategory = categories.find((cat) => cat.name === value);
        setPost((prevData) => ({
            ...prevData,
            category: value,
            category_id: selectedCategory?.id || null,
        }));
    };

    const handleSave = async (postStatusId) => {
        // Validate required fields
        if (!post.title.trim()) {
            setAlertState({
                show: true,
                type: "error",
                title: "Validation Error",
                message: "Title is required"
            });
            return;
        }

        if (!post.category_id) {
            setAlertState({
                show: true,
                type: "error",
                title: "Validation Error",
                message: "Please select a category"
            });
            return;
        }

        if (!post.description.trim()) {
            setAlertState({
                show: true,
                type: "error",
                title: "Validation Error",
                message: "Description is required"
            });
            return;
        }

        if (!post.content.trim()) {
            setAlertState({
                show: true,
                type: "error",
                title: "Validation Error",
                message: "Content is required"
            });
            return;
        }

        // Check if title already exists
        try {
            const titleCheckResponse = await axios.get(
                `http://localhost:4001/posts/check-title/${encodeURIComponent(post.title.trim())}`
            );

            if (titleCheckResponse.data.exists) {
                setAlertState({
                    show: true,
                    type: "error",
                    title: "Title Already Exists",
                    message: "An article with this title already exists. Please choose a different title."
                });
                return;
            }
        } catch (error) {
            console.error("Error checking title:", error);
            // Continue with save if title check fails (don't block user)
        }

        setIsSaving(true);

        try {
            // Create the article data without image
            const articleData = {
                title: post.title.trim(),
                category_id: parseInt(post.category_id), // Ensure it's a number
                description: post.description.trim(),
                content: post.content.trim(),
                status_id: parseInt(postStatusId), // Ensure it's a number
                image: "" // Empty image for now
            };

            await axios.post(
                "http://localhost:4001/posts",
                articleData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // Navigate immediately and pass alert data via state
            const alertData = {
                show: true,
                type: "success",
                title: postStatusId === 1 ? "Create article and saved as draft" : "Create article and published",
                message: postStatusId === 1 ? "You can publish article later" : "Your article is now live"
            };

            navigate("/admin/article-management", {
                state: { alertData }
            });
        } catch (error) {
            console.error("Error creating post:", error);
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to create article",
                message: "Something went wrong while trying to create article. Please try again later."
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAlertClose = () => {
        setAlertState(prev => ({ ...prev, show: false }));
    };

    const handleDiscardConfirm = () => {
        navigate("/admin/article-management");
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

        if (!file) {
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to upload file",
                message: "Please upload a valid image file (JPEG, PNG, GIF, WebP)."
            });
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to upload file",
                message: "The file is too large. Please upload an image smaller than 5MB."
            });
            return;
        }

        setImageFile({ file });
    };

    const handleUploadClick = () => {
        document.getElementById('file-upload').click();
    };

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>

                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl font-semibold">Create article</h1>
                    </div>
                    <div className="space-x-2">
                        <Button
                            className="px-8 py-2 rounded-full bg-white text-brown-600 border-brown-400 hover:bg-brown-100"
                            variant="outline"
                            disabled={isSaving}
                            onClick={() => handleSave(1)}
                        >
                            Save as draft
                        </Button>
                        <Button
                            className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                            disabled={isSaving}
                            onClick={() => handleSave(2)}
                        >
                            Save and publish
                        </Button>
                    </div>
                </header>

                {!isLoading && (
                    <main className="flex-1 p-8 bg-white overflow-auto">
                        <form className="space-y-7 max-w-4xl">
                            <div>
                                <label
                                    htmlFor="thumbnail"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Thumbnail image
                                </label>
                                <div className="flex items-end space-x-4">
                                    {imageFile.file ? (
                                        <img
                                            src={URL.createObjectURL(imageFile.file)}
                                            alt="Uploaded"
                                            className="rounded-md object-cover w-80 h-48"
                                        />
                                    ) : (
                                        <div className="flex justify-center items-center w-80 h-48 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                            <div className="text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="px-6 py-2 rounded-full bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                                        onClick={handleUploadClick}
                                    >
                                        Upload thumbnail image
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
                                <Select
                                    value={post.category}
                                    onValueChange={(value) => {
                                        handleCategoryChange(value);
                                    }}
                                >
                                    <SelectTrigger className="w-full max-w-lg mt-1 py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 focus:ring-0 focus:ring-offset-0 focus:border-gray-500">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className={`bg-white border-none ${categories.length === 0 ? "hidden" : ""}`}>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="author" className="block text-gray-700 font-medium mb-2">Author name</label>
                                <Input
                                    id="author"
                                    name="author"
                                    value={state.user.name}
                                    className="mt-1 max-w-lg py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 focus:ring-0 focus:ring-offset-0 focus:border-gray-500"
                                    disabled
                                />
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Article title"
                                    value={post.title}
                                    onChange={handleInputChange}
                                    className="mt-1 max-w-lg py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="introduction" className="block text-gray-700 font-medium mb-2">
                                    Introduction (max 120 letters)
                                </label>
                                <Textarea
                                    id="introduction"
                                    name="description"
                                    placeholder="Introduction"
                                    rows={3}
                                    value={post.description}
                                    onChange={handleInputChange}
                                    className="mt-1 max-w-lg py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-500 resize-none"
                                    maxLength={120}
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Content"
                                    rows={15}
                                    value={post.content}
                                    onChange={handleInputChange}
                                    className="mt-1 max-w-4xl py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-500 resize-none"
                                />
                            </div>

                            {/* Discard Button */}
                            <div className="flex justify-start mt-6">
                                <DeletePostDialog
                                    onDelete={handleDiscardConfirm}
                                    triggerStyle="text"
                                    title="Discard Article"
                                    message="Are you sure you want to discard this article? All unsaved changes will be lost."
                                    confirmText="Discard"
                                />
                            </div>
                        </form>
                    </main>
                )}
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