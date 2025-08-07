import { Linkedin, Github, Mail, Search, ChevronDown } from 'lucide-react'


export function NavBar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">hh.</div>

      {/* Navigation buttons */}
      <div className="flex gap-3 relative">
        <button className="px-6 py-2 border border-gray-800 text-black bg-white rounded-full hover:bg-gray-50 transition-colors">
          Log in
        </button>
        <button className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors relative">
          Sign up
        </button>
      </div>
    </nav>
  )
}

export function HeroSection() {
  return (
    <section className="w-full px-8 py-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Content - Main heading and subtitle */}
        <div className="lg:col-span-1">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
            Stay<br />
            Informed,<br />
            Stay Inspired
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
          </p>
        </div>
        {/* Center - Main image */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="w-full max-w-md">
            <img
              src="./src/assets/man_and_cat.jpg"
              alt="Man with cat in autumn forest"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
        {/* Right Content - Author bio */}
        <div className="lg:col-span-1">
          <div className="text-sm text-gray-500 mb-2">-Author</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thompson P.</h2>
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
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="w-full bg-[#EFEEEB] py-6 px-8 flex items-center justify-between">
      {/* Left: Get in touch and icons */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-800">Get in touch</span>
        <a href="#" className="hover:opacity-80" aria-label="LinkedIn">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
            <Linkedin className="w-3 h-3 text-white" />
          </div>
        </a>
        <a href="#" className="hover:opacity-80" aria-label="GitHub">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
            <Github className="w-3 h-3 text-white" />
          </div>
        </a>
        <a href="#" className="hover:opacity-80" aria-label="Email">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
            <Mail className="w-3 h-3 text-white" />
          </div>
        </a>
      </div>
      {/* Right: Home page link */}
      <a href="#" className="font-medium text-gray-800 underline underline-offset-2 hover:text-black">Home page</a>
    </footer>
  )
}

export function ArticleSection() {
  return (
    <section className="w-full bg-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 text-left px-4 sm:px-8">Latest articles</h2>
      </div>
      {/* Main content area with tabs/search bar */}
      <div className="py-6 sm:py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </div>
    </section>
  )
}