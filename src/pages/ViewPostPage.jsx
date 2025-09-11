import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { NavBar, Footer } from "../components/Homepage"
import { ArrowLeft, Smile, Copy, FacebookIcon, Linkedin, Twitter } from 'lucide-react'
import { Toaster, toast } from 'sonner'


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
    const [isDialogOpen, setIsDialogOpen] = useState(false) // Add dialog state


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

    // Handle like button click
    const handleLikeClick = () => {
        toast.error("Please sign in to like this post", {
            style: {
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626'
            }
        })
    }

    // Handle copy link click
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success("Copied!", {
                description: "This article has been copied to your clipboard.",
                style: {
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    color: '#166534'
                }
            })
        } catch (err) {
            toast.error("Failed to copy link")
        }
    }

    // Main return
    return (
        <>
            <NavBar />

            {/* only image */}
            <div className="md:px-16 md:pt-12 bg-white">
                <div className="w-full mb-6 md:mb-8">
                    {/* Featured Image - Full Width */}
                    <div className="w-full">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full aspect-[18/9] md:aspect-[21/9] object-cover md:rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* main content */}
            <div className="px-4 md:px-16 bg-white">

                {/* Main Container with consistent padding like homepage */}
                <div className="w-full flex flex-col md:flex-row gap-8">

                    {/* Left content */}
                    <div className="w-full md:w-8/12">
                        {/* Category Tag */}
                        <div className="mb-4">
                            <span className="bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                                {post.category}
                            </span>
                            <span className="text-sm text-gray-500 ml-4">{formatDate(post.date)}</span>
                        </div>

                        {/* Post Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Post Content with Markdown */}
                        <div className="markdown text-gray-700 leading-relaxed">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>

                        {/* auther bio only on mobile */}
                        <div className="w-full block md:hidden mt-8">
                            <AuthorBio post={post} />
                        </div>

                        {/* Post Stats */}
                        <div className="bg-[#EFEEEB] rounded-2xl py-3 px-4 gap-4 my-8">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Like Button - Full width on mobile, auto on desktop */}
                                <PostActionButton
                                    className="w-full md:w-auto"
                                    icon={<Smile className="w-4 h-4" />}
                                    text={post.likes}
                                    onClick={handleLikeClick}
                                />

                                {/* Copy Link and Social Media Buttons - Second row on mobile */}
                                <div className="flex gap-2 w-full md:w-auto md:ml-auto">
                                    <PostActionButton
                                        icon={<Copy className="w-4 h-4" />}
                                        text="Copy link"
                                        onClick={handleCopyLink}
                                        className="flex-1 md:flex-none"
                                    />
                                    <SocialButton platform="facebook" href="#" />
                                    <SocialButton platform="linkedin" href="#" />
                                    <SocialButton platform="twitter" href="#" />
                                </div>
                            </div>
                        </div>


                        {/* comment section */}
                        <Comment
                            setDialogState={setIsDialogOpen}
                            comments={comments}
                        />

                    </div>

                    {/* Right content only on desktop */}
                    <div className="w-full md:w-4/12 hidden md:block">

                        <AuthorBio post={post} />

                    </div>

                </div>
            </div>
            <Footer />
            <Toaster position="top-right" />
        </>
    )
}

//author bio
function AuthorBio(post) {
    return (
        <div className="bg-[#EFEEEB] rounded-2xl p-6">

            {/* Author Profile */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#DAD6D1]">
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                    alt={post.author}
                />
                <div>
                    {/* Author Header */}
                    <div className="text-sm text-gray-500">Author</div>
                    <h3 className="text-xl font-bold text-gray-800">{post.author}</h3>
                </div>
            </div>

            {/* Author Bio */}
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                    I am a pet enthusiast and freelance writer who specializes in animal behavior and care.
                    With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
                </p>
                <p>
                    When I'm not writing, I spend time volunteering at my local animal shelter,
                    helping cats find loving homes.
                </p>
            </div>
        </div>


    )
}

// Reusable Button Component(Like, Copy Link, Social Media Buttons)
function PostActionButton({ icon, text, onClick, className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors ${className}`}
        >
            {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
            <span className="text-sm font-medium">{text}</span>
        </button>
    )
}

// Social Media Button Component
function SocialButton({ platform, href, className = "" }) {
    const socialIcons = {
        facebook: <FacebookIcon className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
        twitter: <Twitter className="w-5 h-5" />
    }

    const socialColors = {
        facebook: "bg-blue-600 hover:bg-blue-700",
        linkedin: "bg-blue-500 hover:bg-blue-600",
        twitter: "bg-blue-400 hover:bg-blue-500"
    }

    return (
        <a
            href={href}
            className={`w-10 h-10 ${socialColors[platform]} text-white rounded-full flex items-center justify-center transition-colors ${className}`}
        >
            {socialIcons[platform]}
        </a>
    )
}

// Comment Component
function Comment({ setDialogState, comments }) {
    return (
        <div className="my-12">
            <div className="space-y-4 mb-16">
                <h3 className="text-lg font-semibold">Comment</h3>
                <div className="space-y-2">
                    <textarea
                        onFocus={() => setDialogState(true)}
                        placeholder="What are your thoughts?"
                        className="w-full p-4 h-24 resize-none border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                    />
                    <div className="flex justify-start md:justify-end">
                        <button className="px-8 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                            Send
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {comments.map((comment, index) => (
                    <div key={index} className="flex flex-col gap-2 mb-4">
                        <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={comment.image}
                                    alt={comment.name}
                                    className="rounded-full w-12 h-12 object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex flex-col items-start justify-between">
                                    <h4 className="font-semibold">{comment.name}</h4>
                                    <span className="text-sm text-gray-500">{comment.date}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600">{comment.comment}</p>
                        {index < comments.length - 1 && (
                            <hr className="border-gray-300 my-4" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Static comments data (since API doesn't have comments)
const comments = [
    {
        name: "Jacob Lash",
        date: "12 September 2024 at 18:30",
        comment: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
        name: "Ahri",
        date: "12 September 2024 at 18:30",
        comment: "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!",
        image: "https://images.unsplash.com/photo-1494790108755-2616b4e5f93a?w=50&h=50&fit=crop&crop=face"
    },
    {
        name: "Mimi mama",
        date: "12 September 2024 at 18:30",
        comment: "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    }
]