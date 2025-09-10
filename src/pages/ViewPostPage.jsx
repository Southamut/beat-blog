import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
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
                {/* Back Button */}
                <div className="max-w-4xl mx-auto px-8 py-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Articles
                    </Link>
                </div>

                {/* Post Content */}
                <article className="max-w-4xl mx-auto px-8 pb-12">
                    {/* Post Header */}
                    <header className="mb-8">
                        <div className="mb-4">
                            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                                {post.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                            {post.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <img
                                className="w-10 h-10 rounded-full"
                                src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                                alt={post.author}
                            />
                            <div>
                                <div className="font-medium text-gray-800">{post.author}</div>
                                <div>{formatDate(post.date)}</div>
                            </div>
                            <div className="ml-auto">
                                <span className="text-gray-500">❤️ {post.likes} likes</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="mb-8">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {post.content.split('\n').map((paragraph, index) => {
                                if (paragraph.startsWith('## ')) {
                                    return (
                                        <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                                            {paragraph.replace('## ', '')}
                                        </h2>
                                    )
                                } else if (paragraph.trim() === '') {
                                    return <br key={index} />
                                } else {
                                    return (
                                        <p key={index} className="mb-4">
                                            {paragraph}
                                        </p>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </article>
            </div>
            <Footer />
        </>
    )
}
