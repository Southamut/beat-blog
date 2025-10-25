import React from "react";
import { Linkedin, Github, Mail, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authentication";
import { ProfileDropdown } from "../components/ProfileDropdown";
import axios from "axios";
import API_URL from "@/config/api";

export function NavBar() {
  const navigate = useNavigate();

  const location = useLocation();

  // 🚨 1. ใช้ useAuth แทน useState/useEffect/fetchUserData ทั้งหมด
  const { isAuthenticated, logout, state } = useAuth();
  const user = state.user || { name: "", role: "user", profile_pic: "" };

  // 🚨 2. ลบ fetchUserData, useEffect (สำหรับดึงข้อมูล) ออกทั้งหมด
  // 🚨 3. ลบ handleLogout เดิมออก แล้วใช้ logout จาก useAuth แทน

  // 🚨 4. Handler Function เพื่อบันทึกพาธ (อันนี้ยังต้องคงอยู่)
  const handleAuthNavigation = (path) => {
    const currentPath = location.pathname;
    const isCurrentlyAuthPage =
      currentPath === "/signup" || currentPath === "/login";

    if (!isCurrentlyAuthPage) {
      localStorage.setItem("referrer_path", currentPath);
    }

    navigate(path);
  };

  return (
    <nav className="border-b border-brown-300 w-full flex justify-between items-center px-4 md:px-16 py-4 bg-brown-100 shadow-sm">
      {/* Logo */}
      <button onClick={() => navigate("/")} className="font-bold">
        <span className="text-brown-600 text-2xl">BEAT</span> 
        <span className="text-md text-brown-400"> Personal Blog</span>
      </button>

      {/* Mobile navigation buttons */}
      <div className="flex flex-col sm:hidden">
        {isAuthenticated ? ( // 🚨 ใช้ isAuthenticated
          <ProfileDropdown user={user} handleLogout={logout} /> // 🚨 ใช้ logout จาก useAuth
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-6 h-6 cursor-pointer">
              <Menu className="w-6 h-6 text-brown-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-screen py-6 space-y-2 bg-brown-100 border-none rounded-none">
              <DropdownMenuItem className="px-4">
                <button
                  className="w-full px-6 py-3 border border-brown-600 text-brown-600 bg-white rounded-full hover:bg-brown-100 transition-colors"
                  onClick={() => handleAuthNavigation("/login")} // 🚨 แก้ไข
                >
                  Log in
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4">
                <button
                  className="w-full px-6 py-3 bg-brown-600 text-white rounded-full hover:bg-brown-500 transition-colors"
                  onClick={() => handleAuthNavigation("/sign-up")} // 🚨 แก้ไข
                >
                  Sign up
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Desktop navigation buttons */}
      <div className="gap-3 relative hidden sm:flex">
        {isAuthenticated ? ( // 🚨 ใช้ isAuthenticated
          <ProfileDropdown user={user} handleLogout={logout} /> // 🚨 ใช้ logout จาก useAuth
        ) : (
          <>
            <button
              className="px-6 py-2 border border-brown-600 font-medium text-brown-600 bg-white rounded-full hover:bg-brown-100 transition-colors"
              onClick={() => handleAuthNavigation("/login")} // 🚨 แก้ไข
            >
              Log in
            </button>
            <button
              className="px-6 py-2 bg-brown-600 font-medium text-white rounded-full hover:bg-brown-500 transition-colors relative"
              onClick={() => handleAuthNavigation("/sign-up")} // 🚨 แก้ไข
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export function HeroSection() {
  const [admin, setAdmin] = React.useState({ name: "", bio: "", profile_pic: "" });

  // Fetch the hero admin (division='main')
  React.useEffect(() => {
    async function fetchHeroAdmin() {
      try {
        const res = await axios.get(`${API_URL}/users/hero-admin`);
        if (res?.data) {
          setAdmin({
            name: res.data.name || "Admin",
            profile_pic: res.data.profile_pic || "",
            bio: res.data.bio || "",
          });
          return;
        }
      } catch (e) {
        // ignore; keep defaults
      }
    }
    fetchHeroAdmin();
  }, []);

  return (
    <section className="w-full mx-auto px-4 md:px-16 py-12 bg-brown-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-4 gap-8 items-center">
        {/* Left Content - Main heading and subtitle */}
        <div className="lg:col-span-1 md:col-span-1 md:text-right text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-brown-600 leading-tight mb-4">
            Stay Informed,
            <br />
            Stay Inspired
          </h1>
          <p className="lg:text-lg text-md font-medium text-brown-400 leading-relaxed">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </p>
        </div>
        {/* Center - Main image */}
        <div className="lg:col-span-1 md:col-span-2 flex justify-center">
          <div className="w-full max-w-md">
            <img
              src={admin.profile_pic || "./src/assets/man_and_cat.jpg"}
              alt="Man with cat in autumn forest"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
        {/* Right Content - Author bio */}
        <div className="lg:col-span-1 md:col-span-1">
          <div className="text-sm font-medium text-brown-400 mb-2">-Author</div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-brown-500">{admin.name || "Admin"}</h2>
          </div>
          <div className="space-y-4 font-medium text-brown-400 leading-relaxed">
            {admin.bio ? <p>{admin.bio}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-brown-200 h-36 py-6 px-4 md:px-16 flex items-center justify-between">
      {/* Left: Get in touch and icons */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-brown-600">Get in touch</span>
        <a href="https://www.linkedin.com/in/punyakit-n" target="_blank" rel="noopener noreferrer" className="hover:opacity-80" aria-label="LinkedIn">
          <div className="w-6 h-6 bg-brown-600 rounded-full flex items-center justify-center">
            <Linkedin className="w-3 h-3 text-white" />
          </div>
        </a>
        <a href="https://github.com/Southamut" target="_blank" rel="noopener noreferrer" className="hover:opacity-80" aria-label="GitHub">
          <div className="w-6 h-6 bg-brown-600 rounded-full flex items-center justify-center">
            <Github className="w-3 h-3 text-white" />
          </div>
        </a>
        <a href="mailto:punyakit.noi@gmail.com" className="hover:opacity-80" aria-label="Email">
          <div className="w-6 h-6 bg-brown-600 rounded-full flex items-center justify-center">
            <Mail className="w-3 h-3 text-white" />
          </div>
        </a>
      </div>
      {/* Right: Home page link */}
      <a
        href="#"
        className="font-medium text-brown-600 underline underline-offset-2 hover:text-black"
      >
        Home page
      </a>
    </footer>
  );
}
