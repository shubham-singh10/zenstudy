import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

function CardSlider({ courseData }) {
    const navigate = useNavigate();
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
        dots: true,
        infinite: true,
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    
    return (
        <div>
            <animated.div
                ref={slideLeftRef}
                style={slideLeftStyles}
                className="w-full"
            >
                <div className="mt-20 m-1 lg:m-20 ">
                    <Slider {...settings}  key={courseData.length}>
                        {courseData.map((d, index) => (
                            <div
                                key={index}
                                className="max-w-xs rounded-2xl overflow-hidden shadow-lg m-4 p-4"
                            >
                                <div className="relative">
                                    <img
                                        src={d.imageUrl}
                                        crossOrigin="anonymous"
                                        alt="Thumbnail"
                                        className={`w-full h-52 rounded-2xl transition-opacity duration-500`}
                                    />
                                </div>

                                <div className="px-6 py-4">
                                    <div className="font-bold text-lg mb-2 text-blue-600">
                                        {d.title}
                                    </div>
                                    <p className="text-gray-700 text-base">{d.name}</p>
                                    {d.other1 === "upcoming" ? (
                                        <p className="text-gray-600 text-xs">Expected: October 2024</p>
                                    ) : (
                                        <p className="text-gray-600 text-xs">
                                            Created at: {formatDate(d.createdAt)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-row px-6 pt-4 pb-2 justify-between items-center border-t-2">
                                    <p className="text-blue-600 font-bold text-2xl">
                                        ₹ {d.price}
                                    </p>
                                    {d.other1 === "upcoming" ? (
                                        <p className="text-red-600 font-bold">Coming Soon</p>
                                    ) : (
                                        <button
                                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                                            onClick={() =>
                                                navigate("/course-details", {
                                                    state: { courseId: d._id },
                                                })
                                            }
                                        >
                                            View Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </animated.div>
        </div>
    );
}

export default CardSlider;
