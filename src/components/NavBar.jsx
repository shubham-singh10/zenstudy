import React, { Fragment, useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoMdArrowDropup } from "react-icons/io";
import Cookies from "js-cookie";

const navLink = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Courses", link: "/courses" },
  { label: "Our Team", link: "/ourteam" },
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
  const [userData, setUserData] = useState(null);
  const isLoggedIn = !!Cookies.get("access_tokennew");
  // Toggle body scroll based on hamburger menu state
  useEffect(() => {
    document.body.style.overflow = hamBurger ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [hamBurger]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData")
    Cookies.remove("access_tokennew");
    navigate("/");
    window.location.reload();
  };

  const handleMoreToggle = () => setShowMore(!showMore);

  return (
    <>
      {/* Navbar Container */}
      <div className="w-full h-[15vh] flex items-center justify-between px-6 lg:px-12 shadow-md">
        {/* Logo */}
        <Link to={"/"} className="flex flex-col items-start">
          <p className="text-3xl font-bold">
            ZenStudy<span className="text-[#054BB4] text-4xl">.</span>
          </p>
          <p className="text-[10px] font-medium text-[#054BB4]">
            Making Education Imaginative
          </p>
        </Link>

        {/* Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLink.slice(0, 4).map((item) => (
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
          <div className="relative">
            <button
              className="px-3 py-2 rounded-md font-medium text-gray-700 hover:text-[#054BB4] flex items-center"
              onClick={handleMoreToggle}
            >
              More <IoMdArrowDropdown />
            </button>
            {showMore && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                {navLink.slice(4).map((item) => (
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
          {!isLoggedIn ? (
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
            <div className="relative">
              {/* Button to Toggle Dropdown */}
              <button
                className="px-4 py-2 bg-[#054BB4] text-white rounded-full flex items-center gap-2 shadow-lg hover:bg-[#063e92] transition-all"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserAlt className="text-lg" />
                <span className="text-sm font-medium">{userData?.name || "User"}</span>
                {dropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                  {/* Welcome Section */}
                  <div className="px-4 py-3 bg-gray-100 rounded-t-lg border-b border-gray-200">
                    <p className="text-sm text-gray-600">Welcome,</p>
                    <p className="text-base font-semibold text-[#054BB4]">{userData?.name}</p>
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
                      <FaUserAlt className="text-blue-600" />
                      <span>My Courses</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-3 text-sm text-white bg-red-600 hover:bg-red-700 transition-all rounded-b-lg"
                      onClick={handleLogout}
                    >
                      <FaUserAlt className="text-white" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Menu - Mobile */}
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

      {/* Mobile Menu */}
      {hamBurger && (
        <div className="lg:hidden w-full bg-[#054BB4] text-white">
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
            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <button
                className="w-full px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default NavBar;
