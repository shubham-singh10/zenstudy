// src/components/Courses.js
import React, { useMemo, useCallback } from "react";
import { useGetCoursesQuery } from "../../api/apiSlice";

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
        </div>
      )}
    </div>
  );
};

export default Courses;
