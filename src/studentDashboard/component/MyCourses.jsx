import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PaginationNew from '../../components/pagination/PaginationNew';
import { FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';
const CourseCard = ({ course }) => {
    const navigate = useNavigate()
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
                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full" onClick={() => navigate("/course-details-view", { state: { courseId: course._id } })}>
                    View Details
                </button>
            </div>
        </div>
    );
};

const MyCourses = () => {
    const [courses, setCourse] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)
    const itemperpage = 6
    const [searchText, setSearchText] = useState('');
    const token = Cookies.get("access_tokennew");
    let userId = null;

    if (token) {
        try {
            userId = token;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    useEffect(() => {
        const getcourse = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API3}zenstudy/api/payment/purchaseCourse`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({user_id:userId})
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Course_data", data)
                setCourse(data.courses);
                setLoading(false);
            } catch (error) {
                console.log("Error:", error);
                setLoading(false);
            }
        }


        getcourse()
    }, [])

    const filteredData = courses.filter((course) => {
        const titleMatch = course.title.toLowerCase().includes(searchText.toLowerCase());
        return titleMatch;
    });

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
    }

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemperpage,
        currentPage * itemperpage
    )
    return (
        <div className='container mx-auto p-4'>
            <div className="flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4 w-full md:w-1/2 lg:w-1/2 ">
                    <input
                        type="text"
                        placeholder="Search Our course by title"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="bg-blue-100 rounded-l-full focus:outline-none  py-2 w-full text-gray-700"
                    />
                    <button className="text-blue-500">
                        <FaSearch /> 
                    </button>
                </div>
            <div className="flex flex-wrap justify-center">
                {paginatedData && paginatedData.map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>
            <PaginationNew
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                data={filteredData}
                itemsPerPage={itemperpage}

            />
        </div>
    )
}

export default MyCourses