import React from 'react'
import Carousel from './Carousel'
import CourseCarousel from './CourseCarousel'
import ExploreArticles from './ExploreArticles '
import FeatureVideo from './FeatureVideo'
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

    // Add more cards here...
];

const Home = () => {
    return (
        <div>
            <Carousel />
            <div className="flex flex-col md:flex-row items-center justify-between mt-8 px-4 md:px-16">
                <div className="text-section md:w-1/2 mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold mb-4"><span className='text-[#5D6169]'>Welcome To</span><span className='text-[#054BB4]'> ZenStudy</span></h2>
                    <h1 className="text-4xl font-bold mb-4"><span className='text-[#5D6169]'>Making</span><span className='text-[#054BB4]'> Education</span><span className='text-[#5D6169]'> Imaginative</span></h1>
                    <p className="text-[#5D6169]">
                        Zenstudy makes learning engaging with 3D models, animations, and AI. Focused on UPSC prep, we aim to expand into other competitive exams, college education, and K12 content.
                    </p>
                    <div className='mt-9'>
                        <button className='rounded-full bg-[#054BB4] text-[#ffffff] px-6 py-2 font-medium mr-5'>Explore Courses</button>
                        <button className='rounded-full border-2  border-solid border-[#054BB4] text-[#054BB4] px-6 py-2 font-medium'>Watch Videos</button>
                    </div>
                </div>
                <div className="image-section md:w-1/2">
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
                        alt="Description of the"
                        className="w-full h-85 rounded-lg"
                    />
                </div>
            </div>
            <div className='mt-20'>
                <h1 className='text-5xl mb-10 text-center text-[#054BB4] font-semibold'>Re<span className='border-b-8 border-[#054BB4]'>cently Added Cours</span>es</h1>
                <CourseCarousel>
                    {cards.map((card, index) => (
                        <div key={index} className="w-full flex-shrink-0 p-4">
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow mx-auto">
                                <a href="#">
                                    <img className="rounded-t-lg w-full h-52 object-cover" src={card.imgurl} alt="" />
                                </a>

                            </div>
                        </div>
                    ))}
                </CourseCarousel>

            </div>
            <ExploreArticles />
            <FeatureVideo />

            <div className="w-full min-h-[30vh] ">
                <div className="px-12 flex flex-col gap-10 ">
                    <div>
                        <p className="text-4xl text-center text-[#054BB4] font-bold">
                            Learn About Us
                        </p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className=" relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]">
                            <div className=" absolute lg:top-[-30px] md:top-[-30px] top-[-25px] lg:left-20 md:left-20 left-4 lg:text-6xl md:text-6xl text-5xl text-[#054BB4] font-semibold">
                                01
                            </div>
                            <div className="flex items-end flex-col lg:px-14 md:px-14 px-6 lg:gap-4 gap-2 py-5">
                                <p className="text-[#054BB4] font-semibold lg:text-3xl md:text-2xl text-xl">
                                    About Us
                                </p>
                                <p className="lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-end  sm:tetx-sm">
                                    Zenstudy is an emerging Edutech platform with a vision to make
                                    learning and education as easy as watching movies and playing
                                    games. Imagination is an art that helps us enjoy our
                                    engagement in any activity. The same applies to education.
                                </p>
                                <button className="lg:px-5 md:px-5 px-4 py-1 bg-[#054BB4] text-white rounded-full">
                                    Read More
                                </button>
                            </div>
                        </div>
                        <div className=" relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]">
                            <div className=" absolute lg:top-[-30px] md:top-[-30px] top-[-25px] lg:right-20 md:right-20 right-4 lg:text-6xl md:text-6xl text-5xl text-[#054BB4] font-semibold">
                                02
                            </div>
                            <div className="flex items-start flex-col lg:px-14 md:px-14 px-6 lg:gap-4 gap-2 py-5">
                                <p className="text-[#054BB4] font-semibold lg:text-3xl md:text-2xl text-xl">
                                    Our Vision
                                </p>
                                <p className="lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-start sm:tetx-sm">
                                    Zenstudy is an emerging Edutech platform with a vision to make
                                    learning and education as easy as watching movies and playing
                                    games. Imagination is an art that helps us enjoy our
                                    engagement in any activity. The same applies to education.
                                </p>
                                <button className="lg:px-5 md:px-5 px-4 py-1 bg-[#054BB4] text-white rounded-full">
                                    Read More
                                </button>
                            </div>
                        </div>
                        <div className=" relative lg:rounded-full md:rounded-full bg-[#CADEFB] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]">
                            <div className=" absolute lg:top-[-30px] md:top-[-30px] top-[-25px] lg:left-20 md:left-20 left-4 lg:text-6xl md:text-6xl text-5xl text-[#054BB4] font-semibold">
                                03
                            </div>
                            <div className="flex items-end flex-col lg:px-14 md:px-14 px-6 lg:gap-4 gap-2 py-5">
                                <p className="text-[#054BB4] font-semibold lg:text-3xl md:text-2xl text-xl">
                                    Our Mission
                                </p>
                                <p className="lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-end sm:tetx-sm">
                                    Zenstudy is an emerging Edutech platform with a vision to make
                                    learning and education as easy as watching movies and playing
                                    games. Imagination is an art that helps us enjoy our
                                    engagement in any activity. The same applies to education.
                                </p>
                                <button className="lg:px-5 md:px-5 px-4 py-1 bg-[#054BB4] text-white rounded-full">
                                    Read More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home