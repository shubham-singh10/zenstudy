import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer"; // Correct import
const About = () => {
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
      <div className="flex flex-col-reverse lg:flex-row items-center lg:gap-0 gap-4 lg:items-start lg:px-12 md:px-6 px-4 py-4 lg:py-10">
        <animated.div
          style={SlideLeft}
          ref={refSlideLeft}
          className="relative lg:w-[50%] w-[100%] mb-8 lg:mb-0 lg:mr-16 p-6 lg:p-10 md:p-8"
        >
          <animated.img
            src="/assets/aboutUs.png"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute rounded-xl top-0 right-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-t-8 lg:border-r-8 border-t-4 border-r-4 border-blue-600"></animated.div>
          <animated.div className="absolute rounded-xl bottom-0 left-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-b-8 lg:border-l-8 border-b-4 border-l-4 border-blue-600"></animated.div>
        </animated.div>
        <animated.div
          style={SlideRight}
          ref={refSlideRight}
          className="flex flex-col items-start lg:w-[50%] w-[100%]"
        >
          <div className="text-2xl mt-10 md:text-3xl lg:text-4xl mb-8 text-center text-[#054BB4] font-semibold">
            A<span className="border-b-4 border-[#054BB4]">bout U</span>s
          </div>
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

      {
        // our mission
      }

      <animated.div
        style={ScaleUp}
        ref={refScaleUp}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bg-blue-600 text-center justify-center items-center"
      >
        <p className="newfont lg:text-3xl md:text-2xl text-xl">Our Mission </p>
      </animated.div>

      <div className="flex flex-col lg:flex-row items-center lg:mt-0 lg:gap-0 gap-4 lg:items-center lg:px-12 md:px-6 px-4 py-10 ">
        <animated.div
          style={SlideLeft1}
          ref={refSlideLeft1}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  At ZenStudy UPSC, after analyzing the UPSC pattern over the
                  last decade and drawing from our team's 20 years of collective
                  experience, we've learned that the UPSC syllabus is incredibly
                  engaging for anyone eager to learn about India and the world.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  However, students often struggle with outdated content, which
                  doesn't feel rewarding during preparation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  At ZenStudy, we aim to evolve the process, making UPSC
                  preparation more engaging, enhancing intellect, and enriching
                  the learning experience about India and the world.
                </p>
              </div>
            </div>
          </div>
        </animated.div>
        <animated.div
          style={SlideRight1}
          ref={refSlideRight1}
          className="relative mb-8 lg:mb-0 lg:ml-16 p-6 lg:p-10 md:p-8"
        >
          <img
            src="/assets/mission.png"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <div className="absolute rounded-xl top-0 left-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-t-8 lg:border-l-8 border-t-4 border-l-4  border-blue-600"></div>
          <div className="absolute rounded-xl bottom-0 right-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-b-8 lg:border-r-8 border-b-4 border-r-4 border-blue-600"></div>
        </animated.div>
      </div>

      {
        // Our vision
      }

      <animated.div
        style={ScaleUp}
        ref={refScaleUp}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bg-blue-600 text-center justify-center items-center"
      >
        <p className="newfont lg:text-3xl md:text-2xl text-xl">Our Vision</p>
      </animated.div>

      <div className="flex flex-col-reverse lg:flex-row items-center lg:gap-0 gap-4  lg:items-center lg:px-12 md:px-6 px-4 py-10 ">
        <animated.div
          style={SlideLeft}
          ref={refSlideLeft}
          className="relative mb-8 lg:mb-0 lg:mr-16 p-6 lg:p-10 md:p-8"
        >
          <animated.img
            src="/assets/vision.png"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute rounded-xl top-0 right-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-t-8 lg:border-r-8 border-t-4 border-r-4 border-blue-600"></animated.div>
          <animated.div className="absolute rounded-xl bottom-0 left-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-b-8 lg:border-l-8 border-b-4 border-l-4 border-blue-600"></animated.div>
        </animated.div>
        <animated.div
          style={SlideLeft1}
          ref={refSlideLeft1}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Education has been an integral part of a child's upbringing.
                  But when we ask any child that is he or she enjoying the
                  education process, seldom we get the answer in affirmation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We at Zen Study is trying to change it through, keeping the
                  substance of the education same, but the evolving way of
                  educating our children in a much more intuitive way, that
                  would be much like enjoying watching a movie or watching or
                  playing a game.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Our ultimate aim is to make education imaginative and to truly
                  aid into the cognitive development of a child.
                </p>
              </div>
            </div>
          </div>
        </animated.div>
      </div>

      {
        // who we are 
      }

      <animated.div
        style={ScaleUp}
        ref={refScaleUp}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bg-blue-600 text-center justify-center items-center"
      >
        <p className="newfont lg:text-3xl md:text-2xl text-xl">Who we are 
        </p>
      </animated.div>

      <div className="flex flex-col lg:flex-row items-center lg:gap-0 gap-4  lg:items-center lg:px-12 md:px-6 px-4 py-10 ">
        <animated.div
          style={SlideLeft1}
          ref={refSlideLeft1}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We are an emerging ed-tech company, currently specializing in
                  services for UPSC aspirants. At this stage, we are focused on
                  addressing the key challenges faced by candidates, leveraging
                  our team's vast experience in learning and developing
                  effective strategies to crack the UPSC exam.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Since the UPSC syllabus covers a large portion of school
                  education in India, we plan to take a bold step forward by
                  enhancing the learning process for UPSC aspirants. In the
                  future, we aim to apply this experience to make education more
                  imaginative and engaging for school students across India.
                </p>
              </div>
            </div>
          </div>
        </animated.div>
        <animated.div
          style={SlideRight1}
          ref={refSlideRight1}
          className="relative mb-8 lg:mb-0 lg:ml-16 p-6 lg:p-10 md:p-8"
        >
          <img
            src="/assets/wwa.png"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <div className="absolute rounded-xl top-0 left-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-t-8 lg:border-l-8 border-t-4 border-l-4  border-blue-600"></div>
          <div className="absolute rounded-xl bottom-0 right-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-b-8 lg:border-r-8 border-b-4 border-r-4 border-blue-600"></div>
        </animated.div>
      </div>

{
      // Why choose us
}

      <animated.div
        style={ScaleUp}
        ref={refScaleUp}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bg-blue-600 text-center justify-center items-center"
      >
        <p className="newfont lg:text-3xl md:text-2xl text-xl">
          Why choose us{" "}
        </p>
      </animated.div>

      <div className="flex flex-col-reverse lg:flex-row items-center lg:gap-0 gap-4 lg:items-center lg:px-12 md:px-6 px-4 py-10 ">
        <animated.div
          style={SlideLeft}
          ref={refSlideLeft}
          className="relative lg:w-[50%] w-[100%] mt-4 lg:mt-0 mb-8 lg:mb-0 lg:mr-16 p-6 lg:p-10 md:p-8"
        >
          <animated.img
            src="/assets/whywe.png"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute rounded-xl top-0 right-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-t-8 lg:border-r-8 border-t-4 border-r-4 border-blue-600"></animated.div>
          <animated.div className="absolute rounded-xl bottom-0 left-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-b-8 lg:border-l-8 border-b-4 border-l-4 border-blue-600"></animated.div>
        </animated.div>
        <animated.div
          style={SlideLeft1}
          ref={refSlideLeft1}
          className="flex  lg:w-[50%] w-[100%] flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We've always been told that choosing friends is one of the
                  most important decisions in life. But when it comes to
                  choosing our teachers, we often have limited information,
                  relying on societal norms or the internet. At ZenStudy, we are
                  creating a unique teaching approach for UPSC aspirants. With
                  our extensive experience as former aspirants, we've gained
                  deep insights into the UPSC syllabus and process. Through
                  analysis, we've found that much of the content available is
                  outdated and doesn't meet the current demands of the exam.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Our vision is to make learning more intuitive and engaging,
                  enabling students to learn faster, think sharper, and stay
                  better informed about India and the world. If you're seeking a
                  great teaching assistant, we believe ZenStudy can enhance your
                  learning experience and guide you toward success. For us, your
                  success brings fulfillment, as our approach is fresh and
                  innovative, especially in the UPSC field. Join us, and let's
                  make your UPSC preparation an enriching journey. Best of luck!
                </p>
              </div>
            </div>
          </div>
        </animated.div>
      </div>


    </div>
  );
};

export default About;
