import React, { useEffect, useRef } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css"; // Glide core styles
import "@glidejs/glide/dist/css/glide.theme.min.css"; // Glide theme styles
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
const CourseCarousel = ({ children }) => {
    const glideRef = useRef(null);
    const glideInstance = useRef(null);


    useEffect(() => {
        if (glideRef.current) {
            glideInstance.current = new Glide(glideRef.current, {
                type: "carousel",
                perView: 3,
                gap: 20,
                autoplay: 3000,
                hoverpause: true,
                animationDuration: 800,
                breakpoints: {
                    1024: { perView: 2 },
                    768: { perView: 1 },
                },
            });


            glideInstance.current.mount();
        }


        return () => {
            if (glideInstance.current) {
                glideInstance.current.destroy();
            }
        };
    }, []);


    return (
        <div
            className="glide flex items-center justify-center"
            ref={glideRef}
        >
            <div className="glide__track h-full " data-glide-el="track">
                <ul className="glide__slides h-full r ">
                    {React.Children.map(children, (child, index) => (
                        <li
                            className="glide__slide flex justify-center items-center"
                            key={index}
                        >
                            <div className="w-full h-full flex justify-center items-center  rounded-lg p-5 ">
                                {child}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


            <div
                className="glide__arrows flex justify-between mt-2 absolute top-1/2 w-full px-4"
                data-glide-el="controls"
            >
                <button
                    className="glide__arrow glide__arrow--left border-none text-lg cursor-pointer px-3 py-2 "
                    data-glide-dir="<"
                >
                    <GrFormPrevious className="text-white text-xl" />
                </button>
                <button
                    className="glide__arrow glide__arrow--right  border-none text-lg cursor-pointer px-3 py-2 text-gray-700"
                    data-glide-dir=">"
                >
                    <GrFormNext className="text-white text-xl" />
                </button>
            </div>
        </div>
    );
};


export default CourseCarousel;

