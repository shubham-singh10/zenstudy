import { useState, useRef, useEffect } from "react"
import { FiLogOut, FiSearch, FiSettings, FiSun, FiUser } from "react-icons/fi"
import { useAuth } from "../../context/auth-context"
import { Link } from "react-router-dom"

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)
    const { user } = useAuth()
    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "G";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="bg-white border-b sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                {/* Left Empty (No navItems) */}

                {/* Right Side - Search and User Menu */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Mobile Search Toggle */}
                    <button className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        <FiSearch className="h-5 w-5 text-gray-500" />
                    </button>

                    {/* Desktop Search */}
                    <div className="hidden md:block relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <FiSun className="h-5 w-5 text-gray-500" />
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1"
                        >
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">{initials}</span>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
                            >
                                <div className="px-4 py-2 border-b">
                                    <p className="font-medium text-gray-900">{user?.name || "Guest"}</p>
                                    <p className="text-sm text-gray-500 truncate">{user?.email || "Upadate your email"}</p>
                                </div>
                                <Link to="/profileNew" onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <FiUser className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Link to="/dailyAffairsNew" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <FiSettings className="w-4 h-4" />
                                    Daily Affairs
                                </Link>
                                <a href="#/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <FiLogOut className="w-4 h-4" />
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Expandable */}
            {isSearchOpen && (
                <div className="md:hidden px-4 pb-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
