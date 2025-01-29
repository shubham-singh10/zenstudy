import React, { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiUser, FiBook, FiCircle, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaRegUserCircle } from "react-icons/fa";
import { RiLiveLine } from "react-icons/ri";
import { useAuth } from "../context/auth-context";

const links = [
  { label: "Home", link: "/", icon: <FaHome /> },
  { label: "Profile", link: "/profile", icon: <FiUser /> },
  { label: "Course Details", link: "/course-details-student", icon: <FiBook /> },
  { label: "My Courses", link: "/mycourse", icon: <FiCircle /> },
  { label: "Live Classes", link: "/liveClass", icon: <RiLiveLine /> },
];

const StudentDashNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const { logout, logoutLoading } = useAuth();

  useEffect(() => {
    const userDataFromLocalStorage = localStorage.getItem("userData");
    if (userDataFromLocalStorage) {
      const parsedUserData = JSON.parse(userDataFromLocalStorage);
      setUserData(parsedUserData);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Disable body scroll when the sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="relative shadow-md bg-white">
      {/* Navbar Header */}
      <div className="h-[10vh] flex items-center justify-between md:justify-between lg:justify-end px-4 lg:px-12">
        {/* Hamburger Menu */}
        <RxHamburgerMenu
          className="lg:hidden block text-2xl cursor-pointer"
          onClick={toggleSidebar}
        />

        {/* User Info Section */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-4 cursor-pointer p-2 rounded-md bg-blue-50 hover:bg-blue-100 transition"
            onClick={toggleDropdown}
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <div className="text-right">
              <p className="text-blue-800 font-semibold text-sm truncate">
                {userData?.name || "User Name"}
              </p>
              <span className="text-gray-500 text-xs">View Profile</span>
            </div>
            <FaRegUserCircle className="text-3xl text-blue-600" />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */ }
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-10 top-18 bg-white w-48 shadow-lg rounded-lg border border-gray-200 z-50"
        >
          <Link
            to="/profile"
            className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiUser className="mr-2" /> Profile
          </Link>
          <hr className="my-2 border-gray-300" />
          <button
            className="flex items-center justify-center text-sm w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg"
            disabled={logoutLoading}
            onClick={()=>logout()}
          >
            <FiLogOut className="mr-2" /> {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      {/* Sidebar */}
      {isOpen && (
        <div
          ref={sidebarRef}
          className="fixed inset-0 z-50 bg-white shadow-lg h-screen w-[75%] md:w-1/3 lg:hidden overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b bg-gray-50">
            {/* Logo and Name Section */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="h-12 w-12 rounded-md"
              />
              {/* Name and Tagline */}
              <div className="flex flex-col">
                <p className="text-xl font-bold text-blue-800 tracking-wide">
                  Zenstudy
                </p>
                <p className="text-[10px] font-medium text-[#054BB4]">
                  Making Education Imaginative
                </p>
              </div>
            </div>


            {/* Close Button */}
            <IoClose
              className="text-2xl text-gray-700 hover:text-gray-900 cursor-pointer transition"
              onClick={() => setIsOpen(false)}
            />
          </div>


          <div className="mt-4">
            {links.map(({ label, link, icon }) => (
              <Link
                to={link}
                key={label}
                className={`flex items-center gap-4 px-6 py-3 font-medium ${location.pathname === link
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 text-gray-700"
                  } transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashNavbar;
