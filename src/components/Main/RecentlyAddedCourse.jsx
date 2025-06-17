import React, { useEffect, useState } from "react";
import CardSlider from "./CardSlider";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const RecentlyAddedCourse = () => {
    const [courses, setCourse] = useState([]);
    const { ref: slideUpRef, inView: slideUpInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const slideUpStyles = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: slideUpInView ? 0 : 100, opacity: slideUpInView ? 1 : 0 },
        config: { duration: 500 },
    });

    useEffect(() => {
        const getcourse = async () => {
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
    
            if (response.status === 404) {
              setCourse([]);
              return;
            }
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
        const mainData = data.courses;

        setCourse(
          mainData.map((course) => ({
            ...course,
            imageUrl: `${process.env.REACT_APP_API}zenstudy/api/image/getimage/${course.thumbnail}`,
          }))
        );
          } catch (error) {
            console.error("Error", error)
          }
        };
    
        getcourse();
      }, []);


      console.log("courses", courses) 
    return (
        <div>
           {courses && courses.length === 0 ?  "" : <div className="relative lg:mt-20 lg:mb-20 md:mt-15 md:mb-15 mt-10 mb-10">
                
                <animated.h1
                    ref={slideUpRef}
                    style={slideUpStyles}
                    className="text-2xl z-50 md:text-3xl lg:text-4xl mb-8 text-center textPurpleGradient font-semibold"
                >
                    Re
                    <span className="border-b-4 border-[#543a5d]">
                        cently Added Cours
                    </span>
                    es
                </animated.h1>
                <CardSlider 
                    courseData={courses}
                />
            </div>}
        </div>
    );
};


export default RecentlyAddedCourse;