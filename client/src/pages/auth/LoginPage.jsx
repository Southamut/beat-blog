import { NavBar } from "../../components/Homepage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function LoginPage() {
  const navigate = useNavigate();

  //for collect user, pass
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //for collect loading, error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //for update state when input fields change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error message when the user starts typing again
    setError(null);
  };

  //for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4001/auth/login",
        formData,
        {
          headers: {},
        }
      );

      const data = response.data;

      localStorage.setItem("access_token", data.access_token);

      alert("Login successful! Redirecting to homepage.");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(
          err.response.data.error ||
            "Login failed. Please check your credentials."
        );
      } else if (err.request) {
        setError("No response from server. Check your network connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex justify-center items-center p-4 my-4 flex-grow">
        <div className="w-full max-w-2xl bg-[#EFEEEB] rounded-sm shadow-md px-3 sm:px-20 py-14">
          <h2 className="text-4xl font-semibold text-center mb-6 text-foreground">
            Log in
          </h2>
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
                type="password"
                id="password"
                name="password"
                placeholder="password"
                // Add value and onChange handler
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white rounded-md border border-[#DAD6D1] px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
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
                disabled={isLoading}
                className="px-8 py-2 bg-foreground text-white rounded-full bg-[#26231E] hover:bg-muted-foreground transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
          <p className="flex flex-row justify-center gap-1 mt-4 text-sm text-center pt-2 text-muted-foreground font-medium">
            Don't have an account?
            <a
              onClick={() => navigate("/sign-up")}
              className="text-foreground hover:text-muted-foreground transition-colors underline font-semibold cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
