import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../Images";
import Loading from "../../Loading";
import toast from "react-hot-toast";


const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg m-4 p-4">
      {/* <Images thumbnail={course.thumbnail} className="w-full h-52 rounded-2xl" /> */}
      <img src="https://api.zenstudy.in/zenstudy/api/image/getimage/1723639706328-POLITY%20THUMBNAIL.webp" alt="Thumbnail" className="w-full h-52 rounded-2xl" />

      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2 h-20 text-blue-600">
          {course.title}
        </div>
        {
          //  <p className="text-gray-700 text-base">{course.tutor}</p>
        }
        <p className="text-gray-600 text-xs">Created at - {formatDate(course.createdAt)}</p>
      </div>
      <div className=" flex flex-row px-6 pt-4 pb-2 justify-between items-center border-t-2">
        <p className="text-blue-600 font-bold text-2xl">₹ {course.price}</p>
        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() =>
            navigate("/course-details", { state: { courseId: course._id } })
          }
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const getOptimizedImageUrl = (thumbnail) => `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${thumbnail}?size=large`;
const getImageUrl = (thumbnail) => {
  const encodedThumbnail = encodeURIComponent(thumbnail);
  return `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${encodedThumbnail}`;
};

const CoursesNew = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("course", courses)
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
        ////console.log("Course_data", data)
        setCourse(data.map(course => ({
          ...course,
          //imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`
          imageUrl: getOptimizedImageUrl(course.thumbnail)
        })));
        // setCourse(data);
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
    return <Loading />
  }
  return (
    <div className="container mx-auto p-4">
      {courses.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl  h-screen text-gray-500">No courses found...</div>
      ) : (
        <Fragment>
          {" "}
          <div className="flex flex-wrap justify-center">
            {courses &&
              courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};


export default CoursesNew;