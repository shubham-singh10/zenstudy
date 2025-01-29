import React, { useEffect, useState, Fragment } from "react";
import Loading from "../../Loading";
import toast from "react-hot-toast";
import CommonCard from "../CommonCard";
import { FaSearch } from "react-icons/fa";
import Pagination from "../pagination/Pagination";
import { Loader } from "../loader/Loader";
import debounce from "lodash.debounce"; // Add lodash debounce for optimized search
import axios from "axios";
import { useAuth } from "../../context/auth-context";

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [tabName, setTabName] = useState([]);
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
  const [activeTab, setActiveTab] = useState(null);
  const {user} = useAuth()

  // Debounced search handler to reduce API calls
  const handleSearchChange = debounce((value) => {
    setSearchText(value);
    setPaginatedData((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
  }, 500); // Adjust debounce delay to your preference

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPaginatedData({...paginatedData, currentPage: 1})
  };
  

  const setCurrentPage = (newPage) => {
    setPaginatedData((prev) => ({ ...prev, currentPage: newPage }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/main/getCategoryId/6788dbd2ec52e9b8545ad6f4`
        );
        setTabName(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let api;
    if (user) {
      api = `fetchPurchaseCoursesWithFilters/${user?._id}?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchText}&catId=${activeTab}`;
    } else {
      api = `fetchCoursesWithFilters?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchText}&catId=${activeTab}`;
    }

    const getCourse = async () => {
      setLoading((prev) => ({ ...prev, paginationLoading: true }));

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
  }, [paginatedData.currentPage, searchText, paginatedData.itemperpage, activeTab, user]); // Dependent on both currentPage and searchText

  if (loading.mainLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-around justify-arround  gap-4 items-center my-10 space-y-4 md:space-y-0">
        {/* Tab System */}
        <div className="flex shadow-xl py-2 px-10 rounded-lg space-x-4 border-2 border-blue-600 pb-2 ">
          <button
            onClick={() => handleTabClick(null)}
            className={`flex items-center space-x-2 px-4 py-1 rounded-t-md transition duration-200 ${
              activeTab === null
                ? "text-blue-600 border-b-4 rounded-lg border-blue-600 font-bold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <span>All</span>
          </button> 

          {tabName.map((tab) => (
            <button
              key={tab._id}
              onClick={() => handleTabClick(tab._id)}
              className={`flex items-center space-x-2 px-4 py-1 rounded-t-md transition duration-200 ${
                activeTab === tab._id
                  ? "text-blue-600 border-b-4 rounded-lg border-blue-600 font-bold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-center bg-gray-100 border border-gray-300 shadow-sm rounded-full px-4 py-3 lg:py-1.5 w-[90%] md:w-[60%] lg:w-[40%]">
          <input
            type="text"
            placeholder="Search a course by title"
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-transparent flex-grow focus:outline-none text-gray-700 placeholder-gray-500 px-2"
          />
          <button className="flex items-center justify-center w-6 h-6 lg:w-10 lg:h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      {
        //      <div className="mt-4">
        //    {activeTab === "All" && <p>All Courses Content</p>}
        //    {activeTab === "Batches" && <p>Batches Content</p>}
        //    {activeTab === "Recorded" && <p>Recorded Content</p>}
        //  </div>
      }

      {courses.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl h-screen text-gray-500">
          No courses found...
        </div>
      ) : loading.paginationLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader fill="black" />
        </div>
      ) : (
        <Fragment>
          <div className="flex flex-wrap justify-center">
            {courses.map((course, index) => (
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
      )}
    </div>
  );
};

export default Courses;
