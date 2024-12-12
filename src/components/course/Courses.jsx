import React, { useEffect, useState, Fragment } from "react";
import Loading from "../../Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import CommonCard from "../CommonCard";
import { FaSearch } from "react-icons/fa";


const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemperpage = 100;
const[searchText, setSearchText] = useState("");

  useEffect(() => {
    const userId = Cookies.get("access_tokennew");
    let api;
    if (userId) {
      api = `getCoursesPurc/${userId}`;
    } else {
      api = "getCoursesP";
    }
    const getcourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/${api}`,
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
        // console.log("Course_data", data)
        // setCourse(data);
        setCourse(
          data.map((course) => ({
            ...course,
            imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`,
          }))
        );
        setLoading(false);
      } catch (error) {
        toast.error(`Oops!! Something went wrong`, {
          position: "top-center",
        });
        setLoading(false);
      }
    };
    getcourse();
  }, []);

console.log(courses);

  const filteredData = courses.filter((course) => {
    const titleMatch = course.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return titleMatch;
  });


  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemperpage,
    currentPage * itemperpage
  );

  if (loading) {
    return <Loading />;
  }


  return (
    <div className="container mx-auto p-4">
    <div className="flex justify-center">
          <div className="flex items-center justify-center bg-gray-100 border border-gray-300 shadow-sm rounded-full px-4 py-2 mb-4 w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search for a course by title"
            onChange={(e)=>setSearchText(e.target.value)}
            className="bg-transparent flex-grow focus:outline-none text-gray-700 placeholder-gray-500 px-2"
          />
          <button
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>
        </div>
        
      {paginatedData.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl  h-screen text-gray-500">
          No courses found...
        </div>
      ) : (
        <Fragment>
          {" "}
          <div className="flex flex-wrap justify-center">
            {paginatedData &&
              paginatedData.map((course, index) => (
                <CommonCard key={index} course={course} link={"course-details"} />
              ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Courses;
