import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { useAuth } from "../../context/auth-context";
import PaginationNew from "../../components/pagination/PaginationNew";
import Loading from "../../Loading";
import { FaPlay, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyPurchaseCourse = () => {
    const [courses, setCourses] = useState({ recorded: [], live: [] });
    const [loading, setLoading] = useState(true);
    const [currentRecordedPage, setCurrentRecordedPage] = useState(1);
    const [currentLivePage, setCurrentLivePage] = useState(1);
    const itemperpage = 6;
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        const getcourse = async () => {

            if (!user?._id) return;
            
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API}zenstudy/api/payment/purchaseCourse`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_id: user?._id }),
                    }
                );

                if (response.status === 204) {
                    setCourses({ recorded: [], live: [] });
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                console.log("Data: ", data);
                if (data.message === "Done") {
                    const coursesWithImageUrls = data.purchaseCourses.map((purchase) => ({
                        ...purchase,
                        imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${purchase.thumbnail}`,
                    }));

                    setCourses({
                        recorded: coursesWithImageUrls.filter((course) => course.tags === "notlive"),
                        live: coursesWithImageUrls.filter((course) => course.tags === "live"),
                    });
                } else {
                    setCourses({ recorded: [], live: [] });
                }

                setLoading(false);
            } catch (error) {
                console.log("Error: ", error);
                setLoading(false);
            }
        };

        getcourse();
    }, [user]);

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
    };

    const getFilteredAndSortedCourses = (courseList) => {
        return courseList
            .filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === "title") {
                    return sortOrder === "asc"
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                }
                return 0;
            });
    };

    const handleSearch = (search) => {
        setCurrentLivePage(1)
        setCurrentRecordedPage(1)
        setSearchTerm(search)
    }
    const handleRecordedLectureClick = (course) => {
        if (course?.title.toLowerCase().includes("mentorship")) {
            Swal.fire({
                title: "Mentorship is available via WhatsApp!",
                text: "We'll add you soon.",
                icon: "info",
                confirmButtonText: "Close",
                customClass: {
                    confirmButton: "bg-blue-600 hover:bg-blue-700",
                },
            });
        } else {
            navigate("/liveClass"); // Navigate to live class if title is not "Mentorship"
        }
    };
    const getPaginatedCourses = (courseList, currentPage) => {
        const indexOfLastItem = currentPage * itemperpage;
        const indexOfFirstItem = indexOfLastItem - itemperpage;
        return courseList.slice(indexOfFirstItem, indexOfLastItem);
    };

    const renderCourseGrid = (courseList) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
            {courseList.map((course) => (
                <div
                    key={course._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="relative pb-[56.25%]">
                        <img
                            src={course?.imageUrl || "/assets/upcoming.webp"}
                            crossOrigin="anonymous"
                            alt={course?.title}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                        />
                    </div>
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{course?.title}</h2>
                        <p className="text-gray-600 mb-4">{course?.language.name}</p>
                        {course?.tags === "live" ? (
                            <div className="flex gap-2">
                                <button
                                    className="flex items-center justify-center w-1/2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                                    onClick={() => handleRecordedLectureClick(course)}
                                >
                                    <FaVideo className="mr-2" /> Visit Live Class
                                </button>
                                <button
                                    className={`flex items-center justify-center w-1/2 ${course?.modules?.length <= 0 ? "bg-red-400 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 px-4 rounded-lg transition-colors`}
                                    disabled={(course?.modules).length <= 0}
                                    onClick={() => navigate(`/watch-course/${course._id}`)}
                                >
                                    <FaPlay className="mr-2" /> Recorded Lecture
                                </button>
                            </div>
                        ) : (
                            <button
                                className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => navigate(`/watch-course/${course._id}`)}
                            >
                                <FaPlay className="mr-2" /> Continue Learning
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Purchased Courses</h1>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleSort("title")}
                            className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                        >
                            Title
                            {sortBy === "title" && (sortOrder === "asc" ? <RiSortAsc size={20} /> : <RiSortDesc size={20} />)}
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Recorded Courses</h2>
                        {getFilteredAndSortedCourses(courses.recorded).length === 0 ? (
                            <p className="text-center text-gray-500 text-lg py-10">No recorded courses found</p>
                        ) : (
                            renderCourseGrid(getPaginatedCourses(getFilteredAndSortedCourses(courses.recorded), currentRecordedPage))
                        )}
                        <PaginationNew
                            setCurrentPage={setCurrentRecordedPage}
                            currentPage={currentRecordedPage}
                            data={getFilteredAndSortedCourses(courses.recorded)}
                            itemsPerPage={itemperpage}
                        />
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Live Courses</h2>
                        {getFilteredAndSortedCourses(courses.live).length === 0 ? (
                            <p className="text-center text-gray-500 text-lg py-10">No live courses found</p>
                        ) : (
                            renderCourseGrid(getPaginatedCourses(getFilteredAndSortedCourses(courses.live), currentLivePage))
                        )}
                        <PaginationNew
                            setCurrentPage={setCurrentLivePage}
                            currentPage={currentLivePage}
                            data={getFilteredAndSortedCourses(courses.live)}
                            itemsPerPage={itemperpage}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MyPurchaseCourse;
