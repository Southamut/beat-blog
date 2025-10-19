import { NavBar } from "../../components/Homepage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function SignupPage() {
  const navigate = useNavigate();

  //for collect&send data
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  //for collect loading, error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  //pending confirm email
  // State สำหรับควบคุม AlertDialog (เปิด/ปิด)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //for update state when input fields change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      // ใช้ e.target.name ในการอัปเดต field ที่ถูกต้อง
      [e.target.name]: e.target.value,
    });
    setError(null); // เคลียร์ error เมื่อผู้ใช้เริ่มพิมพ์ใหม่
    setSuccessMessage(null);
  };

  // Handler for sending form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // ตรวจสอบความถูกต้องเบื้องต้น
    if (
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.name
    ) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      //send form to regist
      const response = await axios.post(
        "http://localhost:4001/auth/register",
        formData
      );

      //success
      const data = response.data;
      setSuccessMessage(data.message || "Registration successful!");

      //success then open confirm email dialog
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response) {
        setError(
          err.response.data.error || "Registration failed. Please try again."
        );
      } else {
        setError("A network error occurred. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler เมื่อกดปุ่ม "I already confirmed." ใน Dialog
  const handleDialogConfirm = async () => {
    setIsLoading(true); // ตั้งค่า Loading ขณะพยายามล็อกอิน
    setError(null);

    // ตรวจสอบว่ามีข้อมูลสำหรับล็อกอินหรือไม่
    if (!formData.email || !formData.password) {
      setError("ไม่สามารถดำเนินการต่อได้: ข้อมูลอีเมลหรือรหัสผ่านหายไป.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. 🚨 พยายามล็อกอินโดยตรงด้วย Email/Password (ใช้เป็นตัวตรวจสอบสถานะการยืนยัน)
      const loginResponse = await axios.post(
        "http://localhost:4001/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // 2. ถ้า LOGIN สำเร็จ (สถานะ 200 OK และมี Access Token กลับมา)
      if (loginResponse.data.access_token) {
        // 3. LOGIN SUCCESS: บันทึก Token และนำทาง
        localStorage.setItem("access_token", loginResponse.data.access_token);
        setIsDialogOpen(false);
        // นำทางไปหน้าสำเร็จ
        navigate("/registration-success");
      } else {
        // กรณีที่ Login API ส่งสถานะ 200 กลับมาแต่ไม่มี token (ไม่น่าจะเกิดขึ้น)
        setError("Plese check your email confirmation.");
      }
    } catch (err) {
      console.error("Login attempt error:", err);

      // 4. ตรวจสอบ Error: หากล็อกอินล้มเหลว (สถานะ 4xx หรือ 5xx)
      // สันนิษฐานว่าเกิดจากการที่อีเมลยังไม่ได้รับการยืนยัน หรือรหัสผ่านผิด

      const backendError = err.response?.data?.error;

      // เราใช้ข้อความ Error จาก Backend /auth/login เป็นหลัก
      if (
        (backendError && backendError.includes("incorrect")) ||
        backendError.includes("doesn't exist")
      ) {
        // ถ้า Backend บอกว่ารหัสผ่านผิด/ผู้ใช้ไม่มี
        setError("User or password incorrect please try agian.");
      } else {
        // กรณีอื่น ๆ (รวมถึงการยังไม่ยืนยันอีเมล ซึ่ง Supabase มักจะถือเป็น invalid credentials)
        setError("❌ Check your email and try login again.");
      }
    } finally {
      setIsLoading(false); // หยุด Loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex justify-center items-center p-4 my-6 flex-grow">
        <div className="w-full max-w-2xl bg-[#EFEEEB] rounded-sm shadow-md px-3 sm:px-20 py-14">
          <h2 className="text-4xl font-semibold text-center mb-6 text-foreground">
            Sign up
          </h2>
          {/* put handleSubmit in form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Full name"
                value={formData.name} // 👈 ผูกค่า
                onChange={handleChange} // 👈 ผูก handler
                className="w-full bg-white rounded-md border border-[#DAD6D1] px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
            <div className="relative space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-muted-foreground"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username} // 👈 ผูกค่า
                onChange={handleChange} // 👈 ผูก handler
                required
                className="w-full bg-white rounded-md border border-[#DAD6D1] px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
            <div className="relative space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email} // 👈 ผูกค่า
                onChange={handleChange} // 👈 ผูก handler
                required
                className="w-full bg-white rounded-md border border-[#DAD6D1] px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
            <div className="relative space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password} // 👈 ผูกค่า
                onChange={handleChange} // 👈 ผูก handler
                required
                className="w-full bg-white rounded-md border border-[#DAD6D1] px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>

            {/* 5. แสดงข้อความสถานะ */}
            {error && (
              <p className="text-red-600 text-center text-sm font-medium">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-600 text-center text-sm font-medium">
                {successMessage}
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading} // ปิดปุ่มระหว่างโหลด
                className="px-8 py-2 bg-foreground text-white rounded-full bg-[#26231E] hover:bg-muted-foreground transition-colors flex items-center gap-1"
              >
                {isLoading ? "Processing..." : "Sign up"}
              </button>
            </div>
          </form>
          <p className="flex flex-row justify-center gap-1 mt-4 text-sm text-center pt-2 text-muted-foreground font-medium">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-foreground hover:text-muted-foreground transition-colors underline font-semibold cursor-pointer"
            >
              Log in
            </a>
          </p>
        </div>
      </main>

      {/* 💡 องค์ประกอบ AlertDialog สำหรับ Pending Confirmation */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-white border-none">
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Please confirm your email.
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <div className="text-center space-y-3">
              <p className="font-semibold text-brown-500 text-foreground">
                Please check your inbox to confirm your email address.
              </p>
              <p className="text-sm text-brown-400">
                A verification link has been sent to **{formData.email}**. You
                must click the link before you can log in.
              </p>
            </div>
          </AlertDialogDescription>
          {/* redirect button */}
          <div className="flex flex-col space-y-2 pt-4">
            <button
              onClick={handleDialogConfirm}
              disabled={isLoading} // 👈 ปิดปุ่มระหว่างตรวจสอบสถานะ
              className="w-full px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-muted-foreground transition-colors disabled:opacity-50"
            >
              {isLoading ? "Checking Status..." : "I already confirmed."}
            </button>
            <AlertDialogCancel disabled={isLoading}>
              Stay on this page
            </AlertDialogCancel>
            {/* แสดง Error ใน Dialog ถ้ามี */}
            {error && (
              <p className="text-red-600 text-center text-sm font-medium mt-2">
                {error}
              </p>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
