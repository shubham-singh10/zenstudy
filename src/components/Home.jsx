import React from "react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";
import Carousel from "./Carousel";
import FeatureVideo from "./FeatureVideo";
import CardSlider from "./CardSlider";
import ExploreArticles from "./ExploreArticles ";




const Home = () => {
    const [refSlideUp, inViewSlideUp] = useInView({ triggerOnce: true });
    const [refSlideLeft, inViewSlideLeft] = useInView({ triggerOnce: true });
    const [refSlideRight, inViewSlideRight] = useInView({ triggerOnce: true });




    const SlideUp = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: inViewSlideUp ? 0 : 100, opacity: inViewSlideUp ? 1 : 0 },
        config: { duration: 500 },
    });




    const SlideLeft = useSpring({
        from: { x: -100, opacity: 0 },
        to: { x: inViewSlideLeft ? 0 : -100, opacity: inViewSlideLeft ? 1 : 0 },
        config: { duration: 500 },
    });




    const SlideLeft1 = useSpring({
        from: { x: -100, opacity: 0 },
        to: { x: 0, opacity: 1 },
        config: { duration: 500 },
    });




    const SlideRight = useSpring({
        from: { x: 100, opacity: 0 },
        to: { x: inViewSlideRight ? 0 : 100, opacity: inViewSlideRight ? 1 : 0 },
        config: { duration: 500 },
    });




    const SlideRight1 = useSpring({
        from: { x: 100, opacity: 0 },
        to: { x: 0, opacity: 1 },
        config: { duration: 500 },
    });




    return (
        <div>
            <Carousel />




            <div className="flex flex-col md:flex-row items-center justify-between mt-8 px-4 md:px-16">
                <animated.div
                    style={SlideLeft1}
                    className="text-section md:w-1/2 mb-4 md:mb-0"
                >
                    <h2 className="text-2xl font-bold mb-4">
                        <span className="text-[#5D6169]">Welcome To</span>
                        <span className="text-[#054BB4]"> ZenStudy</span>
                    </h2>
                    <h1 className="text-4xl font-bold mb-4">
                        <span className="text-[#5D6169]">Making</span>
                        <span className="text-[#054BB4]"> Education</span>
                        <span className="text-[#5D6169]"> Imaginative</span>
                    </h1>
                    <p className="text-[#5D6169]">
                        Zenstudy offers a unique educational platform by making education
                        imaginative. It introduces a modern educational technology by
                        blending traditional learning. It provides a new and innovative
                        method in approaching the UPSC preparation as well as provides a
                        personalized student centered education through innovative teaching
                        methodology, interactive online platforms and real world
                        application.
                    </p>
                    <div className="mt-9">
                        <button className="rounded-full bg-[#054BB4] text-[#ffffff] px-6 py-2 font-medium mr-5">
                            Explore Courses
                        </button>
                        <button className="rounded-full border-2 border-solid border-[#054BB4] text-[#054BB4] px-6 py-2 font-medium lg:mt-0 md:mt-4 mt-4">
                            Watch Videos
                        </button>
                    </div>
                </animated.div>
                <animated.div
                    style={SlideRight1}
                    className="relative image-section md:w-1/2 flex justify-center items-center"
                >
                    <img
                        src="/assets/herosection-logo.jpeg"
                        alt="Description of the"
                        style={{ width: "100%", height: "auto" }}
                        className="md:w-[400px] md:h-[400px] w-[400px] h-[400px] z-50 rounded-lg"
                    />
                </animated.div>
            </div>




            <div className="relative lg:mt-20 lg:mb-20 md:mt-15 md:mb-15 mt-10 mb-10">
                <div className="absolute -z-50 lg:top-[-100px] lg:left-[0px] top-[-30px] left-[0px] lg:w-[300px] lg:h-[300px] w-[200px] h-[200px] bg-gray-100 text-white flex items-center justify-end px-4 rounded-full"></div>




                <animated.h1
                    style={SlideUp}
                    className="text-2xl z-50 md:text-3xl lg:text-4xl mb-8 text-center text-[#054BB4] font-semibold"
                    ref={refSlideUp}
                >
                    Re
                    <span className="border-b-4 border-[#054BB4]">
                        cently Added Cours
                    </span>
                    es
                </animated.h1>
                <animated.div style={SlideLeft} ref={refSlideLeft}>
                    <CardSlider />
                </animated.div>
            </div>




            <ExploreArticles />
            <FeatureVideo />




            <div className="w-full min-h-[30vh] relative ">
                <div className="absolute -z-50 lg:top-[-70px] lg:right-[0px] top-[-10px] right-[0px] lg:w-[300px] lg:h-[300px] w-[200px] h-[200px] bg-gray-100 text-white flex items-center justify-end px-4 rounded-full"></div>




                <div className="px-4 lg:px-12 flex flex-col mt-20 lg:mt-20 gap-6 lg:gap-10 ">
                    <div>
                        <animated.p
                            style={SlideUp}
                            className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold text-[#054BB4]"
                            ref={refSlideUp}
                        >
                            Le
                            <span className="border-b-4 border-[#054BB4]">arn About</span>
                            Us
                        </animated.p>
                    </div>
                    <div className="flex flex-col gap-14 mb-10">
                        <animated.div
                            style={SlideRight}
                            className="relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
                            ref={refSlideRight}
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
                                <button className="lg:px-5 md:px-5 px-4 py-1 bg-[#054BB4] text-white rounded-full">
                                    Read More
                                </button>
                            </div>
                        </animated.div>
                        <animated.div
                            style={SlideLeft}
                            className="relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
                            ref={refSlideLeft}
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
                                <button className="lg:px-5 md:px-5 px-4 py-1 bg-[#054BB4] text-white rounded-full">
                                    Read More
                                </button>
                            </div>
                        </animated.div>
                        <animated.div
                            style={SlideRight}
                            className="relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
                            ref={refSlideRight}
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
                                <button className="lg:px-5 md:px-5 px-4 py-1 bg-[#054BB4] text-white rounded-full">
                                    Read More
                                </button>
                            </div>
                        </animated.div>
                    </div>
                </div>
            </div>
        </div>
    );
};




export default Home;