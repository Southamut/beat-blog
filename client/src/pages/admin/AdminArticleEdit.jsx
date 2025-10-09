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
import { useAuth } from "@/contexts/authentication";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminArticleEdit() {
    const { state } = useAuth();
    const navigate = useNavigate();
    const { articleId } = useParams();
    const [post, setPost] = useState({
        image: "",
        category_id: null,
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch categories
                const responseCategories = await axios.get(
                    "http://localhost:4001/categories"
                );
                setCategories(responseCategories.data);

                // Fetch article data
                const responseArticle = await axios.get(
                    `http://localhost:4001/posts/${articleId}`
                );
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
                toast.custom((t) => (
                    <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-lg mb-1">Failed to load article</h2>
                            <p className="text-sm">
                                Something went wrong while trying to load the article. Please try again later.
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
                navigate("/admin/article-management");
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
        setIsSaving(true);
        const formData = new FormData();

        formData.append("title", post.title);
        formData.append("category_id", post.category_id);
        formData.append("description", post.description);
        formData.append("content", post.content);
        formData.append("status_id", postStatusId);
        formData.append("user_id", state.user.id);
        formData.append("image", "");

        if (imageFile.file) {
            const reader = new FileReader();
            reader.onload = async () => {
                formData.set("image", reader.result);

                try {
                    await axios.put(
                        `http://localhost:4001/posts/${articleId}`,
                        Object.fromEntries(formData),
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    toast.custom((t) => (
                        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-lg mb-1">
                                    Updated article successfully
                                </h2>
                                <p className="text-sm">
                                    {postStatusId === 1
                                        ? "Your article has been successfully saved as draft."
                                        : postStatusId === 2
                                            ? "Your article has been successfully published."
                                            : ""}
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
                    navigate("/admin/article-management");
                } catch (error) {
                    console.error("Error updating post:", error);
                    toast.custom((t) => (
                        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-lg mb-1">Failed to update article</h2>
                                <p className="text-sm">
                                    Something went wrong while trying to update article. Please try
                                    again later.
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
            reader.readAsDataURL(imageFile.file);
        } else {
            try {
                await axios.put(
                    `http://localhost:4001/posts/${articleId}`,
                    Object.fromEntries(formData),
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                toast.custom((t) => (
                    <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-lg mb-1">
                                Updated article successfully
                            </h2>
                            <p className="text-sm">
                                {postStatusId === 1
                                    ? "Your article has been successfully saved as draft."
                                    : postStatusId === 2
                                        ? "Your article has been successfully published."
                                        : ""}
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
                navigate("/admin/article-management");
            } catch (error) {
                console.error("Error updating post:", error);
                toast.custom((t) => (
                    <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-lg mb-1">Failed to update article</h2>
                            <p className="text-sm">
                                Something went wrong while trying to update article. Please try
                                again later.
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
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

        if (!file) {
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            toast.custom((t) => (
                <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">Failed to upload file</h2>
                        <p className="text-sm">
                            Please upload a valid image file (JPEG, PNG, GIF, WebP).
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
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.custom((t) => (
                <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg mb-1">Failed to upload file</h2>
                        <p className="text-sm">
                            The file is too large. Please upload an image smaller than 5MB.
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
                        <h1 className="text-xl font-semibold">Edit article</h1>
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
                        </form>
                    </main>
                )}
            </SidebarInset>
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
                    <Skeleton className="h-4 w-24 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 w-full max-w-lg bg-gray-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 w-full max-w-lg bg-gray-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-16 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 w-full bg-gray-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-64 mb-2 bg-gray-200" />
                    <Skeleton className="h-24 w-full bg-gray-200" />
                </div>

                <div>
                    <Skeleton className="h-4 w-24 mb-2 bg-gray-200" />
                    <Skeleton className="h-80 w-full bg-gray-200" />
                </div>
            </div>
        </main>
    );
}