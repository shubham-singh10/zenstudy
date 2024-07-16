import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { GrLanguage } from "react-icons/gr";
import { useLocation, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
    const [coursePost, setCoursePost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const location = useLocation()
    const { courseId } = location.state || {}
    // Perticular Course get data API
    useEffect(() => {

        const getCourse = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API2}zenstudy/api/course/coursedetail/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Course_data", data);
                setCoursePost(data.coursedetail);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        getCourse()

    }, [courseId])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-4xl font-bold text-red-600"> Error: Please refresh the page.</div>
        </div>;
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="">
            <div className="p-4 lg:p-12 bg-blue-100 w-full md:p-8 rounded-md flex flex-col justify-start items-start">
                <button
                    className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4 flex items-center lg:-mt-10 md:-mt-6 sm:mt-0'
                    onClick={() => navigate(-1)}
                >
                    <FiArrowLeft className='w-5 h-5 mr-2' />
                    Back
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                        {coursePost?.title}
                    </h1>
                    <p className="mt-2 md:mt-4 text-sm md:text-base">
                        {coursePost?.content}
                    </p>
                    <div className="flex items-center mt-4">
                        <div className="flex items-center mr-4">
                            <GrLanguage />
                            <span className="ml-2">Hindi, English</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" p-4 md:p-12 lg:p-12 mt-8 flex flex-col md:flex-row lg:flex-row gap-1 md:gap-4 lg:gap-56">
                <div className=' border-l-8 border-blue-600 p-8'>
                    <h2 className="text-lg md:text-xl font-bold">About Course</h2>
                    <ul className="mt-4 space-y-2 flex flex-col gap-4">
                        <li className="flex items-start">
                            Lorem Ipsum has been the industry's standard dummy text
                        </li>
                        <li className="flex items-start">
                            Lorem Ipsum has been the industry's standard dummy text
                        </li>
                        <li className="flex items-start">
                            Lorem Ipsum has been the industry's standard dummy text
                        </li>
                        <li className="flex items-start">
                            Lorem Ipsum has been the industry's standard dummy text
                        </li>
                        <li className="flex items-start">
                            Lorem Ipsum has been the industry's standard dummy text
                        </li>
                    </ul>
                </div>
                <div className="bg-white justify-center items-center max-w-sm  mt-[20px] md:mt-[-80px] lg:mt-[-120px] relative rounded-2xl overflow-hidden shadow-lg m-4 p-4">
                    <img
                        className="w-full h-52 rounded-2xl"
                        src={coursePost?.image}
                        alt={coursePost?.title}
                    />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-blue-600">{coursePost?.title}</div>
                        <p className="text-gray-700 text-base">Tutor</p>
                        <p className="text-gray-600">created at- {formatDate(coursePost?.createdAt)}</p>
                        <p className="text-gray-600">course day</p>


                    </div>
                    <div className=" flex flex-row px-6 pt-4 pb-2 justify-between items-center">
                        <p className="text-blue-600 font-bold text-2xl">₹ {coursePost?.price}</p>
                        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>


            <div className="p-2 md:p-12 lg:p-12 bg-blue-100 ">
                {Array(3).fill("Module Title").map((title, index) => (
                    <details key={index} className="mb-4 bg-white rounded-2xl shadow overflow-hidden">
                        <summary className="flex items-center p-4 cursor-pointer">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-4" />

                            <span className="flex-1 font-semibold">{title}</span>
                            <div className="transform rotate-0 transition-transform">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </summary>
                        <div className="p-4">
                            <p>Module content goes here.</p>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};


export default CourseDetail;
