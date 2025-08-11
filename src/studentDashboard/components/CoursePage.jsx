import React from "react";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { useAuth } from "../../context/auth-context";
import Pagination from "../../components/pagination/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResourceSkeleton from "./free-resources/resource-skeleton";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState({
    mainLoading: true,
    paginationLoading: false,
    imageLoading: true,
  });
  const [paginatedData, setPaginatedData] = useState({
    currentPage: 1,
    itemperpage: 6,
    totalData: 0,
  });
  const { user } = useAuth();

  // const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") || "";

  useEffect(() => {
    const getcourse = async () => {
      setLoading((prev) => ({ ...prev, paginationLoading: true }));

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/fetchPurchaseCoursesWithFilters/${user?._id}?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchTerm}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404) {
          setCourses([]);
          setLoading({ mainLoading: false, paginationLoading: false });
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const mainData = data.courses;
        const metaData = data.meta;

        setPaginatedData((prev) => ({ ...prev, totalData: metaData.total }));

        if (mainData.length === 0) {
          setCourses([]);
        } else {
          setTimeout(() => {
            setCourses(
              mainData
                .map((course) => ({
                  ...course,
                  imageUrl: course.thumbnailS3,
                }))
                .sort((a, b) =>
                  sortOrder === "asc" ? a.price - b.price : b.price - a.price
                )
            );
          }, 200);
        }

        setLoading({ mainLoading: false, paginationLoading: false });
      } catch (error) {
        setLoading({ mainLoading: false, paginationLoading: false });
      }
    };

    getcourse();
  }, [
    user,
    paginatedData.currentPage,
    paginatedData.itemperpage,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      params.set("page", "1"); // Reset to first page when searching
      return params;
    });
  };

  const setCurrentPage = (newPage) => {
    setLoading((prev) => ({ ...prev, paginationLoading: true }));
    setPaginatedData((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  if (loading.mainLoading) {
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
          Available Courses
        </h1>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#543a5d]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleSort("price")}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              Price
              {sortBy === "price" &&
                (sortOrder === "asc" ? (
                  <RiSortAsc size={20} />
                ) : (
                  <RiSortDesc size={20} />
                ))}
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
            loading.paginationLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {courses.length === 0 && !loading.mainLoading ? (
            <div className="text-center textdark text-lg py-10">
              No courses found
            </div>
          ) : (
            courses.map((course) => {
              const newPage = course.title?.includes("UPSC Foundation Batch");
              const mentor = course.title?.includes(
                "Personalised Mentorship Programme"
              );
              return (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative"
                  onClick={() =>
                    course.isFree
                      ? navigate(`/watch-course-free/${course._id}`)
                      : newPage
                      ? navigate(
                          `/livecourse-details-student/${course.title.replace(
                            /\s+/g,
                            "-"
                          )}`,
                          { state: { courseId: course._id } }
                        )
                      : mentor
                      ? navigate(
                          `/course-detail-new/${course.title.replace(
                            /\s+/g,
                            "-"
                          )}`,
                          { state: { courseId: course._id } }
                        )
                      : navigate(
                          `/course-details-view/${course.title.replace(
                            /\s+/g,
                            "-"
                          )}`,
                          { state: { courseId: course._id } }
                        )
                  }
                >
                  {loading.imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-2xl">
                      <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                  <img
                    src={course?.imageUrl || "/assets/upcoming.webp"}
                    crossOrigin="anonymous"
                    alt={course?.title}
                    className={`w-full h-48 object-cover transition-opacity duration-500 ${
                      loading.imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setLoading(false)}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold textPurple mb-2">
                      {course?.title}
                    </h2>

                    <div className="flex justify-between items-center mb-4">
                      {course.isFree ? (
                        <p className="px-3 py-1 bg-green-100 text-green-600 font-semibold rounded-full text-sm shadow-sm">
                          Free Course
                        </p>
                      ) : (
                        <span className="text-2xl font-bold textPurple">
                          <span className="line-through text-gray-400 text-sm mr-1">
                            ₹ {course.value}
                          </span>
                          ₹ {course.price}
                          {(course?.title
                            ?.toLowerCase()
                            .includes("personalised mentorship programme") ||
                            course?.title
                              ?.toLowerCase()
                              .includes("upsc foundation batch")) && (
                            <span className="text-xs text-gray-500">
                              /month
                            </span>
                          )}
                        </span>
                      )}

                      <p className="textGold bgGredient-green px-4 py-1 text-xs mb-2 w-fit rounded-tr-xl rounded-bl-xl">
                        {course?.language}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      {course.isFree ? (
                        <button
                          className="flex-1 border border-[#543a5d] textLight bgGredient-purple py-2 px-4 rounded-lg hover:scale-105 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/watch-course-free/${course._id}`);
                          }}
                        >
                          Watch Course
                        </button>
                      ) : newPage ? (
                        <button
                          className="flex-1 border border-[#543a5d] textLight bgGredient-purple py-2 px-4 rounded-lg hover:scale-105 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/livecourse-details-student/${course.title.replace(
                                /\s+/g,
                                "-"
                              )}`,
                              { state: { courseId: course._id } }
                            );
                          }}
                        >
                          View Details
                        </button>
                      ) : mentor ? (
                        <button
                          className="flex-1 border border-[#543a5d] textLight bgGredient-purple py-2 px-4 rounded-lg hover:scale-105 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/course-detail-new/${course.title.replace(
                                /\s+/g,
                                "-"
                              )}`,
                              { state: { courseId: course._id } }
                            );
                          }}
                        >
                          View Details
                        </button>
                      ) : (
                        <button
                          className="flex-1 border border-[#543a5d] textLight bgGredient-purple py-2 px-4 rounded-lg hover:scale-105 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/course-details-view/${course.title.replace(
                                /\s+/g,
                                "-"
                              )}`,
                              { state: { courseId: course._id } }
                            );
                          }}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading.paginationLoading && (
          <Pagination
            data={paginatedData.totalData}
            setCurrentPage={setCurrentPage}
            currentPage={paginatedData.currentPage}
            itemsPerPage={paginatedData.itemperpage}
          />
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
