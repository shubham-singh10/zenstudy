import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiBook, FiCircle, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Cookies from 'js-cookie';

const links = [
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

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };


    return (
        <div className={`hidden h-full lg:flex flex-col py-8 shadow-xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-between px-4">
                <img src={"/assets/logo.png"} alt="Logo" className={`h-10 w-10 ${isCollapsed ? 'block' : 'hidden'}`} />
                <Link to={"/"} className={`text-3xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
                    ZenStudy<span className="text-[#054BB4] text-4xl">.</span>
                </Link>
                <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
                    {isCollapsed ? <FiChevronRight size={35} /> : <FiChevronLeft size={35} />}
                </button>
            </div>
            <div className={`flex flex-col mt-36 items-center justify-center gap-4 font-medium text-xl ${isCollapsed ? 'mt-8' : 'mt-16'}`}>
                {links.map(({ label, link, icon }) => (
                    <Link to={link} key={label} className={`w-full flex items-center py-3 px-4 ${location.pathname === link ? 'bg-[#054BB4] text-white' : 'text-black hover:bg-gray-200'} transition-colors duration-200`}>
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
