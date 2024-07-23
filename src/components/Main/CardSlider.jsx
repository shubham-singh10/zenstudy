import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";




function CardSlider() {
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
        centerMode: true,
        centerPadding: "0",
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




    const data = [
        {
            title: "UPSC",
            img: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "1000",
        },
        {
            title: "UPSC",
            img: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "1000",
        },
        {
            title: "UPSC",
            img: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "1000",
        },
        {
            title: "UPSC",
            img: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "1000",
        },
        {
            title: "UPSC",
            img: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "1000",
        },
        {
            title: "UPSC",
            img: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "1000",
        },
        // Add more data items here...
    ];




    return (
        <div>
            <animated.div
                ref={slideLeftRef}
                style={slideLeftStyles}
                className="w-full"
            >
                <div className="mt-20 m-1 lg:m-20">
                    <Slider {...settings}>
                        {data.map((d, index) => (
                            <div
                                key={index}
                                className="max-w-sm rounded-2xl overflow-hidden shadow-lg m-4 p-4"
                            >
                                <img
                                    className="w-full h-52 rounded-2xl"
                                    src={d.img}
                                    alt="Course"
                                />
                                <div className="px-6 py-4">
                                    <div className="font-bold text-xl mb-2 text-blue-600">
                                        {d.title}
                                    </div>
                                    <p className="text-gray-700 text-base">{d.name}</p>
                                    <p className="text-gray-600">{d.name}</p>
                                    <p className="text-gray-600">{d.name}</p>
                                </div>
                                <div className="flex flex-row px-6 pt-4 pb-2 justify-between items-center">
                                    <p className="text-blue-600 font-bold text-2xl">
                                        ₹ {d.price}
                                    </p>
                                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
                                        View Details
                                    </button>
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