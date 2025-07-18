import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBook,
  FiBookOpen,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiHome,
  FiLayout,
  FiMenu,
  FiSquare,
  FiTag,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/auth-context";
import { BiBrain } from "react-icons/bi";
import { GiNotebook } from 'react-icons/gi';

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
        items: [
          { href: "/", label: "Home", icon: FiHome },
          { href: "/profile", label: "Profile", icon: FiLayout },
        ],
      },
      {
        title: "Pages",
        items: [
          {
            href: "/course-details-student",
            label: "Courses",
            icon: FiBook,
          },
          { href: "/mycourse", label: "My Courses", icon: FiBookOpen },
          { href: "/liveClass", label: "Live Classes", icon: FiVideo },
        ],
      },
      {
        title: "Self Learning",
        items: [
          { href: "/free-resources", label: "Free Resources", icon: BiBrain },
          { href: "/pyqs", label: "PYQs", icon: GiNotebook },
          {
            label: "Current Affairs",
            icon: FiFileText,
            dropdown: [
              { href: "/dailyAffairs", label: "Daily", icon: FiSquare },
              { href: "/monthlyAffairs", label: "Monthly", icon: FiTag },
            ],
          },
          {
            label: "Mock Tests",
            icon: FiFileText,
            dropdown: [
              { href: "/testSeries", label: "Test", icon: FiSquare },
            ],
          },
        ],
      },
    ],
    []
  );

  const isActive = (href) => location.pathname === href;

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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f172a] text-white rounded-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-2 border-sidebar-border text-sidebar-accent-foreground z-40
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-3 shadow-xl bg-gradient-to-b from-black/10 to-transparent z-[-1] rounded-b-md ">
            <div className="flex items-center justify-center gap-2">
              <div className="bg-sidebar-foreground rounded-lg flex items-center justify-center">
                <img
                  src={"/assets/logo.png"}
                  alt="Logo"
                  className="h-12 w-12 rounded-md"
                />
              </div>
              <div>
                <p className="font-bold textdark text-lg">Zenstudy</p>
                <p className="text-xs textPurple text-nowrap">
                  Making Education Imaginative
                </p>
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
                                  ? "bg-purple-100"
                                  : "hover:bg-purple-100"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 textPurple" />
                                <span className="textPurple">{item.label}</span>
                              </div>
                              {openDropdowns.includes(item.label) ? (
                                <FiChevronDown className="w-4 h-4 textPurple" />
                              ) : (
                                <FiChevronRight className="w-4 h-4 textPurple" />
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
                                          ? "bg-purple-100 text-sidebar-accent-primary"
                                          : "hover:bg-purple-100"
                                      }`}
                                      onClick={() => {
                                        if (window.fbq) {
                                          fbq("trackCustom", "SidebarSubLinkClick", {
                                            parent: item.label,
                                            link: subItem.href,
                                            label: subItem.label,
                                            location: window.location.pathname,
                                          });
                                        }
                                        if (isMobile) setIsOpen(false);
                                      }}
                                    >
                                      <div className="flex items-center textPurple gap-3">
                                        <subItem.icon className="w-5 h-5 textPurple" />
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
                                ? "bg-purple-100"
                                : "hover:bg-purple-100"
                            }`}
                            onClick={() => {
                              if (window.fbq) {
                                fbq("trackCustom", "SidebarLinkClick", {
                                  link: item.href,
                                  label: item.label,
                                  location: window.location.pathname,
                                });
                              }
                              if (isMobile) setIsOpen(false);
                            }}
                          >
                            <item.icon className="w-5 h-5 textPurple" />
                            <span className="textPurple">{item.label}</span>
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
            <div className="absolute top-0 left-0 w-full h-full -translate-y-0 bgGredient-purple z-[-1] rounded-t-md shadow-lg"></div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-medium textGold">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-medium textGold truncate">
                  {user?.name || "Guest"}
                </p>
                <p className="text-xs textGold truncate">
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
