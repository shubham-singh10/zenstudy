import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PaginationNew from '../../components/pagination/PaginationNew';
import { FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';

const CourseCard = ({ course }) => {
    const navigate = useNavigate()
    const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
    const [loading, setLoading] = useState(true);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg p-4 bg-white">
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-2xl">
                        <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
                    </div>
                )}
                <img
                    src={imageSrc}
                    crossOrigin="anonymous"
                    alt={course.course_id.title}
                    className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => {
                        setLoading(false);
                        setImageSrc(course.imageUrl);
                    }}
                />
            </div>
            <div className="px-4 py-2 h-24 border-b-2">
                <div className="font-bold text-lg h-auto mb-1">{course.course_id.title}</div>
                <p className="text-gray-600 text-xs">Created at: {formatDate(course.course_id.createdAt)}</p>
                <p className="text-gray-600 text-xs">{course.course_id.day}</p>
            </div>
            <div className="px-4 pt-2 pb-2">
                <button className="bg-blue-600 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded-full" onClick={() => navigate(`/watch-course/${course._id}`)}>Continue Learning</button>
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
                const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/payment/purchaseCourse`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: userId })
                });
                if (response.status === 204) {
                    setCourse([]);
                    setLoading(false);
                    return;
                }


                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                //console.log("Purchase_course", data)
                const filteredCourses = data.purchaseCourses.filter(purchase => purchase.course_id !== null);
                if (filteredCourses.length === 0) {
                    setCourse([]);
                } else {
                    const coursesWithImageUrls = filteredCourses.map(purchase => ({
                        ...purchase,
                        imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${purchase.course_id.thumbnail}` // Assuming `thumbnail` is a property of `course_id`
                    }));
                    setCourse(coursesWithImageUrls);
                }
                setLoading(false);
            } catch (error) {
                //console.log("Error:", error);
                setLoading(false);
            }
        }


        getcourse()
    }, [userId])


    const filteredData = courses.filter((course) => {
        const titleMatch = course.course_id?.title.toLowerCase().includes(searchText.toLowerCase());
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
        <div className='container mx-auto p-4 flex flex-col items-center gap-4'>
            {courses.length === 0 ? (
                <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl  text-gray-500">No courses found...</div>
            ) : (
                <Fragment>
                    <div className="flex items-center  justify-center bg-blue-100 rounded-full px-4 py-2 mb-4 w-full md:w-1/2 lg:w-1/2 ">
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
                    <div className="flex flex-wrap justify-center gap-10">
                        {paginatedData.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))}
                    </div>
                    <PaginationNew
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        data={filteredData}
                        itemsPerPage={itemperpage}
                    />
                </Fragment>
            )}
        </div>
    )
}
export default MyCourses