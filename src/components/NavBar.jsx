import React, { Fragment, useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross2, RxDashboard } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoMdArrowDropup } from "react-icons/io";
import { FaBookOpenReader } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/auth-context";
import Loading from "../Loading";

const navLink = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Courses", link: "/courses" },
  { label: "Our Team", link: "/ourteam" },
  { label: "Current Affairs", link: "/currentAffair" },
  { label: "Blogs", link: "https://blog.zenstudy.in/" },
  { label: "Events", link: "https://blog.zenstudy.in/category/events/" },
  { label: "Contact", link: "/contact" },
];

const NavBar = () => {
  const [hamBurger, setHamBurger] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, logout, logoutLoading } = useAuth()


  // Toggle body scroll based on hamburger menu state
  useEffect(() => {
    if (hamBurger) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [hamBurger]);
  

  const handleMoreToggle = () => setShowMore(!showMore);

  if (loading) {
    return <Loading />
   }
  return (
    <Fragment>
      {/* Navbar Container */}
      <div className="w-full h-[15vh] mb-4 flex items-center justify-between px-6 lg:px-12 shadow-md">
        {/* Logo */}
        <Link to={"/"} className="flex flex-col items-start">
          <p className="text-3xl font-bold">
            Zenstudy
          </p>
          <p className="text-[10px] font-medium text-[#054BB4]">
            Making Education Imaginative
          </p>
        </Link>

        {/* Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLink.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${location.pathname === item.link
                ? "text-[#054BB4] border-b-2 border-[#054BB4]"
                : "hover:text-[#054BB4] text-gray-700"
                }`}
            >
              {item.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div className="relative z-50">
            <button
              className="px-3 py-2 rounded-md font-medium text-gray-700 hover:text-[#054BB4] flex items-center"
              onClick={handleMoreToggle}
            >
              More <IoMdArrowDropdown />
            </button>
            {showMore && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                {navLink.slice(5).map((item) => (
                  <Link
                    key={item.label}
                    to={item.link}
                    className="block px-4 py-2 text-gray-700 hover:bg-[#054BB4] hover:text-white transition-all"
                    onClick={() => setShowMore(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/sign-In")}
              >
                Login
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-green-800 hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/sign-Up")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="relative z-50">
              {/* Button to Toggle Dropdown */}
              <button
                className="px-4 py-2 bg-[#054BB4] text-white rounded-full flex items-center gap-2 shadow-lg hover:bg-[#063e92] transition-all"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserAlt className="text-lg" />
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                {dropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                  {/* Welcome Section */}
                  <div className="px-4 py-3 bg-gray-100 rounded-t-lg border-b border-gray-200">
                    <p className="text-sm text-gray-600">Welcome,</p>
                    <p className="text-base font-semibold text-[#054BB4]">{user?.name || "User"}</p>
                  </div>

                  {/* Links Section */}
                  <div className="flex flex-col">
                    <button
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all"
                      onClick={() => navigate("/profile")}
                    >
                      <FaUserAlt className="text-blue-600" />
                      <span>Profile</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all"
                      onClick={() => navigate("/mycourse")}
                    >
                      <FaBookOpenReader className="text-blue-600" />
                      <span>My Courses</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-3 text-sm text-white bg-red-600 hover:bg-red-700 transition-all rounded-b-lg"
                      disabled={logoutLoading}
                      onClick={() => logout()}
                    >
                      <FiLogOut className="text-white" />
                      <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {
          /* Hamburger Menu - Mobile */
        }
        <div className="lg:hidden flex items-center">
          {!hamBurger ? (
            <RxHamburgerMenu
              className="text-2xl text-[#054BB4] cursor-pointer"
              onClick={() => setHamBurger(true)}
            />
          ) : (
            <RxCross2
              className="text-2xl text-[#054BB4] cursor-pointer"
              onClick={() => setHamBurger(false)}
            />
          )}
        </div>
      </div>

      {
        /* Mobile Menu */
      }

      {hamBurger && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-[#054BB4] text-white z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <RxCross2
              className="text-2xl text-white cursor-pointer"
              onClick={() => setHamBurger(false)}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="flex flex-col items-center space-y-4 py-4">
              {navLink.map((item) => (
                <li key={item.label} className="w-full text-center">
                  <Link
                    to={item.link}
                    onClick={() => setHamBurger(false)}
                    className="block w-full px-4 py-2 hover:bg-[#063e92] transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!isAuthenticated ? (
                <Fragment>
                  <button
                    className="w-full px-4 py-2 bg-white text-[#054BB4] rounded-full hover:bg-gray-200"
                    onClick={() => {
                      navigate("/sign-In");
                      setHamBurger(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="w-full px-4 py-2 bg-white text-[#054BB4] rounded-full hover:bg-gray-200"
                    onClick={() => {
                      navigate("/sign-Up");
                      setHamBurger(false);
                    }}
                  >
                    Sign Up
                  </button>
                </Fragment>
              ) : (
                <Fragment>
                  <button
                    className="flex items-center justify-center w-[50%] px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition-all"
                    onClick={() => {
                      navigate("/profile");
                      setHamBurger(false);
                    }}
                  >
                    <RxDashboard className="text-xl mr-2" />
                    My Dashboard
                  </button>
                  <button
                    className="flex items-center justify-center w-[50%] px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full shadow-md hover:from-red-600 hover:to-red-800 hover:shadow-lg transition-all"
                    disabled={logoutLoading}
                    onClick={() => logout()}
                  >
                    <FiLogOut className="text-xl mr-2" />
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </Fragment>
              )}
            </ul>
          </div>
        </div>
      )}
      
    </Fragment>
  );
};

export default NavBar;
