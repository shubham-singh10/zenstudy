import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

// Custom reusable animation hook
const useSlideAnimation = (direction = "x", offset = 100) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const animationStyle = useSpring({
    from: { [direction]: offset, opacity: 0 },
    to: { [direction]: inView ? 0 : offset, opacity: inView ? 1 : 0 },
    config: { duration: 500 },
  });

  return { ref, style: animationStyle };
};

const HomeText = () => {
  const leftAnim = useSlideAnimation("x", -100);
  const rightAnim = useSlideAnimation("y", 100);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mt-8 px-4 md:px-16">
        <animated.div
          ref={leftAnim.ref}
          style={leftAnim.style}
          className="text-section md:w-1/2 mb-4 md:mb-0"
        >
          <h2 className="font-bold lg:mb-2 text-center lg:text-start md:text-start">
            <span className="text-4xl md:text-2xl lg:text-2xl text-[#43464b]">
              Welcome To
            </span>
            <span className="text-3xl md:text-4xl lg:text-4xl textPurple">
              {" "}Zenstudy
            </span>
          </h2>

          <h1 className="text-4xl font-bold mb-4 text-center lg:text-start md:text-start">
            <span className="text-xl lg:text-2xl text-[#43464b]">Making</span>
            <span className="text-xl lg:text-4xl textGreen"> Education</span>
            <span className="text-xl lg:text-2xl text-[#43464b]"> Imaginative</span>
          </h1>

          <p className="text-[#5D6169]">
            Zenstudy offers a unique educational platform by making education imaginative. It introduces a modern educational technology by blending traditional learning. It provides a new and innovative method in approaching the UPSC preparation as well as provides a personalized student centered education through innovative teaching methodology, interactive online platforms and real world application.
          </p>

          <div className="mt-9 flex flex-col md:flex-row lg:flex-row justify-center text-center mb-4 lg:mb-0 md:mb-0">
            <Link to="/courses">
              <button className="custom-btn-2 md:mr-5 lg:mr-5">
                <span className="custom-btn-2-bg"></span>
                <span className="custom-btn-2-text">Explore Courses</span>
              </button>
            </Link>
            <Link to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu" target="_blank" rel="noopener noreferrer">
              <button className="custom-btn mt-4 lg:mt-0 md:mt-0">
                <span className="custom-btn-bg"></span>
                <span className="custom-btn-text">Watch Videos</span>
              </button>
            </Link>
          </div>
        </animated.div>

        <animated.div
          ref={rightAnim.ref}
          style={rightAnim.style}
          className="relative image-section md:w-1/2 flex justify-center items-center"
        >
          <img
            src="/assets/boylogo.webp"
            alt="Zenstudy Character Illustration"
            className="w-[100%] z-50 rounded-lg"
            loading="lazy"
          />
        </animated.div>
      </div>
    </div>
  );
};

export default React.memo(HomeText);
