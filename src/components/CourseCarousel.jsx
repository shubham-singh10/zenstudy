import React, { useState, useEffect } from 'react';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const cards = [
    {
        imgurl: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/39ce18e9-0c4a-4b15-80f2-29e07f961d96.webp',
        title: 'Noteworthy technology acquisitions 2021',
        description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'
    },

    {
        imgurl: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/39ce18e9-0c4a-4b15-80f2-29e07f961d96.webp',
        title: 'Noteworthy technology acquisitions 2021',
        description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'
    },
    {
        imgurl: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/39ce18e9-0c4a-4b15-80f2-29e07f961d96.webp',
        title: 'Noteworthy technology acquisitions 2021',
        description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'
    },
    {
        imgurl: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/39ce18e9-0c4a-4b15-80f2-29e07f961d96.webp',
        title: 'Noteworthy technology acquisitions 2021',
        description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'
    },
    {
        imgurl: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/39ce18e9-0c4a-4b15-80f2-29e07f961d96.webp',
        title: 'Noteworthy technology acquisitions 2021',
        description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'
    },

    // Add more cards here...
];

const CourseCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const img = [
        {
            imgurl: "https://flowbite.com/docs/images/carousel/carousel-2.svg",
            title: "Course 1",
            tutor: "Tutor 1",
            date: "12/07/2024",
            day: "Friday",
            price: "$100"
        },
        {
            imgurl: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/39ce18e9-0c4a-4b15-80f2-29e07f961d96.webp",
            title: "Course 2",
            tutor: "Tutor 2",
            date: "13/07/2024",
            day: "Saturday",
            price: "$120"
        },
        {
            imgurl: "https://flowbite.com/docs/images/carousel/carousel-3.svg",
            title: "Course 3",
            tutor: "Tutor 3",
            date: "14/07/2024",
            day: "Sunday",
            price: "$150"
        },
        {
            imgurl: "https://flowbite.com/docs/images/carousel/carousel-4.svg",
            title: "Course 4",
            tutor: "Tutor 4",
            date: "15/07/2024",
            day: "Monday",
            price: "$180"
        },
    ];


    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % Math.ceil(img.length / 2));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isHovered, img.length]);


    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(img.length / 2)) % Math.ceil(img.length / 2));
    };


    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(img.length / 2));
    };


    return (
        <div className="container mx-auto flex justify-center items-center">
            <div className="relative w-full max-w-6xl">
                <div className="overflow-hidden rounded-2xl shadow-lg p-4 flex justify-center items-center bg-white dark:bg-gray-800">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`w-full flex-shrink-0 p-4 ${cards.length === 1 ? 'sm:w-full' : 'sm:w-1/2'}`}
                                style={{ flexBasis: cards.length === 1 ? '100%' : '50%' }}
                            >
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto">
                                    <a href="#">
                                        <img className="rounded-t-lg w-full h-52 object-cover" src={card.imgurl} alt="" />
                                    </a>
                                    <div className="p-5">
                                        <a href="#">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                {card.title}
                                            </h5>
                                        </a>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                            {card.description}
                                        </p>
                                        <a
                                            href="#"
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Read more
                                            <svg
                                                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 14 10"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                    onClick={prevSlide}
                >
                    <GrFormPrevious />
                </button>
                <button
                    type="button"
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                    onClick={nextSlide}
                >
                    <MdNavigateNext />
                </button>
            </div>
        </div>

        // <div className="container mx-auto flex justify-center items-center">
        //     <div className="relative w-full max-w-6xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        //         <div className="overflow-hidden rounded-2xl shadow-lg p-4 flex justify-center items-center">
        //             <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
        //                 {img.map((item, index) => (
        //                     <div
        //                         key={index}
        //                         className={`w-full p-4 ${img.length === 1 ? 'flex justify-center' : 'w-full sm:w-1/2 flex-shrink-0'}`}
        //                         style={{ flexBasis: img.length === 1 ? '100%' : '50%' }}
        //                     >
        //                         <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg mx-auto">
        //                             <img
        //                                 className="w-full h-52 rounded-tl-2xl"
        //                                 src={item.imgurl}
        //                                 alt={`Course ${index + 1}`}
        //                             />
        //                             <div className="px-6 py-4">
        //                                 <div className="font-bold text-xl mb-2 text-blue-600">{item.title}</div>
        //                                 <p className="text-gray-700 text-base">{item.tutor}</p>
        //                                 <p className="text-gray-600">{item.date}</p>
        //                                 <p className="text-gray-600">{item.day}</p>
        //                             </div>
        //                             <div className="flex flex-row px-6 pt-4 pb-2 justify-between items-center">
        //                                 <p className="text-blue-600 font-bold text-2xl">{item.price}</p>
        //                                 <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
        //                                     View Details
        //                                 </button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //         <button
        //             type="button"
        //             className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        //             onClick={prevSlide}
        //         >
        //             <GrFormPrevious />
        //         </button>
        //         <button
        //             type="button"
        //             className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        //             onClick={nextSlide}
        //         >
        //             <MdNavigateNext />
        //         </button>
        //     </div>
        // </div>
    );
};


export default CourseCarousel;
