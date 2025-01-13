import React, { useEffect, useState, Fragment } from "react";
import Loading from "../../Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import CommonCard from "../CommonCard";
import { FaSearch } from "react-icons/fa";
import Pagination from "../pagination/Pagination";
import { Loader } from "../loader/Loader";
import debounce from "lodash.debounce"; // Add lodash debounce for optimized search

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState({
    mainLoading: true,
    paginationLoading: false,
  });
  const [paginatedData, setPaginatedData] = useState({
    currentPage: 1,
    itemperpage: 6,
    totalData: 0,
  });
  const [searchText, setSearchText] = useState("");

  // Debounced search handler to reduce API calls
  const handleSearchChange = debounce((value) => {
    setSearchText(value);
    setPaginatedData((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
  }, 500); // Adjust debounce delay to your preference

  const setCurrentPage = (newPage) => {
    setPaginatedData((prev) => ({ ...prev, currentPage: newPage }));
  };

  useEffect(() => {
    const userId = Cookies.get("access_tokennew");
    let api;
    if (userId) {
      api = `getCoursesPurc/${userId}?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchText}`;
    } else {
      api = `getCoursesPNew?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchText}`;
    }

    const getCourse = async () => {
      setLoading((prev) => ({ ...prev, paginationLoading: true }));

      try {
        const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/course/${api}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          setCourse([]);
          setLoading({ mainLoading: false, paginationLoading: false });
          return;
        }

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const mainData = data.courses;
        const metaData = data.meta;

        setPaginatedData((prev) => ({ ...prev, totalData: metaData.total }));
        setCourse(
          mainData.map((course) => ({
            ...course,
            imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`,
          }))
        );
        setLoading({ mainLoading: false, paginationLoading: false });
      } catch (error) {
        toast.error(`Oops!! Something went wrong`, { position: "top-center" });
        console.log(error);
        
        setLoading({ mainLoading: false, paginationLoading: false });
      }
    };

    getCourse();
  }, [paginatedData.currentPage, searchText, paginatedData.itemperpage]); // Dependent on both currentPage and searchText

  if (loading.mainLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center bg-gray-100 border border-gray-300 shadow-sm rounded-full px-4 py-2 w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search a course by title"
            onChange={(e) => handleSearchChange(e.target.value)} // Debounced search input
            className="bg-transparent flex-grow focus:outline-none text-gray-700 placeholder-gray-500 px-2"
          />
          <button className="flex items-center justify-center w-6 h-6 lg:w-10 lg:h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200">
            <FaSearch />
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl h-screen text-gray-500">
          No courses found...
        </div>
      ) : (
        
          loading.paginationLoading ? (
            <div className="flex justify-center items-center h-96">
            <Loader fill="black" />
            </div>
          ) : (
            <Fragment>
            <div className="flex flex-wrap justify-center">
              { courses.map((course, index) => (
                <CommonCard key={index} course={course} link={"course-details"} />
              ))}
            </div>
            <Pagination
            data={paginatedData.totalData}
            setCurrentPage={setCurrentPage}
            currentPage={paginatedData.currentPage}
            itemsPerPage={paginatedData.itemperpage}
          />

          </Fragment>

          )
         
        
      
      )}

     
    </div>
  );
};

export default Courses;
