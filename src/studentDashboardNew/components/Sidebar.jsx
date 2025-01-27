import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBook,
  FiBookOpen,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiLayout,
  FiMenu,
  FiSquare,
  FiTag,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/auth-context";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const menuItems = useMemo(
    () => [
      {
        title: "General",
        items: [{ href: "/profileNew", label: "Profile", icon: FiLayout }],
      },
      {
        title: "Pages",
        items: [
          {
            href: "/course-details-studentNew",
            label: "Courses",
            icon: FiBook,
          },
          { href: "/mycourseNew", label: "My Courses", icon: FiBookOpen },
          { href: "/liveClassNew", label: "Live Classes", icon: FiVideo },
        ],
      },
      {
        title: "Self Learning",
        items: [
          {
            label: "Current Affairs",
            icon: FiFileText,
            dropdown: [
              { href: "/dailyAffairsNew", label: "Daily", icon: FiSquare },
              { href: "/monthlyAffairsNew", label: "Monthly", icon: FiTag },
            ],
          },
        ],
      },
    ],
    []
  );

  // Function to check if the current route is active
  const isActive = (href) => location.pathname === href;

  // Auto-open dropdowns if any sub-item is active
  useEffect(() => {
    const activeDropdowns = [];

    menuItems.forEach((section) => {
      section.items.forEach((item) => {
        if (item.dropdown) {
          const isDropdownActive = item.dropdown.some(
            (subItem) => location.pathname === subItem.href
          );
          if (isDropdownActive) {
            activeDropdowns.push(item.label);
          }
        }
      });
    });

    setOpenDropdowns(activeDropdowns);
  }, [location.pathname, menuItems]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f172a] text-white rounded-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-2 border-sidebar-border text-sidebar-accent-foreground z-40
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Sidebar content */}
        <div className="flex flex-col h-full">
          <div className="p-3 shadow-xl bg-gradient-to-b from-black/10 to-transparent z-[-1] rounded-b-md ">
            <div className="flex items-center justify-center  gap-2">
              <div className="bg-sidebar-foreground rounded-lg flex items-center justify-center">
                <img
                  src={"/assets/logo.png"}
                  alt="Logo"
                  className={`h-12 w-12 rounded-md`}
                />
              </div>
              <div>
                <p className="font-bold text-lg">Zenstudy</p>
                <p className="text-xs text-blue-700 text-nowrap">
                  Making Education Imaginative</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((section) => (
              <div key={section.title} className="mb-6">
                <p className="text-xs text-sidebar-accent-ring mb-3">
                  {section.title}
                </p>
                <ul className="space-y-2">
                  {section.items.map((item) => {
                    return (
                      <li key={item.label}>
                        {item.dropdown ? (
                          <div>
                            <button
                              onClick={() =>
                                setOpenDropdowns((prev) =>
                                  prev.includes(item.label)
                                    ? prev.filter((i) => i !== item.label)
                                    : [...prev, item.label]
                                )
                              }
                              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                                openDropdowns.includes(item.label)
                                  ? "bg-gray-200"
                                  : "hover:bg-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                              </div>
                              {openDropdowns.includes(item.label) ? (
                                <FiChevronDown className="w-4 h-4" />
                              ) : (
                                <FiChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            {openDropdowns.includes(item.label) && (
                              <ul className="mt-2 ml-6 space-y-2">
                                {item.dropdown.map((subItem) => (
                                  <li key={subItem.label}>
                                    <Link
                                      to={subItem.href}
                                      className={`block px-3 py-2 rounded-lg transition-colors ${
                                        isActive(subItem.href)
                                          ? "bg-gray-200 text-sidebar-accent-primary"
                                          : "hover:bg-gray-200"
                                      }`}
                                      onClick={() =>
                                        isMobile && setIsOpen(false)
                                      }
                                    >
                                      <div className="flex items-center gap-3">
                                        <subItem.icon className="w-5 h-5" />
                                        {subItem.label}
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive(item.href)
                                ? "bg-gray-200"
                                : "hover:bg-gray-200"
                            }`}
                            onClick={() => isMobile && setIsOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="p-4 relative">
            <div className="absolute top-0 left-0 w-full h-full -translate-y-0 bg-gradient-to-b from-black/10 to-transparent z-[-1] rounded-t-md shadow-lg"></div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-gray-600 rounded-full shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{user?.name || "Guest"}</p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "Please update email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
