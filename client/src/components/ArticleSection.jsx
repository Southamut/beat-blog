import { Search, ImageOff } from 'lucide-react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import API_URL from '@/config/api';

export function ArticleSection() {

    // blog posts state
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [loadingMore, setLoadingMore] = useState(false)

    // Search states
    const [searchKeyword, setSearchKeyword] = useState('')
    const [searchSuggestions, setSearchSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    // categories
    const [categories, setCategories] = useState(["Highlight"])
    //select category
    const [selectedCategory, setSelectedCategory] = useState("Highlight")

    //post per page
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`)
            const categoryNames = response.data.map(cat => cat.name)
            // Add "Highlight" as the first option to show all posts
            setCategories(["Highlight", ...categoryNames])
        } catch (err) {
            console.error('Error fetching categories:', err)
            // Fallback to default categories if API fails
            setCategories(["Highlight", "General"])
        }
    }

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories()
    }, [])

    // Search function
    const handleSearch = async (keyword) => {
        if (!keyword.trim()) {
            setSearchSuggestions([])
            setShowSuggestions(false)
            return
        }

        try {
            setSearchLoading(true)
            const response = await axios.get(`${API_URL}/posts`, {
                params: {
                    keyword: keyword,
                    limit: 6
                }
            })
            setSearchSuggestions(response.data.posts)
            setShowSuggestions(true)
        } catch (err) {
            console.error('Search error:', err)
            setSearchSuggestions([])
        } finally {
            setSearchLoading(false)
        }
    }

    // Handle search input change
    const handleSearchInputChange = (e) => {
        const value = e.target.value
        setSearchKeyword(value)

        if (value.trim()) {
            handleSearch(value)
        } else {
            setSearchSuggestions([])
            setShowSuggestions(false)
        }
    }

    // Handle search suggestion click
    const handleSuggestionClick = (post) => {
        setSearchKeyword(post.title)
        setShowSuggestions(false)
        // Navigate to post page
        window.location.href = `/post/${post.id}`
    }

    // Fetch posts from API
    const fetchPosts = async (pageNum = 1, resetPosts = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            // Use category parameter only when not Highlight
            const categoryParam = selectedCategory === "Highlight" ? "" : selectedCategory;

            const response = await axios.get(`${API_URL}/posts`, {
                params: {
                    page: pageNum,
                    limit: 6,
                    category: categoryParam
                }
            })

            if (resetPosts) {
                setPosts(response.data.posts)
            } else {
                setPosts((prevPosts) => [...prevPosts, ...response.data.posts])
            }

            // Check if we've reached the last page
            if (response.data.currentPage >= response.data.totalPages) {
                setHasMore(false)
            } else {
                setHasMore(true)
            }

            setError(null)
        } catch (err) {
            setError('Failed to fetch posts')
            console.error('Error fetching posts:', err)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    // Initial load and when page changes
    useEffect(() => {
        fetchPosts(page, page === 1)
    }, [page])

    // Reset when category changes
    useEffect(() => {
        setPage(1)
        setHasMore(true)
        fetchPosts(1, true)
    }, [selectedCategory])

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <section className="md:max-w-10/12 mx-auto w-full bg-white">
                <div className='px-8'>
                    <h2 className="text-lg font-bold text-gray-900 text-left">Latest articles</h2>
                </div>
                <div className="py-4 sm:py-8 px-8">
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner message="Loading posts..." />
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="md:max-w-10/12 mx-auto w-full bg-white">
                <div className='px-8'>
                    <h2 className="text-lg font-bold text-gray-900 text-left">Latest articles</h2>
                </div>
                <div className="py-4 sm:py-8 px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-600">Error: {error}</div>
                    </div>
                </div>
            </section>
        )
    }

    // Main return
    return (
        <section className="mx-auto w-full py-8 bg-brown-100">
            {/* separate category tab and search bar */}
            <div className="md:px-16">
                {/* Header */}
                <div className="pb-4 md:pb-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-left px-4 md:px-0">Latest articles</h2>
                </div>

                {/* Mobile layout - stacked */}
                <div className="md:hidden px-4 py-4 bg-[#f5f4f0]">
                    {/* Search bar */}
                    <div className="relative">
                        <div className="relative bg-white rounded-xl">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchKeyword}
                                onChange={handleSearchInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-none rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 text-sm sm:text-base text-gray-600 placeholder-gray-400 focus:outline-none"
                            />
                            <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                                {searchLoading ? (
                                    <div className="p-4 text-center">
                                        <LoadingSpinner message="Searching..." size="small" />
                                    </div>
                                ) : searchSuggestions.length > 0 ? (
                                    searchSuggestions.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() => handleSuggestionClick(post)}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {post.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No posts found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category filter */}
                    <div className="md:hidden w-full mt-4">
                        <label className="text-muted-foreground text-sm mb-2 block">Category</label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value)}
                        >
                            <SelectTrigger className="w-full py-3 bg-white border-none rounded-lg text-muted-foreground">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-none flex-row-reverse">
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Desktop layout - horizontal */}
                <div className="hidden h-20 md:flex items-center justify-between bg-[#f5f4f0] rounded-2xl px-4">
                    {/* Category tabs */}
                    <div className="hidden md:flex space-x-2 h-12">
                        {categories.map((category) => (
                            <ArticleButton
                                key={category}
                                text={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`hover:bg-[#DAD6D1] ${selectedCategory === category ? 'bg-[#DAD6D1]' : ''}`}
                            />
                        ))}
                    </div>
                    {/* Search bar */}
                    <div className="relative w-80 ">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchKeyword}
                            onChange={handleSearchInputChange}
                            className="w-full px-4 py-2 h-12 bg-white border-none rounded-xl pl-4 pr-10 text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                                {searchLoading ? (
                                    <div className="p-4 text-center">
                                        <LoadingSpinner message="Searching..." size="small" />
                                    </div>
                                ) : searchSuggestions.length > 0 ? (
                                    searchSuggestions.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() => handleSuggestionClick(post)}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {post.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No posts found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content area with tabs/search bar */}
            <div className="pt-6 px-4 md:px-16">
                <div>
                    {/* Blog cards grid */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                            <BlogCard
                                key={post.id}
                                id={post.id}
                                image={post.image}
                                category={post.category}
                                title={post.title}
                                description={post.description}
                                author={post.author}
                                date={formatDate(post.date)} />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className={`hover:text-muted-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto ${!loadingMore ? 'underline' : ''}`}
                            >
                                {loadingMore ? (
                                    <>
                                        <LoadingSpinner message="" size="small" />
                                        Loading more...
                                    </>
                                ) : (
                                    'View more'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

// components
function BlogCard(props) {
    const hasImage = props.image && props.image.trim() !== '';

    return (
        <div className="flex flex-col gap-4">
            <Link to={`/post/${props.id}`} className="relative">
                {hasImage ? (
                    <img 
                        className="w-full aspect-[16/10] object-cover rounded-2xl" 
                        src={props.image} 
                        alt={props.title}
                    />
                ) : (
                    <div className="w-full aspect-[16/10] bg-gray-100 rounded-2xl flex items-center justify-center">
                        <ImageOff className="w-16 h-16 text-gray-400" />
                    </div>
                )}
            </Link>
            <div className="flex flex-col">
                <div className="flex">
                    <span className="bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{props.category}
                    </span>
                </div>
                <Link to={`/post/${props.id}`}>
                    <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
                        {props.title}
                    </h2>
                </Link>
                <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                    {props.description}</p>
                <div className="flex items-center text-sm">
                    <img className="w-8 h-8 rounded-full mr-2" src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Tomson P." />
                    <span>{props.author}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{props.date}</span>
                </div>
            </div>
        </div>
    );
}

function ArticleButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={`px-4 py-3 transition-colors rounded-xl text-sm text-muted-foreground font-medium ${props.className}`}
        >
            {props.text}
        </button>
    )
}

// Loading Spinner Component
function LoadingSpinner({ message = "Loading...", size = "large" }) {
    const sizeClasses = {
        small: "h-8 w-8",
        medium: "h-12 w-12",
        large: "h-16 w-16"
    }

    return (
        <div className="flex flex-col justify-center items-center gap-3">
            <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin`}></div>
            <div className="text-gray-600">{message}</div>
        </div>
    )
}