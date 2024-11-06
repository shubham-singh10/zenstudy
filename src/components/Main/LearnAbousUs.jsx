import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const LearnAbousUs = () => {
  const { ref: slideUpTitleRef, inView: slideUpTitleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: slideUp01Ref, inView: slideUp01InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: slideUp02Ref, inView: slideUp02InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: slideUp03Ref, inView: slideUp03InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const slideUpTitleStyles = useSpring({
    from: { y: 100, opacity: 0 },
    to: {
      y: slideUpTitleInView ? 0 : 100,
      opacity: slideUpTitleInView ? 1 : 0,
    },
    config: { duration: 500 },
  });

  const slideUp01Styles = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: slideUp01InView ? 0 : 100, opacity: slideUp01InView ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideUp02Styles = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: slideUp02InView ? 0 : 100, opacity: slideUp02InView ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideUp03Styles = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: slideUp03InView ? 0 : 100, opacity: slideUp03InView ? 1 : 0 },
    config: { duration: 500 },
  });

  return (
    <div>
      <div className="w-full min-h-[30vh] relative ">
        <div className="px-4 lg:px-12 flex flex-col mt-20 lg:mt-20 gap-6 lg:gap-10 ">
          <div>
            <animated.p
              ref={slideUpTitleRef}
              style={slideUpTitleStyles}
              className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold text-[#054BB4]"
            >
              Le
              <span className="border-b-4 border-[#054BB4]">arn About</span>
              Us
            </animated.p>
          </div>
          <div className="flex flex-col gap-14 mb-10">
            <animated.div
              ref={slideUp01Ref}
              style={slideUp01Styles}
              className="relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
            >
              <div className="absolute lg:top-[-30px] md:top-[-30px] top-[-25px] lg:left-20 md:left-20 left-4 lg:text-6xl md:text-6xl text-5xl text-[#054BB4] font-semibold">
                01
              </div>
              <div className="flex items-end flex-col lg:px-14 md:px-14 px-6 lg:gap-4 gap-2 py-5">
                <p className="text-[#054BB4] font-semibold lg:text-3xl md:text-2xl text-xl">
                  About Us
                </p>
                <p className="lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-end sm:text-sm">
                  Zenstudy is an innovative educational startup revolutionizing
                  learning through a blend of traditional methods and modern
                  technology. We specialize in personalized student-centered
                  education, with an interactive online platform and real-world
                  application.
                </p>
                <Link to="/about">
                <button className="custom-btn-2 ">
                <span className="custom-btn-2-bg"></span>
                <span className="custom-btn-2-text">Read More</span>
              </button>
                </Link>
              </div>
            </animated.div>
            <animated.div
              ref={slideUp02Ref}
              style={slideUp02Styles}
              className="relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
            >
              <div className="absolute lg:top-[-30px] md:top-[-30px] top-[-25px] lg:right-20 md:right-20 right-4 lg:text-6xl md:text-6xl text-5xl text-[#054BB4] font-semibold">
                02
              </div>
              <div className="flex items-start flex-col lg:px-14 md:px-14 px-6 lg:gap-4 gap-2 py-5">
                <p className="text-[#054BB4] font-semibold lg:text-3xl md:text-2xl text-xl">
                  Our Vision
                </p>
                <p className="lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-start sm:text-sm">
                  To revolutionize education by making learning accessible,
                  inclusive, and engaging for everyone, regardless of location,
                  through innovative and imaginative approaches that incorporate
                  gamification and cutting-edge technology.
                </p>
                <Link to="/about">
                  <button className="custom-btn-2 ">
                    <span className="custom-btn-2-bg"></span>
                    <span className="custom-btn-2-text">Read More</span>
                  </button>
                </Link>
              </div>
            </animated.div>
            <animated.div
              ref={slideUp03Ref}
              style={slideUp03Styles}
              className="relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
            >
              <div className="absolute lg:top-[-30px] md:top-[-30px] top-[-25px] lg:left-20 md:left-20 left-4 lg:text-6xl md:text-6xl text-5xl text-[#054BB4] font-semibold">
                03
              </div>
              <div className="flex items-end flex-col lg:px-14 md:px-14 px-6 lg:gap-4 gap-2 py-5">
                <p className="text-[#054BB4] font-semibold lg:text-3xl md:text-2xl text-xl">
                  Our Mission
                </p>
                <p className="lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-end sm:text-sm">
                  To create a dynamic and inclusive platform that leverages
                  gamification to enhance learning experiences, ensuring that
                  students from underserved urban and rural areas have access to
                  high-quality education.
                </p>
                <Link to="/about">
                <button className="custom-btn-2 ">
                <span className="custom-btn-2-bg"></span>
                <span className="custom-btn-2-text">Read More</span>
              </button>
                </Link>
              </div>
            </animated.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnAbousUs;
