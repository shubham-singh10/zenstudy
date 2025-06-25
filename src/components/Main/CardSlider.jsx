import React, { lazy, Suspense, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
const CommonCard = lazy(() => import("../CommonCard"));

function CardSlider({ courseData = [] }) {
  const { ref: slideLeftRef, inView: slideLeftInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const slideLeftStyles = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
    config: { duration: 500 },
    delay: 100, // optional smoother animation
  });

  const settings = useMemo(() => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }), []);

  return (
    <animated.div ref={slideLeftRef} style={slideLeftStyles} className="w-full mt-10 lg:mt-20 px-2 lg:px-20">
      <Slider {...settings}>
        {courseData.map((course, index) => (
          <Suspense fallback={<div>Loading Card...</div>}>
          <CommonCard
            key={course._id || index} // use course._id if available
            course={course}
            link="course-details"
            linknew="courseDetailslive"
            mentorLink="courseDetailNew"
            differentClass="flex flex-col justify-between h-full"
          />
          </Suspense>
        ))}
      </Slider>
    </animated.div>
  );
}

export default React.memo(CardSlider);
