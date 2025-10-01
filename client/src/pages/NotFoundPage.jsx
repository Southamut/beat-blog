import { Link } from 'react-router-dom'
import { NavBar, Footer } from "../components/Homepage"
import { Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
    return (
        <>
            <NavBar />
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center max-w-md mx-auto px-8">
                    <div className="mb-8">
                        <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Sorry, the page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
