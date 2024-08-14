<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import he from "he";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Images from "../Images";
const CourseDetailsView = () => {
  const [coursePost, setCoursePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payloading, setPayLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = location.state || {};
  const [currentUser, setCurrentUser] = useState(false);
=======
// src/components/Courses.js
import React, { useMemo, useCallback } from "react";
import { useGetCoursesQuery } from "../../api/apiSlice";
>>>>>>> 12c4cf3092af5d7413b9f3f11444c62a34077f1a

const Courses = () => {
  const { data: courses = [], error, isLoading } = useGetCoursesQuery();

  // Memoize courses data to avoid unnecessary re-renders
  const memoizedCourses = useMemo(() => courses, [courses]);

  // Handle view details click
  const handleViewDetails = useCallback((courseId) => {
    // Replace with your navigation logic
    alert(`Viewing details for course ${courseId}`);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold text-red-600">
          Error: {error.message}. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {memoizedCourses.length === 0 ? (
        <div className="flex text-center justify-center items-center text-2xl md:text-3xl lg:text-4xl h-screen text-gray-500">
          No courses found...
        </div>
<<<<<<< HEAD
      </div>
      <div className="p-4 md:p-12 lg:p-12 mt-8 flex flex-col md:flex-row lg:flex-row gap-1 md:gap-4 lg:gap-10 md:items-center lg:items-start items-center">
        <div className=" border-l-8 border-blue-600 p-2  w-full md:w-1/2 lg:w-2/3">
          <h2 className="text-lg md:text-xl font-bold">About Course</h2>
          <ul className="mt-4 space-y-2 flex flex-col gap-4">
            <li className="flex items-start text-justify">
              Scoring well in the UPSC mains exam requires a strategic approach,
              and understanding the importance of previous years' questions
              (PYQs) is crucial. PYQs help you identify the patterns, trends,
              and types of questions frequently asked, which can guide your
              preparation and focus on key areas. Developing the ability to
              write effective answers, even with limited information, is
              essential to maximize your marks. This skill helps you demonstrate
              a comprehensive understanding of the subject and meet the exam's
              demands.
            </li>
            <li className="flex items-start text-justify">
              Our course offers detailed explanations of PYQs, teaching you how
              to tackle various question types and structure your answers
              effectively. Mains performance is critical for making it onto the
              list, while the interview stage determines your final rank. By
              joining our course, you'll gain insights into the nuances of the
              exam and learn how to address the questions holistically, ensuring
              you cover every aspect and increase your chances of success.
            </li>
          </ul>
        </div>

        <div className="bg-white justify-center items-center max-w-sm  mt-[20px] md:mt-[-80px] lg:mt-[-120px] relative rounded-2xl overflow-hidden shadow-lg m-4 p-4 w-full h-1/2">

          {
        // firstModule && (
        //     <div key={0}>
        //       {firstModule.videos.length > 0 ? (
        //         <div key={firstModule.videos[0]._id}>
        //           <iframe
        //             src={firstModule.videos[0].videoUrl || "no videos"}
        //             frameborder="0"
        //             className="top-0 left-0 h-[30vh] w-[100%]"
        //             allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        //             title="zenstudy"
        //           ></iframe>
                  
        //         </div>
        //       ) : (
        //         <div>No videos</div>
        //       )}
        //     </div>
        //   )
            }

          <Images thumbnail={coursePost?.thumbnail} className="w-full h-52 rounded-2xl"/>

          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-blue-600">
              {coursePost?.title}
            </div>
            {
              //<p className="text-gray-700 text-base">Tutor</p>
            }
            <p className="text-gray-600 text-xs mt-4">
              Created at - {formatDate(coursePost?.createdAt)}
            </p>
            {
              // <p className="text-gray-600">course day</p>
            }
          </div>
          <div className=" flex flex-row px-6 pt-4 pb-2 justify-between items-center  border-t-2">
            <p className="text-blue-600 font-bold text-2xl">
              ₹ {coursePost?.price}
            </p>
            {currentUser ? (
              <button
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => handlePayment(coursePost?.price)}
                disabled={!payloading}
              >
                {!payloading ? "Please wait..." : "Pay Now"}
              </button>
            ) : (
              <button
                onClick={()=> navigate("/sign-in")}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
              >
                Pay Now
              </button>
            )}
          </div>
=======
      ) : (
        <div className="flex flex-wrap justify-center">
          {memoizedCourses.map((course) => (
            <div
              key={course._id}
              className="max-w-sm rounded-2xl overflow-hidden shadow-lg m-4 p-4"
            >
              <img
                className="w-full h-52 object-cover rounded-2xl"
                src={course.thumbnail}
                alt={course.title}
                loading="lazy" // Native lazy loading
              />
              <div className="px-6 py-4">
                <div className="font-bold text-lg mb-2 h-20 text-blue-600">
                  {course.title}
                </div>
                <p className="text-gray-600 text-xs">
                  Created at - {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row px-6 pt-4 pb-2 justify-between items-center border-t-2">
                <p className="text-blue-600 font-bold text-2xl">
                  ₹ {course.price}
                </p>
                <button
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => handleViewDetails(course._id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
>>>>>>> 12c4cf3092af5d7413b9f3f11444c62a34077f1a
        </div>
      )}
    </div>
  );
};

export default Courses;
