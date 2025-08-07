import { Search, ChevronDown } from 'lucide-react'
import { blogPosts } from "../data/blogPosts"

export function ArticleSection() {
    return (
        <section className="max-w-10/12 mx-auto w-full bg-white">
            {/* Header */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 text-left">Latest articles</h2>
            </div>
            {/* Main content area with tabs/search bar */}
            <div className="py-6 sm:py-8 px-4 sm:px-8">
                <div>
                    {/* Mobile layout - stacked */}
                    <div className="space-y-4 sm:space-y-6 lg:hidden">
                        {/* Search bar */}
                        <div className="relative">
                            <div className="relative bg-[#f5f4f0] rounded-xl">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#f5f4f0] border-none rounded-xl pl-3 sm:pl-4 pr-10 sm:pr-12 text-sm sm:text-base text-gray-600 placeholder-gray-400 focus:outline-none"
                                />
                                <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                        </div>
                        {/* Category filter */}
                        <div className="space-y-2">
                            <label className="text-gray-600 text-xs sm:text-sm font-medium">Category</label>
                            <div className="relative bg-[#f5f4f0] rounded-xl">
                                <div className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl cursor-pointer">
                                    <span className="text-sm sm:text-base text-gray-600">Highlight</span>
                                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Desktop layout - horizontal */}
                    <div className="hidden lg:flex items-center justify-between bg-[#f5f4f0] rounded-xl p-4">
                        {/* Category tabs */}
                        <div className="flex items-center gap-6">
                            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Highlight</button>
                            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cat</button>
                            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Inspiration</button>
                            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">General</button>
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
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BlogCard key={i} image={blogPosts[i].image} category={blogPosts[i].category} title={blogPosts[i].title} description={blogPosts[i].description} author={blogPosts[i].author} date={blogPosts[i].date} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
function BlogCard(props) {
    return (
        <div className="flex flex-col gap-4">
            <a href="#" className="relative h-[212px] sm:h-[360px]">
                <img className="w-full h-full object-cover rounded-md" src={props.image} alt="Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do" />
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

