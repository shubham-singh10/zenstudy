import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CourseCard = ({ course }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    return (
        <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg m-4 p-4">
            <img
                className="w-full h-52 rounded-2xl"
                src={course.image}
                alt="Course "
            />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-blue-600">{course.title}</div>
                <p className="text-gray-700 text-base">{course.tutor}</p>
                <p className="text-gray-600">{formatDate(course.createdAt)}</p>
                <p className="text-gray-600">{course.day}</p>

            </div>
            <div className=" flex flex-row px-6 pt-4 pb-2 justify-between items-center">
                <p className="text-blue-600 font-bold text-2xl">₹{course.price}</p>
                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
                    View Details
                </button>
            </div>
        </div>
    );
};

const Courses = () => {
    const [courses, setCourse] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const getcourse = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API2}zenstudy/api/course`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                //console.log("Course_data", data)
                setCourse(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }


        getcourse()
    }, [])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
    }

    if (error) {
        navigate(0)
        return <div className="flex items-center justify-center h-screen">
            <div className="text-4xl font-bold text-red-600"> Error: {error.message}. Please refresh the page.</div>
        </div>;
    }
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center">
                {courses && courses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>
        </div>
    );
};


export default Courses;


