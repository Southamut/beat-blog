import { useState, useEffect } from "react"
import { AdminPanel } from "../../components/AdminPanel"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttentionAlert } from "@/components/AttentionAlert"
import { useNavigate, useLocation } from "react-router-dom"
import { DeletePostDialog } from "@/components/DeletePostDialog";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import API_URL from "@/config/api";

export function AdminArticleManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [articles, setArticles] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [alertState, setAlertState] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    })

    const navigate = useNavigate()
    const location = useLocation()

    // Check for alert data from navigation
    useEffect(() => {
        if (location.state?.alertData) {
            setAlertState(location.state.alertData)
            // Refresh data to show the new article
            fetchData()
            // Clear the state to prevent showing alert on refresh
            navigate(location.pathname, { replace: true, state: {} })
        }
    }, [location.state, navigate, location.pathname])

    // Extract fetchData function to be reusable
    const fetchData = async () => {
        try {
            setIsLoading(true)

            // Fetch articles with status and category information
            // Use a large limit to get all posts for admin management
            const articlesResponse = await axios.get(`${API_URL}/posts?limit=100`)
            const categoriesResponse = await axios.get(`${API_URL}/categories`)

            setArticles(articlesResponse.data.posts || [])
            setCategories(categoriesResponse.data || [])
        } catch (error) {
            console.error("Error fetching data:", error)
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to load articles",
                message: "Something went wrong while trying to load articles. Please try again later."
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch articles and categories from Supabase
    useEffect(() => {
        fetchData()
    }, [])

    // Get status name from status_id
    const getStatusName = (statusId) => {
        const statusMap = {
            1: "Draft",
            2: "Published",
            3: "Archived"
        }
        return statusMap[statusId] || "Unknown"
    }

    // Get status color and dot color
    const getStatusStyle = (statusId) => {
        if (statusId === 2) { // Published
            return {
                dotColor: "bg-green",
                textColor: "text-green"
            }
        } else if (statusId === 1) { // Draft
            return {
                dotColor: "bg-brown-400",
                textColor: "text-brown-400"
            }
        } else { // Archived or other
            return {
                dotColor: "bg-red",
                textColor: "text-red"
            }
        }
    }

    // Get category name from category_id
    const getCategoryName = (categoryId) => {
        // Convert categoryId to number if it's a string
        const numericCategoryId = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
        
        const category = categories.find(cat => cat.id === numericCategoryId)
        return category ? category.name : "Unknown"
    }

    // Filter articles
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || getStatusName(article.status_id).toLowerCase() === statusFilter.toLowerCase()
        const categoryName = article.category || getCategoryName(article.category_id)
        const matchesCategory = categoryFilter === "all" || categoryName === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    const handleDelete = async (articleId) => {
        try {
            await axios.delete(`${API_URL}/posts/${articleId}`)
            setAlertState({
                show: true,
                type: "success",
                title: "Deleted article successfully",
                message: "The article has been removed."
            })
            setArticles(articles.filter(article => article.id !== articleId))
        } catch (error) {
            console.error("Error deleting article:", error)
            setAlertState({
                show: true,
                type: "error",
                title: "Failed to delete article",
                message: "Something went wrong. Please try again later."
            })
        }
    }

    const handleAlertClose = () => {
        setAlertState(prev => ({ ...prev, show: false }))
    }

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>
                <header className="flex bg-brown-100 h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl text-brown-600 font-semibold">Article Management</h1>
                    </div>
                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={() => navigate("/admin/article-management/create")}
                    >
                        <Plus size={18} />
                        Create article
                    </Button>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-8 bg-brown-100">
                    {/* Filter Section */}
                    <div className="flex justify-between items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400 h-4 w-4" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="py-3 px-4 pl-10 rounded-md font-medium bg-white border-brown-200 text-brown-500 placeholder:text-brown-400 focus:ring-0 focus:ring-offset-0"
                            />
                        </div>

                        <div className="flex gap-4">
                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="py-3 px-4 rounded-md font-medium bg-white border-brown-200 text-brown-400 focus:ring-0 focus:ring-offset-0 w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white font-medium text-brown-400 border-none focus:ring-0 focus:ring-offset-0">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Category Filter */}
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="py-3 px-4 rounded-md font-medium bg-white border-brown-200 text-brown-400 focus:ring-0 focus:ring-offset-0 w-32">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white font-medium text-brown-400 border-none focus:ring-0 focus:ring-offset-0">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border border-brown-300 overflow-hidden">
                        <Table>
                            <TableHeader className="border-b border-brown-300">
                                <TableRow className="bg-brown-100 border-none hover:bg-brown-200">
                                    <TableHead className="font-medium text-brown-400 py-4 border-none">Article title</TableHead>
                                    <TableHead className="font-medium text-brown-400 py-4 border-none">Category</TableHead>
                                    <TableHead className="font-medium text-brown-400 py-4 border-none">Status</TableHead>
                                    <TableHead className="border-none"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array(3).fill().map((_, index) => (
                                        <TableRow key={index} className={`border-none ${index % 2 === 0 ? "bg-white" : "bg-brown-100"}`}>
                                            <TableCell className="py-4 border-none">
                                                <Skeleton className="h-6 w-[300px] bg-brown-200" />
                                            </TableCell>
                                            <TableCell className="py-4 border-none">
                                                <Skeleton className="h-6 w-[100px] bg-brown-200" />
                                            </TableCell>
                                            <TableCell className="py-4 border-none">
                                                <Skeleton className="h-6 w-[80px] bg-brown-200" />
                                            </TableCell>
                                            <TableCell className="py-4 text-right border-none">
                                                <Skeleton className="h-6 w-[75px] bg-brown-200" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredArticles.length > 0 ? (
                                    filteredArticles.map((article, index) => {
                                        const statusStyle = getStatusStyle(article.status_id)
                                        return (
                                            <TableRow key={article.id} className={`border-none ${index % 2 === 0 ? "bg-brown-100" : "bg-brown-200"}`}>
                                                <TableCell className="py-4 border-none">
                                                    <div className="font-medium text-brown-500 text-sm leading-5">
                                                        {article.title}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 border-none">
                                                    <span className="font-medium text-sm text-brown-500">
                                                        {article.category || getCategoryName(article.category_id)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 border-none">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${statusStyle.dotColor}`}></div>
                                                        <span className={`font-medium text-sm ${statusStyle.textColor}`}>
                                                            {getStatusName(article.status_id)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-right border-none">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            className="p-2 text-brown-400 hover:text-brown-500 rounded transition-colors"
                                                            onClick={() => navigate(`/admin/article-management/edit/${article.id}`)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <DeletePostDialog onDelete={() => handleDelete(article.id)} triggerStyle="icon" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow className="border-none">
                                        <TableCell colSpan={4} className="h-24 text-center border-none">
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-gray-500">No articles found</p>
                                                <p className="text-sm text-gray-400">
                                                    Try adjusting your search or filter criteria
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Results info */}
                    <div className="text-sm text-brown-400">
                        Showing {filteredArticles.length} of {articles.length} articles
                    </div>
                </div>
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
    )
}