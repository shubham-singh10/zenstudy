import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationNew from "../../components/pagination/PaginationNew";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const courseId = course.course_id._id;

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/course/${courseId}/getReviews`
        );
        // console.log('Response: ', response.data)
        setAverageRating(response.data.averageRating);
        setReviewsCount(response.data.reviews.length);
      } catch (error) {
        console.log("Error fetching reviews");
      }
    };

    fetchAverageRating();
  }, [courseId]);

  const isLiveClass = course?.course_id?.tags === "live";

  const handleLiveClassClick = () => {
    if (isLiveClass) {
      setShowModal(true);
    } else {
      navigate(`/watch-course/${course._id}`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/liveClass");
  };

  return (
    <div className="max-w-xs space-y-4 rounded overflow-hidden shadow-lg p-4 bg-white">
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
          className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => {
            setLoading(false);
            setImageSrc(course.imageUrl);
          }}
        />
      </div>
      <div className="flex justify-between items-center gap-2 px-4 py-2 border-b-2">
        <span className="text-sm font-bold">{course.course_id.title}</span>
        <span className="text-sm px-2 py-1 bg-gray-400 text-white rounded-full">
          {course.course_id.language.name}
        </span>
      </div>

      <div className=" text-center flex gap-2 items-center justify-around ">
        <button className="custom-btn" onClick={handleLiveClassClick}>
          <span className="custom-btn-bg"></span>
          <span className="custom-btn-text text-sm">
            {isLiveClass ? "Visit Live" : "Continue Learning"}
          </span>
        </button>

        {isLiveClass && (
          <button
            className={`${
              (course?.course_id?.modules).length <= 0
                ? "bg-red-500 cursor-not-allowed text-white px-4 py-2 rounded-full"
                : "custom-btn"
            }`}
            disabled={(course?.course_id?.modules).length <= 0}
            onClick={() => navigate(`/watch-course/${course._id}`)}
          >
            <span
              className={`${
                (course?.course_id?.modules).length <= 0 ? "" : "custom-btn-bg"
              }`}
            ></span>
            <span
              className={`${
                (course?.course_id?.modules).length <= 0
                  ? "text-white"
                  : "custom-btn-text"
              } text-sm`}
            >
              Recorded
            </span>
          </button>
        )}
        {/* Modal for live class info */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <p className="text-lg font-bold mb-4">
                Mentorship is available via WhatsApp, and we'll add you soon.
                Check the live class page for upcoming sessions
              </p>
              <button className="custom-btn" onClick={handleModalClose}>
                <span className="custom-btn-bg"></span>
                <span className="custom-btn-text">OK</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MyCourses = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemperpage = 6;
  const [searchText, setSearchText] = useState("");
  const token = Cookies.get("access_tokennew");
  let userId = null;
  if (token) {
    try {
      userId = token;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  useEffect(() => {
    const getcourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/payment/purchaseCourse`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );

        if (response.status === 204) {
          setCourse([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        //console.log("Purchase_course", data)
        const filteredCourses = data.purchaseCourses.filter(
          (purchase) => purchase.course_id !== null
        );
        if (filteredCourses.length === 0) {
          setCourse([]);
        } else {
          const coursesWithImageUrls = filteredCourses.map((purchase) => ({
            ...purchase,
            imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${purchase.course_id.thumbnail}`, // Assuming `thumbnail` is a property of `course_id`
          }));
          setCourse(coursesWithImageUrls);
        }
        setLoading(false);
      } catch (error) {
        //console.log("Error:", error);
        setLoading(false);
      }
    };

    getcourse();
  }, [userId]);

  const filteredData = courses.filter((course) => {
    const titleMatch = course.course_id?.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return titleMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
      </div>
    );
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemperpage,
    currentPage * itemperpage
  );

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-4">
      {courses.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl  text-gray-500">
          No courses found...
        </div>
      ) : (
        <Fragment>
          <div className="flex items-center justify-center bg-gray-100 border border-gray-300 shadow-sm rounded-full px-4 py-2 mb-4 w-full md:w-1/2 lg:w-1/2">
            <input
              type="text"
              placeholder="Search for a course by title"
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent flex-grow focus:outline-none text-gray-700 placeholder-gray-500 px-2"
            />
            <button
              className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6">
            {paginatedData.length > 0 ? (
              <>
                {/* Display Course Cards */}
                <div className="flex flex-wrap justify-center gap-10">
                  {paginatedData.map((course, index) => (
                    <CourseCard key={index} course={course} />
                  ))}
                </div>

                {/* Show Pagination Only When There Are Courses */}
                <PaginationNew
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  data={filteredData}
                  itemsPerPage={itemperpage}
                />
              </>
            ) : (
              // Show "No courses found" message
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-gray-700 animate-bounce">
                  No courses match your search.
                </h2>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};
export default MyCourses;
