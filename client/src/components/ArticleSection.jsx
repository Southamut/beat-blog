import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import API_URL from "@/config/api";
import {
  BlogCard,
  ArticleButton,
  LoadingSpinner,
} from "@/components/ui/BlogCard";

export function ArticleSection() {
  // blog posts state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Search states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // categories
  const [categories, setCategories] = useState(["Highlight"]);
  //select category
  const [selectedCategory, setSelectedCategory] = useState("Highlight");

  //post per page
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const categoryNames = response.data.map((cat) => cat.name);
      // Add "Highlight" as the first option to show all posts
      setCategories(["Highlight", ...categoryNames]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback to default categories if API fails
      setCategories(["Highlight", "General"]);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add event listeners for closing suggestions
  useEffect(() => {
    if (showSuggestions) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuggestions]);

  // Search function
  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axios.get(`${API_URL}/posts`, {
        params: {
          keyword: keyword,
          limit: 6,
          published_only: true,
        },
        headers: { "X-Disable-Global-Loading": "1" },
      });
      setSearchSuggestions(response.data.posts);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    if (value.trim()) {
      handleSearch(value);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (post) => {
    setSearchKeyword(post.title);
    setShowSuggestions(false);
    // Navigate to post page
    window.location.href = `/post/${post.id}`;
  };

  // Handle clicking outside to close suggestions
  const handleClickOutside = (e) => {
    if (!e.target.closest(".search-container")) {
      setShowSuggestions(false);
    }
  };

  // Handle Escape key to close suggestions
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Fetch posts from API
  const fetchPosts = async (pageNum = 1, resetPosts = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Use category parameter only when not Highlight
      const categoryParam =
        selectedCategory === "Highlight" ? "" : selectedCategory;

      const response = await axios.get(`${API_URL}/posts`, {
        params: {
          page: pageNum,
          limit: 6,
          category: categoryParam,
          published_only: true, // Add flag to indicate we only want published posts
        },
        headers: { "X-Disable-Global-Loading": "1" },
      });

      if (resetPosts) {
        setPosts(response.data.posts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      }

      // Check if we've reached the last page
      if (response.data.currentPage >= response.data.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load and when page changes
  useEffect(() => {
    fetchPosts(page, page === 1);
  }, [page]);

  // Reset when category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  }, [selectedCategory]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Remove early returns so the category/search bar always stays visible

  // Main return
  return (
    <section className="mx-auto w-full py-8 bg-brown-100">
      {/* separate category tab and search bar */}
      <div className="md:px-16">
        {/* Header */}
        <div className="pb-4 md:pb-8">
          <h2 className="text-2xl font-bold text-beown-600 text-left px-4 md:px-0">
            Latest articles
          </h2>
        </div>

        {/* Mobile layout - stacked */}
        <div className="md:hidden px-4 py-4 bg-brown-200">
          {/* Search bar */}
          <div className="relative search-container">
            <div className="relative bg-white rounded-xl">
              <input
                type="text"
                placeholder="Search"
                value={searchKeyword}
                onChange={handleSearchInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-none rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 text-sm font-medium sm:text-base text-brown-600 placeholder-beown-400 focus:outline-none"
              />
              <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-brown-400" />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-brown-200 z-50 max-h-80 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center">
                    <LoadingSpinner message="Searching..." size="small" />
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  searchSuggestions.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleSuggestionClick(post)}
                      className="p-3 hover:bg-brown-100 cursor-pointer border-b border-brown-200 last:border-b-0"
                    >
                      <h3 className="font-medium text-brown-600 text-sm line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-brown-400 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-brown-400 font-medium text-sm">
                    No posts found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category filter */}
          <div className="md:hidden w-full mt-4">
            <label className="text-brown-400 text-sm font-medium mb-2 block">
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-full py-3 bg-white border-none rounded-lg font-medium text-brown-400">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white font-medium text-brown-400 border-none flex-row-reverse">
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
        <div className="hidden h-20 md:flex items-center justify-between bg-brown-200 rounded-2xl px-4 gap-4">
          {/* Category tabs */}
          <div className="hidden md:flex space-x-2 h-12">
            {categories.map((category) => (
              <ArticleButton
                key={category}
                text={category}
                onClick={() => setSelectedCategory(category)}
                className={`hover:bg-brown-300 ${
                  selectedCategory === category ? "bg-brown-300" : ""
                }`}
              />
            ))}
          </div>
          {/* Search bar */}
          <div className="relative w-80 search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchKeyword}
              onChange={handleSearchInputChange}
              className="w-full px-4 py-2 h-12 bg-white border-none rounded-xl pl-4 pr-10 text-sm font-medium text-brown-600 placeholder-brown-400 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brown-400" />

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-brown-200 z-50 max-h-80 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center">
                    <LoadingSpinner message="Searching..." size="small" />
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  searchSuggestions.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleSuggestionClick(post)}
                      className="p-3 hover:bg-brown-100 cursor-pointer border-b border-brown-200 last:border-b-0"
                    >
                      <h3 className="font-medium text-brown-600 text-sm line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-brown-400 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-brown-400 text-sm">
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
            {loading && page === 1 ? (
              <div className="col-span-1 md:col-span-2 flex justify-center items-center h-64">
                <LoadingSpinner message="Loading posts..." />
              </div>
            ) : error ? (
              <div className="col-span-1 md:col-span-2 flex justify-center items-center h-64">
                <div className="text-red-600">Error: {error}</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="col-span-1 md:col-span-2 flex justify-center items-center h-64">
                <div className="text-brown-400 font-medium">No posts found</div>
              </div>
            ) : (
              posts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  image={post.image}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  author={post.author || "Admin"}
                  authorImage={post.authorImage}
                  date={formatDate(post.date)}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`hover:text-brown-500 font-medium text-brown-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto ${
                  !loadingMore ? "underline" : ""
                }`}
              >
                {loadingMore ? (
                  <div>
                    <LoadingSpinner message="" size="small" />
                    <span className="font-medium text-brown-600">
                      Loading more...
                    </span>
                  </div>
                ) : (
                  "View more"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
