import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import StudentDashNavbar from './StudentDashNavbar';

const StudentLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <StudentDashNavbar />
                <div className="flex-1 p-4 lg:overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudentLayout;
