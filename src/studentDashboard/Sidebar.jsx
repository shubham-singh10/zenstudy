import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiBook, FiClipboard } from "react-icons/fi";
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiLiveLine,
  RiNewspaperLine,
} from "react-icons/ri";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaFilePdf, FaHome } from "react-icons/fa";

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
    label: "Courses",
    link: "/course-details-student",
    icon: <FiBook />,
  },
  {
    label: "My Courses",
    link: "/mycourse",
    icon: <FaBookOpenReader />,
  },
  {
    label: "Live Classes",
    link: "/liveClass",
    icon: <RiLiveLine />,
  },
  {
    label: "Current Affairs",
    icon: <RiLiveLine />,
    subLinks: [
      {
        label: "Daily",
        link: "/dailyAffairs",
      },
      {
        label: "Monthly",
        link: "/monthlyAffairs",
      },
    ],
  },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleDropdownToggle = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <div
      className={`hidden h-full lg:flex flex-col py-6 shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } bg-white`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={"/assets/logo.png"}
            alt="Logo"
            className={`h-12 w-12 rounded-md ${
              isCollapsed ? "hidden" : "block"
            }`}
          />
          {!isCollapsed && (
            <div>
              <p className="text-xl font-bold text-blue-800 tracking-wide">
                Zenstudy<span className="text-[#054BB4] text-4xl">.</span>
              </p>
              <p className="text-[8px] font-medium text-[#054BB4]">
                Making Education Imaginative
              </p>
            </div>
          )}
        </div>
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          {isCollapsed ? (
            <RiMenuUnfoldLine size={25} />
          ) : (
            <RiMenuFoldLine size={25} />
          )}
        </button>
      </div>

      {/* Sidebar Links */}
      <div
        className={`flex flex-col mt-16 items-start ${
          isCollapsed ? "items-center" : "px-4"
        } gap-4 font-medium text-base`}
      >
        {links.map(({ label, link, icon, subLinks }) => (
          <div key={label} className="w-full">
            <div
              className={`w-full flex items-center py-3 px-4 rounded-lg cursor-pointer ${
                location.pathname === link
                  ? "bg-[#054BB4] text-white"
                  : "text-gray-800 hover:bg-gray-100"
              } transition-all duration-200`}
              onClick={() =>
                subLinks ? handleDropdownToggle(label) : navigate(link)
              }
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{icon}</span>
                {!isCollapsed && <span>{label}</span>}
              </div>
            </div>

            {/* Render Sublinks */}
            {subLinks && activeDropdown === label && (
              <div className="ml-6 mt-2">
                {subLinks.map(({ label: subLabel, subLinks: nestedLinks, link: subLink, icon }) =>
                  nestedLinks ? (
                    <div key={subLabel}>
                      <div
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer text-gray-800 hover:bg-gray-100`}
                        onClick={() => handleDropdownToggle(subLabel)}
                      >
                        <span className="text-lg">{icon}</span>
                        {!isCollapsed && <span>{subLabel}</span>}
                      </div>
                      {activeDropdown === subLabel && (
                        <div className="ml-6 mt-2">
                          {nestedLinks.map(({ label, link, icon }) => (
                            <Link
                              to={link}
                              key={label}
                              className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                              <span className="text-base">{icon}</span>
                              <span className="ml-2">{label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={subLink}
                      key={subLabel}
                      className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <span className="text-base">{icon}</span>
                      <span className="ml-2">{subLabel}</span>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
