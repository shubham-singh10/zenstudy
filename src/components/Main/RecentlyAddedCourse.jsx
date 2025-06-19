import React, { useEffect, useState, useMemo } from "react";
import CardSlider from "./CardSlider";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const RecentlyAddedCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Intersection Observer
  const { ref: slideUpRef, inView: slideUpInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation
  const slideUpStyles = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: slideUpInView ? 0 : 100, opacity: slideUpInView ? 1 : 0 },
    config: { duration: 500 },
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/fetchCoursesWithFilters?page=1&limit=4`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setCourses([]);
            return;
          }
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        const mainData = data.courses || [];

        const formattedCourses = mainData.map((course) => ({
          ...course,
          imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`,
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Memoize courseData to avoid unnecessary rerenders
  const memoizedCourses = useMemo(() => courses, [courses]);

  // Render nothing if still loading or no courses
  if (loading || memoizedCourses.length === 0) return null;

  return (
    <div className="lg:mt-20 md:mt-15 mt-10">
      <animated.h1
        ref={slideUpRef}
        style={slideUpStyles}
        className="text-2xl z-50 md:text-3xl lg:text-4xl mb-8 text-center textPurpleGradient font-semibold"
      >
        Re
        <span className="border-b-4 border-[#543a5d]">cently Added Cours</span>
        es
      </animated.h1>

      <CardSlider courseData={memoizedCourses} />
    </div>
  );
};

export default RecentlyAddedCourse;
