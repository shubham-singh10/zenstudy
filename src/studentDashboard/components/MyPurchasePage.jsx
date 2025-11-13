import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { useAuth } from "../../context/auth-context";
import PaginationNew from "../../components/pagination/PaginationNew";
import { FaPlay, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ResourceSkeleton from "./free-resources/resource-skeleton";

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
          `${process.env.REACT_APP_API}zenstudy/api/payment/purchaseCourseNew`,
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
        if (data.message === "Done") {
          const coursesWithImageUrls = data.purchaseCourses.map((purchase) => ({
            ...purchase.course,
            paymentId: purchase.paymentId,
            imageUrl: purchase.course.thumbnail || "/assets/upcoming.webp",
          }));

          setCourses({
            recorded: coursesWithImageUrls.filter(
              (course) => course.tags === "notlive"
            ),
            live: coursesWithImageUrls.filter(
              (course) => course.tags === "live"
            ),
          });
        } else {
          setCourses({ recorded: [], live: [] });
        }

        setLoading(false);
      } catch (error) {
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
      .filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
    setCurrentLivePage(1);
    setCurrentRecordedPage(1);
    setSearchTerm(search);
  };
  const handleRecordedLectureClick = (course) => {
    if (course?.title.toLowerCase().includes("mentorship")) {
      Swal.fire({
        title: "Mentorship is available via WhatsApp!",
        text: "We'll add you soon.",
        icon: "info",
        confirmButtonText: "Close",
        customClass: {
          confirmButton: "bgGredient-purple hover:scale-105",
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
          onClick={() => navigate(`/watch-course/${course.paymentId}`)}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-transform duration-300"
        >
          {/* Thumbnail */}
          <div className="relative pb-[56.25%]">
            <img
              src={course?.imageUrl || "/assets/upcoming.webp"}
              crossOrigin="anonymous"
              alt={course?.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold textPurple mb-2 line-clamp-1">
              {course?.title}
            </h2>

            <p className="textGold mb-4 bgGredient-green px-4 text-xs py-1 w-fit rounded-tr-xl rounded-bl-xl">
              {course?.languageName}
            </p>

            {/* Actions */}
            {course?.tags === "live" ? (
              <div
                className="flex gap-2"
                onClick={(e) => e.stopPropagation()} // Prevents triggering card click
              >
                <button
                  className="flex items-center text-xs justify-center w-1/2 bgGredient-green textGold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                  onClick={() => handleRecordedLectureClick(course)}
                >
                  <FaVideo className="mr-2 text-xs" /> Visit Live Class
                </button>

                <button
                  className={`flex items-center text-xs justify-center w-1/2 ${
                    course?.modules?.length <= 0 || course?.modules === undefined
                      ? "bgGredient-purple cursor-not-allowed"
                      : "bgGredient-purple-lr hover:scale-105"
                  } text-white py-2 px-4 rounded-lg transition-transform`}
                  disabled={course?.modules?.length <= 0 || course?.modules === undefined}
                  onClick={() => navigate(`/watch-course/${course.paymentId}`)}
                >
                  <FaPlay className="mr-2 text-xs" />
                  {course?.modules?.length <= 0 || course?.modules === undefined
                    ? "No Recorded Lecture yet"
                    : "Recorded Lecture"}
                </button>
              </div>
            ) : (
              <button
                className="flex items-center justify-center w-full bgGredient-purple-lr text-white py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/watch-course/${course.paymentId}`);
                }}
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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ResourceSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold textPurpleGradient mb-6">
          Your Purchased Courses
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#543a5d]"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleSort("title")}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              Title
              {sortBy === "title" &&
                (sortOrder === "asc" ? (
                  <RiSortAsc size={20} />
                ) : (
                  <RiSortDesc size={20} />
                ))}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold textPurple mb-4">
              Your Recorded Courses
            </h2>
            {getFilteredAndSortedCourses(courses.recorded).length === 0 ? (
              <p className="text-center textdark text-lg py-10">
                No recorded courses found
              </p>
            ) : (
              renderCourseGrid(
                getPaginatedCourses(
                  getFilteredAndSortedCourses(courses.recorded),
                  currentRecordedPage
                )
              )
            )}
            <PaginationNew
              setCurrentPage={setCurrentRecordedPage}
              currentPage={currentRecordedPage}
              data={getFilteredAndSortedCourses(courses.recorded)}
              itemsPerPage={itemperpage}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold textdark mb-4">
              Your Live Courses
            </h2>
            {getFilteredAndSortedCourses(courses.live).length === 0 ? (
              <p className="text-center textdark text-lg py-10">
                No live courses found
              </p>
            ) : (
              renderCourseGrid(
                getPaginatedCourses(
                  getFilteredAndSortedCourses(courses.live),
                  currentLivePage
                )
              )
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
