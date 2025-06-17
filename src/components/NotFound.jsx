import { Link } from "react-router-dom"
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa"
import NewNavBar from "./NewNavBar"

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
   
    <NewNavBar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* 404 Graphic */}
          <div className="relative ">
            <div className="text-[180px] md:text-[250px] font-bold text-purple-100 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl md:text-8xl font-bold bgGredient-purple text-transparent bg-clip-text">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold textPurple mb-4">Oops! Page Not Found</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bgGredient-green textGold font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaHome className="text-lg" />
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-white textPurple border border-[#543a5d] font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-lg" />
              Contact Support
            </Link>
          </div>

          {/* Popular Links */}
          <div className="bgGradient-purple-light rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold textPurple mb-4">Popular Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                to="/courses"
                className="px-4 py-3 text-gray-700 hover:text-[#543a5d] hover:bg-purple-50 rounded-lg transition-all flex items-center gap-2"
              >
                <FaSearch className="textPurple" />
                Explore Courses
              </Link>
              <Link
                to="/currentAffair"
                className="px-4 py-3 text-gray-700 hover:text-[#543a5d] hover:bg-purple-50 rounded-lg transition-all flex items-center gap-2"
              >
                <FaSearch className="textPurple" />
                Current Affairs
              </Link>
              <Link
                to="/about"
                className="px-4 py-3 text-gray-700 hover:text-[#543a5d] hover:bg-purple-50 rounded-lg transition-all flex items-center gap-2"
              >
                <FaSearch className="textPurple" />
                About Us
              </Link>
              <Link
                to="https://blog.zenstudy.in/"
                className="px-4 py-3 text-gray-700 hover:text-[#543a5d] hover:bg-purple-50 rounded-lg transition-all flex items-center gap-2"
              >
                <FaSearch className="textPurple" />
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-6 bgGradient-purple-light border-t">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Zenstudy. Making Education Imaginative</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound