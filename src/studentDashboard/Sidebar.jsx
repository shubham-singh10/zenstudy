import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiBook } from "react-icons/fi";
import { RiMenuFoldLine, RiMenuUnfoldLine, RiLiveLine } from "react-icons/ri";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

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
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
        {links.map(({ label, link, icon }) => (
          <Link
            to={link}
            key={label}
            className={`w-full flex items-center py-3 px-4 rounded-lg ${
              location.pathname === link
                ? "bg-[#054BB4] text-white"
                : "text-gray-800 hover:bg-gray-100"
            } transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{icon}</span>
              {!isCollapsed && <span>{label}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
