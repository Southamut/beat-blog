import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Smile,
  Copy,
  FacebookIcon,
  Linkedin,
  Twitter,
  ImageOff,
} from "lucide-react";
import { AttentionAlert } from "@/components/AttentionAlert.jsx";
import API_URL from "@/config/api";
import { useAuth } from "@/contexts/authentication";

// Loading Spinner Component
function LoadingSpinner({ message = "Loading...", size = "large" }) {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin`}
      ></div>
      <div className="text-gray-600">{message}</div>
    </div>
  );
}

export function ViewPostComponent() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add dialog state
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [alert, setAlert] = useState({ visible: false, type: "success", title: "", message: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts/${postId}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError("Post not found");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const res = await axios.get(`${API_URL}/posts/${postId}/comments`, { headers: { "X-Disable-Global-Loading": "1" } });
        setComments(res.data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCommentDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} at ${hours}:${minutes}`;
  };

  if (loading) {
    return <></>;
  }

  if (error || !post) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The post you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Handle like button click
  const handleLikeClick = async () => {
    const token = window.localStorage.getItem("access_token");
    if (!isAuthenticated || !token) {
      setAlert({ visible: true, type: "error", title: "Sign in required", message: "Please sign in to like this post" });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}`, "X-Disable-Global-Loading": "1" } }
      );
      const newCount = res.data?.likes_count;
      setPost((prev) => (prev ? { ...prev, likes_count: newCount, likes: newCount } : prev));
    } catch (err) {
      setAlert({ visible: true, type: "error", title: "Action failed", message: "Failed to update like" });
    }
  };

  const handleSubmitComment = async () => {
    const token = window.localStorage.getItem("access_token");
    if (!isAuthenticated || !token) {
      setAlert({ visible: true, type: "error", title: "Sign in required", message: "Please sign in to comment" });
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/posts/${postId}/comments`,
        { comment_text: commentText.trim() },
        { headers: { Authorization: `Bearer ${token}`, "X-Disable-Global-Loading": "1" } }
      );
      const created = res.data;
      setComments((prev) => [created, ...prev]);
      setCommentText("");
      setAlert({ visible: true, type: "success", title: "Posted", message: "Comment posted" });
    } catch (err) {
      setAlert({ visible: true, type: "error", title: "Post failed", message: "Failed to post comment" });
    }
  };

  // Handle copy link click
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setAlert({ visible: true, type: "success", title: "Copied", message: "This article has been copied to your clipboard." });
    } catch (err) {
      setAlert({ visible: true, type: "error", title: "Copy failed", message: "Failed to copy link" });
    }
  };

  const hasImage = post.image && post.image.trim() !== "";

  // Main return
  return (
    <>
      {/* only image */}
      <div className="md:px-16 md:pt-12 bg-brown-100">
        <div className="w-full mb-6 md:mb-8">
          {/* Featured Image - Full Width */}
          <div className="w-full">
            {hasImage ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full aspect-[18/9] md:aspect-[21/9] object-cover md:rounded-2xl"
              />
            ) : (
              <div className="w-full aspect-[18/9] md:aspect-[21/9] bg-gray-100 md:rounded-2xl flex items-center justify-center">
                <ImageOff className="w-24 h-24 text-gray-400" />
              </div>
            )}
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
              <span className="text-sm text-brown-400 ml-4">
                {formatDate(post.date)}
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-brown-600 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Post Content with Markdown */}
            <div className="markdown text-brown-500 leading-relaxed">
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
                  text={post.likes ?? post.likes_count ?? 0}
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
              comments={(comments || []).map((c) => ({
                name: c.user?.name || "User",
                date: formatCommentDate(c.created_at),
                comment: c.comment_text,
                image:
                  c.user?.profile_pic ||
                  "https://ui-avatars.com/api/?name=User&background=EEE&color=888",
              }))}
              value={commentText}
              onChange={setCommentText}
              onSubmit={handleSubmitComment}
              loading={commentsLoading}
            />
          </div>

          {/* Right content only on desktop */}
          <div className="w-full md:w-4/12 hidden md:block md:sticky md:top-6 md:self-start">
            <AuthorBio post={post} />
          </div>
        </div>
      </div>

      <AttentionAlert
        type={alert.type}
        title={alert.title || (alert.type === "success" ? "Success" : "Error")}
        message={alert.message}
        isVisible={alert.visible}
        onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}

//author bio
function AuthorBio({ post }) {
  return (
    <div className="bg-brown-200 rounded-2xl p-6">
      {/* Author Profile */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-brown-300">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={post.authorImage || "https://ui-avatars.com/api/?name=Admin&background=EEE&color=888"}
          alt={post.author}
        />
        <div>
          {/* Author Header */}
          <div className="text-sm text-brown-400">Author</div>
          <h3 className="text-xl font-bold text-brown-500">{post.author}</h3>
        </div>
      </div>

      {/* Author Bio */}
      <div className="space-y-4 text-brown-400 leading-relaxed">
        <p>{post.authorBio || ""}</p>
      </div>
    </div>
  );
}

// Reusable Button Component(Like, Copy Link, Social Media Buttons)
function PostActionButton({ icon, text, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 border border-brown-300 rounded-full text-brown-500 bg-white hover:bg-brown-100 transition-colors ${className}`}
    >
      {typeof icon === "string" ? (
        <span className="text-lg">{icon}</span>
      ) : (
        icon
      )}
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}

// Social Media Button Component
function SocialButton({ platform, href, className = "" }) {
  const socialIcons = {
    facebook: <FacebookIcon className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
  };

  const socialColors = {
    facebook: "bg-[#1877F2] hover:bg-[#1565C0]",
    linkedin: "bg-[#0077B5] hover:bg-[#005684]",
    twitter: "bg-[#55ACEE] hover:bg-[#3390C5]",
  };

  return (
    <a
      href={href}
      className={`w-10 h-10 ${socialColors[platform]} text-white rounded-full flex items-center justify-center transition-colors ${className}`}
    >
      {socialIcons[platform]}
    </a>
  );
}

// Comment Component
function Comment({ setDialogState, comments, value, onChange, onSubmit, loading }) {
  return (
    <div className="my-12">
      <div className="space-y-4 mb-16">
        <h3 className="text-lg font-semibold text-brown-400">Comment</h3>
        <div className="space-y-2">
          <textarea
            onFocus={() => setDialogState(true)}
            placeholder="What are your thoughts?"
            className="w-full p-4 h-24 resize-none border border-brown-300 rounded-lg text-brown-400 font-medium"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex justify-start md:justify-end">
            <button onClick={onSubmit} disabled={loading} className="px-8 py-2 bg-brown-600 text-white rounded-full hover:bg-brown-500 transition-colors disabled:opacity-60">
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
                  <h4 className="font-medium text-brown-500">{comment.name}</h4>
                  <span className="text-sm font-medium text-brown-400">{comment.date}</span>
                </div>
              </div>
            </div>
            <p className="text-brown-400 font-medium">{comment.comment}</p>
            {index < comments.length - 1 && (
              <hr className="border-brown-300 my-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// removed mock comments
