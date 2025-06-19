import { useEffect, useState, Fragment } from "react";
import toast from "react-hot-toast";
import CommonCard from "../CommonCard";
import { FaSearch } from "react-icons/fa";
import Pagination from "../pagination/Pagination";
import debounce from "lodash.debounce";
import axios from "axios";
import { useAuth } from "../../context/auth-context";
import CourseCardSkeleton from "./course-card-skeleton";
import ResourceSkeleton from "../../studentDashboard/components/free-resources/resource-skeleton";

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
  const [contentVisible, setContentVisible] = useState(false);
  const { user } = useAuth();

  // Debounced search handler to reduce API calls
  const handleSearchChange = debounce((value) => {
    setSearchText(value);
    setPaginatedData((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
  }, 500);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPaginatedData({ ...paginatedData, currentPage: 1 });
  };

  const setCurrentPage = (newPage) => {
    setPaginatedData((prev) => ({ ...prev, currentPage: newPage }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}zenstudy/api/main/getCategoryId/6788dbd2ec52e9b8545ad6f4`
        );
        setTabName(response.data.data);
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let api;
    if (user) {
      api = `fetchPurchaseCoursesWithFilters/${user?._id}?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchText}&catId=${activeTab === "Free Courses" ? null : activeTab}&isFree=${activeTab === "Free Courses" && true}`;
    } else {
      api = `fetchCoursesWithFilters?page=${paginatedData.currentPage}&limit=${
        paginatedData.itemperpage
      }&search=${searchText}&catId=${activeTab === "Free Courses" ? null : activeTab}&isFree=${
        activeTab === "Free Courses" && true
      }`;
    }

    const getCourse = async () => {
      setLoading((prev) => ({ ...prev, paginationLoading: true }));
      setContentVisible(false);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API2}zenstudy/api/course/${api}`,
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
          setTimeout(() => {
            setContentVisible(true);
          }, 300);
          return;
        }

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const mainData = data.courses;

        console.log("Fetched courses:", mainData);
        const metaData = data.meta;
        setPaginatedData((prev) => ({ ...prev, totalData: metaData.total }));

        // Process the course data
        const processedCourses = mainData.map((course) => ({
          ...course,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`,
        }));

        setCourse(mainData);
        setLoading({ mainLoading: false, paginationLoading: false });

        // Add a small delay before showing content for a smoother transition
        setTimeout(() => {
          setContentVisible(true);
        }, 300);
      } catch (error) {
        toast.error(`Oops!! Something went wrong`, { position: "top-center" });
        console.log(error);
        setLoading({ mainLoading: false, paginationLoading: false });
        setTimeout(() => {
          setContentVisible(true);
        }, 300);
      }
    };

    getCourse();
  }, [
    paginatedData.currentPage,
    searchText,
    paginatedData.itemperpage,
    activeTab,
    user,
  ]);

  if (loading.mainLoading) {
    return (
      <div className=" px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ResourceSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-around justify-arround mx-2 gap-4 items-center my-10 space-y-4 md:space-y-0">
        {/* Tab System */}
        <div className="flex shadow-xl py-2 lg:px-10 px-2 space-x-2 rounded-lg lg:space-x-4 border-2 border-[#543a5d] pb-2 overflow-x-auto">
          {/* Static Tabs */}
          {["All", "Free Courses"].map((item) => (
            <button
              key={item}
              onClick={() => handleTabClick(item === "All" ? null : item)}
              className={`flex items-center space-x-2 px-4 py-1 rounded-t-md transition duration-200 ${
                activeTab === (item === "All" ? null : item)
                  ? "textPurple border-b-4 rounded-lg border-[#543a5d] font-bold"
                  : "text-gray-600 hover:text-[#543a5d]"
              }`}
            >
              <span>{item}</span>
            </button>
          ))}

          {/* Dynamic Tabs */}
          {tabName.map((tab) => (
            <button
              key={tab._id}
              onClick={() => handleTabClick(tab._id)}
              className={`flex items-center space-x-2 px-4 py-1 rounded-t-md transition duration-200 ${
                activeTab === tab._id
                  ? "textPurple border-b-4 rounded-lg border-[#543a5d] font-bold"
                  : "text-gray-600 hover:text-[#543a5d]"
              }`}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-row items-center justify-center bg-gray-100 border border-[#543a5d] shadow-sm rounded-full px-3 sm:px-4 py-2 sm:py-3 lg:py-1.5 w-full xs:w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] min-w-[250px]">
          <input
            type="text"
            placeholder="Search a course"
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-transparent flex-grow focus:outline-none text-gray-700 placeholder-gray-500 px-2 text-sm sm:text-base w-0 min-w-0"
          />
          <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bgGredient-purple text-white rounded-full hover:bg-[#80588d] transition duration-200">
            <FaSearch />
          </button>
        </div>
      </div>

      {loading.paginationLoading ? (
        <div className="flex flex-wrap justify-center transition-opacity duration-500 ease-in-out">
          <CourseCardSkeleton count={paginatedData.itemperpage} />
        </div>
      ) : courses.length === 0 ? (
        <div
          className={`flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl h-96 text-gray-500 transition-opacity duration-500 ease-in-out ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          No courses found...
        </div>
      ) : (
        <Fragment>
          <div
            className={`flex flex-wrap justify-center transition-opacity duration-500 ease-in-out ${
              contentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {courses.map((course, index) => (
              <CommonCard
                key={index}
                course={course}
                link={"course-details"}
                linknew={"courseDetailslive"}
                mentorLink={"courseDetailNew"}
              />
            ))}
          </div>
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              contentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Pagination
              data={paginatedData.totalData}
              setCurrentPage={setCurrentPage}
              currentPage={paginatedData.currentPage}
              itemsPerPage={paginatedData.itemperpage}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Courses;
