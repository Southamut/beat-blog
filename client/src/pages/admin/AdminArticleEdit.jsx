import { ImageIcon, X } from "lucide-react";
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
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import API_URL from "@/config/api";

export default function AdminArticleEdit() {
    const { state } = useAuth();
    const navigate = useNavigate();
    const { articleId } = useParams();
    const [post, setPost] = useState({
        image: "",
        category_id: null,
        category: "", // Add this field
        title: "",
        description: "",
        date: null,
        content: "",
        status_id: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState({});
    const [alertState, setAlertState] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);


                // Fetch categories
                const responseCategories = await api.get("/categories");
                setCategories(responseCategories.data);

                // Fetch article data
                const responseArticle = await api.get(`/posts/${articleId}`);
                const articleData = responseArticle.data;

                // Find category name
                const category = responseCategories.data.find(cat => cat.id === articleData.category_id);

                setPost({
                    image: articleData.image || "",
                    category_id: articleData.category_id,
                    category: category?.name || "",
                    title: articleData.title || "",
                    description: articleData.description || "",
                    date: articleData.date || null,
                    content: articleData.content || "",
                    status_id: articleData.status_id || null,
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                
                // Handle authentication errors specifically
                if (error.response?.status === 401 || error.response?.status === 403) {
                    setAlertState({
                        show: true,
                        type: "error",
                        title: "Authentication Error",
                        message: "Your session has expired. Please log in again."
                    });
                } else {
                    setAlertState({
                        show: true,
                        type: "error",
                        title: "Failed to load article",
                        message: "Something went wrong while trying to load the article. Please try again later."
                    });
                }
                // Don't redirect automatically - let user see the error message
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [articleId, navigate]);

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

        // Check if title already exists (excluding current article)
        try {
            const titleCheckResponse = await api.get(
                `/posts/check-title/${encodeURIComponent(post.title.trim())}?excludeId=${articleId}`
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
            let imageUrl = post.image || "";

            // Upload new image if provided
            if (imageFile.file) {
                const formData = new FormData();
                formData.append('articleImage', imageFile.file);

                const uploadResponse = await axios.post(
                    `${API_URL}/upload/article-image`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                imageUrl = uploadResponse.data.imageUrl;
            }

            // Create the article data for update
            const articleData = {
                title: post.title.trim(),
                category_id: parseInt(post.category_id),
                description: post.description.trim(),
                content: post.content.trim(),
                status_id: parseInt(postStatusId),
                image: imageUrl
            };

            await api.put(`/posts/${articleId}`, articleData, {
                headers: { "Content-Type": "application/json" },
            });

            // Navigate immediately and pass alert data via state
            const alertData = {
                show: true,
                type: "success",
                title: postStatusId === 1 ? "Update article and saved as draft" : "Update article and published",
                message: postStatusId === 1 ? "You can publish article later" : "Your article is now live"
            };

            navigate("/admin/article-management", {
                state: { alertData }
            });
        } catch (error) {
            console.error("Error updating post:", error);
            
            // Handle authentication errors specifically
            if (error.response?.status === 401 || error.response?.status === 403) {
                setAlertState({
                    show: true,
                    type: "error",
                    title: "Authentication Error",
                    message: "Your session has expired. Please log in again."
                });
            } else {
                setAlertState({
                    show: true,
                    type: "error",
                    title: "Failed to update article",
                    message: error.response?.data?.message || "Something went wrong while trying to update article. Please try again later."
                });
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleAlertClose = () => {
        setAlertState(prev => ({ ...prev, show: false }));
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/posts/${articleId}`);

            const alertData = {
                show: true,
                type: "success",
                title: "Deleted article successfully",
                message: "The article has been removed."
            };
            navigate("/admin/article-management", { state: { alertData } });
        } catch (error) {
            console.error("Error deleting article:", error);
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to delete article",
                message: "Something went wrong. Please try again later."
            });
        }
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

                <header className="flex bg-brown-100 h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl text-brown-600 font-semibold">Edit article</h1>
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

                {isLoading ? (
                    <SkeletonLoading />
                ) : (
                    <main className="flex-1 p-8 bg-brown-100 overflow-auto">
                        <form className="space-y-7 max-w-4xl">
                            <div>
                                <label
                                    htmlFor="thumbnail"
                                    className="block text-brown-400 font-medium mb-2"
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
                                    ) : post.image ? (
                                        <img
                                            src={post.image}
                                            alt="Current"
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
                                        className="px-6 py-2 rounded-full bg-white border-brown-300 text-brown-600 hover:bg-brown-200"
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
                                <label htmlFor="category" className="block text-brown-400 font-medium mb-2">Category</label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={post.category || ""}
                                    onValueChange={(value) => {
                                        handleCategoryChange(value);
                                    }}
                                >
                                    <SelectTrigger className="w-full max-w-lg mt-1 py-3 px-4 rounded-md font-medium bg-white border-brown-300 text-brown-500">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className={`bg-white font-medium text-brown-500 border-none ${categories.length === 0 ? "hidden" : ""}`}>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="author" className="block text-brown-400 font-medium mb-2">Author name</label>
                                <Input
                                    id="author"
                                    name="author"
                                    value={state.user.name}
                                    className="mt-1 max-w-lg py-3 px-4 rounded-md font-medium bg-white border-brown-300 text-brown-500"
                                    disabled
                                />
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-brown-400 font-medium mb-2">Title</label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Article title"
                                    value={post.title}
                                    onChange={handleInputChange}
                                    className="mt-1 max-w-lg py-3 px-4 rounded-md font-medium bg-white border-brown-300 text-brown-500 placeholder:text-brown-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="introduction" className="block text-brown-400 font-medium mb-2">
                                    Introduction (max 120 letters)
                                </label>
                                <Textarea
                                    id="introduction"
                                    name="description"
                                    placeholder="Introduction"
                                    rows={3}
                                    value={post.description}
                                    onChange={handleInputChange}
                                    className="mt-1 max-w-lg py-3 px-4 rounded-md font-medium bg-white border-brown-300 text-brown-500 placeholder:text-brown-400"
                                    maxLength={120}
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-brown-400 font-medium mb-2">Content</label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Content"
                                    rows={15}
                                    value={post.content}
                                    onChange={handleInputChange}
                                    className="mt-1 max-w-4xl py-3 px-4 rounded-md font-medium bg-white border-brown-300 text-brown-500 placeholder:text-brown-400"
                                />
                            </div>

                            {/* Delete Article Link */}
                            <div className="flex justify-start mt-6">
                                <DeletePostDialog onDelete={handleDelete} triggerStyle="text" />
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

function SkeletonLoading() {
    return (
        <main className="flex-1 p-8 bg-white overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit article</h2>
                <div className="space-x-2">
                    <Button className="px-8 py-2 rounded-full" variant="outline" disabled>
                        Save as draft
                    </Button>
                    <Button className="px-8 py-2 rounded-full" disabled>
                        Save and publish
                    </Button>
                </div>
            </div>

            <div className="space-y-7 max-w-4xl">
                <div>
                    <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
                    <div className="flex items-end space-x-4">
                        <Skeleton className="h-48 w-80 bg-gray-200" />
                        <Skeleton className="h-10 w-48 bg-gray-200" />
                    </div>
                </div>

                <div>
                    <Skeleton className="h-4 w-24 mb-2 bg-brown-200" />
                    <Skeleton className="h-10 w-full max-w-lg bg-brown-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-32 mb-2 bg-brown-200" />
                    <Skeleton className="h-10 w-full max-w-lg bg-brown-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-16 mb-2 bg-brown-200" />
                    <Skeleton className="h-10 w-full bg-brown-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-64 mb-2 bg-brown-200" />
                    <Skeleton className="h-24 w-full bg-brown-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-24 mb-2 bg-brown-200" />
                    <Skeleton className="h-80 w-full bg-brown-200" />
                </div>
            </div>
        </main>
    );
}