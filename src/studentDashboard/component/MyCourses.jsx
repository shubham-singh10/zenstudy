import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PaginationNew from '../../components/pagination/PaginationNew';
import { FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

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
    const courseId = course.course_id._id
    const [reviewsCount, setReviewsCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API2}zenstudy/api/course/${courseId}/getReviews`);
                // console.log('Response: ', response.data)
                setAverageRating(response.data.averageRating);
                setReviewsCount(response.data.reviews.length);
            } catch (error) {
                console.log("Error fetching reviews");
            }
        };

        fetchAverageRating();
    }, [courseId]);

    return (
        <div className="max-w-xs space-y-2 rounded overflow-hidden shadow-lg p-4 bg-white">
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
            <div className="px-4 py-2 border-b-2">
 
                <div className="font-bold text-lg h-auto mb-1">{course.course_id.title}</div>
          
                <p className="text-gray-600 text-xs">Created at: {formatDate(course.course_id.createdAt)}</p>
                <p className="text-gray-600 text-xs">{course.course_id.day}</p>

                <div className="flex items-center space-x-1 mt-1">
                {/* <span className="text-lg font-semibold text-yellow-500">{averageRating?.toFixed(1)} / 5</span> */}
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => {
                        const fullStars = Math.floor(averageRating);
                        const hasHalfStar = averageRating % 1 !== 0;

                        if (index < fullStars) {
                            // Full star
                            return (
                                <svg key={index} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
                                </svg>
                            );
                        } else if (index === fullStars && hasHalfStar) {
                            // Half star
                            return (
                                <svg key={index} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <defs>
                                        <linearGradient id="half">
                                            <stop offset="50%" stopColor="currentColor" />
                                            <stop offset="50%" stopColor="lightGray" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z"
                                        fill="url(#half)"
                                    />
                                </svg>
                            );
                        } else {
                            // Empty star
                            return (
                                <svg key={index} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.118 3.43a1 1 0 00.95.69h3.584c.969 0 1.371 1.24.588 1.81l-2.897 2.11a1 1 0 00-.364 1.118l1.118 3.43c.3.921-.755 1.688-1.54 1.118l-2.897-2.11a1 1 0 00-1.176 0l-2.897 2.11c-.784.57-1.838-.197-1.539-1.118l1.118-3.43a1 1 0 00-.364-1.118l-2.897-2.11c-.783-.57-.38-1.81.588-1.81h3.584a1 1 0 00.95-.69l1.118-3.43z" />
                                </svg>
                            );
                        }
                    })}
                </div>
                <div className=" text-gray-500 text-xs ">{averageRating}/5 ({reviewsCount} reviews)</div>
            </div>
        
       

            </div>
            <div className="px-4">
                <button className="bg-blue-600 text-sm hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded-full" onClick={() => navigate(`/watch-course/${course._id}`)}>Continue Learning</button>
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