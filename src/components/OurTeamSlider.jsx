import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Custom Next Arrow
const NextArrow = ({ onClick }) => {
  return (
    <button
      className="absolute z-10 right-4 top-[480px]  transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md"
      onClick={onClick}
    >
      <FaArrowRight />
    </button>
  );
};

// Custom Prev Arrow
const PrevArrow = ({ onClick }) => {
  return (
    <button
      className="absolute z-10 right-16 top-[480px] transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md"
      onClick={onClick}
    >
      <FaArrowLeft />
    </button>
  );
};

function OurTeamSlider() {
  const { ref: slideLeftRef, inView: slideLeftInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  const slideLeftStyles = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
    config: { duration: 500 },
  });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    beforeChange: (current, next) => setActiveSlide(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "0",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0",
        },
      },
    ],
  };

  const courseData = [
    {
      id: 1,
      title: "John Doe",
      role: "Frontend Developer",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      thumbnail:
        "https://img.freepik.com/premium-photo/artist-digital-avatar-generative-ai_934475-9261.jpg",
    },
    {
      id: 2,
      title: "John Doe",
      role: "Frontend Developer",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      thumbnail:
        "https://img.freepik.com/premium-photo/artist-digital-avatar-generative-ai_934475-9261.jpg",
    },
    {
      id: 3,
      title: "John Doe",
      role: "Frontend Developer",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      thumbnail:
        "https://img.freepik.com/premium-photo/artist-digital-avatar-generative-ai_934475-9261.jpg",
    },
    {
      id: 4,
      title: "John Doe",
      role: "Frontend Developer",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      thumbnail:
        "https://img.freepik.com/premium-photo/artist-digital-avatar-generative-ai_934475-9261.jpg",
    },
    {
      id: 5,
      title: "John Doe",
      role: "Frontend Developer",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      thumbnail:
        "https://img.freepik.com/premium-photo/artist-digital-avatar-generative-ai_934475-9261.jpg",
    },
    // Add more profiles as needed...
  ];

  return (
    <div>
      <animated.div
        ref={slideLeftRef}
        style={slideLeftStyles}
        className="w-full"
      >
        <div className="mx-4 mb-10 lg:mb-20 lg:mx-20 md:mx-15 relative">
          <Slider {...settings}>
            {courseData.map((course, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-between rounded-2xl overflow-hidden shadow-lg shadow-slate-500 my-20 p-6 transition-transform duration-500 bg-white ${
                  index === activeSlide
                    ? "transform translate-y-[30px] opacity-100"
                    : "opacity-70"
                }`}
              >
                <div className="relative flex justify-center">
                  <img
                    src={course.thumbnail}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white z-50 shadow-md"
                  />

                  <div className="w-24 h-24 mt-1 bg-blue-700 rounded-full absolute"></div>
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-blue-600">
                    {course.title}
                  </h2>
                  <p className="italic text-gray-500">{course.role}</p>
                </div>

                <div className="text-center mt-4 px-6">
                  <p className="text-gray-700 text-sm">
                    {course.description}
                  </p>
                </div>

                <div className="flex w-full justify-end mt-6 space-x-4">
                  <FaLinkedin className="text-blue-600 w-6 h-6 cursor-pointer" />
                  <FaInstagram className="text-blue-600 w-6 h-6 cursor-pointer" />
                  <FaFacebook className="text-blue-600 w-6 h-6 cursor-pointer" />
                  <FaTwitter className="text-blue-600 w-6 h-6 cursor-pointer" />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </animated.div>
    </div>
  );
}

export default OurTeamSlider;
