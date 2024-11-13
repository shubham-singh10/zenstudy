import React, { Fragment, useEffect, useState } from "react";
import PaginationNew from "../../components/pagination/PaginationNew";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import CommonCard from "../../components/CommonCard";

const CourseDeatils = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemperpage = 6;
  const [searchText, setSearchText] = useState("");

  const userId = Cookies.get("access_tokennew")

  useEffect(() => {
    const getcourse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/getCoursesPurc/${userId}`,
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
        //  console.log("Course_data", data);
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
  }, [userId]);


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
              <CommonCard key={index} course={course} link={"course-details-view"}/>
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