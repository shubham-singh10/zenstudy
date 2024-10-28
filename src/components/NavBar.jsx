import React, { Fragment, useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoMdArrowDropup } from "react-icons/io";
import Cookies from 'js-cookie';

const navLink = [
  {
    label: "Home",
    link: "/",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "About",
    link: "/about",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Blogs",
    link: "https://blog.zenstudy.in/",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Our Team",
    link: "/ourteam",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Courses",
    link: "/courses",
    className: "hover:text-[#054BB4]"
  },
  {
    label: "Contact",
    link: "/contact",
    className: "hover:text-[#054BB4]"
  },
];

const NavBar = () => {
  const [hamBurger, setHamBurger] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!Cookies.get('access_tokennew');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle body scroll based on hamburger menu state
  useEffect(() => {
    if (hamBurger) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // reset when component unmounts
    };
  }, [hamBurger]);

  function handleClick() {
    setHamBurger(!hamBurger);
  }

  const handleLogout = () => {
    Cookies.remove('access_tokennew');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <div className="w-full h-[15vh] flex items-center justify-between px-12">
        <div className="flex items-center justify-between w-full">
          <Link to={"/"} className="flex items-center flex-col">
            <p className="text-3xl font-bold">
              ZenStudy<span className="text-[#054BB4] text-4xl">.</span>
            </p>
            <p className="text-[10px] font-medium text-[#054BB4]">
              Making Education Imaginative 
            </p>
          </Link>
          <div className="lg:block hidden">
            <ul className="flex items-center justify-between gap-8 cursor-pointer">
              {navLink.map((item) => (
                <Fragment key={item.label}>
                  <li
                    className={`${location.pathname === item.link
                      ? "px-5 py-[2px] text-[#054BB4] rounded-full border-2 border-solid border-[#054BB4] font-medium"
                      : item.className
                    } transition-all duration-300 ease-in-out`}
                  >
                    <Link to={item.link}>{item.label}</Link>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
          {!isLoggedIn ? (
            <div className="lg:block hidden space-x-4">
              <button
                className="px-5 py-2 bg-[#054BB4] text-white rounded-full hover:bg-[#063e92] transition-colors duration-200"
                onClick={() => navigate("/sign-In")}
              >
                Login
              </button>
              <button
                className="px-5 py-2 bg-[#054BB4] text-white rounded-full hover:bg-[#063e92] transition-colors duration-200"
                onClick={() => navigate("/sign-Up")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="lg:block hidden relative">
              <button
                className="p-2 flex gap-2 bg-[#054BB4] text-white rounded-full hover:bg-[#063e92] transition-colors duration-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserAlt />{dropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </button>
              {dropdownOpen && (
                <div className="absolute z-50 -right-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    className="block w-full text-left px-4 py-2 rounded-t-md  text-gray-800 hover:bg-blue-600 hover:text-white"
                    onClick={() => navigate("/profile")}
                  >
                    User Dashboard
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 rounded-t-md  text-gray-800 hover:bg-blue-600 hover:text-white"
                    onClick={() => navigate("/mycourse")}
                  >
                    My Courses
                  </button>
                  <button
                    className="block w-full bg-red-600 rounded-b-md text-white text-left px-4 py-2 hover:bg-red-700 hover:text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="lg:hidden text-2xl flex items-center relative z-30 text-[#054BB4]">
            {!hamBurger ? (
              <RxHamburgerMenu onClick={handleClick} className="cursor-pointer" />
            ) : (
              <RxCross2 onClick={handleClick} className="text-[#054BB4] cursor-pointer" />
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {hamBurger && (
          <div className="lg:hidden w-full bg-[#054BB4] text-white overflow-hidden">
            <div className="w-full h-[120vh] bg-[#054BB4] relative top-[-160px] text-white">
              <div className="w-full h-full absolute flex items-center justify-center flex-col gap-5">
                <ul className="flex flex-col items-center justify-center text-lg w-full">
                  {navLink.map((item) => (
                    <li
                      key={item.label}
                      className={`w-full text-center border-b border-white py-4 transition-all duration-300 ease-in-out hover:text-[#054BB4] hover:bg-[#F9F9F9] cursor-pointer ${location.pathname === item.link ? "" : ""
                      }`}
                    >
                      <Link to={item.link} onClick={() => setHamBurger(false)}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {!isLoggedIn ? (
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-1 border-2 border-solid border-white text-lg rounded-full hover:text-[#054BB4] hover:bg-[#F9F9F9] transition-all duration-300 cursor-pointer"
                      onClick={() => { navigate("/sign-Up"); setHamBurger(false); }}
                    >
                      Sign Up
                    </button>

                    <button
                      className="px-4 py-1 border-2 border-solid border-white text-lg rounded-full hover:text-[#054BB4] hover:bg-[#F9F9F9] transition-all duration-300 cursor-pointer"
                      onClick={() => { navigate("/sign-In"); setHamBurger(false); }}
                    >
                      Log In
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <button
                      className="px-4 py-1 border-2 border-solid border-white text-lg rounded-full hover:text-[#054BB4] hover:bg-[#F9F9F9] transition-all duration-300 cursor-pointer"
                      onClick={() => { navigate("/profile"); setHamBurger(false); }}
                    >
                      User Dashboard
                    </button>
                    <button
                      className="px-4 py-1 border-2 border-solid border-white text-lg rounded-full hover:text-[#054BB4] hover:bg-[#F9F9F9] transition-all duration-300 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
