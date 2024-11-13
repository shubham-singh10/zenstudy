import React, { useEffect, useState, Fragment } from "react";
import Loading from "../../Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import CommonCard from "../CommonCard";

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto p-4">
      {courses.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl  h-screen text-gray-500">
          No courses found...
        </div>
      ) : (
        <Fragment>
          {" "}
          <div className="flex flex-wrap justify-center">
            {courses &&
              courses.map((course, index) => (
                <CommonCard key={index} course={course} link={"course-details"} />
              ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Courses;
