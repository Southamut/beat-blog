import { Search, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

export function ArticleSection() {
    // blog posts state
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // categories
    const categories = ["Highlight", "Cat", "Inspiration", "General"]
    //select category
    const [selectedCategory, setSelectedCategory] = useState("Highlight")

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const response = await axios.get('https://blog-post-project-api.vercel.app/posts')
                setPosts(response.data.posts)
                setError(null)
            } catch (err) {
                setError('Failed to fetch posts')
                console.error('Error fetching posts:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    // Filter posts by category
    const filteredPosts = posts.filter(post => {
        if (selectedCategory === "Highlight") return true
        return post.category === selectedCategory
    })

    if (loading) {
        return (
            <section className="md:max-w-10/12 mx-auto w-full bg-white">
                <div className='px-8'>
                    <h2 className="text-lg font-bold text-gray-900 text-left">Latest articles</h2>
                </div>
                <div className="py-4 sm:py-8 px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600">Loading posts...</div>
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

    return (
        <section className="md:max-w-10/12 mx-auto w-full bg-white">
            {/* Header */}
            <div className='px-8'>
                <h2 className="text-lg font-bold text-gray-900 text-left">Latest articles</h2>
            </div>
            {/* Main content area with tabs/search bar */}
            <div className="py-4 sm:py-8 px-0 md:px-8">
                <div>
                    {/* Mobile layout - stacked */}
                    <div className="md:hidden px-8 py-4 bg-[#f5f4f0]">
                        {/* Search bar */}
                        <div className="relative">
                            <div className="relative bg-white rounded-xl">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-none rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 text-sm sm:text-base text-gray-600 placeholder-gray-400 focus:outline-none"
                                />
                                <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
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
                    <div className="hidden md:flex items-center justify-between bg-[#f5f4f0] rounded-xl p-4">
                        {/* Category tabs */}
                        <div className="hidden md:flex space-x-2">
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
                        <div className="relative w-80">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full px-4 py-2 bg-white border-none rounded-xl pl-4 pr-10 text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>


                    {/* Blog cards grid */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
                        {filteredPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                image={post.image}
                                category={post.category}
                                title={post.title}
                                description={post.description}
                                author={post.author}
                                date={formatDate(post.date)} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// components
function BlogCard(props) {
    return (
        <div className="flex flex-col gap-4">
            <a href="#" className="relative h-[212px] sm:h-[360px]">
                <img className="w-full h-full object-cover rounded-md" src={props.image} alt={props.title} />
            </a>
            <div className="flex flex-col">
                <div className="flex">
                    <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{props.category}
                    </span>
                </div>
                <a href="#" >
                    <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
                        {props.title}
                    </h2>
                </a>
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
            className={`px-4 py-3 transition-colors rounded-lg text-sm text-muted-foreground font-medium ${props.className}`}
        >
            {props.text}
        </button>
    )
}