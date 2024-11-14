import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import CommonCard from "../CommonCard";

function CardSlider({ courseData }) {
  const { ref: slideLeftRef, inView: slideLeftInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const slideLeftStyles = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
    config: { duration: 500 },
  });

  const settings = {
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
          centerMode: false,
          centerPadding: "0",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          centerPadding: "0",
        },
      },
    ],
  };


  return (
    <div>
      <animated.div
        ref={slideLeftRef}
        style={slideLeftStyles}
        className="w-full"
      >
        <div className="mt-20 m-1 lg:m-20 ">
          <Slider {...settings} key={courseData.length}>
            {courseData.map((d, index) => (
              <CommonCard key={index} course={d} link={"course-details"} differentClass={"flex flex-col justify-between h-[100%]"}/>
            ))}
          </Slider>
        </div>
      </animated.div>
    </div>
  );
}

export default CardSlider;
