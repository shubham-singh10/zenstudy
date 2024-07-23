import React from "react";
import CardSlider from "./CardSlider";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const RecentlyAddedCourse = () => {
    const { ref: slideUpRef, inView: slideUpInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });


    const slideUpStyles = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: slideUpInView ? 0 : 100, opacity: slideUpInView ? 1 : 0 },
        config: { duration: 500 },
    });

    return (
        <div>
            <div className="relative lg:mt-20 lg:mb-20 md:mt-15 md:mb-15 mt-10 mb-10">
                <div className="absolute -z-50 lg:top-[-100px] lg:left-[0px] top-[-30px] left-[0px] lg:w-[300px] lg:h-[300px] w-[200px] h-[200px] bg-gray-100 text-white flex items-center justify-end px-4 rounded-full"></div>
                <animated.h1
                    ref={slideUpRef}
                    style={slideUpStyles}
                    className="text-2xl z-50 md:text-3xl lg:text-4xl mb-8 text-center text-[#054BB4] font-semibold"
                >
                    Re
                    <span className="border-b-4 border-[#054BB4]">
                        cently Added Cours
                    </span>
                    es
                </animated.h1>
                <CardSlider />
            </div>
        </div>
    );
};


export default RecentlyAddedCourse;