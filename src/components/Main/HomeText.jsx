import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";


const HomeText = () => {
    const { ref: slideLeftRef, inView: slideLeftInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });


    const { ref: slideRightRef, inView: slideRightInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });


    const slideLeftStyles = useSpring({
        from: { x: -100, opacity: 0 },
        to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
        config: { duration: 500 },
    });


    const slideRightStyles = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: slideRightInView ? 0 : 100, opacity: slideRightInView ? 1 : 0 },
        config: { duration: 500 },
    });


    return (
        <div>
            <div className="flex flex-col md:flex-row items-center justify-between mt-8 px-4 md:px-16">
                <animated.div
                    ref={slideLeftRef}
                    style={slideLeftStyles}
                    className="text-section md:w-1/2 mb-4 md:mb-0"
                >
                    <h2 className="font-bold lg:mb-2  text-center lg:text-start md:text-start ">
                        <span className="text-4xl md:text-2xl lg:text-2xl text-[#5D6169]">Welcome To</span>
                        <span className="text-3xl md:text-4xl lg:text-4xl text-[#054BB4]"> ZenStudy</span>
                    </h2>
                    <h1 className="text-4xl font-bold mb-4 text-center lg:text-start md:text-start ">
                        <span className="text-xl lg:text-2xl text-[#5D6169]">Making</span>
                        <span className="text-xl  lg:text-4xl text-[#054BB4]"> Education</span>
                        <span className="text-xl lg:text-2xl text-[#5D6169]"> Imaginative</span>
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
                    <div className="mt-9 flex flex-col md:flex-row lg:flex-row justify-center text-center mb-4 lg:mb-0 md:mb-0">
                        <Link to="/courses"><button className="rounded-full bg-[#054BB4] text-[#ffffff] px-6 py-2 font-medium md:mr-5 lg:mr-5">
                            Explore Courses
                        </button>
                        </Link>
                        <Link to="https://youtube.com/@zenstudyz?si=iN4l51faOy1_mjYu" target="blank"><button className="rounded-full border-2 border-solid border-[#054BB4] text-[#054BB4] px-6 py-2 font-medium lg:mt-0 md:mt-0 mt-4">
                            Watch Videos
                        </button>
                        </Link>
                    </div>
                </animated.div>
                <animated.div
                    ref={slideRightRef}
                    style={slideRightStyles}
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
        </div>
    );
};


export default HomeText;