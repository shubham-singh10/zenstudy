import React, { Fragment, useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross2, RxDashboard } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/auth-context";
import Loading from "../Loading";

// ✅ Updated navLink with nested structure
const navLink = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Courses", link: "/courses" },
  { label: "Mock Tests", link: "/test-series" },
  { label: "Current Affairs", link: "/currentAffair" },
  { label: "Our Team", link: "/ourteam" },
  { label: "Contact", link: "/contact" },
  {
    label: "Free Study Material",
    subLinks: [
      {
        label: "Editorials/Issues",
        link: "https://blog.zenstudy.in/category/daily-editorials/",
      },
      {
        label: "Daily Current Affairs",
        link: "https://blog.zenstudy.in/category/gs3/current-affairs/",
      },
      {
        label: "Daily Practice MCQs",
        link: "https://blog.zenstudy.in/category/gs3/daily-practice-mcqs/",
      },
      {
        label: "Monthly Current Affairs Magazine",
        link: "https://blog.zenstudy.in/category/gs3/monthly-current-affairs-magazine/",
      },
      {
        label: "UPSC PYQs",
        subLinks: [
          {
            label: "Prelims",
            link: "https://blog.zenstudy.in/category/pyq/pyq-prelims/",
          },
          {
            label: "Mains",
            link: "https://blog.zenstudy.in/category/pyq/pyq-mains/",
          },
          {
            label: "Optional Paper",
            link: "https://blog.zenstudy.in/category/pyq/pyq-optional-papers/",
          },
          {
            label: "Essay Paper",
            link: "https://blog.zenstudy.in/category/pyq/pyq-essay-papers/",
          },
        ],
      },
    ],
  },
];

const NewNavBar = () => {
  const [hamBurger, setHamBurger] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [openMain, setOpenMain] = useState(null); // for main submenu (Free Study Material)
  const [openNested, setOpenNested] = useState(null); // for nested submenu (UPSC PYQs)

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, logout, logoutLoading } = useAuth();

  // 👉 Facebook Pixel Tracking
  const handlePixelTrack = (label, source = "Desktop") => {
    if (window.fbq) {
      fbq("trackCustom", "NavbarLinkClick", {
        link_label: label,
        source,
      });
    }
  };

  useEffect(() => {
    document.body.style.overflow = hamBurger ? "hidden" : "auto";
  }, [hamBurger]);

  if (loading) {
    return <Loading />;
  }

  // Desktop Dropdown items
  const freeStudy = navLink.find(
    (item) => item.label === "Free Study Material"
  );

  return (
    <Fragment>
      {/* TOP NAVBAR */}
      <div className="w-full z-50 lg:h-[15vh] h-[10vh] mb-1 flex items-center justify-between px-6 lg:px-12 shadow-md bg-white">
        <Link to={"/"} className="flex flex-col items-start">
          <p className="text-3xl textdark font-bold">Zenstudy</p>
          <p className="text-[10px] font-bold textPurple">
            Making Education Imaginative
          </p>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLink.slice(0, 7).map((item) => (
            <Link
              key={item.label}
              to={item.link}
              onClick={() => handlePixelTrack(item.label, "Desktop")}
              className={`px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                location.pathname === item.link
                  ? " textPurple border-b-2 border-[#543a5d]"
                  : "hover:text-[#efdb78] text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Dropdown: Free Study Material */}
          <div
            className="relative z-50"
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={() => setShowMore(false)}
          >
            <div className="px-3 py-2 rounded-md font-medium text-gray-700 hover:text-[#efdb78] flex items-center cursor-pointer">
              Free Study Material{" "}
              {showMore ? (
                <IoMdArrowDropup className="ml-1" />
              ) : (
                <IoMdArrowDropdown className="ml-1" />
              )}
            </div>

            <div
              className={`absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 min-w-[200px] z-10 transition-all duration-200 ${
                showMore ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              {freeStudy?.subLinks.map((item) => (
                <div key={item.label} className="relative group">
                  {!item.subLinks ? (
                    <Link
                      to={item.link}
                      onClick={() => {
                        handlePixelTrack(item.label, "Desktop");
                        setShowMore(false);
                      }}
                      className="block px-4 py-2 text-gray-700 hover:bg-[#efdb78] hover:text-white transition-all"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="relative">
                      <div className="flex justify-between items-center px-4 py-2 text-gray-700 hover:bg-[#efdb78] hover:text-white cursor-pointer">
                        {item.label}
                        <IoMdArrowDropdown />
                      </div>
                      <div className="absolute top-0 left-full ml-1 bg-white shadow-lg rounded-lg border border-gray-200 min-w-[180px] opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
                        {item.subLinks.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.link}
                            onClick={() => {
                              handlePixelTrack(sub.label, "Desktop");
                              setShowMore(false);
                            }}
                            className="block px-4 py-2 text-gray-700 hover:bg-[#efdb78] hover:text-white transition-all"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isAuthenticated ? (
            <button
              className="px-6 py-2 bgGredient-purple text-white font-semibold rounded-full shadow-lg hover:from-[#935aa6] hover:to-[#543a5d] hover:shadow-xl transition-all duration-300"
              onClick={() => {
                handlePixelTrack("Login", "Desktop");
                navigate("/sign-In");
              }}
            >
              LogIn / SignUp
            </button>
          ) : (
            <div
              className="relative z-50"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="px-4 py-2 bgGredient-purple text-white rounded-full flex items-center gap-2 shadow-lg transition-all cursor-pointer">
                <FaUserAlt className="text-lg" />
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
                {showDropdown ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </div>

              {/* Profile Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border border-gray-200 z-10 transition-opacity duration-200 ${
                  showDropdown ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <div className="px-4 py-3 bg-purple-50 rounded-t-lg border-b border-gray-200">
                  <p className="text-sm text-gray-600">Welcome,</p>
                  <p className="text-base font-semibold textPurple">
                    {user?.name || "User"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <button
                    className="flex items-center gap-2 px-4 py-3 text-sm textPurple hover:bg-purple-50 transition-all"
                    onClick={() => {
                      handlePixelTrack("Profile", "Desktop");
                      navigate("/profile");
                    }}
                  >
                    <FaUserAlt />
                    <span>Profile</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-3 text-sm textPurple hover:bg-purple-50 transition-all"
                    onClick={() => {
                      handlePixelTrack("My Courses", "Desktop");
                      navigate("/mycourse");
                    }}
                  >
                    <FaBookOpenReader />
                    <span>My Courses</span>
                  </button>
                  <button
                    className="flex font-bold items-center gap-2 px-4 py-3 text-sm bg-gradient-to-r from-[#efdb78] to-[#f5eeb4] hover:from-[#f5eeb4] hover:to-[#efdb78] textPurple transition-all rounded-b-lg"
                    disabled={logoutLoading}
                    onClick={() => {
                      handlePixelTrack("Logout", "Desktop");
                      logout();
                    }}
                  >
                    <FiLogOut />
                    <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <div className="lg:hidden flex items-center">
          {!hamBurger ? (
            <RxHamburgerMenu
              className="text-2xl textPurple cursor-pointer"
              onClick={() => setHamBurger(true)}
            />
          ) : (
            <RxCross2
              className="text-2xl textPurple cursor-pointer"
              onClick={() => setHamBurger(false)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {hamBurger && (
        <div className="bgGredient-purple lg:hidden fixed top-0 left-0 w-full h-full z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <RxCross2
              className="text-2xl text-white cursor-pointer"
              onClick={() => setHamBurger(false)}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="flex flex-col items-start space-y-4 py-4">
              {navLink.map((item) =>
                !item.subLinks ? (
                  <li key={item.label} className="w-full text-left">
                    <Link
                      to={item.link}
                      onClick={() => {
                        handlePixelTrack(item.label, "Mobile");
                        setHamBurger(false);
                      }}
                      className="block w-full px-4 py-2 textLight hover:bg-[#efdb78] hover:text-black border-2 rounded-3xl border-white transition-all"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label} className="w-full">
                    <button
                      className="w-full flex justify-between items-center px-4 py-2 textLight font-semibold border-2 border-white rounded-3xl"
                      onClick={() =>
                        setOpenMain(openMain === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      {openMain === item.label ? (
                        <IoMdArrowDropup />
                      ) : (
                        <IoMdArrowDropdown />
                      )}
                    </button>

                    {openMain === item.label && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.subLinks.map((sub) =>
                          !sub.subLinks ? (
                            <li key={sub.label}>
                              <Link
                                to={sub.link}
                                onClick={() => {
                                  handlePixelTrack(sub.label, "Mobile");
                                  setHamBurger(false);
                                }}
                                className="block px-4 py-2 textLight hover:bg-[#efdb78] hover:text-black rounded-xl border border-white transition-all"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ) : (
                            <li key={sub.label}>
                              <button
                                className="w-full flex justify-between items-center px-4 py-2 textLight border border-white rounded-xl"
                                onClick={() =>
                                  setOpenNested(
                                    openNested === sub.label ? null : sub.label
                                  )
                                }
                              >
                                {sub.label}
                                {openNested === sub.label ? (
                                  <IoMdArrowDropup />
                                ) : (
                                  <IoMdArrowDropdown />
                                )}
                              </button>

                              {openNested === sub.label && (
                                <ul className="ml-6 mt-2 space-y-2">
                                  {sub.subLinks.map((deep) => (
                                    <li key={deep.label}>
                                      <Link
                                        to={deep.link}
                                        onClick={() => {
                                          handlePixelTrack(
                                            deep.label,
                                            "Mobile"
                                          );
                                          setHamBurger(false);
                                        }}
                                        className="block px-4 py-2 textLight hover:bg-[#efdb78] hover:text-black rounded-xl border border-white transition-all"
                                      >
                                        {deep.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </li>
                )
              )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <button
                  className="w-full px-4 py-2 bgGredient-gold textLight rounded-full hover:scale-105 transition-all"
                  onClick={() => {
                    handlePixelTrack("Login", "Mobile");
                    navigate("/sign-In");
                    setHamBurger(false);
                  }}
                >
                  LogIn / SignUp
                </button>
              ) : (
                <Fragment>
                  <button
                    className="flex items-center justify-center w-[70%] px-6 py-3 bgGredient-green textGold rounded-full hover:scale-105 transition-all"
                    onClick={() => {
                      handlePixelTrack("Dashboard", "Mobile");
                      navigate("/profile");
                      setHamBurger(false);
                    }}
                  >
                    <RxDashboard className="text-xl mr-2" />
                    My Dashboard
                  </button>
                  <button
                    className="flex items-center justify-center w-[70%] px-6 py-3 bgGredient-gold textGreen rounded-full hover:scale-105 transition-all"
                    disabled={logoutLoading}
                    onClick={() => {
                      handlePixelTrack("Logout", "Mobile");
                      logout();
                    }}
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

export default NewNavBar;
