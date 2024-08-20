import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationNew from "../../components/pagination/PaginationNew";
import { FaSearch } from "react-icons/fa";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(`/assets/upcoming.webp`);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  const isUpcoming = course.other1 === "upcoming";
  return (
    <div className="max-w-xs rounded-2xl overflow-hidden shadow-lg m-4 p-4">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-2xl">
            <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
          </div>
        )}
        <img
          src={imageSrc}
          crossOrigin="anonymous"
          alt="Thumbnail"
          className={`w-full h-52 rounded-2xl transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => {
            setLoading(false);
            setImageSrc(course.imageUrl);
          }}
        />
      </div>

      <div className="px-6 py-4">
        <div className="font-bold text-lg h-20 mb-1 text-blue-600">
          {course.title}
        </div>

        {isUpcoming ? (
          <p className="text-gray-600 text-md mt-2">Expected: October 2024</p>
        ) : (<p className="text-gray-600 text-md">
          Created at: {formatDate(course.createdAt)}
        </p>)}
      </div>
      <div className="flex flex-row px-6 pt-4 pb-2 justify-between items-center border-t-2">
        <p className="text-blue-600 font-bold text-2xl">₹ {course.price}</p>
        {isUpcoming ? (
          <p className="text-red-600 font-bold">Coming Soon</p>
        ) : (<button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() =>
            navigate("/course-details-view", { state: { courseId: course._id } })
          }
        >
          View Details
        </button>)}
      </div>
    </div>
  );
};


const CourseDeatils = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemperpage = 6;
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    const getcourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/getCoursesP`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
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
        // console.log("Course_data", data);
        // setCourse(data);
        setCourse(data.filter(course => course.other1 !== "upcoming").map(course => ({
          ...course,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`
        })));
        setLoading(false);
      } catch (error) {
        //console.log("Error:", error);
        setLoading(false);
      }
    };


    getcourse();
  }, []);


  const filteredData = courses.filter((course) => {
    const titleMatch = course.title
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
          <div className="flex flex-wrap justify-center">
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
  );
};


export default CourseDeatils;