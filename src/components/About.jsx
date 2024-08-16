import React from "react";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer"; // Correct import
const About = () => {
  const { ref: refSlideUp, inView: inViewSlideUp } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: refSlideLeft, inView: inViewSlideLeft } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: refSlideRight, inView: inViewSlideRight } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: refSlideLeft1, inView: inViewSlideLeft1 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: refSlideRight1, inView: inViewSlideRight1 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: refScaleUp, inView: inViewScaleUp } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const SlideUp = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: inViewSlideUp ? 0 : 100, opacity: inViewSlideUp ? 1 : 0 },
    config: { duration: 700 },
  });

  const SlideLeft = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewSlideLeft ? 0 : -100, opacity: inViewSlideLeft ? 1 : 0 },
    config: { duration: 500 },
  });

  const SlideRight = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewSlideRight ? 0 : 100, opacity: inViewSlideRight ? 1 : 0 },
    config: { duration: 500 },
  });

  const SlideLeft1 = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewSlideLeft1 ? 0 : -100, opacity: inViewSlideLeft1 ? 1 : 0 },
    config: { duration: 500 },
  });

  const SlideRight1 = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewSlideRight1 ? 0 : 100, opacity: inViewSlideRight1 ? 1 : 0 },
    config: { duration: 500 },
  });

  const ScaleUp = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: inViewScaleUp ? 1 : 0, opacity: inViewScaleUp ? 1 : 0 },
    config: { duration: 500 },
  });


  return (
    <div className="flex flex-col items-center bg-white gap-2">
      <animated.h1
        style={SlideUp}
        ref={refSlideUp}
        className="text-2xl mt-10 md:text-3xl lg:text-4xl mb-8 text-center text-[#054BB4] font-semibold"
      >
        A<span className="border-b-4 border-[#054BB4]">bout U</span>s
      </animated.h1>
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:px-12 md:px-6 px-4 py-4 lg:py-10">
        <animated.div
          style={SlideLeft}
          ref={refSlideLeft}
          className="relative mb-8 lg:mb-0 lg:mr-16 p-10"
        >
          <animated.img
            src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute top-0 right-0 w-[150px] h-[150px] border-t-8 border-r-8 border-blue-600"></animated.div>
          <animated.div className="absolute bottom-0 left-0 w-[150px] h-[150px] border-b-8 border-l-8 border-blue-600"></animated.div>
        </animated.div>
        <animated.div
          style={SlideRight}
          ref={refSlideRight}
          className="flex flex-col items-start"
        >
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Zenstudy is an innovative educational startup revolutionizing
                  learning through a blend of traditional methods and modern
                  technology.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We specialize in personalized student-centered education, with
                  an interactive online platform and real-world application.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Our dedicated team and competent educators are working
                  tirelessly to provide enriched content as per the exam demand,
                  ensuring holistic development and success for every student.
                </p>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
      <animated.div
        style={ScaleUp}
        ref={refScaleUp}
        className="flex w-[100%] h-[120px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bg-blue-600 text-center justify-center items-center"
      >
        <div className="h-full mt-20">
          <ImQuotesLeft />{" "}
        </div>
        <p className="newfont lg:text-3xl md:text-2xl text-xl">
          Making Education Imaginative.{" "}
        </p>
        <div className="h-full mt-20">
          <ImQuotesRight />
        </div>
      </animated.div>

      <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start lg:px-12 md:px-6 px-4 py-16">
        <animated.div
          style={SlideLeft1}
          ref={refSlideLeft1}
          className="flex flex-col items-start"
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  To create a dynamic and inclusive platform that leverages
                  gamification to enhance learning experiences, ensuring that
                  students from underserved urban and rural areas have access to
                  high-quality education.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We aim to foster creativity and imagination in learners,
                  making education an engaging and a lifelong journey.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Our goal is to expand across all sectors of education,
                  providing comprehensive and adaptable solutions that meet the
                  diverse needs of students and educators worldwide.
                </p>
              </div>
            </div>
          </div>
        </animated.div>
        <animated.div
          style={SlideRight1}
          ref={refSlideRight1}
          className="relative mb-8 lg:mb-0 lg:ml-16 p-10"
        >
          <img
            src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-0 right-0 w-[150px] h-[150px] border-t-8 border-r-8 border-blue-600"></div>
          <div className="absolute bottom-0 left-0 w-[150px] h-[150px] border-b-8 border-l-8 border-blue-600"></div>
        </animated.div>
      </div>
    </div>
  );
};

export default About;