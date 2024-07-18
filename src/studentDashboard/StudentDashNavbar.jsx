import React, { useEffect, useState } from 'react';
import { IoClose, IoNotifications } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FiUser, FiBook, FiAward } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

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
        label: "UPSC",
        link: "/upsc-student",
        icon: <FiAward />,
    },
];

const StudentDashNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState(null)
    const location = useLocation();
    
    useEffect(() => {
        const userDataFromLocalStorage = localStorage.getItem("userData");
        if (userDataFromLocalStorage) {
            const parsedUserData = JSON.parse(userDataFromLocalStorage);
            setUserData(parsedUserData);
        }
    }, []);
    const handleClick = () => {
        setIsOpen(false);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full h-[10vh] shadow-lg flex items-center justify-between px-4 lg:px-12 relative bg-white">
            <div>
                <p className="font-semibold text-lg hidden lg:block">Student Dashboard</p>
                <RxHamburgerMenu className="lg:hidden block text-2xl cursor-pointer" onClick={toggleSidebar} />
                {isOpen && (
                    <div className="h-screen md:w-1/4 lg:hidden w-full bg-white shadow-lg absolute top-0 left-0 z-50">
                        <IoClose className="text-3xl absolute right-3 top-2" onClick={toggleSidebar} />
                        <div className="flex items-center justify-between flex-col h-full py-11">
                            <div className="flex items-center flex-col w-full px-12">
                                <p className="text-3xl font-bold">ZenStudy<span className="text-[#054BB4] text-4xl">.</span></p>
                                <p className="text-[10px] font-medium text-[#054BB4]">Making Education Imaginative</p>
                            </div>
                            <div className={`flex flex-col items-center justify-center gap-4 font-medium text-xl`}>
                                {links.map(({ label, link, icon }) => (
                                    <Link to={link} key={label} className={`w-full flex items-center py-3 px-4 ${location.pathname === link ? 'bg-[#054BB4] text-white' : 'text-black hover:bg-gray-200'} transition-colors duration-200`} onClick={handleClick}>
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{icon}</span>
                                            <span>{label}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <button className="bg-red-500 w-full py-3 text-lg text-white font-semibold" onClick={toggleSidebar}>Log Out</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between gap-7">
                <IoNotifications className="text-2xl text-[#054BB4]" />
                <div className="flex items-center gap-4">
                    <img src={userData?.avatar || "https://i.ibb.co/GcKk9fh/images-2.jpg"} alt="Profile" className="w-14 rounded-full" />
                    <div className="flex flex-col items-end">
                        <p className="text-[#054BB4] font-semibold">{userData?.name}</p>
                        <p className="text-[#CADEFB] text-sm">Student</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashNavbar;
