import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { NavBar, Footer } from "../components/Homepage"
import { ArrowLeft } from 'lucide-react'

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

export function ViewPostPage() {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`https://blog-post-project-api.vercel.app/posts/${postId}`)
                setPost(response.data)
                setError(null)
            } catch (err) {
                setError('Post not found')
                console.error('Error fetching post:', err)
            } finally {
                setLoading(false)
            }
        }

        if (postId) {
            fetchPost()
        }
    }, [postId])

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
            <>
                <NavBar />
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner message="Loading post..." />
                </div>
                <Footer />
            </>
        )
    }

    if (error || !post) {
        return (
            <>
                <NavBar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
                        <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-white">
                {/* Main Container with consistent padding like homepage */}
                <div className="w-full md:max-w-4xl mx-auto px-8 py-12">
                    {/* Post Header */}
                    <article>
                        {/* Category Tag */}
                        <div className="mb-4">
                            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                                {post.category}
                            </span>
                        </div>

                        {/* Post Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 mb-8">
                            <img
                                className="w-12 h-12 rounded-full object-cover"
                                src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                                alt={post.author}
                            />
                            <div className="flex flex-col">
                                <div className="font-semibold text-gray-800">{post.author}</div>
                                <div className="text-sm text-gray-500">{formatDate(post.date)}</div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="mb-8">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-80 lg:h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Post Content with Markdown */}
                        <div className="markdown text-gray-700 leading-relaxed">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>

                        {/* Post Stats */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600">❤️ {post.likes}</span>
                                <button className="text-blue-600 hover:text-blue-800 font-medium">
                                    Copy link
                                </button>
                                <div className="flex gap-2 ml-auto">
                                    <a href="#" className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                        f
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        in
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                        t
                                    </a>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <Footer />
        </>
    )
}
