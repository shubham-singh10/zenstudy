import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiBook, FiAward, FiChevronRight, FiCircle, FiChevronLeft } from 'react-icons/fi';
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

    // {
    //     label: "UPSC",
    //     link: "/upsc-student",
    //     icon: <FiAward />,
    // },
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate()
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout =()=>{
        Cookies.remove('access_tokennew')
        localStorage.removeItem("userData")
        navigate("/")
    }

    return (
        <div className={`hidden h-full lg:flex flex-col justify-between py-8 shadow-xl ${isCollapsed ? 'w-20' : 'w-1/6'} transition-all duration-300`}>
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                    <Link to={"/"} className={`text-3xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
                        ZenStudy<span className="text-[#054BB4] text-4xl">.</span>
                    </Link>
                </div>
                <button onClick={toggleSidebar} className=" block text-2xl focus:outline-none">
                    {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>
            <div className={`flex flex-col items-center justify-center gap-4 font-medium text-xl ${isCollapsed ? 'mt-8' : 'mt-16'}`}>
                {links.map(({ label, link, icon }) => (
                    <Link to={link} key={label} className={`w-full flex items-center py-3 px-4 ${location.pathname === link ? 'bg-[#054BB4] text-white' : 'text-black hover:bg-gray-200'} transition-colors duration-200`}>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{icon}</span>
                            {!isCollapsed && <span>{label}</span>}
                        </div>
                    </Link>
                ))}
            </div>
            <div>
                <button className="bg-red-500 w-full py-3 text-lg text-white font-semibold flex items-center justify-center" onClick={()=> handleLogout()}>
                    <FiLogOut className="text-2xl mr-2" />
                    {!isCollapsed && 'Log Out'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
