import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";
import toast from "react-hot-toast";

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
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg m-4 p-4">
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
        <div className="font-bold text-lg mb-1 text-blue-600">
          {course.title}
        </div>

        {isUpcoming ? (
          <p className="text-gray-600 text-md mt-2">Expected: October 2024</p>
        ) : (<p className="text-gray-600 text-md mt-1">
          Created at: {formatDate(course.createdAt)}
        </p>)}
      </div>
      <div className="flex flex-row px-6 pt-4 pb-2 justify-between items-center border-t-2">
        <p className="text-blue-600 font-bold text-2xl">₹ {course.price}</p>
        {isUpcoming ? (
          <p className="text-red-600 font-bold">Coming Soon</p>
        ) : (<button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() =>
            navigate("/course-details", { state: { courseId: course._id } })
          }
        >
          View Details
        </button>)}
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // console.log("Course_data", data)
        // setCourse(data);
        setCourse(data.map(course => ({
          ...course,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`
        })));
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


export default Courses;