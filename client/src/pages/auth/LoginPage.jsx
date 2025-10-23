import { NavBar } from "../../components/Homepage";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/authentication";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🚨 ใช้ Hook useAuth
    const { login, state } = useAuth(); 
    const { loading, error } = state;

  //for collect user, pass
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //for update state when input fields change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //for form submission
  const handleSubmit = async (e) => {
        e.preventDefault();
        // 🚨 เรียกใช้ login จาก useAuth
        await login(formData); 
        // Logic Redirect ถูกจัดการใน AuthProvider แล้ว
    };

  return (
    <div className="flex flex-col min-h-screen bg-brown-100">
      <NavBar />
      <main className="flex justify-center items-center p-4 my-4 flex-grow">
        <div className="w-full max-w-2xl bg-brown-200 rounded-sm shadow-md px-3 sm:px-20 py-14">
          <h2 className="text-4xl font-semibold text-center mb-2 text-foreground">
            Log in
          </h2>
          {location.state?.info && (
            <p className="text-green-700 bg-green-50 border border-green-200 rounded-md py-2 px-3 text-center mb-4 text-sm">
              {location.state.info}
            </p>
          )}
          {/* Attach handleSubmit to the form's onSubmit event */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="relative space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email"
                // Add value and onChange handler
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white rounded-md border border-brown-300 px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
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
                type="password"
                id="password"
                name="password"
                placeholder="password"
                // Add value and onChange handler
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white rounded-md border border-brown-300 px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>

            {/* Display error message */}
            {error && (
              <p className="text-red-600 text-center text-sm font-medium">
                {error}
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                // Disable button when loading to prevent multiple submissions
                disabled={loading}
                className="px-8 py-2 bg-foreground text-white rounded-full bg-brown-600 hover:bg-muted-foreground transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
          <p className="flex flex-row justify-center gap-1 mt-4 text-sm text-brown-400 text-center pt-2 text-muted-foreground font-medium">
            Don't have an account?
            <a
              onClick={() => navigate("/sign-up")}
              className="text-brown-600 text-foreground hover:text-muted-foreground transition-colors underline font-semibold cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
