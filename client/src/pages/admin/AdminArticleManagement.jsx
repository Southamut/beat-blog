import { useState } from "react"
import { AdminPanel } from "../../components/AdminPanel"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "../../data/blogPosts"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function AdminArticleManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const navigate = useNavigate()

    // Add status to blog posts (for demo purposes, all are published)
    const articlesWithStatus = blogPosts.map(post => ({
        ...post,
        status: "Published"
    }))

    // Get unique categories
    const categories = [...new Set(blogPosts.map(post => post.category))]

    // Filter articles and show only first one for demo
    const filteredArticles = articlesWithStatus.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || article.status.toLowerCase() === statusFilter.toLowerCase()
        const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-xl font-semibold">Article Management</h1>
                    </div>
                    <Button
                        className="px-8 py-2 rounded-full bg-brown-600 text-white hover:bg-brown-500"
                        onClick={() => navigate("/admin/article-management/create")}
                    >
                        <Plus size={18} />
                        Create article
                    </Button>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-8">
                    {/* Filter Section */}
                    <div className="flex justify-between items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="py-3 px-4 pl-10 rounded-md bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 focus:ring-0 focus:ring-offset-0 focus:border-gray-500 w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Category Filter */}
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="py-3 px-4 rounded-md bg-gray-50 border-gray-300 text-gray-700 focus:ring-0 focus:ring-offset-0 focus:border-gray-500 w-32">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="border-b border-gray-200">
                                <TableRow className="bg-brown-200 border-none hover:bg-brown-200">
                                    <TableHead className="font-medium text-brown-600 py-4 border-none">Article title</TableHead>
                                    <TableHead className="font-medium text-brown-600 py-4 border-none">Category</TableHead>
                                    <TableHead className="font-medium text-brown-600 py-4 border-none">Status</TableHead>
                                    <TableHead className="font-medium text-brown-600 py-4 text-right w-24 border-none"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredArticles.length > 0 ? (
                                    filteredArticles.map((article, index) => (
                                        <TableRow key={article.id} className={`border-none ${index % 2 === 0 ? "bg-white" : "bg-brown-100"}`}>
                                            <TableCell className="py-4 border-none">
                                                <div className="font-medium text-gray-700 text-sm leading-5">
                                                    {article.title}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-none">
                                                <span className="text-sm text-gray-700">
                                                    {article.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 border-none">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm text-green-600 font-medium">
                                                        {article.status}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-right border-none">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        className="p-2 hover:bg-brown-200 rounded transition-colors"
                                                        onClick={() => navigate(`/admin/article-management/edit/${article.id}`)}
                                                    >
                                                        <Edit className="h-4 w-4 text-brown-600" />
                                                    </button>
                                                    <DeletePostDialog onDelete={() => console.log("Delete post", article.id)} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
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
                    <div className="text-sm text-gray-500">
                        Showing {filteredArticles.length} of {articlesWithStatus.length} articles
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function DeletePostDialog({ onDelete }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button>
                    <Trash2 className="h-4 w-4 hover:text-muted-foreground text-brown-600" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
                <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
                    Delete Post
                </AlertDialogTitle>
                <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
                    Do you want to delete this post?
                </AlertDialogDescription>
                <div className="flex flex-row gap-4">
                    <AlertDialogCancel className="bg-white rounded-full text-brown-600 border border-brown-400 hover:bg-brown-100 transition-colors w-28 h-12 flex items-center justify-center">
                        Cancel
                    </AlertDialogCancel>
                    <button
                        onClick={onDelete}
                        className="rounded-full text-white bg-brown-600 hover:bg-brown-500 transition-colors w-28 h-12 flex items-center justify-center"
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