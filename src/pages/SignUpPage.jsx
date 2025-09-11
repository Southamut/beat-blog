import { NavBar } from "../components/Homepage"
import { useNavigate } from 'react-router-dom'

export function SignupPage() {

    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex justify-center items-center p-4 my-6 flex-grow">
                <div className="w-full max-w-2xl bg-[#EFEEEB] rounded-sm shadow-md px-3 sm:px-20 py-14">
                    <h2 className="text-4xl font-semibold text-center mb-6 text-foreground">
                        Sign up
                    </h2>
                    <form className="space-y-6">
                        <div className="relative space-y-1">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-muted-foreground"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                placeholder="Full name"
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
                                placeholder="Username"
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
                                type="email"
                                placeholder="Email"
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
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white rounded-md border border-[#DAD6D1] px-3 py-2 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"

                            />

                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-8 py-2 bg-foreground text-white rounded-full bg-gray-800 hover:bg-muted-foreground transition-colors flex items-center gap-1"
                            >
                                Sign up
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
        </div>
    );
}