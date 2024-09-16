import React, { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiUser, FiBook, FiCircle, FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaRegUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";

const links = [
  {
    label: "Home",
    link: "/",
    icon: <FaHome />,
  },
  {
    label: "Profile",
    link: "/profile",
    icon: <FiUser />,
  },
  {
    label: "Course Details",
    link: "/course-details-student",
    icon: <FiBook />,
  },
  {
    label: "My Courses",
    link: "/mycourse",
    icon: <FiCircle />,
  },
];

const StudentDashNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const handleClick = () => {
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    Cookies.remove("access_tokennew");
    navigate("/");
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="m-5 h-[10vh] shadow-lg flex items-center justify-between px-4 py-4 lg:px-12 relative bg-white">
      <div>
        {/* <p className="font-semibold text-lg hidden lg:block">Student Dashboard</p> */}
        <RxHamburgerMenu
          className="lg:hidden block text-2xl cursor-pointer"
          onClick={toggleSidebar}
        />
        {isOpen && (
          <div ref={sidebarRef} className="h-screen md:w-1/4 lg:hidden w-full bg-white shadow-lg absolute top-0 left-0 z-50">
            <div className="flex items-center flex-col h-full py-11">
              <div className="flex items-center flex-col w-full px-12">
                <Link to={"/"} className="text-3xl font-bold">
                  <img src={"/assets/logo.png"} alt="Logo" className={`h-40 w-40`} />
                </Link>
                <IoClose
                  className="text-3xl absolute right-3 top-2"
                  onClick={toggleSidebar}
                />
              </div>
              <div className={`flex flex-col items-center justify-center gap-4 mt-8 font-medium text-lg`}>
                {links.map(({ label, link, icon }) => (
                  <Link
                    to={link}
                    key={label}
                    className={`w-full flex items-center py-3 px-12 ${location.pathname === link
                      ? "bg-[#054BB4] text-white"
                      : "text-black hover:bg-gray-200"
                      } transition-colors duration-200`}
                    onClick={handleClick}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{icon}</span>
                      <span>{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-7">
        {/* <IoNotifications className="lg:text-2xl md:text-xl text-lg text-[#054BB4]" /> */}
        <div className="relative">
          <div className="flex items-center gap-4 cursor-pointer" onClick={toggleDropdown}>
            <div className="flex flex-col items-end">
              <p className="text-[#054BB4] font-semibold sm:text-sm md:text-lg lg:text-lg">
                {userData?.name}
              </p>
              {
                // <p className="text-[#CADEFB] text-sm">Student</p>
            }
            </div>
            {
            // <img
            //   src={userData?.avatar || "https://i.ibb.co/GcKk9fh/images-2.jpg"}
            //   alt="Profile"
            //   className="lg:w-14 md:w-12 w-10 m-2 rounded-full"
            // />
            }
            <FaRegUserCircle  className="text-3xl text-blue-800 hover:text-blue-600"/>
          </div>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className={`absolute right-0 mt-4 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 transition-transform transform ${isDropdownOpen ? "scale-100" : "scale-0"
                }`}
            >
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 mt-2 hover:bg-gray-200"
                onClick={closeDropdown}
              >
                <FiUser className="mr-2" /> Profile
              </Link>
              <hr className="border-t-2 border-gray-500 " />
              <button
                className="ml-6 mb-2 mt-2 flex items-center px-8 py-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded transition-colors duration-200"
                onClick={handleLogout}
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashNavbar;
