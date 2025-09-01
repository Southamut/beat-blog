import { Linkedin, Github, Mail } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">hh.</div>

      {/* Mobile navigation buttons */}
      <div className="flex flex-col sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-6 h-6 cursor-pointer">
            <img src="./src/assets/navbar.svg" alt="navigation menu" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-screen py-6 space-y-2 bg-white border-none rounded-none">
            <DropdownMenuItem className="px-4">
              <button className="w-full px-6 py-3 border border-gray-800 text-gray-800 bg-white rounded-full hover:bg-gray-50 transition-colors">
                Log in
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4">
              <button className="w-full px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                Sign up
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop navigation buttons */}
      <div className="gap-3 relative hidden sm:flex">
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
    <section className="w-full md:max-w-10/12 mx-auto px-8 py-12 bg-white">
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
    <footer className="w-full bg-[#EFEEEB] py-6 px-4 sm:px-8 flex items-center justify-between">
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