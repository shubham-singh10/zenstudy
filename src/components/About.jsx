import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const About = () => {
  // Intersection observer hooks to track in-view state
  const { ref: refAboutUs, inView: inViewAboutUs } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refMission, inView: inViewMission } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refVision, inView: inViewVision } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refWhoWeAre, inView: inViewWhoWeAre } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: refWhyChooseUs, inView: inViewWhyChooseUs } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animations
  const slideFromLeftAboutUs = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewAboutUs ? 0 : -100, opacity: inViewAboutUs ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromRightAboutUs = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewAboutUs ? 0 : 100, opacity: inViewAboutUs ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromLeftMission = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewMission ? 0 : -100, opacity: inViewMission ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromRightMission = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewMission ? 0 : 100, opacity: inViewMission ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromLeftVision = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewVision ? 0 : -100, opacity: inViewVision ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromRightVision = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewVision ? 0 : 100, opacity: inViewVision ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromLeftWhoWeAre = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewWhoWeAre ? 0 : -100, opacity: inViewWhoWeAre ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromRightWhoWeAre = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewWhoWeAre ? 0 : 100, opacity: inViewWhoWeAre ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromLeftWhyChooseUs = useSpring({
    from: { x: -100, opacity: 0 },
    to: { x: inViewWhyChooseUs ? 0 : -100, opacity: inViewWhyChooseUs ? 1 : 0 },
    config: { duration: 500 },
  });

  const slideFromRightWhyChooseUs = useSpring({
    from: { x: 100, opacity: 0 },
    to: { x: inViewWhyChooseUs ? 0 : 100, opacity: inViewWhyChooseUs ? 1 : 0 },
    config: { duration: 500 },
  });

  const scaleUpMission = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: inViewMission ? 1 : 0, opacity: inViewMission ? 1 : 0 },
    config: { duration: 500 },
  });

  const scaleUpVision = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: inViewVision ? 1 : 0, opacity: inViewVision ? 1 : 0 },
    config: { duration: 500 },
  });

  const scaleUpWhoWeAre = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: inViewWhoWeAre ? 1 : 0, opacity: inViewWhoWeAre ? 1 : 0 },
    config: { duration: 500 },
  });

  const scaleUpWhyChooseUs = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: inViewWhyChooseUs ? 1 : 0, opacity: inViewWhyChooseUs ? 1 : 0 },
    config: { duration: 500 },
  });

  return (

    <div className="flex flex-col items-center bg-white gap-2">
      {/* About Us Section */}
      <div className="flex flex-col-reverse lg:flex-row items-center lg:gap-0 gap-4 lg:items-start lg:px-12 md:px-6 px-4 py-4 lg:py-10">
        <animated.div
          style={slideFromLeftAboutUs}
          ref={refAboutUs}
          className="relative lg:w-[50%] w-[100%] mb-8 lg:mb-0 lg:mr-16 p-6 lg:p-10 md:p-8"
        >
          <animated.img
            src="/assets/about-us.webp"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute rounded-xl top-0 right-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-t-8 lg:border-r-8 border-t-4 border-r-4 border-[#543a5d]"></animated.div>
          <animated.div className="absolute rounded-xl bottom-0 left-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-b-8 lg:border-l-8 border-b-4 border-l-4 border-[#543a5d]"></animated.div>
        </animated.div>
        <animated.div
          style={slideFromRightAboutUs}
          className="flex flex-col items-start lg:w-[50%] w-[100%]"
        >
          <div className="text-2xl mt-10 md:text-3xl lg:text-4xl mb-8 text-center textPurpleGradient font-semibold">
            A<span className="border-b-4 border-[#543a5d]">bout U</span>s
          </div>

          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Zenstudy is an innovative educational startup revolutionizing
                  learning through a blend of traditional methods and modern
                  technology.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We specialize in personalized student-centered education, with
                  an interactive online platform and real-world application.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
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

      {/* Our Mission Section */}
      <animated.div
        style={scaleUpMission}
        ref={refMission}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bgGredient-purple text-center  justify-center items-center"
      >
        <p className="lg:text-3xl md:text-2xl text-xl">Our Mission</p>
      </animated.div>
      <div className="flex flex-col lg:flex-row items-center lg:mt-0 lg:gap-0 gap-4 lg:items-center lg:px-12 md:px-6 px-4 py-10 ">
        <animated.div
          style={slideFromLeftMission}
          ref={refMission}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  At Zenstudy UPSC, after analyzing the UPSC pattern over the
                  last decade and drawing from our team's 20 years of collective
                  experience, we've learned that the UPSC syllabus is incredibly
                  engaging for anyone eager to learn about India and the world.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  However, students often struggle with outdated content, which
                  doesn't feel rewarding during preparation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  At Zenstudy, we aim to evolve the process, making UPSC
                  preparation more engaging, enhancing intellect, and enriching
                  the learning experience about India and the world.
                </p>
              </div>
            </div>
          </div>

        </animated.div>
        <animated.div
          style={slideFromRightMission}
          className="relative mb-8 lg:mb-0 lg:ml-16 p-6 lg:p-10 md:p-8"
        >
          <img
            src="/assets/our-mission.webp"
            alt="Mission"
            className="w-full h-auto object-cover"
          />
          <div className="absolute rounded-xl top-0 left-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-t-8 lg:border-l-8 border-t-4 border-l-4  border-[#543a5d]"></div>
          <div className="absolute rounded-xl bottom-0 right-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-b-8 lg:border-r-8 border-b-4 border-r-4 border-[#543a5d]"></div>
        </animated.div>
      </div>

      {/* Our Vision Section */}
      <animated.div
        style={scaleUpVision}
        ref={refVision}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bgGredient-purple text-center  justify-center items-center"
      >
        <p className="lg:text-3xl md:text-2xl text-xl">Our Vision</p>
      </animated.div>

      <div className="flex flex-col-reverse lg:flex-row items-center lg:gap-0 gap-4 lg:items-center lg:px-12 md:px-6 px-4 py-10">
        <animated.div
          style={slideFromLeftVision}
          ref={refVision}
          className="relative mb-8 lg:mb-0 lg:mr-16 p-6 lg:p-10 md:p-8"
        >
          <animated.img
            src="/assets/our-vision.webp"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute rounded-xl top-0 right-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-t-8 lg:border-r-8 border-t-4 border-r-4 border-[#543a5d]"></animated.div>
          <animated.div className="absolute rounded-xl bottom-0 left-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-b-8 lg:border-l-8 border-b-4 border-l-4 border-[#543a5d]"></animated.div>
        </animated.div>
        <animated.div
          style={slideFromRightVision}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Education has been an integral part of a child's upbringing.
                  But when we ask any child that is he or she enjoying the
                  education process, seldom we get the answer in affirmation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
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
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
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

      {/* Who Are We Section */}
      <animated.div
        style={scaleUpWhoWeAre}
        ref={refWhoWeAre}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bgGredient-purple text-center  justify-center items-center"
      >
        <p className="lg:text-3xl md:text-2xl text-xl">Who Are We</p>
      </animated.div>
      <div className="flex flex-col lg:flex-row items-center lg:gap-0 gap-4 lg:items-center lg:px-12 md:px-6 px-4 py-10">
        <animated.div
          style={slideFromLeftWhoWeAre}
          ref={refWhoWeAre}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
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
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
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
          style={slideFromRightWhoWeAre}
          className="relative mb-8 lg:mb-0 lg:ml-16 p-6 lg:p-10 md:p-8"
        >
          <img
            src="/assets/who-we-are.webp"
            alt="Who We Are"
            className="w-full h-auto object-cover"
          />
          <div className="absolute rounded-xl top-0 left-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-t-8 lg:border-l-8 border-t-4 border-l-4  border-[#543a5d]"></div>
          <div className="absolute rounded-xl bottom-0 right-0 w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:border-b-8 lg:border-r-8 border-b-4 border-r-4 border-[#543a5d]"></div>
        </animated.div>
      </div>

      {/* Why Choose Us Section */}
      <animated.div
        style={scaleUpWhyChooseUs}
        ref={refWhyChooseUs}
        className="flex w-[100%] h-[90px] mt-4 mb-4 lg:mb-10 lg:mt-10 md:mt-6 md:mb-6 text-white bgGredient-purple text-center  justify-center items-center"
      >
        <p className="lg:text-3xl md:text-2xl text-xl">Why Choose Us</p>
      </animated.div>
      <div className="flex flex-col-reverse lg:flex-row items-center lg:gap-0 gap-4 lg:items-center lg:px-12 md:px-6 px-4 py-10">
        <animated.div
          style={slideFromLeftWhyChooseUs}
          ref={refWhyChooseUs}
          className="relative lg:w-[50%] w-[100%] mt-4 lg:mt-0 mb-8 lg:mb-0 lg:mr-16 p-6 lg:p-10 md:p-8"
        >
          <animated.img
            src="/assets/why-choose-us.webp"
            alt="Team"
            className="w-full h-auto object-cover"
          />
          <animated.div className="absolute rounded-xl top-0 right-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-t-8 lg:border-r-8 border-t-4 border-r-4 border-[#543a5d]"></animated.div>
          <animated.div className="absolute rounded-xl bottom-0 left-0 lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] lg:border-b-8 lg:border-l-8 border-b-4 border-l-4 border-[#543a5d]"></animated.div>
        </animated.div>
        <animated.div
          style={slideFromRightWhyChooseUs}
          className="flex  lg:w-[50%] w-[100%] flex-col items-center justify-center"
        >
          <div className="flex flex-col space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  We've always been told that choosing friends is one of the
                  most important decisions in life. But when it comes to
                  choosing our teachers, we often have limited information,
                  relying on societal norms or the internet. At Zenstudy, we are
                  creating a unique teaching approach for UPSC aspirants. With
                  our extensive experience as former aspirants, we've gained
                  deep insights into the UPSC syllabus and process. Through
                  analysis, we've found that much of the content available is
                  outdated and doesn't meet the current demands of the exam.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bgGredient-purple rounded-full mt-2"></div>
              <div className="ml-4">
                <p>
                  Our vision is to make learning more intuitive and engaging,
                  enabling students to learn faster, think sharper, and stay
                  better informed about India and the world. If you're seeking a
                  great teaching assistant, we believe Zenstudy can enhance your
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
    </div >
  );
};

export default About;
