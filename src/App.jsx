import './App.css'

// NavBar component - Header with logo and navigation
function NavBar() {
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

// HeroSection component - Main content area with heading, image, and author bio
function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
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

// Main App component - Combines NavBar and HeroSection
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <HeroSection />
    </div>
  )
}

export default App